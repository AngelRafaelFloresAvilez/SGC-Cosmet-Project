package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.util.ConexionBD;
import com.proyecto.sgccosmetproject.model.Usuario;

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

@WebServlet("/CitasServlet")
public class CitasServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public CitasServlet() {
        super();
    }

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

        if ("obtenerCitas".equals(action)) {
            obtenerCitasUsuario(usuario.getIdUsuario(), response);
            return;
        }

        request.getRequestDispatcher("/WEB-INF/citas.jsp").forward(request, response);
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

        if ("cancelarCita".equals(action)) {
            cancelarCita(request, response, usuario.getIdUsuario());
        } else {
            doGet(request, response);
        }
    }

    private void obtenerCitasUsuario(int idUsuario, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        // Mapeo exacto según tu esquema Oracle: id_cliente, s.nombre, costo_pactado, estado_cita
        String sql = "SELECT c.id_cita, "
                + "c.id_servicio, "
                + "NVL(s.nombre, 'Servicio Estetico') AS servicio, "
                + "TO_CHAR(c.fecha, 'DD/MM/YYYY') AS fecha, "
                + "c.hora, "
                + "c.costo_pactado AS costo, "
                + "c.duracion_pactada AS duracion, "
                + "c.estado_cita AS estado "
                + "FROM citas c "
                + "LEFT JOIN servicios s ON c.id_servicio = s.id_servicio "
                + "WHERE c.id_cliente = ? "
                + "ORDER BY c.fecha DESC, c.hora DESC";

        StringBuilder json = new StringBuilder("[");

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext());
             PreparedStatement ps = conexion.prepareStatement(sql)) {

            ps.setInt(1, idUsuario);
            try (ResultSet rs = ps.executeQuery()) {
                boolean primero = true;
                while (rs.next()) {
                    if (!primero) json.append(",");

                    int id = rs.getInt("id_cita");
                    int idServicio = rs.getInt("id_servicio");
                    String servicio = escapeJson(rs.getString("servicio"));
                    String fecha = escapeJson(rs.getString("fecha"));
                    String hora = escapeJson(rs.getString("hora"));
                    double costo = rs.getDouble("costo");
                    String duracion = rs.getString("duracion") != null ? escapeJson(rs.getString("duracion")) : "";
                    String estado = escapeJson(rs.getString("estado"));

                    json.append("{")
                            .append("\"id\":").append(id).append(",")
                            .append("\"idServicio\":").append(idServicio).append(",")
                            .append("\"servicio\":\"").append(servicio).append("\",")
                            .append("\"fecha\":\"").append(fecha).append("\",")
                            .append("\"hora\":\"").append(hora).append("\",")
                            .append("\"precio\":\"$").append(String.format("%.2f", costo)).append(" MXN\",")
                            .append("\"duracion\":\"").append(duracion).append("\",")
                            .append("\"estado\":\"").append(estado).append("\"")
                            .append("}");

                    primero = false;
                }
            }
            json.append("]");
            out.print(json.toString());

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"" + escapeJson(e.getMessage()) + "\"}");
        }
        out.flush();
    }

    private void cancelarCita(HttpServletRequest request, HttpServletResponse response, int idUsuario) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String idCitaStr = request.getParameter("id");
        if (idCitaStr == null || idCitaStr.isEmpty()) {
            out.print("{\"success\": false, \"error\": \"ID de cita no válido.\"}");
            return;
        }

        // Actualización con las columnas id_cliente y estado_cita
        String sql = "UPDATE citas SET estado_cita = 'Cancelada' WHERE id_cita = ? AND id_cliente = ?";

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext());
             PreparedStatement ps = conexion.prepareStatement(sql)) {

            ps.setInt(1, Integer.parseInt(idCitaStr));
            ps.setInt(2, idUsuario);

            int filasAfectadas = ps.executeUpdate();
            if (filasAfectadas > 0) {
                out.print("{\"success\": true}");
            } else {
                out.print("{\"success\": false, \"error\": \"No se pudo encontrar o modificar la cita.\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            out.print("{\"success\": false, \"error\": \"" + escapeJson(e.getMessage()) + "\"}");
        }
        out.flush();
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