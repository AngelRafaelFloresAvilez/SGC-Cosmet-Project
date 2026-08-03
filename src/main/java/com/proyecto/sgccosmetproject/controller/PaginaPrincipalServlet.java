package com.proyecto.sgccosmetproject.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

// Nota: Si usas una versión antigua de Java EE (Tomcat 9 o inferior),
// cambia 'jakarta.servlet' por 'javax.servlet' en los imports superiores.

@WebServlet("/pagina-principal")
public class PaginaPrincipalServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Hacemos el forward interno hacia la carpeta protegida WEB-INF
        request.getRequestDispatcher("/WEB-INF/pagina-principal.jsp").forward(request, response);
    }
}