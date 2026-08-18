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

@WebServlet("/restablecer-contrasena")
public class RestablecerContrasenaServlet extends HttpServlet {

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String token = request.getParameter("token");
        Usuario usuario = usuarioDAO.validarToken(token);

        if (usuario == null) {
            request.setAttribute("tokenInvalido", true);
        } else {
            request.setAttribute("token", token);
        }
        request.getRequestDispatcher("/WEB-INF/vistas/publico/restablecer-contrasena.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String token = request.getParameter("token");
        String nuevaContrasena = request.getParameter("nuevaContrasena");
        String confirmarContrasena = request.getParameter("confirmarContrasena");

        Usuario usuario = usuarioDAO.validarToken(token);
        if (usuario == null) {
            request.setAttribute("tokenInvalido", true);
            request.getRequestDispatcher("/WEB-INF/vistas/publico/restablecer-contrasena.jsp").forward(request, response);
            return;
        }

        String error = null;
        if (ValidacionAuthUtil.esVacio(nuevaContrasena) || !ValidacionAuthUtil.contrasenaFuerte(nuevaContrasena)) {
            error = "La contrasena debe tener minimo 8 caracteres, con mayuscula, minuscula y numero.";
        } else if (!nuevaContrasena.equals(confirmarContrasena)) {
            error = "Las contrasenas no coinciden.";
        }

        if (error != null) {
            request.setAttribute("error", error);
            request.setAttribute("token", token);
            request.getRequestDispatcher("/WEB-INF/vistas/publico/restablecer-contrasena.jsp").forward(request, response);
            return;
        }

        usuarioDAO.actualizarContrasena(usuario, nuevaContrasena);
        response.sendRedirect(request.getContextPath() + "/login?restablecida=1");
    }
}
