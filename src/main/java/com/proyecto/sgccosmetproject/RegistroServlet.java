    package com.proyecto.sgccosmetproject;

    import jakarta.servlet.annotation.WebServlet;
    import jakarta.servlet.http.HttpServlet;
    import jakarta.servlet.http.HttpServletRequest;
    import jakarta.servlet.http.HttpServletResponse;
    import java.io.IOException;
    import java.sql.Connection;
    import java.sql.PreparedStatement;
    import java.sql.SQLException;
    // Clase exclusiva para registrar un usuario (con fines de pruebas de envio de datos y demostrativos para nosotros guiarnos)
    @WebServlet("/guardar-usuario")
    public class RegistroServlet extends HttpServlet {
        // Metodo doPost (envia informacion por lo que debe enviarse de forma segura)
        @Override
        protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
            // Recibir parámetros del formulario (El llenado en el JSP del formulario)
            String nombre = request.getParameter("nombre");
            String correo = request.getParameter("correo");
            String telefono = request.getParameter("telefono");
            String fechaNacimiento = request.getParameter("fechaNacimiento");
            String contrasena = request.getParameter("contrasena");
            int idRol = Integer.parseInt(request.getParameter("idRol"));

            // Se define el INSERT que sera enviado a la BD
            String sql = "INSERT INTO usuarios (nombre_completo, correo, telefono, fecha_nacimiento, contrasena, id_rol, estado_veto, faltas_consecutivas) VALUES (?, ?, ?, TO_DATE(?, 'YYYY-MM-DD'), ?, ?, 'FALSE', 0)";

            // Se realiza la conexion con la BD (En un try para que cierre automaticamente al final)
            try (Connection conexion = ConexionBD.obtenerConexion(getServletContext());
                 // Metemos la sentencia en un PreparedStatement para mayor seguridad
                 PreparedStatement stmt = conexion.prepareStatement(sql)) {
                // Asignamos los valores a los signos de interrogacion de la sentencia SQL ya en el PreparedStatement
                stmt.setString(1, nombre);
                stmt.setString(2, correo);
                stmt.setString(3, telefono);
                stmt.setString(4, fechaNacimiento);
                stmt.setString(5, contrasena);
                stmt.setInt(6, idRol);
                // Ejecutamos la sentencia en la BD
                stmt.executeUpdate();
                // Si la ejecucion sale bien, reenviamos al JSP de usuarios
                response.sendRedirect("usuarios");
            } catch (SQLException e) {
                // Manejo de errores si la base de datos rechaza los datos (por ejemplo un dato duplicado)
                response.setContentType("text/html;charset=UTF-8");
                response.getWriter().println("<h3 style='color: red;'> Error al guardar: " + e.getMessage() + "</h3>");
            }
        }
    }