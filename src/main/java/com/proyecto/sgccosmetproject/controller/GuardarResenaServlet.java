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
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;

@WebServlet("/guardarResena")
public class GuardarResenaServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();

        HttpSession session = request.getSession(false);
        Usuario usuarioActivo = (session != null) ? (Usuario) session.getAttribute("usuarioSesion") : null;

        if (usuarioActivo == null) {
            out.print("{\"success\": false, \"message\": \"Usuario no autenticado.\"}");
            return;
        }

        String idServicioStr = request.getParameter("idServicio");
        String calificacionStr = request.getParameter("calificacion");
        String comentario = request.getParameter("comentario");

        if (idServicioStr == null || calificacionStr == null || idServicioStr.trim().isEmpty() || calificacionStr.trim().isEmpty()) {
            out.print("{\"success\": false, \"message\": \"Faltan datos requeridos.\"}");
            return;
        }

        int idServicio = Integer.parseInt(idServicioStr.trim());
        int calificacion = Integer.parseInt(calificacionStr.trim());

        if (calificacion < 1 || calificacion > 5) {
            out.print("{\"success\": false, \"message\": \"La calificación debe estar entre 1 y 5.\"}");
            return;
        }

        if (comentario != null && comentario.length() > 4000) {
            comentario = comentario.substring(0, 4000);
        }

        String sql = "INSERT INTO resenas (id_cliente, id_servicio, calificacion, comentario) VALUES (?, ?, ?, ?)";

        try (Connection conn = ConexionBD.obtenerConexion(getServletContext())) {
            boolean autoCommitOriginal = conn.getAutoCommit();
            conn.setAutoCommit(false);

            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setInt(1, usuarioActivo.getIdUsuario());
                ps.setInt(2, idServicio);
                ps.setInt(3, calificacion);
                ps.setString(4, comentario);

                int filas = ps.executeUpdate();
                if (filas > 0) {
                    conn.commit();
                    out.print("{\"success\": true, \"message\": \"Reseña guardada exitosamente.\"}");
                } else {
                    conn.rollback();
                    out.print("{\"success\": false, \"message\": \"No se pudo guardar la reseña.\"}");
                }
            } catch (Exception e) {
                conn.rollback();
                throw e;
            } finally {
                conn.setAutoCommit(autoCommitOriginal);
            }

        } catch (Exception e) {
            e.printStackTrace();
            out.print("{\"success\": false, \"message\": \"Error al guardar en BD: " + escapeJson(e.getMessage()) + "\"}");
        }
        out.flush();
    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}