package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.util.ConexionBD;
import com.proyecto.sgccosmetproject.util.TokenManager;
import jakarta.servlet.ServletException;
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
 * Controlador para la verificación del código y actualización de la nueva contraseña
 * en <strong>SGC-Cosmetics</strong>.
 * <p>
 * Valida el código de 6 dígitos mediante {@link TokenManager}, asegura la coherencia
 * y fortaleza de las contraseñas, actualiza la base de datos e invalida el token utilizado.
 * </p>
 *
 * @author alearr1ola
 * @version 1.0
 */
@WebServlet("/restablecer-password")
public class ResetPasswordServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(ResetPasswordServlet.class.getName());

    /**
     * Muestra la interfaz gráfica para ingresar el código y la nueva contraseña.
     *
     * @param request  Petición HTTP entrante.
     * @param response Respuesta HTTP saliente.
     * @throws ServletException Si ocurre un error de despacho.
     * @throws IOException      Si ocurre un error de entrada/salida.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("/WEB-INF/restablecer-password.jsp").forward(request, response);
    }

    /**
     * Procesa la verificación del código de 6 dígitos y el cambio de contraseña.
     * <ol>
     *   <li>Valida que el código no sea nulo ni vacío.</li>
     *   <li>Verifica la validez y vigencia del código en {@link TokenManager}.</li>
     *   <li>Comprueba que la nueva contraseña y su confirmación coincidan y cumplan longitud mínima.</li>
     *   <li>Ejecuta la actualización en la tabla {@code usuarios} de Oracle DB.</li>
     *   <li>Invalida el código utilizado para evitar reuso.</li>
     *   <li>Redirige al login con confirmación de éxito.</li>
     * </ol>
     *
     * @param request  Petición HTTP con los parámetros {@code codigo}, {@code nuevaPassword} y {@code confirmarPassword}.
     * @param response Respuesta HTTP.
     * @throws ServletException Si ocurre un error en el servlet.
     * @throws IOException      Si ocurre un error de redirección.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String codigo = request.getParameter("codigo");
        String nuevaPassword = request.getParameter("nuevaPassword");
        String confirmarPassword = request.getParameter("confirmarPassword");

        // 1. Validaciones básicas de campos
        if (codigo == null || codigo.trim().isEmpty()) {
            request.setAttribute("error", "emptyCode");
            request.getRequestDispatcher("/WEB-INF/restablecer-password.jsp").forward(request, response);
            return;
        }

        codigo = codigo.trim();

        if (nuevaPassword == null || nuevaPassword.length() < 6) {
            request.setAttribute("error", "shortPassword");
            request.setAttribute("codigoIngresado", codigo);
            request.getRequestDispatcher("/WEB-INF/restablecer-password.jsp").forward(request, response);
            return;
        }

        if (!nuevaPassword.equals(confirmarPassword)) {
            request.setAttribute("error", "passwordMismatch");
            request.setAttribute("codigoIngresado", codigo);
            request.getRequestDispatcher("/WEB-INF/restablecer-password.jsp").forward(request, response);
            return;
        }

        // 2. Validar el código de recuperación en memoria
        String correoUsuario = TokenManager.validarToken(codigo);
        if (correoUsuario == null) {
            request.setAttribute("error", "invalidCode");
            request.setAttribute("codigoIngresado", codigo);
            request.getRequestDispatcher("/WEB-INF/restablecer-password.jsp").forward(request, response);
            return;
        }

        // 3. Actualizar la contraseña en la base de datos
        String sql = "UPDATE usuarios SET contrasena = ? WHERE LOWER(correo) = ?";

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext());
             PreparedStatement stmt = conexion.prepareStatement(sql)) {

            stmt.setString(1, nuevaPassword);
            stmt.setString(2, correoUsuario.toLowerCase());

            int filasActualizadas = stmt.executeUpdate();

            if (filasActualizadas > 0) {
                // 4. Invalidar el token para prevenir reuso
                TokenManager.invalidarToken(codigo);
                LOGGER.info("Contraseña actualizada exitosamente para: " + correoUsuario);

                // 5. Redireccionar al login con mensaje de éxito
                response.sendRedirect(request.getContextPath() + "/login?resetSuccess=true");
            } else {
                LOGGER.warning("No se encontro el usuario para actualizar contraseña: " + correoUsuario);
                request.setAttribute("error", "userNotFound");
                request.getRequestDispatcher("/WEB-INF/restablecer-password.jsp").forward(request, response);
            }

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error de base de datos al actualizar contraseña: " + e.getMessage(), e);
            request.setAttribute("error", "dbError");
            request.setAttribute("errorMessage", "Error al actualizar la contraseña: " + e.getMessage());
            request.setAttribute("codigoIngresado", codigo);
            request.getRequestDispatcher("/WEB-INF/restablecer-password.jsp").forward(request, response);
        }
    }
}
