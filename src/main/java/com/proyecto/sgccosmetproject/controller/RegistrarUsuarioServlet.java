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
import java.sql.Date;
import java.sql.PreparedStatement;

@WebServlet("/registrar-usuario")
public class RegistrarUsuarioServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String nombre = request.getParameter("nombre");
        String apellido = request.getParameter("apellido");
        String nombreCompleto = (nombre != null ? nombre.trim() : "") + " " + (apellido != null ? apellido.trim() : "");
        String email = request.getParameter("email");
        String telefono = request.getParameter("telefono");
        String fechaStr = request.getParameter("fecha");
        String password = request.getParameter("password");

        // 3 Corresponde al id_rol de 'Cliente' en la tabla roles
        int idRolCliente = 3;

        // 'FALSE' asegura que el usuario nace ACTIVO (sin veto)
        String estadoVeto = "FALSE";

        String sql = "INSERT INTO usuarios (nombre_completo, correo, telefono, fecha_nacimiento, contrasena, id_rol, estado_veto, faltas_consecutivas) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, 0)";

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext());
             PreparedStatement ps = conexion.prepareStatement(sql)) {

            ps.setString(1, nombreCompleto);
            ps.setString(2, email);
            ps.setString(3, telefono);
            ps.setDate(4, Date.valueOf(fechaStr));
            ps.setString(5, password);
            ps.setInt(6, idRolCliente);
            ps.setString(7, estadoVeto); // <-- 'FALSE' para que la cuenta esté activa

            ps.executeUpdate();

            HttpSession session = request.getSession();
            session.setAttribute("mensajeExito", "¡Cuenta creada exitosamente! Ya puedes iniciar sesión.");
            response.sendRedirect(request.getContextPath() + "/login");

        } catch (Exception e) {
            e.printStackTrace();
            HttpSession session = request.getSession();
            session.setAttribute("mensajeError", "Error al registrar la cuenta: " + e.getMessage());
            response.sendRedirect(request.getContextPath() + "/register");
        }
    }
}