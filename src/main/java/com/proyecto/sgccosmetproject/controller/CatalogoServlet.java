package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.dao.ServicioDAO;
import com.proyecto.sgccosmetproject.model.Servicio;
import com.proyecto.sgccosmetproject.model.Usuario;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

/**
 * Controlador encargo de gestionar el acceso protegido al catálogo de servicios.
 */
@WebServlet("/catalogoServlet")
public class CatalogoServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. Obtener la sesión actual sin crear una nueva si no existe
        HttpSession session = request.getSession(false);

        // 2. Verificar si la sesión existe y si el usuario está autenticado
        if (session != null && session.getAttribute("usuarioSesion") != null) {

            // Usuario validado: Recuperamos el objeto usuario por si se requiere en el servlet
            Usuario usuarioActivo = (Usuario) session.getAttribute("usuarioSesion");

            // 3. Instanciamos el DAO y obtenemos la lista de la BD (pasando el ServletContext)
            ServicioDAO servicioDAO = new ServicioDAO();
            List<Servicio> listaServicios = servicioDAO.obtenerTodos(getServletContext());

            // 4. Enviamos la lista al JSP
            request.setAttribute("listaServicios", listaServicios);

            // Redirigimos internamente al JSP ubicado en la carpeta protegida WEB-INF
            request.getRequestDispatcher("/WEB-INF/catalogo.jsp").forward(request, response);

        } else {
            // Usuario no autenticado: Redirigimos al Login mediante la ruta dinámica del contexto
            response.sendRedirect(request.getContextPath() + "/login");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // En caso de recibir peticiones POST, redirigimos al mismo flujo GET
        doGet(request, response);
    }
}