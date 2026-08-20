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

        if (idStr != null && accion != null) {
            try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {
                int idUsuario = Integer.parseInt(idStr);

                switch (accion) {
                    case "vetar":
                        // CORREGIDO: Guarda 'TRUE' explícitamente para cumplir CHK_ESTADO_VETO
                        actualizarEstadoVeto(conexion, idUsuario, "TRUE");
                        break;
                    case "activar":
                        // CORREGIDO: Guarda 'FALSE' explícitamente para cumplir CHK_ESTADO_VETO
                        actualizarEstadoVeto(conexion, idUsuario, "FALSE");
                        break;
                    case "quitar-bloqueo":
                        limpiarFaltasYDesbloquear(conexion, idUsuario);
                        break;
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        response.sendRedirect(request.getContextPath() + "/admin/clientes");
    }

    private void actualizarEstadoVeto(Connection conexion, int idUsuario, String nuevoEstado) throws Exception {
        String sql = "UPDATE usuarios SET estado_veto = ? WHERE id_usuario = ?";
        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, nuevoEstado); // 'TRUE' o 'FALSE'
            ps.setInt(2, idUsuario);
            ps.executeUpdate();
        }
    }

    private void limpiarFaltasYDesbloquear(Connection conexion, int idUsuario) throws Exception {
        String sql = "UPDATE usuarios SET faltas_consecutivas = 0, estado_veto = 'FALSE' WHERE id_usuario = ?";
        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setInt(1, idUsuario);
            ps.executeUpdate();
        }
    }
}