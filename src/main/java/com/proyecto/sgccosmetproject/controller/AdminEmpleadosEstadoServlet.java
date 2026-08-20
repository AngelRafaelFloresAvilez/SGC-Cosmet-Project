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

@WebServlet("/admin/empleados/estado")
public class AdminEmpleadosEstadoServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        String idStr = request.getParameter("id");
        String accion = request.getParameter("accion");

        if (idStr != null && !idStr.trim().isEmpty() && accion != null) {
            try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {
                int idEmpleado = Integer.parseInt(idStr);

                if ("eliminar".equalsIgnoreCase(accion)) {
                    String sql = "DELETE FROM empleados WHERE id_empleado = ?";
                    try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                        ps.setInt(1, idEmpleado);
                        ps.executeUpdate();
                    }
                    session.setAttribute("mensajeExito", "Empleado eliminado correctamente.");
                } else if ("activar".equalsIgnoreCase(accion) || "desactivar".equalsIgnoreCase(accion)) {
                    String nuevoEstado = "activar".equalsIgnoreCase(accion) ? "ACTIVO" : "INACTIVO";
                    String sql = "UPDATE empleados SET estado = ? WHERE id_empleado = ?";
                    try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                        ps.setString(1, nuevoEstado);
                        ps.setInt(2, idEmpleado);
                        ps.executeUpdate();
                    }
                    session.setAttribute("mensajeExito", "Estado del empleado actualizado.");
                }
            } catch (Exception e) {
                e.printStackTrace();
                session.setAttribute("mensajeError", "Error al cambiar estado: " + e.getMessage());
            }
        }

        response.sendRedirect(request.getContextPath() + "/admin/empleados");
    }
}