package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.model.Usuario;
import com.proyecto.sgccosmetproject.util.ConexionBD;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet("/PerfilServlet")
public class PerfilServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        Usuario usuario = (Usuario) session.getAttribute("usuarioSesion");
        String action = request.getParameter("action");

        // Refrescar estado_veto actualizado desde la BD
        refrescarUsuarioEnSesion(session, usuario);

        if ("obtenerDatos".equals(action)) {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            PrintWriter out = response.getWriter();

            String sqlCitas = "SELECT c.id_cita, c.fecha, c.hora, c.costo_pactado, c.duracion_pactada, c.estado_cita, " +
                    "s.nombre AS nombre_servicio " +
                    "FROM citas c " +
                    "JOIN servicios s ON c.id_servicio = s.id_servicio " +
                    "WHERE c.id_cliente = ? " +
                    "ORDER BY c.fecha DESC, c.hora DESC";

            String sqlPagos = "SELECT p.id_pago, p.monto_total, p.metodo_pago, p.estado_pago " +
                    "FROM pagos p " +
                    "JOIN citas c ON p.id_cita = c.id_cita " +
                    "WHERE c.id_cliente = ? " +
                    "ORDER BY p.id_pago DESC";

            try (Connection con = ConexionBD.obtenerConexion(getServletContext())) {

                StringBuilder jsonCitas = new StringBuilder("[");
                try (PreparedStatement stmtCitas = con.prepareStatement(sqlCitas)) {
                    stmtCitas.setInt(1, usuario.getIdUsuario());
                    ResultSet rsCitas = stmtCitas.executeQuery();
                    boolean primero = true;
                    while (rsCitas.next()) {
                        if (!primero) jsonCitas.append(",");
                        jsonCitas.append("{")
                                .append("\"idCita\":").append(rsCitas.getInt("id_cita")).append(",")
                                .append("\"nombreServicio\":\"").append(escapeJson(rsCitas.getString("nombre_servicio"))).append("\",")
                                .append("\"fecha\":\"").append(rsCitas.getDate("fecha")).append("\",")
                                .append("\"hora\":\"").append(rsCitas.getString("hora") != null ? escapeJson(rsCitas.getString("hora")) : "").append("\",")
                                .append("\"costoPactado\":").append(rsCitas.getDouble("costo_pactado")).append(",")
                                .append("\"duracionPactada\":\"").append(rsCitas.getString("duracion_pactada") != null ? escapeJson(rsCitas.getString("duracion_pactada")) : "").append("\",")
                                .append("\"estadoCita\":\"").append(rsCitas.getString("estado_cita") != null ? escapeJson(rsCitas.getString("estado_cita")) : "Pendiente").append("\"")
                                .append("}");
                        primero = false;
                    }
                }
                jsonCitas.append("]");

                StringBuilder jsonPagos = new StringBuilder("[");
                try (PreparedStatement stmtPagos = con.prepareStatement(sqlPagos)) {
                    stmtPagos.setInt(1, usuario.getIdUsuario());
                    ResultSet rsPagos = stmtPagos.executeQuery();
                    boolean primero = true;
                    while (rsPagos.next()) {
                        if (!primero) jsonPagos.append(",");
                        jsonPagos.append("{")
                                .append("\"idPago\":").append(rsPagos.getInt("id_pago")).append(",")
                                .append("\"montoTotal\":").append(rsPagos.getDouble("monto_total")).append(",")
                                .append("\"metodoPago\":\"").append(rsPagos.getString("metodo_pago") != null ? escapeJson(rsPagos.getString("metodo_pago")) : "Efectivo").append("\",")
                                .append("\"estadoPago\":\"").append(rsPagos.getString("estado_pago") != null ? escapeJson(rsPagos.getString("estado_pago")) : "Completado").append("\"")
                                .append("}");
                        primero = false;
                    }
                }
                jsonPagos.append("]");

                String foto = usuario.getFotoPerfil() != null ? escapeJson(usuario.getFotoPerfil()) : "";
                String respuestaFinal = "{\"citas\":" + jsonCitas.toString() + ",\"pagos\":" + jsonPagos.toString() + ",\"fotoPerfil\":\"" + foto + "\"}";
                out.print(respuestaFinal);

            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"error\":\"" + escapeJson(e.getMessage()) + "\"}");
            }
            return;
        }

        request.getRequestDispatcher("/WEB-INF/perfil.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        Usuario usuario = (Usuario) session.getAttribute("usuarioSesion");
        String action = request.getParameter("action");

        if ("actualizarPerfil".equals(action)) {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            PrintWriter out = response.getWriter();

            String nombre = request.getParameter("nombre");
            String correo = request.getParameter("correo");
            String telefono = request.getParameter("telefono");
            String fechaNacStr = request.getParameter("fechaNacimiento");
            String fotoPerfil = request.getParameter("fotoPerfil");

            boolean actualizaFoto = (fotoPerfil != null && !fotoPerfil.trim().isEmpty());

            String sqlUpdate = actualizaFoto ?
                    "UPDATE usuarios SET nombre_completo = ?, correo = ?, telefono = ?, fecha_nacimiento = TO_DATE(?, 'YYYY-MM-DD'), foto_perfil = ? WHERE id_usuario = ?" :
                    "UPDATE usuarios SET nombre_completo = ?, correo = ?, telefono = ?, fecha_nacimiento = TO_DATE(?, 'YYYY-MM-DD') WHERE id_usuario = ?";

            try (Connection con = ConexionBD.obtenerConexion(getServletContext());
                 PreparedStatement stmt = con.prepareStatement(sqlUpdate)) {

                stmt.setString(1, nombre);
                stmt.setString(2, correo);
                stmt.setString(3, telefono);
                stmt.setString(4, fechaNacStr);

                if (actualizaFoto) {
                    stmt.setString(5, fotoPerfil);
                    stmt.setInt(6, usuario.getIdUsuario());
                } else {
                    stmt.setInt(5, usuario.getIdUsuario());
                }

                int filas = stmt.executeUpdate();
                if (filas > 0) {
                    usuario.setNombreCompleto(nombre);
                    usuario.setCorreo(correo);
                    usuario.setTelefono(telefono);
                    if (fechaNacStr != null && !fechaNacStr.isEmpty()) {
                        usuario.setFechaNacimiento(java.sql.Date.valueOf(fechaNacStr));
                    }
                    if (actualizaFoto) {
                        usuario.setFotoPerfil(fotoPerfil);
                    }
                    session.setAttribute("usuarioSesion", usuario);
                    out.print("{\"success\":true}");
                } else {
                    out.print("{\"success\":false, \"error\":\"No se encontró el registro para actualizar.\"}");
                }
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"success\":false, \"error\":\"" + escapeJson(e.getMessage()) + "\"}");
            }
            return;
        }

        doGet(request, response);
    }

    private void refrescarUsuarioEnSesion(HttpSession session, Usuario usuario) {
        String sql = "SELECT estado_veto FROM usuarios WHERE id_usuario = ?";
        try (Connection con = ConexionBD.obtenerConexion(getServletContext());
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, usuario.getIdUsuario());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    usuario.setEstadoVeto(rs.getString("estado_veto"));
                    session.setAttribute("usuarioSesion", usuario);
                }
            }
        } catch (Exception ignored) {}
    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}