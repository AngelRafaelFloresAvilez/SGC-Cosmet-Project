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
        String correo = request.getParameter("loginEmail");
        String contrasena = request.getParameter("loginPassword");

        String sql = "SELECT id_usuario, nombre_completo, correo, telefono, fecha_nacimiento, id_rol, estado_veto " +
                "FROM usuarios WHERE correo = ? AND contrasena = ?";

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext());
             PreparedStatement stmt = conexion.prepareStatement(sql)) {

            stmt.setString(1, correo);
            stmt.setString(2, contrasena);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Usuario usuarioLogueado = new Usuario(
                            rs.getString("nombre_completo"),
                            rs.getString("correo"),
                            rs.getString("telefono"),
                            rs.getDate("fecha_nacimiento"),
                            rs.getInt("id_rol"),
                            rs.getString("estado_veto")
                    );

                    usuarioLogueado.setIdUsuario(rs.getInt("id_usuario"));

                    HttpSession session = request.getSession();
                    session.setAttribute("usuarioSesion", usuarioLogueado);

                    switch (usuarioLogueado.getIdRol()) {
                        case 1: // Administrador
                            response.sendRedirect(request.getContextPath() + "/admin-dashboard");
                            break;

                        case 2: // Especialista / Empleado
                            response.sendRedirect(request.getContextPath() + "/especialista-dashboard");
                            break;

                        case 3: // Cliente
                        default:
                            response.sendRedirect(request.getContextPath() + "/dashboardServlet");
                            break;
                    }

                } else {
                    request.setAttribute("error", "invalid");
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