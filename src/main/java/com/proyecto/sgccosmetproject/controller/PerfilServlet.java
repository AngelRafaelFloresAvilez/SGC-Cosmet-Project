package com.proyecto.sgccosmetproject.controller; // Ajusta el paquete de tus controladores si es diferente

import com.proyecto.sgccosmetproject.model.Usuario;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Date;

@WebServlet("/PerfilServlet")
public class PerfilServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession();

        // 1. Intentar obtener el usuario guardado en la sesión
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        // 2. Si no existe un usuario en sesión (p. ej. realizando pruebas locales),
        // pasamos los 6 argumentos obligatorios que exige tu constructor:
        if (usuario == null) {
            usuario = new Usuario(
                    "Ana López",                             // nombreCompleto
                    "ana.lopez@sgc.com",                     // correo
                    "+52 55 1234 5678",                      // telefono
                    Date.valueOf("1997-08-14"),              // fechaNacimiento (java.sql.Date)
                    1,                                       // idRol (ej: 1 = Cliente VIP)
                    "Normal"                                 // estadoVeto
            );

            // Opcional: Almacenarlo en la sesión activa
            session.setAttribute("usuario", usuario);
        }

        // 3. Pasar el objeto como atributo del request para que el JSP lo lea
        request.setAttribute("usuario", usuario);

        // 4. Redirigir la petición a la vista perfil.jsp
        request.getRequestDispatcher("/WEB-INF/perfil.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}