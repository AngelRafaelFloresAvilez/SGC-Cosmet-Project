package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.util.ConexionBD;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
// Clase exclusiva para comprobar la conexion visualmente
@WebServlet("/probar-conexion")
public class ConexionServlet extends HttpServlet {
    // Metodo doGet (solo comprueba datos, no envia)
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Define el tipo de formato
        response.setContentType("text/html;charset=UTF-8");
        // Esto solo es para escribir en el HTML
        PrintWriter out = response.getWriter();

        out.println("<html><head><title>Prueba DB</title></head><body>");
        out.println("<h2>Probando conexión a Oracle Cloud...</h2>");

        // Se realiza la conexion con la clase ConexionDB y se le pasa el mapeo del servlet para que sepa donde encontrar la wallet
        // (IMPORTANTE: Este tipo de formato con la conexion en el try permite cerrar las conexiones sin el .close)
        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {
            // Si se conecto correctamente, dira esto
            out.println("<h3 style='color: green;'> Conexion exitosa desde el servidor web :P </h3>");
            // Solo muestra el usuario conectado de la BD (No es importante, solo esta ahi)
            String dbUser = System.getenv("DB_USER");
            out.println("<p>Usuario conectado: " + (dbUser != null ? dbUser : "Desconocido") + "</p>");
        } catch (SQLException e) {
            // Si hubo algun problema en la conexion, esto lo mostrara
            out.println("<h3 style='color: red;'> Error en la base de datos:</h3>");
            out.println("<pre>" + e.getMessage() + "</pre>");
        }
        // Cierra el HTML
        out.println("</body></html>");
    }
}