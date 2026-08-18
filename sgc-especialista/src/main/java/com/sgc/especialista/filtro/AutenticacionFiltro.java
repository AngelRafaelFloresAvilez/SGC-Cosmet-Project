package com.sgc.especialista.filtro;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * Protege todas las rutas /especialista/* verificando que exista una sesion con rol ESPECIALISTA.
 * La sesion la deja el login compartido (com.sgc.auth.servlet.LoginServlet), que guarda
 * "idEmpleado" y "rol" cuando el usuario autenticado es un especialista.
 */
@WebFilter(urlPatterns = "/especialista/*")
public class AutenticacionFiltro implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        HttpSession sesion = request.getSession(false);
        Object idEmpleado = (sesion != null) ? sesion.getAttribute("idEmpleado") : null;
        Object rol = (sesion != null) ? sesion.getAttribute("rol") : null;

        if (idEmpleado == null || !"ESPECIALISTA".equals(rol)) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        chain.doFilter(req, res);
    }
}
