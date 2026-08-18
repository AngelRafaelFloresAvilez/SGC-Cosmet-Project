package com.sgc.auth.servlet;

import com.sgc.auth.dao.UsuarioDAO;
import com.sgc.auth.modelo.Usuario;
import com.sgc.auth.util.ValidacionAuthUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Genera un enlace de recuperacion de contrasena. Como este proyecto no tiene un
 * servidor de correo configurado, el enlace se muestra directamente en pantalla en
 * lugar de enviarse por email (se deja un comentario de donde se conectaria un
 * servicio real de correo, por ejemplo Jakarta Mail).
 */
@WebServlet("/recuperar-contrasena")
public class RecuperarContrasenaServlet extends HttpServlet {

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("/WEB-INF/vistas/publico/recuperar-contrasena.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String correo = request.getParameter("correo");

        if (!ValidacionAuthUtil.correoValido(correo)) {
            request.setAttribute("error", "Ingresa un correo electronico valido.");
            request.setAttribute("correoEnviado", correo);
            request.getRequestDispatcher("/WEB-INF/vistas/publico/recuperar-contrasena.jsp").forward(request, response);
            return;
        }

        Usuario usuario = usuarioDAO.buscarPorCorreo(correo);
        if (usuario != null) {
            String token = usuarioDAO.generarTokenRecuperacion(usuario);
            // TODO integracion real: enviar este enlace por correo con Jakarta Mail en vez
            // de mostrarlo en pantalla. Se muestra aqui solo para poder probar el flujo
            // completo sin tener un servidor SMTP configurado.
            String enlace = request.getContextPath() + "/restablecer-contrasena?token=" + token;
            request.setAttribute("enlaceDemo", enlace);
        }

        // Por seguridad, se muestra el mismo mensaje de exito exista o no el correo:
        // asi no se revela si un correo esta registrado en el sistema.
        request.setAttribute("enviado", true);
        request.getRequestDispatcher("/WEB-INF/vistas/publico/recuperar-contrasena.jsp").forward(request, response);
    }
}
