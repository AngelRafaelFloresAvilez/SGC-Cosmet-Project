package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.util.ConexionBD;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.Part;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.UUID;

@WebServlet("/admin/servicios/guardar")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 1,
        maxFileSize = 1024 * 1024 * 5,
        maxRequestSize = 1024 * 1024 * 10
)
public class AdminServiciosGuardarServlet extends HttpServlet {

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
        String precioStr = request.getParameter("precio");
        String duracionStr = request.getParameter("duracion");
        String estado = request.getParameter("estado");
        String descripcion = request.getParameter("descripcion");
        String fotoUrl = request.getParameter("fotoUrl");

        Part fotoArchivo = request.getPart("fotoArchivo");
        String rutaFotoProcesada = null;

        if (fotoArchivo != null && fotoArchivo.getSize() > 0) {
            String fileName = UUID.randomUUID().toString() + "_" + obtenerNombreArchivo(fotoArchivo);
            String uploadPath = getServletContext().getRealPath("") + File.separator + "uploads" + File.separator + "servicios";
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            fotoArchivo.write(uploadPath + File.separator + fileName);
            rutaFotoProcesada = "/uploads/servicios/" + fileName;
        } else if (fotoUrl != null && !fotoUrl.trim().isEmpty()) {
            rutaFotoProcesada = fotoUrl.trim();
        }

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {
            double precio = Double.parseDouble(precioStr);
            int duracion = Integer.parseInt(duracionStr);
            String estadoNormalizado = "activo".equalsIgnoreCase(estado) ? "ACTIVO" : "INACTIVO";

            if (idStr == null || idStr.trim().isEmpty()) {
                String sql = "INSERT INTO servicios (nombre, descripcion, duracion_estimada, costo, estado, foto_url) "
                        + "VALUES (?, ?, ?, ?, ?, ?)";
                try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                    ps.setString(1, nombre);
                    ps.setString(2, descripcion);
                    ps.setInt(3, duracion);
                    ps.setDouble(4, precio);
                    ps.setString(5, estadoNormalizado);
                    ps.setString(6, rutaFotoProcesada);
                    ps.executeUpdate();
                }
                session.setAttribute("mensajeExito", "Servicio creado exitosamente.");
            } else {
                int idServicio = Integer.parseInt(idStr);
                if (rutaFotoProcesada != null) {
                    String sql = "UPDATE servicios SET nombre=?, descripcion=?, duracion_estimada=?, costo=?, estado=?, foto_url=? WHERE id_servicio=?";
                    try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                        ps.setString(1, nombre);
                        ps.setString(2, descripcion);
                        ps.setInt(3, duracion);
                        ps.setDouble(4, precio);
                        ps.setString(5, estadoNormalizado);
                        ps.setString(6, rutaFotoProcesada);
                        ps.setInt(7, idServicio);
                        ps.executeUpdate();
                    }
                } else {
                    String sql = "UPDATE servicios SET nombre=?, descripcion=?, duracion_estimada=?, costo=?, estado=? WHERE id_servicio=?";
                    try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                        ps.setString(1, nombre);
                        ps.setString(2, descripcion);
                        ps.setInt(3, duracion);
                        ps.setDouble(4, precio);
                        ps.setString(5, estadoNormalizado);
                        ps.setInt(6, idServicio);
                        ps.executeUpdate();
                    }
                }
                session.setAttribute("mensajeExito", "Servicio actualizado correctamente.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            session.setAttribute("mensajeError", "Error al guardar el servicio: " + e.getMessage());
        }

        response.sendRedirect(request.getContextPath() + "/admin/servicios");
    }

    private String obtenerNombreArchivo(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        for (String token : contentDisp.split(";")) {
            if (token.trim().startsWith("filename")) {
                return token.substring(token.indexOf('=') + 2, token.length() - 1);
            }
        }
        return "imagen.jpg";
    }
}