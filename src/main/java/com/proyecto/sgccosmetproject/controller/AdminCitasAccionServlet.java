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
                String nuevoEstado = "confirmar".equalsIgnoreCase(accion) ? "CONFIRMADA" : "CANCELADA";

                String sql = "UPDATE citas SET estado_cita = ? WHERE id_cita = ?";
                try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                    ps.setString(1, nuevoEstado);
                    ps.setInt(2, idCita);
                    ps.executeUpdate();
                }

                session.setAttribute("mensajeExito", "La cita #" + idCita + " fue actualizada a " + nuevoEstado.toLowerCase() + ".");

            } catch (Exception e) {
                e.printStackTrace();
                session.setAttribute("mensajeError", "Error procesando la cita: " + e.getMessage());
            }
        }

        String redirectUrl = request.getContextPath() + "/admin/citas";
        if (pagina != null && !pagina.isEmpty()) {
            redirectUrl += "?pagina=" + pagina;
        }
        response.sendRedirect(redirectUrl);
    }
}