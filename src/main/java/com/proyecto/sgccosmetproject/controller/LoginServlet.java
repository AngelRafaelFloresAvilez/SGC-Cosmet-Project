package com.proyecto.sgccosmetproject.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // Al acceder vía GET (es decir, pulsando el botón/enlace), mostramos la interfaz
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Hacemos el forward al JSP que está dentro de la zona segura WEB-INF
        request.getRequestDispatcher("/WEB-INF/login.jsp").forward(request, response);
    }
}