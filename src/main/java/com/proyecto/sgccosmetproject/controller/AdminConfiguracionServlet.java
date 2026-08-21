package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.model.Usuario;
import com.proyecto.sgccosmetproject.util.ConexionBD;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet("/admin/configuracion")
public class AdminConfiguracionServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        request.setAttribute("paginaActiva", "configuracion");

        try (Connection con = ConexionBD.obtenerConexion(getServletContext())) {
            request.setAttribute("sumClients", contar(con,
                    "SELECT COUNT(*) FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol WHERE LOWER(r.nombre_rol) LIKE '%cliente%'"));
            request.setAttribute("sumSpecialists", contar(con, "SELECT COUNT(*) FROM empleados"));
            request.setAttribute("sumServices", contar(con, "SELECT COUNT(*) FROM servicios"));
            request.setAttribute("sumPromos", contar(con, "SELECT COUNT(*) FROM promociones"));
            request.setAttribute("sumAppointments", contar(con, "SELECT COUNT(*) FROM citas"));
            request.setAttribute("ruleBanned", contar(con,
                    "SELECT COUNT(*) FROM usuarios WHERE UPPER(NVL(estado_veto,'FALSE')) IN ('TRUE','1')"));
        } catch (Exception e) {
            e.printStackTrace();
        }

        request.getRequestDispatcher("/WEB-INF/administrador/configuracion.jsp").forward(request, response);
    }

    private int contar(Connection con, String sql) {
        try (PreparedStatement ps = con.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) {
            // Si la consulta falla (columna/tabla ausente), devolvemos 0 sin romper la vista.
        }
        return 0;
    }
}
