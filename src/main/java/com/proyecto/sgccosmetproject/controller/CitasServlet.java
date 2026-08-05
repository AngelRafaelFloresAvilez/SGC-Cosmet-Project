package com.proyecto.sgccosmetproject.controller; // Ajusta el nombre de tu paquete si difiere

import com.proyecto.sgccosmetproject.model.Usuario;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/CitasServlet")
public class CitasServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public CitasServlet() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. Obtener la sesión actual sin crear una nueva
        HttpSession session = request.getSession(false);

        // 2. Validar que exista la sesión y el usuario logueado
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        // 3. Reenviar la petición a la vista JSP de Citas
        request.getRequestDispatcher("/WEB-INF/citas.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}