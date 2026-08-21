package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.dao.CitaDAO;
import com.proyecto.sgccosmetproject.model.Cita;
import com.proyecto.sgccosmetproject.model.Pago;
import com.proyecto.sgccosmetproject.model.Usuario;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Date;

@WebServlet("/agendarCitaServlet")
public class AgendarCitaServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);

        // 1. Seguridad: Verificar sesión
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"status\": \"error\", \"message\": \"Sesión no iniciada\"}");
            return;
        }

        Usuario usuario = (Usuario) session.getAttribute("usuarioSesion");

        try {
            // 2. Extraer parámetros enviados por JavaScript
            int idServicio = Integer.parseInt(request.getParameter("idServicio"));
            int idEmpleado = Integer.parseInt(request.getParameter("idEmpleado"));
            String fechaStr = request.getParameter("fecha"); // Espera formato 'YYYY-MM-DD'
            String hora = request.getParameter("hora");     // Espera formato 'HH:MM:SS'
            double monto = Double.parseDouble(request.getParameter("monto"));
            String duracion = request.getParameter("duracion");
            String metodoPago = request.getParameter("metodoPago");

            // 3. Crear objeto Cita
            Cita cita = new Cita();
            cita.setIdCliente(usuario.getIdUsuario());
            cita.setIdEmpleado(idEmpleado);
            cita.setIdServicio(idServicio);
            cita.setFecha(Date.valueOf(fechaStr));
            cita.setHora(hora);
            cita.setCostoPactado(monto);
            cita.setDuracionPactada(duracion);
            cita.setEstadoCita("Pendiente");

            // 4. Crear objeto Pago
            Pago pago = new Pago();
            pago.setMontoTotal(monto);
            pago.setMetodoPago(metodoPago);
            pago.setEstadoPago("Completado");

            // 5. Ejecutar la transacción en BD
            CitaDAO citaDAO = new CitaDAO();
            boolean exito = citaDAO.registrarCitaYPago(cita, pago, getServletContext());

            if (exito) {
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("{\"status\": \"success\", \"message\": \"Cita registrada con éxito\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"status\": \"error\", \"message\": \"Error al guardar en la base de datos\"}");
            }

        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"status\": \"error\", \"message\": \"Datos de formulario inválidos o incompletos\"}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"status\": \"error\", \"message\": \"" + e.getMessage() + "\"}");
        }
    }
}