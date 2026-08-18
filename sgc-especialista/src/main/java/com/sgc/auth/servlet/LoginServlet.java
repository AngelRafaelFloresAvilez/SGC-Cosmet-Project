package com.sgc.auth.servlet;

import com.sgc.auth.dao.UsuarioDAO;
import com.sgc.auth.modelo.Usuario;
import com.sgc.auth.util.ValidacionAuthUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Si ya hay sesion activa, no tiene sentido mostrar el login de nuevo.
        HttpSession sesionExistente = request.getSession(false);
        if (sesionExistente != null && sesionExistente.getAttribute("rol") != null) {
            response.sendRedirect(request.getContextPath() + "/especialista/dashboard");
            return;
        }

        request.getRequestDispatcher("/WEB-INF/vistas/publico/login.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String correo = request.getParameter("correo");
        String contrasena = request.getParameter("contrasena");
        String mantenerSesion = request.getParameter("mantenerSesion");

        if (!ValidacionAuthUtil.correoValido(correo) || ValidacionAuthUtil.esVacio(contrasena)) {
            request.setAttribute("error", "Ingresa tu usuario y contrasena.");
            request.setAttribute("correoEnviado", correo);
            request.getRequestDispatcher("/WEB-INF/vistas/publico/login.jsp").forward(request, response);
            return;
        }

        Usuario usuario = usuarioDAO.autenticar(correo, contrasena);
        if (usuario == null) {
            // Mensaje generico a proposito: no decimos si fallo el correo o la contrasena,
            // para no ayudar a alguien que intenta adivinar cuentas validas.
            request.setAttribute("error", "Usuario o contrasena incorrectos.");
            request.setAttribute("correoEnviado", correo);
            request.getRequestDispatcher("/WEB-INF/vistas/publico/login.jsp").forward(request, response);
            return;
        }

        HttpSession sesion = request.getSession(true);
        sesion.setAttribute("idUsuario", usuario.getIdUsuario());
        sesion.setAttribute("correo", usuario.getCorreo());
        sesion.setAttribute("rol", usuario.getRol());
        sesion.setAttribute("idPerfil", usuario.getIdPerfil());
        sesion.setAttribute("idEmpleado", usuario.getIdPerfil());

        if (!"on".equals(mantenerSesion)) {
            // Sesion valida solo mientras el navegador este abierto (cookie de sesion,
            // sin maxAge). Si el usuario marca "mantener la sesion iniciada" dejamos el
            // timeout normal de sesion configurado en web.xml.
            sesion.setMaxInactiveInterval(30 * 60);
        } else {
            sesion.setMaxInactiveInterval(7 * 24 * 60 * 60);
        }

        response.sendRedirect(request.getContextPath() + "/especialista/dashboard");
    }
}
