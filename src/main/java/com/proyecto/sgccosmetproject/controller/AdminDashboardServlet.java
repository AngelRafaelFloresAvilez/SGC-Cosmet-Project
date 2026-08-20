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

@WebServlet("/admin-dashboard")
public class AdminDashboardServlet extends HttpServlet {

    private static final DateTimeFormatter ISO_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        request.setAttribute("paginaActiva", "dashboard");

        // Formato legible para la fecha actual (Ej. "20 de agosto, 2026")
        LocalDate hoy = LocalDate.now();
        DateTimeFormatter fmtHero = DateTimeFormatter.ofPattern("d 'de' MMMM, yyyy", new Locale("es", "ES"));
        request.setAttribute("fechaHoyTexto", hoy.format(fmtHero));

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {

            // 1. KPIs Estadísticos
            request.setAttribute("citasHoy", obtenerCitasHoy(conexion));
            request.setAttribute("clientesRegistrados", obtenerTotalClientes(conexion));
            request.setAttribute("especialistasActivos", obtenerTotalEspecialistas(conexion));
            request.setAttribute("ventasDelMes", obtenerVentasDelMes(conexion));

            // 2. Gráfica semanal y Listas de apoyo
            request.setAttribute("citasSemana", obtenerCitasSemana(conexion, hoy));
            request.setAttribute("citasPendientes", obtenerCitasPendientes(conexion));
            request.setAttribute("topServicios", obtenerTopServicios(conexion));
            request.setAttribute("actividadReciente", obtenerActividadReciente(conexion));
            request.setAttribute("clientesInasistencias", obtenerClientesInasistencias(conexion));
            request.setAttribute("especialistasDisponibles", obtenerEspecialistasEstatus(conexion));

            request.getRequestDispatcher("/WEB-INF/administrador/dashboard.jsp").forward(request, response);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error cargando Dashboard Admin: " + e.getMessage());
        }
    }

    private int obtenerCitasHoy(Connection conexion) {
        String sql = "SELECT COUNT(*) FROM citas WHERE TRUNC(fecha) = TRUNC(SYSDATE)";
        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private int obtenerTotalClientes(Connection conexion) {
        String sql = "SELECT COUNT(*) FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol WHERE LOWER(r.nombre_rol) LIKE '%cliente%'";
        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private int obtenerTotalEspecialistas(Connection conexion) {
        String sql = "SELECT COUNT(*) FROM empleados";
        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private double obtenerVentasDelMes(Connection conexion) {
        String sql = "SELECT COALESCE(SUM(costo_pactado), 0) FROM citas WHERE TRUNC(fecha, 'MM') = TRUNC(SYSDATE, 'MM') AND UPPER(estado_cita) = 'COMPLETADA'";
        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getDouble(1);
        } catch (Exception e) { e.printStackTrace(); }
        return 0.0;
    }

    private Map<String, Integer> obtenerCitasSemana(Connection conexion, LocalDate hoy) {
        Map<String, Integer> semana = new LinkedHashMap<>();
        semana.put("Lunes", 0);
        semana.put("Martes", 0);
        semana.put("Miercoles", 0);
        semana.put("Jueves", 0);
        semana.put("Viernes", 0);
        semana.put("Sabado", 0);
        semana.put("Domingo", 0);

        LocalDate inicioSemana = hoy.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate finSemana = inicioSemana.plusDays(6);

        String sql = "SELECT TO_CHAR(fecha, 'DY', 'NLS_DATE_LANGUAGE=SPANISH') AS dia, COUNT(*) AS total "
                + "FROM citas WHERE TRUNC(fecha) BETWEEN TO_DATE(?, 'YYYY-MM-DD') AND TO_DATE(?, 'YYYY-MM-DD') "
                + "GROUP BY TO_CHAR(fecha, 'DY', 'NLS_DATE_LANGUAGE=SPANISH')";

        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, inicioSemana.format(ISO_DATE));
            ps.setString(2, finSemana.format(ISO_DATE));
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String diaAbr = rs.getString("dia");
                    if (diaAbr != null) {
                        diaAbr = diaAbr.toUpperCase();
                        if (diaAbr.contains("LUN")) semana.put("Lunes", rs.getInt("total"));
                        else if (diaAbr.contains("MAR")) semana.put("Martes", rs.getInt("total"));
                        else if (diaAbr.contains("MIÉ") || diaAbr.contains("MIE")) semana.put("Miercoles", rs.getInt("total"));
                        else if (diaAbr.contains("JUE")) semana.put("Jueves", rs.getInt("total"));
                        else if (diaAbr.contains("VIE")) semana.put("Viernes", rs.getInt("total"));
                        else if (diaAbr.contains("SÁB") || diaAbr.contains("SAB")) semana.put("Sabado", rs.getInt("total"));
                        else if (diaAbr.contains("DOM")) semana.put("Domingo", rs.getInt("total"));
                    }
                }
            }
        } catch (Exception e) { e.printStackTrace(); }
        return semana;
    }

    private List<Map<String, Object>> obtenerCitasPendientes(Connection conexion) {
        List<Map<String, Object>> lista = new ArrayList<>();
        String sql = "SELECT c.id_cita, TO_CHAR(c.fecha, 'DD/MM') AS fecha_corta, c.hora, "
                + "COALESCE(u.nombre_completo, 'Cliente General') AS cliente_nombre, "
                + "COALESCE(s.nombre, 'Servicio General') AS servicio_nombre "
                + "FROM citas c "
                + "LEFT JOIN usuarios u ON c.id_cliente = u.id_usuario "
                + "LEFT JOIN servicios s ON c.id_servicio = s.id_servicio "
                + "WHERE UPPER(c.estado_cita) = 'PENDIENTE' OR c.estado_cita IS NULL "
                + "ORDER BY c.fecha ASC, c.hora ASC FETCH FIRST 5 ROWS ONLY";

        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> cita = new HashMap<>();
                cita.put("idCita", rs.getInt("id_cita"));
                cita.put("fechaFormateadaCorta", rs.getString("fecha_corta"));
                cita.put("horaInicioFormateada", rs.getString("hora"));
                cita.put("servicio", rs.getString("servicio_nombre"));

                Map<String, String> cliente = new HashMap<>();
                cliente.put("nombreCompleto", rs.getString("cliente_nombre"));
                cita.put("cliente", cliente);

                lista.add(cita);
            }
        } catch (Exception e) { e.printStackTrace(); }
        return lista;
    }

    private Map<String, Integer> obtenerTopServicios(Connection conexion) {
        Map<String, Integer> top = new LinkedHashMap<>();
        String sql = "SELECT s.nombre, COUNT(c.id_cita) AS total "
                + "FROM citas c JOIN servicios s ON c.id_servicio = s.id_servicio "
                + "GROUP BY s.nombre ORDER BY total DESC FETCH FIRST 5 ROWS ONLY";

        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                top.put(rs.getString("nombre"), rs.getInt("total"));
            }
        } catch (Exception e) { e.printStackTrace(); }
        return top;
    }

    private List<String> obtenerActividadReciente(Connection conexion) {
        List<String> actividad = new ArrayList<>();
        String sql = "SELECT TO_CHAR(c.fecha, 'DD/MM/YYYY') AS f_str, c.hora, u.nombre_completo AS cliente, s.nombre AS servicio "
                + "FROM citas c "
                + "JOIN usuarios u ON c.id_cliente = u.id_usuario "
                + "JOIN servicios s ON c.id_servicio = s.id_servicio "
                + "ORDER BY c.id_cita DESC FETCH FIRST 4 ROWS ONLY";

        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                actividad.add("Cita agendada para " + rs.getString("cliente") + " (" + rs.getString("servicio") + ") el " + rs.getString("f_str"));
            }
        } catch (Exception e) { e.printStackTrace(); }
        return actividad;
    }

    private List<Map<String, Object>> obtenerClientesInasistencias(Connection conexion) {
        List<Map<String, Object>> lista = new ArrayList<>();
        String sql = "SELECT u.nombre_completo, COUNT(*) AS faltas "
                + "FROM citas c JOIN usuarios u ON c.id_cliente = u.id_usuario "
                + "WHERE UPPER(c.estado_cita) IN ('INASISTENCIA', 'NO_ASISTIO', 'CANCELADA') "
                + "GROUP BY u.nombre_completo HAVING COUNT(*) > 0 ORDER BY faltas DESC FETCH FIRST 5 ROWS ONLY";

        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> item = new HashMap<>();
                item.put("nombreCompleto", rs.getString("nombre_completo"));
                item.put("faltas", rs.getInt("faltas"));
                lista.add(item);
            }
        } catch (Exception e) { e.printStackTrace(); }
        return lista;
    }

    private List<Map<String, Object>> obtenerEspecialistasEstatus(Connection conexion) {
        List<Map<String, Object>> lista = new ArrayList<>();
        String sql = "SELECT e.id_empleado, u.nombre_completo, COALESCE(e.especialidad, 'Especialista') AS especialidad, "
                + "(SELECT COUNT(*) FROM citas c WHERE c.id_empleado = e.id_empleado AND TRUNC(c.fecha) = TRUNC(SYSDATE) AND UPPER(c.estado_cita) = 'EN_PROCESO') AS en_cita "
                + "FROM empleados e JOIN usuarios u ON e.id_usuario = u.id_usuario";

        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> esp = new HashMap<>();
                esp.put("nombreCompleto", rs.getString("nombre_completo"));
                esp.put("especialidad", rs.getString("especialidad"));
                esp.put("estaOcupado", rs.getInt("en_cita") > 0);
                lista.add(esp);
            }
        } catch (Exception e) { e.printStackTrace(); }
        return lista;
    }
}