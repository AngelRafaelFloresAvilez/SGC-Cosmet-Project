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

@WebServlet("/admin/citas/accion")
public class AdminCitasAccionServlet extends HttpServlet {

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
        String pagina = request.getParameter("pagina");

        if (idStr != null && accion != null) {
            try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {
                int idCita = Integer.parseInt(idStr);
                String nuevoEstado = null;

                // Mapeo exacto según la restricción CHECK: 'Pendiente', 'Confirmada', 'Cancelada', 'Inasistencia'
                if ("confirmar".equalsIgnoreCase(accion)) {
                    nuevoEstado = "Confirmada";
                } else if ("cancelar".equalsIgnoreCase(accion)) {
                    nuevoEstado = "Cancelada";
                } else if ("inasistencia".equalsIgnoreCase(accion)) {
                    nuevoEstado = "Inasistencia";
                }

                if (nuevoEstado != null) {
                    String sql = "UPDATE citas SET estado_cita = ? WHERE id_cita = ?";
                    try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                        ps.setString(1, nuevoEstado);
                        ps.setInt(2, idCita);
                        ps.executeUpdate();
                    }
                    session.setAttribute("mensajeExito", "Estado de la cita actualizado a " + nuevoEstado);
                }
            } catch (Exception e) {
                e.printStackTrace();
                session.setAttribute("mensajeError", "Error al actualizar la cita: " + e.getMessage());
            }
        }

        String target = request.getContextPath() + "/admin/citas";
        if (pagina != null && !pagina.isEmpty()) {
            target += "?pagina=" + pagina;
        }
        response.sendRedirect(target);
    }
}