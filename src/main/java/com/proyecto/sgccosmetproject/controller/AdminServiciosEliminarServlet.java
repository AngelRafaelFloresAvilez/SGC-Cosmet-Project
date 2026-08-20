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

@WebServlet("/admin/servicios/eliminar")
public class AdminServiciosEliminarServlet extends HttpServlet {

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
                String sql = "DELETE FROM servicios WHERE id_servicio = ?";
                try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                    ps.setInt(1, idServicio);
                    ps.executeUpdate();
                }
                session.setAttribute("mensajeExito", "Servicio eliminado correctamente.");
            } catch (Exception e) {
                e.printStackTrace();
                session.setAttribute("mensajeError", "No se puede eliminar el servicio porque tiene citas registradas.");
            }
        }

        response.sendRedirect(request.getContextPath() + "/admin/servicios");
    }
}