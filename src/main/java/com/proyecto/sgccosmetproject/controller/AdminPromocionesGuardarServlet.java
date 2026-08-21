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
import java.sql.Date;
import java.sql.PreparedStatement;

@WebServlet("/admin/promociones/guardar")
public class AdminPromocionesGuardarServlet extends HttpServlet {

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
        String descripcion = request.getParameter("descripcion");
        String tipo = request.getParameter("tipo");
        String descuento = request.getParameter("descuento");
        String fechaInicioStr = request.getParameter("fechaInicio");
        String fechaFinStr = request.getParameter("fechaFin");

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {

            Date fechaInicio = Date.valueOf(fechaInicioStr);
            Date fechaFin = Date.valueOf(fechaFinStr);

            if (idStr == null || idStr.trim().isEmpty()) {
                String sql = "INSERT INTO promociones (nombre, descripcion, tipo, descuento, fecha_inicio, fecha_fin) "
                        + "VALUES (?, ?, ?, ?, ?, ?)";
                try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                    ps.setString(1, nombre);
                    ps.setString(2, descripcion);
                    ps.setString(3, tipo);
                    ps.setString(4, descuento);
                    ps.setDate(5, fechaInicio);
                    ps.setDate(6, fechaFin);
                    ps.executeUpdate();
                }
                session.setAttribute("mensajeExito", "Promoción creada exitosamente.");
            } else {
                int idPromocion = Integer.parseInt(idStr);
                String sql = "UPDATE promociones SET nombre=?, descripcion=?, tipo=?, descuento=?, fecha_inicio=?, fecha_fin=? "
                        + "WHERE id_promocion=?";
                try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                    ps.setString(1, nombre);
                    ps.setString(2, descripcion);
                    ps.setString(3, tipo);
                    ps.setString(4, descuento);
                    ps.setDate(5, fechaInicio);
                    ps.setDate(6, fechaFin);
                    ps.setInt(7, idPromocion);
                    ps.executeUpdate();
                }
                session.setAttribute("mensajeExito", "Promoción actualizada correctamente.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            session.setAttribute("mensajeError", "Error al guardar la promoción: " + e.getMessage());
        }

        response.sendRedirect(request.getContextPath() + "/admin/promociones");
    }
}