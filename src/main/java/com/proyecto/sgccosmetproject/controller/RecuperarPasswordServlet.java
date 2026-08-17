package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.util.ConexionBD;
import com.proyecto.sgccosmetproject.util.MailSender;
import com.proyecto.sgccosmetproject.util.TokenManager;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Controlador para la solicitud de recuperación de contraseñas en <strong>SGC-Cosmetics</strong>.
 *
 * Atiende las peticiones GET para mostrar la vista de ingreso de correo, y las peticiones POST
 * para verificar la existencia del usuario en la base de datos, generar el código temporal
 * de recuperación y despachar el correo electrónico correspondiente.
 *
 *
 * @author alearr1ola
 * @version 1.0
 */
@WebServlet("/recuperar-password")
public class RecuperarPasswordServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(RecuperarPasswordServlet.class.getName());

    /**
     * Muestra la interfaz gráfica para solicitar la recuperación de contraseña.
     *
     * @param request  Petición HTTP entrante.
     * @param response Respuesta HTTP saliente.
     * @throws ServletException Si ocurre un error de despacho.
     * @throws IOException      Si ocurre un error de entrada/salida.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("/WEB-INF/recuperar-password.jsp").forward(request, response);
    }

    /**
     * Procesa el formulario de solicitud de recuperación de contraseña.
     *
     *   Valida el formato del correo electrónico recibido.
     *   Consulta en Oracle DB si existe una cuenta asociada al correo.
     *   Genera un código numérico seguro de 6 dígitos con expiración de 15 minutos.
     *   Envía el correo con plantilla oficial de SGC-Cosmetics.
     *   Redirige al usuario al formulario de validación de código y cambio de contraseña.
     *
     *
     * @param request  Petición HTTP con el parámetro {@code email}.
     * @param response Respuesta HTTP.
     * @throws ServletException Si ocurre un error en el servlet.
     * @throws IOException      Si ocurre un error de redirección.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String email = request.getParameter("email");

        // Validación básica de entrada
        if (email == null || email.trim().isEmpty() || !email.contains("@")) {
            request.setAttribute("error", "invalidEmail");
            request.getRequestDispatcher("/WEB-INF/recuperar-password.jsp").forward(request, response);
            return;
        }

        email = email.trim().toLowerCase();
        String nombreCompleto = null;

        String sql = "SELECT nombre_completo FROM usuarios WHERE LOWER(correo) = ?";

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext());
             PreparedStatement stmt = conexion.prepareStatement(sql)) {

            stmt.setString(1, email);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    nombreCompleto = rs.getString("nombre_completo");
                }
            }

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error de base de datos al buscar usuario para recuperacion: " + e.getMessage(), e);
            request.setAttribute("error", "dbError");
            request.setAttribute("errorMessage", "Error al consultar el servicio. Por favor intenta más tarde.");
            request.getRequestDispatcher("/WEB-INF/recuperar-password.jsp").forward(request, response);
            return;
        }

        // Si el usuario no existe en la base de datos
        if (nombreCompleto == null) {
            request.setAttribute("error", "userNotFound");
            request.setAttribute("emailIngresado", email);
            request.getRequestDispatcher("/WEB-INF/recuperar-password.jsp").forward(request, response);
            return;
        }

        // Generar código de 6 dígitos seguro
        String codigo = TokenManager.generarToken(email);

        // Despachar correo electrónico con la plantilla de SGC-Cosmetics
        MailSender.enviarCorreoRecuperacion(email, nombreCompleto, codigo);

        LOGGER.info("Proceso de recuperacion iniciado para: " + email);

        // Redirigir a la pantalla de restablecer contraseña con el correo precargado
        request.setAttribute("emailEnviado", email);
        request.setAttribute("info", "codeSent");
        request.getRequestDispatcher("/WEB-INF/restablecer-password.jsp").forward(request, response);
    }
}
