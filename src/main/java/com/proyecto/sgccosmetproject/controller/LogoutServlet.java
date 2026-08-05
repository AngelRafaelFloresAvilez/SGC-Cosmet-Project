package com.proyecto.sgccosmetproject.controller; // Ajusta el paquete si es necesario

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/logout")
public class LogoutServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. Obtener la sesión actual si existe (sin crear una nueva)
        HttpSession session = request.getSession(false);

        // 2. Destruir la sesión y eliminar todos los atributos (usuarioSesion, etc.)
        if (session != null) {
            session.invalidate();
        }

        // 3. Redirigir a la página principal
        response.sendRedirect(request.getContextPath() + "/pagina-principal");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Permitir que también responda a peticiones POST si fuera necesario
        doGet(request, response);
    }
}