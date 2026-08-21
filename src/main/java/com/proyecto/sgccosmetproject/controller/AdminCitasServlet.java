package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.util.ConexionBD;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;

@WebServlet("/admin/citas")
public class AdminCitasServlet extends HttpServlet {

    private static final int REGISTROS_POR_PAGINA = 10;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        request.setAttribute("paginaActiva", "citas");

        String q = request.getParameter("q");
        String busqueda = (q != null) ? q.trim() : "";

        int paginaActual = 1;
        String pagParam = request.getParameter("pagina");
        if (pagParam != null && !pagParam.isEmpty()) {
            try {
                paginaActual = Math.max(1, Integer.parseInt(pagParam));
            } catch (NumberFormatException ignored) {}
        }

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {

            // 1. Métricas superiores
            request.setAttribute("totalCitas", obtenerTotalCitas(conexion));
            request.setAttribute("pendientes", obtenerCitasPendientesCount(conexion));
            request.setAttribute("canceladasEsteMes", obtenerCanceladasEsteMes(conexion));

            // 2. Conteo total para paginación
            int totalRegistros = contarCitasFiltradas(conexion, busqueda);
            int totalPaginas = (int) Math.ceil((double) totalRegistros / REGISTROS_POR_PAGINA);
            if (totalPaginas == 0) totalPaginas = 1;
            paginaActual = Math.min(paginaActual, totalPaginas);

            // 3. Consulta paginada de citas
            List<Map<String, Object>> citas = obtenerCitasPaginadas(conexion, busqueda, paginaActual, REGISTROS_POR_PAGINA);
            Map<Integer, String> nombresEmpleados = obtenerMapEmpleados(citas, conexion);

            request.setAttribute("citas", citas);
            request.setAttribute("nombresEmpleados", nombresEmpleados);
            request.setAttribute("busqueda", busqueda);
            request.setAttribute("paginaActual", paginaActual);
            request.setAttribute("totalPaginas", totalPaginas);

            request.getRequestDispatcher("/WEB-INF/administrador/citas.jsp").forward(request, response);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error cargando citas: " + e.getMessage());
        }
    }

    private int obtenerTotalCitas(Connection conexion) {
        String sql = "SELECT COUNT(*) FROM citas";
        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private int obtenerCitasPendientesCount(Connection conexion) {
        String sql = "SELECT COUNT(*) FROM citas WHERE UPPER(estado_cita) = 'PENDIENTE' OR estado_cita IS NULL";
        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private int obtenerCanceladasEsteMes(Connection conexion) {
        String sql = "SELECT COUNT(*) FROM citas WHERE UPPER(estado_cita) = 'CANCELADA' AND TRUNC(fecha, 'MM') = TRUNC(SYSDATE, 'MM')";
        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private int contarCitasFiltradas(Connection conexion, String busqueda) {
        String sql = "SELECT COUNT(*) FROM citas c "
                + "LEFT JOIN usuarios u ON c.id_cliente = u.id_usuario "
                + "LEFT JOIN servicios s ON c.id_servicio = s.id_servicio "
                + "LEFT JOIN empleados e ON c.id_empleado = e.id_empleado "
                + "LEFT JOIN usuarios e_u ON e.id_usuario = e_u.id_usuario "
                + "WHERE LOWER(COALESCE(u.nombre_completo, '')) LIKE ? "
                + "OR LOWER(COALESCE(s.nombre, '')) LIKE ? "
                + "OR LOWER(COALESCE(e_u.nombre_completo, '')) LIKE ?";
        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            String term = "%" + busqueda.toLowerCase() + "%";
            ps.setString(1, term);
            ps.setString(2, term);
            ps.setString(3, term);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return rs.getInt(1);
            }
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private List<Map<String, Object>> obtenerCitasPaginadas(Connection conexion, String busqueda, int pagina, int cantidad) {
        List<Map<String, Object>> lista = new ArrayList<>();
        int offset = (pagina - 1) * cantidad;

        String sql = "SELECT c.id_cita, c.id_empleado, TO_CHAR(c.fecha, 'DD/MM/YYYY') AS fecha_str, c.hora, c.estado_cita, "
                + "COALESCE(u.nombre_completo, 'Cliente General') AS cliente_nombre, "
                + "COALESCE(u.correo, 'Sin correo') AS cliente_correo, "
                + "COALESCE(s.nombre, 'Servicio General') AS servicio_nombre, "
                + "COALESCE(e_u.nombre_completo, 'Sin asignar') AS empleado_nombre "
                + "FROM citas c "
                + "LEFT JOIN usuarios u ON c.id_cliente = u.id_usuario "
                + "LEFT JOIN servicios s ON c.id_servicio = s.id_servicio "
                + "LEFT JOIN empleados e ON c.id_empleado = e.id_empleado "
                + "LEFT JOIN usuarios e_u ON e.id_usuario = e_u.id_usuario "
                + "WHERE LOWER(COALESCE(u.nombre_completo, '')) LIKE ? "
                + "OR LOWER(COALESCE(s.nombre, '')) LIKE ? "
                + "OR LOWER(COALESCE(e_u.nombre_completo, '')) LIKE ? "
                + "ORDER BY c.fecha DESC, c.hora DESC "
                + "OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";

        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            String term = "%" + busqueda.toLowerCase() + "%";
            ps.setString(1, term);
            ps.setString(2, term);
            ps.setString(3, term);
            ps.setInt(4, offset);
            ps.setInt(5, cantidad);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> cita = new HashMap<>();
                    cita.put("idCita", rs.getInt("id_cita"));
                    cita.put("idEmpleado", rs.getInt("id_empleado"));
                    cita.put("servicio", rs.getString("servicio_nombre"));
                    cita.put("fechaFormateadaCorta", rs.getString("fecha_str"));
                    cita.put("horaInicioFormateada", rs.getString("hora"));

                    String estado = rs.getString("estado_cita");
                    if (estado == null || estado.trim().isEmpty()) estado = "PENDIENTE";
                    cita.put("estado", estado.toUpperCase());
                    cita.put("etiquetaEstado", formatearEtiqueta(estado));
                    cita.put("claseBadge", obtenerClaseBadge(estado));

                    Map<String, String> cliente = new HashMap<>();
                    cliente.put("nombreCompleto", rs.getString("cliente_nombre"));
                    cliente.put("correo", rs.getString("cliente_correo"));
                    cita.put("cliente", cliente);

                    lista.add(cita);
                }
            }
        } catch (Exception e) { e.printStackTrace(); }
        return lista;
    }

    private Map<Integer, String> obtenerMapEmpleados(List<Map<String, Object>> citas, Connection conexion) {
        Map<Integer, String> mapa = new HashMap<>();
        for (Map<String, Object> c : citas) {
            int idEmp = (int) c.get("idEmpleado");
            if (idEmp > 0 && !mapa.containsKey(idEmp)) {
                String sql = "SELECT u.nombre_completo FROM empleados e JOIN usuarios u ON e.id_usuario = u.id_usuario WHERE e.id_empleado = ?";
                try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                    ps.setInt(1, idEmp);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (rs.next()) mapa.put(idEmp, rs.getString("nombre_completo"));
                    }
                } catch (Exception e) { e.printStackTrace(); }
            }
        }
        return mapa;
    }

    private String obtenerClaseBadge(String estado) {
        switch (estado.toUpperCase()) {
            case "CONFIRMADA": return "badge-confirmada";
            case "CANCELADA": return "badge-cancelada";
            case "COMPLETADA": return "badge-completada";
            default: return "badge-pendiente";
        }
    }

    private String formatearEtiqueta(String estado) {
        if (estado == null) return "Pendiente";
        switch (estado.toUpperCase()) {
            case "CONFIRMADA": return "Confirmada";
            case "CANCELADA": return "Cancelada";
            case "COMPLETADA": return "Completada";
            default: return "Pendiente";
        }
    }
}