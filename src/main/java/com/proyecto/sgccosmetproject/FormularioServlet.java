package com.proyecto.sgccosmetproject;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.ServletException;
import java.io.IOException;

@WebServlet("/nuevo-usuario")
public class FormularioServlet extends HttpServlet {
    // Clase que reenvia simplemente a el jsp de registro (en donde se llenan registros y se envian a a la clase RegistroServlet
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getRequestDispatcher("/WEB-INF/registro.jsp").forward(request, response);
    }
}