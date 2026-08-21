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
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.UUID;

@WebServlet("/admin/servicios/guardar")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 1, // 1 MB
        maxFileSize = 1024 * 1024 * 5,       // 5 MB
        maxRequestSize = 1024 * 1024 * 10    // 10 MB
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

        request.setCharacterEncoding("UTF-8");

        String idStr = request.getParameter("id");
        String nombre = request.getParameter("nombre");
        String precioStr = request.getParameter("precio");
        String duracionStr = request.getParameter("duracion");
        String estadoRaw = request.getParameter("estado");
        String descripcion = request.getParameter("descripcion");
        String fotoUrlInput = request.getParameter("fotoUrl");

        String estadoFinal = "Activo";
        if (estadoRaw != null && ("Inactivo".equalsIgnoreCase(estadoRaw) || "false".equalsIgnoreCase(estadoRaw))) {
            estadoFinal = "Inactivo";
        }

        double costo = 0.0;
        if (precioStr != null && !precioStr.trim().isEmpty()) {
            try {
                costo = Double.parseDouble(precioStr.trim());
            } catch (NumberFormatException ignored) {}
        }

        String duracion = (duracionStr != null && !duracionStr.trim().isEmpty())
                ? duracionStr.trim() + " minutos"
                : "60 minutos";

        // Procesar foto / imagen
        String rutaFoto = null;
        if (fotoUrlInput != null && !fotoUrlInput.trim().isEmpty()) {
            rutaFoto = fotoUrlInput.trim();
        } else {
            try {
                Part filePart = request.getPart("fotoArchivo");
                if (filePart != null && filePart.getSize() > 0 && filePart.getSubmittedFileName() != null) {
                    String fileName = filePart.getSubmittedFileName();
                    String extension = fileName.contains(".") ? fileName.substring(fileName.lastIndexOf(".")) : ".jpg";
                    String nuevoNombre = UUID.randomUUID().toString() + extension;

                    String uploadDir = getServletContext().getRealPath("/assets/uploads");
                    File dir = new File(uploadDir);
                    if (!dir.exists()) dir.mkdirs();

                    File fileToSave = new File(dir, nuevoNombre);
                    try (InputStream input = filePart.getInputStream()) {
                        Files.copy(input, fileToSave.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    }
                    rutaFoto = "/assets/uploads/" + nuevoNombre;
                }
            } catch (Exception ignored) {}
        }

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {

            if (idStr != null && !idStr.trim().isEmpty()) {
                // ACTUALIZAR
                int idServicio = Integer.parseInt(idStr.trim());

                StringBuilder sql = new StringBuilder("UPDATE servicios SET nombre = ?, descripcion = ?, costo = ?, duracion_estimada = ?, estado = ?");
                if (rutaFoto != null) {
                    sql.append(", foto_url = ?");
                }
                sql.append(" WHERE id_servicio = ?");

                try (PreparedStatement ps = conexion.prepareStatement(sql.toString())) {
                    ps.setString(1, nombre);
                    ps.setString(2, descripcion);
                    ps.setDouble(3, costo);
                    ps.setString(4, duracion);
                    ps.setString(5, estadoFinal);

                    if (rutaFoto != null) {
                        ps.setString(6, rutaFoto);
                        ps.setInt(7, idServicio);
                    } else {
                        ps.setInt(6, idServicio);
                    }
                    ps.executeUpdate();
                }

                session.setAttribute("mensajeExito", "Servicio actualizado correctamente.");

            } else {
                // INSERTAR
                String sql = "INSERT INTO servicios (nombre, descripcion, costo, duracion_estimada, estado, foto_url) VALUES (?, ?, ?, ?, ?, ?)";
                try (PreparedStatement ps = conexion.prepareStatement(sql)) {
                    ps.setString(1, nombre);
                    ps.setString(2, descripcion);
                    ps.setDouble(3, costo);
                    ps.setString(4, duracion);
                    ps.setString(5, estadoFinal);
                    ps.setString(6, rutaFoto);
                    ps.executeUpdate();
                }

                session.setAttribute("mensajeExito", "Servicio creado correctamente.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            session.setAttribute("mensajeError", "Error al guardar el servicio: " + e.getMessage());
        }

        response.sendRedirect(request.getContextPath() + "/admin/servicios");
    }
}