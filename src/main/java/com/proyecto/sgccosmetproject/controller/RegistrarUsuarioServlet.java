package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.util.ConexionBD;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@WebServlet("/registrar-usuario")
public class RegistrarUsuarioServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        // 1. Leemos con los nombres EXACTOS que vienen del formulario register.jsp
        String nombre = request.getParameter("nombre");
        String apellido = request.getParameter("apellido");
        String correo = request.getParameter("email");
        String telefono = request.getParameter("telefono");
        String fechaNacimiento = request.getParameter("fecha");
        String contrasena = request.getParameter("password");

        // 2. Unimos nombre y apellido porque la BD espera 'nombre_completo'
        String nombreCompleto = nombre + " " + apellido;

        // 3. Asignamos un rol por defecto (ej. 2 para cliente).
        // En el formulario público el usuario no elige su rol por seguridad.
        int idRolCliente = 2;

        // Sentencia SQL basada en la estructura original
        String sql = "INSERT INTO usuarios (nombre_completo, correo, telefono, fecha_nacimiento, contrasena, id_rol, estado_veto, faltas_consecutivas) VALUES (?, ?, ?, TO_DATE(?, 'YYYY-MM-DD'), ?, ?, 'FALSE', 0)";

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext());
             PreparedStatement stmt = conexion.prepareStatement(sql)) {

            stmt.setString(1, nombreCompleto);
            stmt.setString(2, correo);
            stmt.setString(3, telefono);
            stmt.setString(4, fechaNacimiento);
            stmt.setString(5, contrasena);
            stmt.setInt(6, idRolCliente);

            // Ejecutamos la inserción en la BD
            stmt.executeUpdate();

            // 4. Si el registro es exitoso, lo enviamos al login para que inicie sesión
            response.sendRedirect(request.getContextPath() + "/login");

        } catch (SQLException e) {
            // 5. Si falla (por ejemplo, correo duplicado), damos un pase interno con el error
            request.setAttribute("error", "Error al registrar la cuenta: " + e.getMessage());
            // Regresamos la vista hacia el JSP de registro (asegúrate de que la ruta coincida con tu estructura)
            request.getRequestDispatcher("/WEB-INF/registro.jsp").forward(request, response);
        }
    }
}