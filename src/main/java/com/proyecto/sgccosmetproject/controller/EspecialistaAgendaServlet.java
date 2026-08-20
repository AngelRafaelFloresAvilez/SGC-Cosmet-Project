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
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@WebServlet("/especialista/agenda")
public class EspecialistaAgendaServlet extends HttpServlet {

    private static final DateTimeFormatter ISO_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DISPLAY_DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        Usuario usuario = (Usuario) session.getAttribute("usuarioSesion");
        request.setAttribute("paginaActiva", "agenda");

        String vista = request.getParameter("vista");
        if (vista == null || (!vista.equals("semana") && !vista.equals("mes"))) {
            vista = "dia";
        }
        request.setAttribute("vista", vista);

        String fechaStr = request.getParameter("fecha");
        LocalDate fechaRef;
        try {
            fechaRef = (fechaStr != null && !fechaStr.trim().isEmpty()) ? LocalDate.parse(fechaStr) : LocalDate.now();
        } catch (Exception e) {
            fechaRef = LocalDate.now();
        }

        request.setAttribute("fechaRef", fechaRef.format(DISPLAY_DATE));
        request.setAttribute("hoy", LocalDate.now().format(DISPLAY_DATE));

        // Paginación de fechas (Anterior / Siguiente)
        if ("dia".equals(vista)) {
            request.setAttribute("fechaAnterior", fechaRef.minusDays(1).format(ISO_DATE));
            request.setAttribute("fechaSiguiente", fechaRef.plusDays(1).format(ISO_DATE));
        } else if ("semana".equals(vista)) {
            request.setAttribute("fechaAnterior", fechaRef.minusWeeks(1).format(ISO_DATE));
            request.setAttribute("fechaSiguiente", fechaRef.plusWeeks(1).format(ISO_DATE));
        } else {
            request.setAttribute("fechaAnterior", fechaRef.minusMonths(1).format(ISO_DATE));
            request.setAttribute("fechaSiguiente", fechaRef.plusMonths(1).format(ISO_DATE));
        }

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {
            int idEmpleado = obtenerIdEmpleado(conexion, usuario.getIdUsuario());

            if ("dia".equals(vista)) {
                cargarVistaDia(conexion, idEmpleado, fechaRef, request);
            } else if ("semana".equals(vista)) {
                cargarVistaSemana(conexion, idEmpleado, fechaRef, request);
            } else {
                cargarVistaMes(conexion, idEmpleado, fechaRef, request);
            }

            request.getRequestDispatcher("/WEB-INF/especialista/agenda.jsp").forward(request, response);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error cargando la agenda: " + e.getMessage());
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

    private void cargarVistaDia(Connection conexion, int idEmpleado, LocalDate fecha, HttpServletRequest request) {
        List<Map<String, Object>> citasDelDia = new ArrayList<>();
        int totalProgramadas = 0, totalConfirmadas = 0, totalPendientes = 0, totalCanceladas = 0;
        Map<String, Object> proximaCita = null;

        String sql = "SELECT c.id_cita, c.hora, c.duracion_pactada, c.estado_cita, "
                + "COALESCE(u.nombre_completo, 'Cliente General') AS cliente_nombre, "
                + "COALESCE(s.nombre, 'Servicio General') AS servicio_nombre "
                + "FROM citas c "
                + "LEFT JOIN usuarios u ON c.id_cliente = u.id_usuario "
                + "LEFT JOIN servicios s ON c.id_servicio = s.id_servicio "
                + "WHERE c.id_empleado = ? AND TRUNC(c.fecha) = TO_DATE(?, 'YYYY-MM-DD') "
                + "ORDER BY c.hora ASC";

        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setInt(1, idEmpleado);
            ps.setString(2, fecha.format(ISO_DATE));

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    totalProgramadas++;
                    String estado = rs.getString("estado_cita");
                    if (estado == null) estado = "Pendiente";

                    if ("CONFIRMADA".equalsIgnoreCase(estado) || "COMPLETADA".equalsIgnoreCase(estado)) totalConfirmadas++;
                    else if ("PENDIENTE".equalsIgnoreCase(estado)) totalPendientes++;
                    else if ("CANCELADA".equalsIgnoreCase(estado)) totalCanceladas++;

                    Map<String, Object> cita = new HashMap<>();
                    cita.put("idCita", rs.getInt("id_cita"));
                    cita.put("horaInicioFormateada", rs.getString("hora"));
                    cita.put("horaFinFormateada", rs.getString("duracion_pactada") != null ? rs.getString("duracion_pactada") : "1 hr");
                    cita.put("servicio", rs.getString("servicio_nombre"));

                    Map<String, String> cliente = new HashMap<>();
                    cliente.put("nombreCompleto", rs.getString("cliente_nombre"));
                    cita.put("cliente", cliente);

                    cita.put("etiquetaEstado", estado);
                    cita.put("claseBadge", obtenerClaseBadge(estado));

                    citasDelDia.add(cita);

                    if (proximaCita == null && !"CANCELADA".equalsIgnoreCase(estado)) {
                        proximaCita = cita;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        request.setAttribute("citasDelDia", citasDelDia);
        request.setAttribute("proximaCita", proximaCita);
        request.setAttribute("totalProgramadas", totalProgramadas);
        request.setAttribute("totalConfirmadas", totalConfirmadas);
        request.setAttribute("totalPendientes", totalPendientes);
        request.setAttribute("totalCanceladas", totalCanceladas);
    }

    private void cargarVistaSemana(Connection conexion, int idEmpleado, LocalDate fecha, HttpServletRequest request) {
        LocalDate inicioSemana = fecha.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate finSemana = inicioSemana.plusDays(6);

        request.setAttribute("inicioSemana", inicioSemana.format(DISPLAY_DATE));
        request.setAttribute("finSemana", finSemana.format(DISPLAY_DATE));

        Map<String, List<Map<String, Object>>> citasPorDia = new LinkedHashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate dia = inicioSemana.plusDays(i);
            citasPorDia.put(dia.format(DISPLAY_DATE), new ArrayList<>());
        }

        String sql = "SELECT c.id_cita, TO_CHAR(c.fecha, 'DD/MM/YYYY') AS fecha_str, c.hora, c.estado_cita, "
                + "COALESCE(u.nombre_completo, 'Cliente General') AS cliente_nombre, "
                + "COALESCE(s.nombre, 'Servicio General') AS servicio_nombre "
                + "FROM citas c "
                + "LEFT JOIN usuarios u ON c.id_cliente = u.id_usuario "
                + "LEFT JOIN servicios s ON c.id_servicio = s.id_servicio "
                + "WHERE c.id_empleado = ? AND TRUNC(c.fecha) BETWEEN TO_DATE(?, 'YYYY-MM-DD') AND TO_DATE(?, 'YYYY-MM-DD') "
                + "ORDER BY c.fecha ASC, c.hora ASC";

        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setInt(1, idEmpleado);
            ps.setString(2, inicioSemana.format(ISO_DATE));
            ps.setString(3, finSemana.format(ISO_DATE));

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String fechaStrKey = rs.getString("fecha_str");
                    if (citasPorDia.containsKey(fechaStrKey)) {
                        Map<String, Object> cita = new HashMap<>();
                        cita.put("idCita", rs.getInt("id_cita"));
                        cita.put("horaInicioFormateada", rs.getString("hora"));
                        cita.put("servicio", rs.getString("servicio_nombre"));

                        Map<String, String> cliente = new HashMap<>();
                        cliente.put("nombreCompleto", rs.getString("cliente_nombre"));
                        cita.put("cliente", cliente);

                        citasPorDia.get(fechaStrKey).add(cita);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        request.setAttribute("citasPorDia", citasPorDia);
    }

    private void cargarVistaMes(Connection conexion, int idEmpleado, LocalDate fecha, HttpServletRequest request) {
        LocalDate primerDiaMes = fecha.withDayOfMonth(1);
        LocalDate primerDiaCalendario = primerDiaMes.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate ultimoDiaCalendario = primerDiaCalendario.plusDays(34);

        List<LocalDate> diasCalendario = new ArrayList<>();
        Map<LocalDate, Integer> conteoPorDia = new HashMap<>();

        LocalDate temp = primerDiaCalendario;
        while (!temp.isAfter(ultimoDiaCalendario)) {
            diasCalendario.add(temp);
            conteoPorDia.put(temp, 0);
            temp = temp.plusDays(1);
        }

        String sql = "SELECT TRUNC(c.fecha) AS fecha_trunc, COUNT(*) AS total "
                + "FROM citas c "
                + "WHERE c.id_empleado = ? AND TRUNC(c.fecha) BETWEEN TO_DATE(?, 'YYYY-MM-DD') AND TO_DATE(?, 'YYYY-MM-DD') "
                + "GROUP BY TRUNC(c.fecha)";

        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setInt(1, idEmpleado);
            ps.setString(2, primerDiaCalendario.format(ISO_DATE));
            ps.setString(3, ultimoDiaCalendario.format(ISO_DATE));

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    java.sql.Date f = rs.getDate("fecha_trunc");
                    if (f != null) {
                        conteoPorDia.put(f.toLocalDate(), rs.getInt("total"));
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        request.setAttribute("primerDiaMes", primerDiaMes);
        request.setAttribute("diasCalendario", diasCalendario);
        request.setAttribute("conteoPorDia", conteoPorDia);
    }

    private String obtenerClaseBadge(String estado) {
        if (estado == null) return "bg-secondary";
        switch (estado.toLowerCase()) {
            case "confirmada":
            case "completada":
                return "bg-success text-white";
            case "pendiente":
                return "bg-warning text-dark";
            case "cancelada":
                return "bg-danger text-white";
            default:
                return "bg-info text-dark";
        }
    }
}