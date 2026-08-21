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

@WebServlet("/admin/reportes")
public class AdminReportesServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        request.setAttribute("paginaActiva", "reportes");

        try (Connection con = ConexionBD.obtenerConexion(getServletContext())) {
            request.setAttribute("statAppointments", contar(con, "SELECT COUNT(*) FROM citas"));
            request.setAttribute("statClients", contar(con,
                    "SELECT COUNT(*) FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol WHERE LOWER(r.nombre_rol) LIKE '%cliente%'"));
            request.setAttribute("statSpecialists", contar(con, "SELECT COUNT(*) FROM empleados"));
            request.setAttribute("statRevenue", sumar(con,
                    "SELECT COALESCE(SUM(costo_pactado),0) FROM citas WHERE UPPER(estado_cita) = 'COMPLETADA'"));

            request.setAttribute("citasSemana", citasPorDiaSemana(con));
            request.setAttribute("topServicios", topServicios(con));
            request.setAttribute("noShowList", inasistencias(con));
            request.setAttribute("cancelaciones", cancelaciones(con));
        } catch (Exception e) {
            e.printStackTrace();
        }

        request.getRequestDispatcher("/WEB-INF/administrador/reportes.jsp").forward(request, response);
    }

    private int contar(Connection con, String sql) {
        try (PreparedStatement ps = con.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception ignored) {}
        return 0;
    }

    private double sumar(Connection con, String sql) {
        try (PreparedStatement ps = con.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getDouble(1);
        } catch (Exception ignored) {}
        return 0.0;
    }

    private Map<String, Integer> citasPorDiaSemana(Connection con) {
        Map<String, Integer> semana = new LinkedHashMap<>();
        for (String d : new String[]{"Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"}) semana.put(d, 0);
        String sql = "SELECT TO_CHAR(fecha, 'DY', 'NLS_DATE_LANGUAGE=SPANISH') AS dia, COUNT(*) AS total FROM citas GROUP BY TO_CHAR(fecha, 'DY', 'NLS_DATE_LANGUAGE=SPANISH')";
        try (PreparedStatement ps = con.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                String d = rs.getString("dia");
                if (d == null) continue;
                d = d.toUpperCase();
                if (d.contains("LUN")) semana.put("Lunes", rs.getInt("total"));
                else if (d.contains("MAR")) semana.put("Martes", rs.getInt("total"));
                else if (d.contains("MIÉ") || d.contains("MIE")) semana.put("Miercoles", rs.getInt("total"));
                else if (d.contains("JUE")) semana.put("Jueves", rs.getInt("total"));
                else if (d.contains("VIE")) semana.put("Viernes", rs.getInt("total"));
                else if (d.contains("SÁB") || d.contains("SAB")) semana.put("Sabado", rs.getInt("total"));
                else if (d.contains("DOM")) semana.put("Domingo", rs.getInt("total"));
            }
        } catch (Exception ignored) {}
        return semana;
    }

    private List<Map<String, Object>> topServicios(Connection con) {
        List<Map<String, Object>> lista = new ArrayList<>();
        String sql = "SELECT s.nombre, COUNT(c.id_cita) AS total, COALESCE(SUM(c.costo_pactado),0) AS ingresos "
                + "FROM citas c JOIN servicios s ON c.id_servicio = s.id_servicio "
                + "GROUP BY s.nombre ORDER BY total DESC FETCH FIRST 6 ROWS ONLY";
        try (PreparedStatement ps = con.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> m = new HashMap<>();
                m.put("nombre", rs.getString("nombre"));
                m.put("total", rs.getInt("total"));
                m.put("ingresos", rs.getDouble("ingresos"));
                lista.add(m);
            }
        } catch (Exception ignored) {}
        return lista;
    }

    private List<Map<String, Object>> inasistencias(Connection con) {
        List<Map<String, Object>> lista = new ArrayList<>();
        String sql = "SELECT u.nombre_completo, COUNT(*) AS faltas "
                + "FROM citas c JOIN usuarios u ON c.id_cliente = u.id_usuario "
                + "WHERE UPPER(c.estado_cita) IN ('INASISTENCIA','NO_ASISTIO','CANCELADA') "
                + "GROUP BY u.nombre_completo HAVING COUNT(*) > 0 ORDER BY faltas DESC FETCH FIRST 6 ROWS ONLY";
        try (PreparedStatement ps = con.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> m = new HashMap<>();
                m.put("nombreCompleto", rs.getString("nombre_completo"));
                m.put("faltas", rs.getInt("faltas"));
                lista.add(m);
            }
        } catch (Exception ignored) {}
        return lista;
    }

    private List<Map<String, Object>> cancelaciones(Connection con) {
        List<Map<String, Object>> lista = new ArrayList<>();
        String sql = "SELECT u.nombre_completo, s.nombre AS servicio, TO_CHAR(c.fecha,'DD/MM/YYYY') AS fecha, c.hora "
                + "FROM citas c JOIN usuarios u ON c.id_cliente = u.id_usuario JOIN servicios s ON c.id_servicio = s.id_servicio "
                + "WHERE UPPER(c.estado_cita) = 'CANCELADA' ORDER BY c.id_cita DESC FETCH FIRST 6 ROWS ONLY";
        try (PreparedStatement ps = con.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> m = new HashMap<>();
                m.put("cliente", rs.getString("nombre_completo"));
                m.put("servicio", rs.getString("servicio"));
                m.put("fecha", rs.getString("fecha"));
                m.put("hora", rs.getString("hora"));
                lista.add(m);
            }
        } catch (Exception ignored) {}
        return lista;
    }
}
