package com.sgc.especialista.servlet;

import com.sgc.especialista.dao.CitaDAO;
import com.sgc.especialista.dao.ClienteDAO;
import com.sgc.especialista.modelo.Cita;
import com.sgc.especialista.modelo.Resena;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/especialista/cita")
public class DetalleCitaServlet extends HttpServlet {

    private final CitaDAO citaDAO = new CitaDAO();
    private final ClienteDAO clienteDAO = new ClienteDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String idEmpleado = (String) request.getSession().getAttribute("idEmpleado");
        String idTexto = request.getParameter("id");

        long idCita;
        try {
            idCita = Long.parseLong(idTexto);
        } catch (NumberFormatException | NullPointerException ex) {
            request.setAttribute("mensajeError", "El identificador de la cita no es valido.");
            request.getRequestDispatcher("/WEB-INF/vistas/error/no-encontrado.jsp").forward(request, response);
            return;
        }

        Cita cita = citaDAO.buscarPorId(idCita);
        if (cita == null || !cita.getIdEmpleado().equals(idEmpleado)) {
            request.setAttribute("mensajeError", "La cita solicitada no existe o no te pertenece.");
            request.getRequestDispatcher("/WEB-INF/vistas/error/no-encontrado.jsp").forward(request, response);
            return;
        }

        List<Resena> historial = clienteDAO.historialResenas(cita.getCliente().getIdCliente());

        HttpSessionMensaje.trasladarAlRequest(request);
        request.setAttribute("cita", cita);
        request.setAttribute("historial", historial);
        request.setAttribute("hoyServidor", java.time.LocalDate.now());
        request.setAttribute("paginaActiva", "agenda");

        request.getRequestDispatcher("/WEB-INF/vistas/detalleCita.jsp").forward(request, response);
    }
}
