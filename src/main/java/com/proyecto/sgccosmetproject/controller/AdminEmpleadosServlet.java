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

@WebServlet("/admin/empleados")
public class AdminEmpleadosServlet extends HttpServlet {

    private static final int REGISTROS_POR_PAGINA = 10;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        request.setAttribute("paginaActiva", "empleados");

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

            request.setAttribute("totalEmpleados", obtenerTotalEmpleados(conexion));
            request.setAttribute("empleadosActivos", obtenerTotalEmpleados(conexion));

            int totalRegistros = contarEmpleadosFiltrados(conexion, busqueda);
            int totalPaginas = (int) Math.ceil((double) totalRegistros / REGISTROS_POR_PAGINA);
            if (totalPaginas == 0) totalPaginas = 1;
            paginaActual = Math.min(paginaActual, totalPaginas);

            List<Map<String, Object>> empleados = obtenerEmpleadosPaginados(conexion, busqueda, paginaActual, REGISTROS_POR_PAGINA);

            request.setAttribute("empleados", empleados);
            request.setAttribute("busqueda", busqueda);
            request.setAttribute("paginaActual", paginaActual);
            request.setAttribute("totalPaginas", totalPaginas);

            request.getRequestDispatcher("/WEB-INF/administrador/empleados.jsp").forward(request, response);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error al cargar empleados: " + e.getMessage());
        }
    }

    private int obtenerTotalEmpleados(Connection conexion) {
        String sql = "SELECT COUNT(*) FROM empleados";
        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private int contarEmpleadosFiltrados(Connection conexion, String busqueda) {
        String sql = "SELECT COUNT(*) FROM empleados e "
                + "JOIN usuarios u ON e.id_usuario = u.id_usuario "
                + "WHERE LOWER(u.nombre_completo) LIKE ? OR LOWER(COALESCE(u.correo, '')) LIKE ? OR LOWER(COALESCE(e.especialidad, '')) LIKE ?";
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

    private List<Map<String, Object>> obtenerEmpleadosPaginados(Connection conexion, String busqueda, int pagina, int cantidad) {
        List<Map<String, Object>> lista = new ArrayList<>();
        int offset = (pagina - 1) * cantidad;

        String sql = "SELECT e.id_empleado, "
                + "       u.nombre_completo AS nombre, "
                + "       u.correo, "
                + "       u.telefono, "
                + "       e.especialidad, "
                + "       COALESCE((SELECT LISTAGG(dia_semana, ',') WITHIN GROUP (ORDER BY id_horario) FROM horarios_laborales WHERE id_empleado = e.id_empleado), 'LUNES,MARTES,MIERCOLES,JUEVES,VIERNES') AS dias_laborales, "
                + "       COALESCE((SELECT MIN(hora_inicio) FROM horarios_laborales WHERE id_empleado = e.id_empleado), '09:00') AS hora_inicio, "
                + "       COALESCE((SELECT MAX(hora_fin) FROM horarios_laborales WHERE id_empleado = e.id_empleado), '18:00') AS hora_fin "
                + "FROM empleados e "
                + "JOIN usuarios u ON e.id_usuario = u.id_usuario "
                + "WHERE LOWER(u.nombre_completo) LIKE ? OR LOWER(COALESCE(u.correo, '')) LIKE ? OR LOWER(COALESCE(e.especialidad, '')) LIKE ? "
                + "ORDER BY e.id_empleado DESC "
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
                    Map<String, Object> emp = new HashMap<>();
                    emp.put("idEmpleado", rs.getInt("id_empleado"));
                    emp.put("nombreCompleto", rs.getString("nombre"));
                    emp.put("correo", rs.getString("correo") != null ? rs.getString("correo") : "");
                    emp.put("telefono", rs.getString("telefono") != null ? rs.getString("telefono") : "");
                    emp.put("especialidad", rs.getString("especialidad") != null ? rs.getString("especialidad") : "General");

                    String hInicio = rs.getString("hora_inicio");
                    String hFin = rs.getString("hora_fin");
                    emp.put("horarioResumen", hInicio + " - " + hFin);

                    String diasLab = rs.getString("dias_laborales");
                    emp.put("rangoDiasLaborales", formatearDiasLaborales(diasLab));
                    emp.put("diasNoLaboralesTexto", calcularDiasNoLaborales(diasLab));
                    emp.put("activo", true);

                    lista.add(emp);
                }
            }
        } catch (Exception e) { e.printStackTrace(); }
        return lista;
    }

    private String formatearDiasLaborales(String diasStr) {
        if (diasStr == null || diasStr.trim().isEmpty()) return "Sin días";
        String[] dias = diasStr.split(",");
        if (dias.length == 7) return "Lunes a Domingo";
        if (dias.length == 5 && diasStr.contains("LUNES") && diasStr.contains("VIERNES")) return "Lunes a Viernes";
        return diasStr.replace(",", ", ");
    }

    private String calcularDiasNoLaborales(String diasStr) {
        List<String> todos = Arrays.asList("LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO");
        List<String> lab = Arrays.asList(diasStr.toUpperCase().split(","));
        List<String> noLab = new ArrayList<>();

        for (String d : todos) {
            if (!lab.contains(d)) {
                noLab.add(d.substring(0, 1) + d.substring(1, Math.min(3, d.length())).toLowerCase());
            }
        }
        return noLab.isEmpty() ? "Ninguno" : String.join(", ", noLab);
    }
}