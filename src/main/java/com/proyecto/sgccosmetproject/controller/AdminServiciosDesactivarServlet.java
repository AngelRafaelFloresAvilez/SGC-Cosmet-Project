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

@WebServlet("/admin/servicios/desactivar")
public class AdminServiciosDesactivarServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        String idStr = request.getParameter("id");
        if (idStr != null && !idStr.trim().isEmpty()) {
            try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {
                int idServicio = Integer.parseInt(idStr);

                // Alineado con la columna 'estado' de la tabla 'servicios'
                String sql = "UPDATE servicios SET estado = 'Inactivo' WHERE id_servicio = ?";

                try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                    ps.setInt(1, idServicio);
                    ps.executeUpdate();
                }
                session.setAttribute("mensajeExito", "Servicio desactivado correctamente.");
            } catch (Exception e) {
                e.printStackTrace();
                session.setAttribute("mensajeError", "Ocurrió un error al intentar desactivar el servicio.");
            }
        }

        response.sendRedirect(request.getContextPath() + "/admin/servicios");
    }
}