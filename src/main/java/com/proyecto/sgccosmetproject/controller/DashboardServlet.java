package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.model.Usuario;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/dashboardServlet")
public class DashboardServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // Se cambió a doGet para permitir el acceso por URL o redirección estándar
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. Obtener la sesión actual sin crear una nueva
        HttpSession session = request.getSession(false);

        // 2. Verificar autenticación
        if (session != null && session.getAttribute("usuarioSesion") != null) {

            // Opcional: Si necesitas pasar el objeto usuario al JSP de forma explícita
            Usuario usuarioActivo = (Usuario) session.getAttribute("usuarioSesion");
            request.setAttribute("usuario", usuarioActivo);

            // Redirigir internamente al JSP protegido en WEB-INF
            request.getRequestDispatcher("/WEB-INF/dashboard.jsp").forward(request, response);
        } else {
            // Usuario no autenticado: Redirigir al login
            response.sendRedirect(request.getContextPath() + "/login");
        }
    }

    // Opcional: Si algún formulario te manda aquí por POST, lo rediriges al GET
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
