package com.proyecto.sgccosmetproject.controller;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.ServletException;
import java.io.IOException;

/**
 * Servlet controlador para despachar la vista de registro de nuevos usuarios en <strong>SGC-Cosmetics</strong>.
 *
 * @author alearr1ola
 * @version 1.0
 */
@WebServlet({"/nuevo-usuario", "/registro"})
public class FormularioServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * Reenvía la petición a la vista protegida de registro en {@code /WEB-INF/registro.jsp}.
     *
     * @param request  Petición HTTP entrante.
     * @param response Respuesta HTTP saliente.
     * @throws ServletException Si ocurre un error durante el reenvío.
     * @throws IOException      Si ocurre un error de E/S.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getRequestDispatcher("/WEB-INF/registro.jsp").forward(request, response);
    }
}