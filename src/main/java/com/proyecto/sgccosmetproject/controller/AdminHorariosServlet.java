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

@WebServlet("/admin/horarios")
public class AdminHorariosServlet extends HttpServlet {

    private static final String[] DIAS = {"", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"};

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        request.setAttribute("paginaActiva", "horarios");

        List<Map<String, Object>> empleados = new ArrayList<>();
        try (Connection con = ConexionBD.obtenerConexion(getServletContext())) {
            String sql = "SELECT e.id_empleado, u.nombre_completo, COALESCE(e.especialidad,'Especialista') AS especialidad "
                    + "FROM empleados e JOIN usuarios u ON e.id_usuario = u.id_usuario ORDER BY u.nombre_completo";
            try (PreparedStatement ps = con.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> emp = new LinkedHashMap<>();
                    int idEmp = rs.getInt("id_empleado");
                    emp.put("nombreCompleto", rs.getString("nombre_completo"));
                    emp.put("especialidad", rs.getString("especialidad"));
                    emp.put("horario", cargarHorario(con, idEmp));
                    empleados.add(emp);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        request.setAttribute("empleados", empleados);
        request.getRequestDispatcher("/WEB-INF/administrador/horarios.jsp").forward(request, response);
    }

    private Map<String, String> cargarHorario(Connection con, int idEmpleado) {
        Map<String, String> horario = new LinkedHashMap<>();
        for (int i = 1; i <= 7; i++) horario.put(DIAS[i], null);
        String sql = "SELECT dia_semana, hora_inicio, hora_fin FROM horarios_laborales WHERE id_empleado = ?";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idEmpleado);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    int d = rs.getInt("dia_semana");
                    if (d >= 1 && d <= 7) horario.put(DIAS[d], rs.getString("hora_inicio") + " - " + rs.getString("hora_fin"));
                }
            }
        } catch (Exception ignored) {}
        return horario;
    }
}
