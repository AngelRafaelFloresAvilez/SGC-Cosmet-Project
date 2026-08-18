package com.sgc.especialista.servlet;

import com.sgc.especialista.dao.AlmacenDatos;
import com.sgc.especialista.dao.CitaDAO;
import com.sgc.especialista.dao.EmpleadoDAO;
import com.sgc.especialista.modelo.Cita;
import com.sgc.especialista.modelo.Empleado;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@WebServlet("/especialista/dashboard")
public class DashboardServlet extends HttpServlet {

    private final EmpleadoDAO empleadoDAO = new EmpleadoDAO();
    private final CitaDAO citaDAO = new CitaDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String idEmpleado = (String) request.getSession().getAttribute("idEmpleado");
        Empleado empleado = empleadoDAO.buscarPorId(idEmpleado);
        if (empleado == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Empleado no encontrado.");
            return;
        }

        LocalDate hoy = LocalDate.now();
        List<Cita> agendaHoy = citaDAO.listarPorEmpleadoYFecha(idEmpleado, hoy);
        List<Cita> proximasCitas = citaDAO.listarProximas(idEmpleado, hoy, 3);

        int pendientes = 0;
        int completadas = 0;
        for (Cita c : agendaHoy) {
            if (c.getEstado().equals(Cita.PENDIENTE)) {
                pendientes++;
            } else if (c.getEstado().equals(Cita.COMPLETADA)) {
                completadas++;
            }
        }

        DateTimeFormatter formatoFecha = DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy", new Locale("es", "MX"));

        HttpSessionMensaje.trasladarAlRequest(request);
        request.setAttribute("empleado", empleado);
        request.setAttribute("hoy", hoy);
        request.setAttribute("fechaHoyTexto", hoy.format(formatoFecha));
        request.setAttribute("agendaHoy", agendaHoy);
        request.setAttribute("proximasCitas", proximasCitas);
        request.setAttribute("totalCitasHoy", agendaHoy.size());
        request.setAttribute("pendientesHoy", pendientes);
        request.setAttribute("completadasHoy", completadas);
        request.setAttribute("recordatorios", AlmacenDatos.getRecordatorios());
        request.setAttribute("paginaActiva", "dashboard");

        request.getRequestDispatcher("/WEB-INF/vistas/dashboard.jsp").forward(request, response);
    }
}
