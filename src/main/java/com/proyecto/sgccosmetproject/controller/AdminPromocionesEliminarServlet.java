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

@WebServlet("/admin/promociones/eliminar")
public class AdminPromocionesEliminarServlet extends HttpServlet {

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
                int idPromocion = Integer.parseInt(idStr);
                String sql = "DELETE FROM promociones WHERE id_promocion = ?";

                try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                    ps.setInt(1, idPromocion);
                    ps.executeUpdate();
                }
                session.setAttribute("mensajeExito", "Promoción eliminada correctamente.");

            } catch (Exception e) {
                e.printStackTrace();
                session.setAttribute("mensajeError", "Error al eliminar la promoción: " + e.getMessage());
            }
        }

        response.sendRedirect(request.getContextPath() + "/admin/promociones");
    }
}