package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.util.ConexionBD;
import com.proyecto.sgccosmetproject.model.Usuario;
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
import java.sql.SQLException;

@WebServlet("/autenticar-usuario")
public class AutenticarUsuarioServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Leemos con los nombres EXACTOS que vienen de tu formulario
        String correo = request.getParameter("loginEmail");
        String contrasena = request.getParameter("loginPassword");

        String sql = "SELECT nombre_completo, correo, telefono, fecha_nacimiento, id_rol, estado_veto " +
                "FROM usuarios WHERE correo = ? AND contrasena = ?";

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext());
             PreparedStatement stmt = conexion.prepareStatement(sql)) {

            stmt.setString(1, correo);
            stmt.setString(2, contrasena);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    // 1. Creamos el objeto del usuario logueado
                    Usuario usuarioLogueado = new Usuario(
                            rs.getString("nombre_completo"),
                            rs.getString("correo"),
                            rs.getString("telefono"),
                            rs.getDate("fecha_nacimiento"),
                            rs.getInt("id_rol"),
                            rs.getString("estado_veto")
                    );

                    // 2. Guardamos en la sesión
                    HttpSession session = request.getSession();
                    session.setAttribute("usuarioSesion", usuarioLogueado);

                    // 3. ¡LA CORRECCIÓN AQUÍ! Damos el pase interno hacia WEB-INF
                    request.getRequestDispatcher("/WEB-INF/dashboard.jsp").forward(request, response);

                } else {
                    // Si falla, también le damos un pase interno de regreso al login con el error
                    request.setAttribute("error", "invalid"); // Usamos setAttribute en lugar de parámetro en la URL
                    request.getRequestDispatcher("/WEB-INF/login.jsp").forward(request, response);
                }
            } catch (ServletException e) {
                throw new RuntimeException(e);
            }

        } catch (SQLException e) {
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println("<h3>Error en base de datos: " + e.getMessage() + "</h3>");
        }
    }
}