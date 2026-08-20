package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.model.Resena;
import com.proyecto.sgccosmetproject.util.ConexionBD;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/obtenerResenas")
public class ObtenerResenasServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);
        response.setContentType("application/json;charset=UTF-8");

        PrintWriter out = response.getWriter();

        String idServicioStr = request.getParameter("idServicio");
        if (idServicioStr == null || idServicioStr.trim().isEmpty()) {
            out.print("[]");
            return;
        }

        int idServicio;
        try {
            idServicio = Integer.parseInt(idServicioStr.trim());
        } catch (NumberFormatException e) {
            out.print("[]");
            return;
        }

        List<Resena> lista = new ArrayList<>();

        String sql = "SELECT r.id_resena, r.id_cliente, u.nombre_completo, r.id_servicio, r.calificacion, r.comentario " +
                "FROM resenas r " +
                "JOIN usuarios u ON r.id_cliente = u.id_usuario " +
                "WHERE r.id_servicio = ? " +
                "ORDER BY r.id_resena DESC";

        try (Connection conn = ConexionBD.obtenerConexion(getServletContext());
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, idServicio);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Resena res = new Resena(
                            rs.getInt("id_resena"),
                            rs.getInt("id_cliente"),
                            rs.getString("nombre_completo"),
                            rs.getInt("id_servicio"),
                            rs.getInt("calificacion"),
                            rs.getString("comentario")
                    );
                    lista.add(res);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < lista.size(); i++) {
            Resena r = lista.get(i);
            json.append("{")
                    .append("\"idResena\":").append(r.getIdResena()).append(",")
                    .append("\"idCliente\":").append(r.getIdCliente()).append(",")
                    .append("\"nombreCliente\":\"").append(escapeJson(r.getNombreCliente())).append("\",")
                    .append("\"idServicio\":").append(r.getIdServicio()).append(",")
                    .append("\"calificacion\":").append(r.getCalificacion()).append(",")
                    .append("\"comentario\":\"").append(escapeJson(r.getComentario())).append("\"")
                    .append("}");
            if (i < lista.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");

        out.print(json.toString());
        out.flush();
    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}