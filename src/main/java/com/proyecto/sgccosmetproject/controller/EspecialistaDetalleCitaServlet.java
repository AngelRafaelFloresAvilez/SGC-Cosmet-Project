package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.model.Usuario;
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
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/especialista/cita")
public class EspecialistaDetalleCitaServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        String idCitaStr = request.getParameter("id");
        if (idCitaStr == null || idCitaStr.trim().isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/especialista/agenda");
            return;
        }

        String sql = "SELECT c.id_cita, TO_CHAR(c.fecha, 'DD/MM/YYYY') AS fecha_cita, c.hora, c.costo_pactado, c.duracion_pactada, c.estado_cita, "
                + "u.nombre_completo AS cliente_nombre, u.correo AS cliente_correo, u.telefono AS cliente_telefono, "
                + "s.nombre AS servicio_nombre, s.descripcion AS servicio_descripcion "
                + "FROM citas c "
                + "JOIN usuarios u ON c.id_cliente = u.id_usuario "
                + "JOIN servicios s ON c.id_servicio = s.id_servicio "
                + "WHERE c.id_cita = ?";

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext());
             PreparedStatement ps = conexion.prepareStatement(sql)) {

            ps.setInt(1, Integer.parseInt(idCitaStr));
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Map<String, Object> detalle = new HashMap<>();
                    detalle.put("idCita", rs.getInt("id_cita"));
                    detalle.put("fecha", rs.getString("fecha_cita"));
                    detalle.put("hora", rs.getString("hora"));
                    detalle.put("costo", rs.getDouble("costo_pactado"));
                    detalle.put("duracion", rs.getString("duracion_pactada"));
                    detalle.put("estado", rs.getString("estado_cita"));
                    detalle.put("clienteNombre", rs.getString("cliente_nombre"));
                    detalle.put("clienteCorreo", rs.getString("cliente_correo"));
                    detalle.put("clienteTelefono", rs.getString("cliente_telefono"));
                    detalle.put("servicioNombre", rs.getString("servicio_nombre"));
                    detalle.put("servicioDescripcion", rs.getString("servicio_descripcion"));

                    request.setAttribute("citaDetalle", detalle);
                    request.getRequestDispatcher("/WEB-INF/especialista/detalleCita.jsp").forward(request, response);
                } else {
                    response.sendRedirect(request.getContextPath() + "/especialista/agenda");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error cargando detalle de la cita: " + e.getMessage());
        }
    }
}