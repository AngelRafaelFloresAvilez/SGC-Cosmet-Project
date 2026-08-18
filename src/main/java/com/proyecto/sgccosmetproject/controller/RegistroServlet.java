package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.util.ConexionBD;
import com.proyecto.sgccosmetproject.util.MailSender;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Servlet controlador para el registro de nuevos usuarios en <strong>SGC-Cosmetics</strong>.
 * <p>
 * Inserta el nuevo registro en la base de datos Oracle y dispara automáticamente
 * la notificación por correo electrónico de bienvenida mediante {@link MailSender}.
 * </p>
 *
 * @author alearr1ola
 * @version 1.0
 */
@WebServlet("/guardar-usuario")
public class RegistroServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(RegistroServlet.class.getName());

    /**
     * Procesa la creación de un nuevo usuario en el sistema.
     * <ol>
     *   <li>Extrae los datos personales del formulario de registro.</li>
     *   <li>Inserta el registro en la tabla {@code usuarios} de Oracle Cloud.</li>
     *   <li>Envía de manera asíncrona el correo de bienvenida oficial de SGC-Cosmetics.</li>
     *   <li>Redirecciona al listado de usuarios o login con confirmación.</li>
     * </ol>
     *
     * @param request  Petición HTTP con los campos {@code nombre}, {@code correo}, {@code telefono},
     *                 {@code fechaNacimiento}, {@code contrasena} e {@code idRol}.
     * @param response Respuesta HTTP para redirección o reporte de error.
     * @throws IOException Si ocurre un error de comunicación de E/S.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String nombre = request.getParameter("nombre");
        String correo = request.getParameter("correo");
        String telefono = request.getParameter("telefono");
        String fechaNacimiento = request.getParameter("fechaNacimiento");
        String contrasena = request.getParameter("contrasena");

        int idRol = 2; // Por defecto Rol Cliente / Empleado
        String idRolParam = request.getParameter("idRol");
        if (idRolParam != null && !idRolParam.trim().isEmpty()) {
            try {
                idRol = Integer.parseInt(idRolParam.trim());
            } catch (NumberFormatException e) {
                idRol = 2;
            }
        }

        String sql = "INSERT INTO usuarios (nombre_completo, correo, telefono, fecha_nacimiento, contrasena, id_rol, estado_veto, faltas_consecutivas) "
                   + "VALUES (?, ?, ?, TO_DATE(?, 'YYYY-MM-DD'), ?, ?, 'FALSE', 0)";

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext());
             PreparedStatement stmt = conexion.prepareStatement(sql)) {

            stmt.setString(1, nombre != null ? nombre.trim() : "");
            stmt.setString(2, correo != null ? correo.trim().toLowerCase() : "");
            stmt.setString(3, telefono != null ? telefono.trim() : "");
            stmt.setString(4, fechaNacimiento);
            stmt.setString(5, contrasena);
            stmt.setInt(6, idRol);

            stmt.executeUpdate();
            LOGGER.info("Usuario registrado exitosamente: " + correo);

            // Enviar notificación de bienvenida por correo electrónico en segundo plano
            if (correo != null && !correo.trim().isEmpty()) {
                MailSender.enviarCorreoBienvenida(correo.trim(), nombre != null ? nombre.trim() : "Usuario");
            }

            // Redireccionar al listado de usuarios
            response.sendRedirect("usuarios");

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error al registrar usuario en la base de datos: " + e.getMessage(), e);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println("<h3 style='color: red;'> Error al guardar: " + e.getMessage() + "</h3>");
        }
    }
}