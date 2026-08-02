package com.proyecto.sgccosmetproject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
// Clase exclusiva para ver los usuarios
@WebServlet("/usuarios")
public class UsuariosServlet extends HttpServlet {
    // Metodo doGet (solo consulta)
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Lista para guardar todos los usuarios y mostrarlos en el JSP
        List<Usuario> listaUsuarios = new ArrayList<>();
        // Linea para realizar la conexion a la BD (Explicada en ConexionServlet)
        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {
            // Instruccion SQL que se ejecutara en el servidor
            String sql = "SELECT nombre_completo, correo, telefono, fecha_nacimiento, id_rol, estado_veto FROM usuarios";
            // Prepara una instruccion segura de la inyeccion SQL y lo mete en un try por si hay algun error
            try (PreparedStatement stmt = conexion.prepareStatement(sql);
                 // Ejecuta la sentencia en el servidor
                 ResultSet rs = stmt.executeQuery()) {
                // Por cada registro en la BD se crea un objeto y se mete en la lista
                while (rs.next()) {
                    Usuario u = new Usuario(
                            rs.getString("nombre_completo"),
                            rs.getString("correo"),
                            rs.getString("telefono"),
                            rs.getDate("fecha_nacimiento"),
                            rs.getInt("id_rol"),
                            rs.getString("estado_veto")
                    );
                    listaUsuarios.add(u);
                }
            } // Aquí se cierran automáticamente rs y stmt (osea la sentencia y la tabla temporal obtenida del servidor)
            // Si la ejecucion salio bien, se manda la lista al request
            request.setAttribute("listaDeUsuarios", listaUsuarios);
        // Si hubo un error se mostrara aqui (de conexion o en la sentencia)
        } catch (Exception e) {
            request.setAttribute("mensajeError", "Error en la BD: " + e.getMessage());
        }
        // Se envia de regreso el request junto con la lista de usuarios almacenados en objetos
        request.getRequestDispatcher("/WEB-INF/usuarios.jsp").forward(request, response);
    }
}