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

@WebServlet("/admin/empleados/guardar")
public class AdminEmpleadosGuardarServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        String idStr = request.getParameter("id");
        String nombre = request.getParameter("nombre");
        String especialidad = request.getParameter("especialidad");
        String correo = request.getParameter("correo");
        String telefono = request.getParameter("telefono");
        String horaInicio = request.getParameter("horaInicio");
        String horaFin = request.getParameter("horaFin");
        String[] diasArr = request.getParameterValues("dias");

        String diasLaborales = (diasArr != null && diasArr.length > 0)
                ? String.join(",", diasArr)
                : "LUNES,MARTES,MIERCOLES,JUEVES,VIERNES";

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {

            if (idStr == null || idStr.trim().isEmpty()) {
                String sql = "INSERT INTO empleados (nombre, especialidad, email, telefono, hora_inicio, hora_fin, dias_laborales, estado) "
                        + "VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVO')";
                try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                    ps.setString(1, nombre);
                    ps.setString(2, especialidad);
                    ps.setString(3, correo);
                    ps.setString(4, telefono);
                    ps.setString(5, horaInicio);
                    ps.setString(6, horaFin);
                    ps.setString(7, diasLaborales);
                    ps.executeUpdate();
                }
                session.setAttribute("mensajeExito", "Empleado registrado con éxito.");
            } else {
                int idEmpleado = Integer.parseInt(idStr);
                String sql = "UPDATE empleados SET nombre=?, especialidad=?, email=?, telefono=?, hora_inicio=?, hora_fin=?, dias_laborales=? "
                        + "WHERE id_empleado=?";
                try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                    ps.setString(1, nombre);
                    ps.setString(2, especialidad);
                    ps.setString(3, correo);
                    ps.setString(4, telefono);
                    ps.setString(5, horaInicio);
                    ps.setString(6, horaFin);
                    ps.setString(7, diasLaborales);
                    ps.setInt(8, idEmpleado);
                    ps.executeUpdate();
                }
                session.setAttribute("mensajeExito", "Empleado actualizado correctamente.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            session.setAttribute("mensajeError", "Error al procesar el empleado: " + e.getMessage());
        }

        response.sendRedirect(request.getContextPath() + "/admin/empleados");
    }
}