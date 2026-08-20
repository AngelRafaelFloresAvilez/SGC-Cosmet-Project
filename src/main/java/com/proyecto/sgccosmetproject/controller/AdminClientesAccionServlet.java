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

@WebServlet("/admin/clientes/accion")
public class AdminClientesAccionServlet extends HttpServlet {

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
                int idCliente = Integer.parseInt(idStr);

                switch (accion) {
                    case "quitar-bloqueo":
                        String sqlFaltas = "UPDATE usuarios SET faltas_consecutivas = 0 WHERE id_usuario = ?";
                        try (PreparedStatement ps = conexion.prepareStatement(sqlFaltas)) {
                            ps.setInt(1, idCliente);
                            ps.executeUpdate();
                        }
                        session.setAttribute("mensajeExito", "Faltas restablecidas a cero.");
                        break;

                    case "vetar":
                        String sqlVetar = "UPDATE usuarios SET estado_veto = 'SI' WHERE id_usuario = ?";
                        try (PreparedStatement ps = conexion.prepareStatement(sqlVetar)) {
                            ps.setInt(1, idCliente);
                            ps.executeUpdate();
                        }
                        session.setAttribute("mensajeExito", "Cliente vetado correctamente.");
                        break;

                    case "activar":
                        String sqlActivar = "UPDATE usuarios SET estado_veto = 'NO' WHERE id_usuario = ?";
                        try (PreparedStatement ps = conexion.prepareStatement(sqlActivar)) {
                            ps.setInt(1, idCliente);
                            ps.executeUpdate();
                        }
                        session.setAttribute("mensajeExito", "Cliente reactivado correctamente.");
                        break;

                    default:
                        session.setAttribute("mensajeError", "Acción no válida.");
                        break;
                }

            } catch (Exception e) {
                e.printStackTrace();
                session.setAttribute("mensajeError", "Error al realizar la acción: " + e.getMessage());
            }
        }

        response.sendRedirect(request.getContextPath() + "/admin/clientes");
    }
}