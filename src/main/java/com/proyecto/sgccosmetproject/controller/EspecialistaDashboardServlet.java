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
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.*;

@WebServlet({"/especialista/dashboard", "/especialista-dashboard"})
public class EspecialistaDashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        Usuario usuario = (Usuario) session.getAttribute("usuarioSesion");
        if (usuario.getIdRol() != 2) {
            response.sendRedirect(request.getContextPath() + "/CitasServlet");
            return;
        }

        request.setAttribute("paginaActiva", "dashboard");

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {
            int idEmpleado = obtenerIdEmpleado(conexion, usuario.getIdUsuario());

            SimpleDateFormat sdf = new SimpleDateFormat("dd 'de' MMMM, yyyy", new Locale("es", "ES"));
            request.setAttribute("fechaHoyTexto", sdf.format(new Date()));

            Map<String, Object> empleadoMap = new HashMap<>();
            empleadoMap.put("nombreCompleto", usuario.getNombreCompleto());
            empleadoMap.put("calificacionPromedio", 4.9);
            request.setAttribute("empleado", empleadoMap);

            if (idEmpleado > 0) {
                cargarEstadisticasCitas(conexion, idEmpleado, request);
                cargarAgendaHoy(conexion, idEmpleado, request);
                cargarProximasCitas(conexion, idEmpleado, request);
            } else {
                request.setAttribute("totalCitasHoy", 0);
                request.setAttribute("pendientesHoy", 0);
                request.setAttribute("completadasHoy", 0);
                request.setAttribute("agendaHoy", Collections.emptyList());
                request.setAttribute("proximasCitas", Collections.emptyList());
            }

            request.getRequestDispatcher("/WEB-INF/especialista/especialista-dashboard.jsp").forward(request, response);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error en el servidor: " + e.getMessage());
        }
    }

    private int obtenerIdEmpleado(Connection conexion, int idUsuario) {
        String sql = "SELECT id_empleado FROM empleados WHERE id_usuario = ?";
        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setInt(1, idUsuario);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return rs.getInt("id_empleado");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    private void cargarEstadisticasCitas(Connection conexion, int idEmpleado, HttpServletRequest request) {
        String sql = "SELECT "
                + "COUNT(*) AS total_hoy, "
                + "COUNT(CASE WHEN UPPER(c.estado_cita) = 'PENDIENTE' THEN 1 END) AS pendientes_hoy, "
                + "COUNT(CASE WHEN UPPER(c.estado_cita) IN ('COMPLETADA', 'CONFIRMADA') THEN 1 END) AS completadas_hoy "
                + "FROM citas c WHERE c.id_empleado = ? AND TRUNC(c.fecha) = TRUNC(SYSDATE)";

        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setInt(1, idEmpleado);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    request.setAttribute("totalCitasHoy", rs.getInt("total_hoy"));
                    request.setAttribute("pendientesHoy", rs.getInt("pendientes_hoy"));
                    request.setAttribute("completadasHoy", rs.getInt("completadas_hoy"));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void cargarAgendaHoy(Connection conexion, int idEmpleado, HttpServletRequest request) {
        List<Map<String, Object>> agenda = new ArrayList<>();
        String sql = "SELECT c.id_cita, c.hora, c.estado_cita, u.nombre_completo AS cliente_nombre, s.nombre AS servicio_nombre "
                + "FROM citas c "
                + "JOIN usuarios u ON c.id_cliente = u.id_usuario "
                + "JOIN servicios s ON c.id_servicio = s.id_servicio "
                + "WHERE c.id_empleado = ? AND TRUNC(c.fecha) = TRUNC(SYSDATE) "
                + "ORDER BY c.hora ASC";

        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setInt(1, idEmpleado);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> cita = new HashMap<>();
                    cita.put("idCita", rs.getInt("id_cita"));
                    cita.put("horaInicioFormateada", rs.getString("hora"));
                    cita.put("servicio", rs.getString("servicio_nombre"));

                    Map<String, String> cliente = new HashMap<>();
                    cliente.put("nombreCompleto", rs.getString("cliente_nombre"));
                    cita.put("cliente", cliente);

                    String estado = rs.getString("estado_cita");
                    cita.put("etiquetaEstado", estado != null ? estado : "Pendiente");
                    cita.put("claseBadge", obtenerClaseBadge(estado));

                    agenda.add(cita);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        request.setAttribute("agendaHoy", agenda);
    }

    private void cargarProximasCitas(Connection conexion, int idEmpleado, HttpServletRequest request) {
        List<Map<String, Object>> proximas = new ArrayList<>();
        String sql = "SELECT c.id_cita, TO_CHAR(c.fecha, 'DD/MM/YYYY') AS fecha_formateada, c.hora, "
                + "u.nombre_completo AS cliente_nombre, s.nombre AS servicio_nombre "
                + "FROM citas c "
                + "JOIN usuarios u ON c.id_cliente = u.id_usuario "
                + "JOIN servicios s ON c.id_servicio = s.id_servicio "
                + "WHERE c.id_empleado = ? AND TRUNC(c.fecha) > TRUNC(SYSDATE) "
                + "ORDER BY c.fecha ASC, c.hora ASC";

        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setInt(1, idEmpleado);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> cita = new HashMap<>();
                    cita.put("idCita", rs.getInt("id_cita"));
                    cita.put("fechaFormateadaCorta", rs.getString("fecha_formateada"));
                    cita.put("horaInicioFormateada", rs.getString("hora"));
                    cita.put("servicio", rs.getString("servicio_nombre"));

                    Map<String, String> cliente = new HashMap<>();
                    cliente.put("nombreCompleto", rs.getString("cliente_nombre"));
                    cita.put("cliente", cliente);

                    proximas.add(cita);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        request.setAttribute("proximasCitas", proximas);
    }

    private String obtenerClaseBadge(String estado) {
        if (estado == null) return "bg-secondary";
        switch (estado.toLowerCase()) {
            case "confirmada":
            case "completada":
                return "bg-success";
            case "pendiente":
                return "bg-warning text-dark";
            case "cancelada":
                return "bg-danger";
            default:
                return "bg-info";
        }
    }
}