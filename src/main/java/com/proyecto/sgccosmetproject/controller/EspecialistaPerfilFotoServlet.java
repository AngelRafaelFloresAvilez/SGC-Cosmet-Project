package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.model.Usuario;
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

@WebServlet("/especialista/perfil/foto")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024,      // 1 MB
        maxFileSize = 2 * 1024 * 1024,         // 2 MB max
        maxRequestSize = 5 * 1024 * 1024       // 5 MB max
)
public class EspecialistaPerfilFotoServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        Usuario usuario = (Usuario) session.getAttribute("usuarioSesion");
        Part filePart = request.getPart("foto");

        if (filePart == null || filePart.getSize() == 0) {
            response.sendRedirect(request.getContextPath() + "/especialista/perfil");
            return;
        }

        String fileName = filePart.getSubmittedFileName();
        String extension = "";
        int i = fileName.lastIndexOf('.');
        if (i > 0) extension = fileName.substring(i);

        String nuevoNombre = "perfil_" + usuario.getIdUsuario() + "_" + System.currentTimeMillis() + extension;

        String uploadPath = getServletContext().getRealPath("") + File.separator + "uploads" + File.separator + "perfiles";
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        filePart.write(uploadPath + File.separator + nuevoNombre);

        String rutaRelativa = "/uploads/perfiles/" + nuevoNombre;

        String sql = "UPDATE usuarios SET ruta_foto = ? WHERE id_usuario = ?";
        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext());
             PreparedStatement ps = conexion.prepareStatement(sql)) {

            ps.setString(1, rutaRelativa);
            ps.setInt(2, usuario.getIdUsuario());
            ps.executeUpdate();

            session.setAttribute("mensajeExito", "Foto de perfil actualizada correctamente.");

        } catch (Exception e) {
            e.printStackTrace();
            session.setAttribute("mensajeError", "Error al guardar la foto en la base de datos.");
        }

        response.sendRedirect(request.getContextPath() + "/especialista/perfil");
    }
}