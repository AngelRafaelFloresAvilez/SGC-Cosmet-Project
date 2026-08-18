package com.sgc.especialista.servlet;

import com.sgc.especialista.dao.CitaDAO;
import com.sgc.especialista.modelo.Cita;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Procesa las acciones de confirmar/cancelar/completar una cita desde el detalle de cita.
 * Se maneja como POST para no permitir que un enlace o un bot ejecute la accion por GET.
 */
@WebServlet("/especialista/cita/accion")
public class AccionCitaServlet extends HttpServlet {

    private final CitaDAO citaDAO = new CitaDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String idEmpleado = (String) request.getSession().getAttribute("idEmpleado");
        String idTexto = request.getParameter("id");
        String accion = request.getParameter("accion");

        long idCita;
        try {
            idCita = Long.parseLong(idTexto);
        } catch (NumberFormatException | NullPointerException ex) {
            redirigirConError(request, response, null, "Identificador de cita invalido.");
            return;
        }

        String accionLimpia = (accion == null) ? "" : accion.trim().toLowerCase();
        boolean accionValida = accionLimpia.equals("confirmar") || accionLimpia.equals("cancelar")
                || accionLimpia.equals("completar");
        if (!accionValida) {
            redirigirConError(request, response, idCita, "Accion no reconocida.");
            return;
        }

        String nuevoEstado;
        if (accionLimpia.equals("confirmar")) {
            nuevoEstado = Cita.CONFIRMADA;
        } else if (accionLimpia.equals("cancelar")) {
            nuevoEstado = Cita.CANCELADA;
        } else {
            nuevoEstado = Cita.COMPLETADA;
        }

        String error = citaDAO.cambiarEstado(idCita, idEmpleado, nuevoEstado);
        if (error != null) {
            redirigirConError(request, response, idCita, error);
            return;
        }

        HttpSessionMensaje.setExito(request, "La cita se actualizo correctamente.");
        response.sendRedirect(request.getContextPath() + "/especialista/cita?id=" + idCita);
    }

    private void redirigirConError(HttpServletRequest request, HttpServletResponse response,
                                    Long idCita, String mensaje) throws IOException {
        HttpSessionMensaje.setError(request, mensaje);
        String destino = (idCita != null)
                ? request.getContextPath() + "/especialista/cita?id=" + idCita
                : request.getContextPath() + "/especialista/agenda";
        response.sendRedirect(destino);
    }
}
