package com.sgc.especialista.servlet;

import com.sgc.especialista.dao.CitaDAO;
import com.sgc.especialista.modelo.Cita;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/especialista/agenda")
public class AgendaServlet extends HttpServlet {

    private final CitaDAO citaDAO = new CitaDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String idEmpleado = (String) request.getSession().getAttribute("idEmpleado");

        String vista = request.getParameter("vista");
        if (vista == null || !(vista.equals("dia") || vista.equals("semana") || vista.equals("mes"))) {
            vista = "dia";
        }

        LocalDate fechaRef = parsearFecha(request.getParameter("fecha"));

        int saltoDias = 1;
        if (vista.equals("semana")) {
            saltoDias = 7;
        } else if (vista.equals("mes")) {
            saltoDias = 30;
        }

        HttpSessionMensaje.trasladarAlRequest(request);
        request.setAttribute("vista", vista);
        request.setAttribute("fechaRef", fechaRef);
        request.setAttribute("fechaAnterior", fechaRef.minusDays(saltoDias));
        request.setAttribute("fechaSiguiente", fechaRef.plusDays(saltoDias));
        request.setAttribute("hoy", LocalDate.now());
        request.setAttribute("paginaActiva", "agenda");

        if (vista.equals("semana")) {
            cargarVistaSemana(request, idEmpleado, fechaRef);
        } else if (vista.equals("mes")) {
            cargarVistaMes(request, idEmpleado, fechaRef);
        } else {
            cargarVistaDia(request, idEmpleado, fechaRef);
        }

        request.getRequestDispatcher("/WEB-INF/vistas/agenda.jsp").forward(request, response);
    }

    private void cargarVistaDia(HttpServletRequest request, String idEmpleado, LocalDate fecha) {
        List<Cita> citasDelDia = citaDAO.listarPorEmpleadoYFecha(idEmpleado, fecha);

        // Buscamos la cita mas cercana que todavia no ha pasado y que no este cancelada.
        Cita proxima = null;
        for (Cita c : citasDelDia) {
            boolean yaPaso = c.getFecha().isEqual(LocalDate.now()) && !c.getHoraInicio().isAfter(LocalTime.now());
            if (c.getEstado().equals(Cita.CANCELADA) || yaPaso) {
                continue;
            }
            if (proxima == null || c.getHoraInicio().isBefore(proxima.getHoraInicio())) {
                proxima = c;
            }
        }

        int confirmadas = 0;
        int pendientes = 0;
        int canceladas = 0;
        for (Cita c : citasDelDia) {
            if (c.getEstado().equals(Cita.CONFIRMADA)) {
                confirmadas++;
            } else if (c.getEstado().equals(Cita.PENDIENTE)) {
                pendientes++;
            } else if (c.getEstado().equals(Cita.CANCELADA)) {
                canceladas++;
            }
        }

        request.setAttribute("citasDelDia", citasDelDia);
        request.setAttribute("proximaCita", proxima);
        request.setAttribute("totalProgramadas", citasDelDia.size());
        request.setAttribute("totalConfirmadas", confirmadas);
        request.setAttribute("totalPendientes", pendientes);
        request.setAttribute("totalCanceladas", canceladas);
    }

    private void cargarVistaSemana(HttpServletRequest request, String idEmpleado, LocalDate fecha) {
        LocalDate inicioSemana = fecha.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate finSemana = inicioSemana.plusDays(6);

        List<Cita> citas = citaDAO.listarPorEmpleadoEntreFechas(idEmpleado, inicioSemana, finSemana);

        // Agrupamos por fecha manteniendo los 7 dias, incluso si no tienen citas.
        Map<LocalDate, List<Cita>> porDia = new LinkedHashMap<>();
        for (int i = 0; i < 7; i++) {
            porDia.put(inicioSemana.plusDays(i), new ArrayList<>());
        }
        for (Cita c : citas) {
            porDia.get(c.getFecha()).add(c);
        }

        request.setAttribute("inicioSemana", inicioSemana);
        request.setAttribute("finSemana", finSemana);
        request.setAttribute("citasPorDia", porDia);
    }

    private void cargarVistaMes(HttpServletRequest request, String idEmpleado, LocalDate fecha) {
        LocalDate primerDiaMes = fecha.withDayOfMonth(1);
        LocalDate ultimoDiaMes = fecha.withDayOfMonth(fecha.lengthOfMonth());
        LocalDate inicioCalendario = primerDiaMes.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate finCalendario = ultimoDiaMes.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        List<Cita> citas = citaDAO.listarPorEmpleadoEntreFechas(idEmpleado, inicioCalendario, finCalendario);
        Map<LocalDate, Long> conteoPorDia = new HashMap<>();
        for (Cita c : citas) {
            Long conteoActual = conteoPorDia.get(c.getFecha());
            if (conteoActual == null) {
                conteoPorDia.put(c.getFecha(), 1L);
            } else {
                conteoPorDia.put(c.getFecha(), conteoActual + 1);
            }
        }

        List<LocalDate> diasCalendario = new ArrayList<>();
        LocalDate cursor = inicioCalendario;
        while (!cursor.isAfter(finCalendario)) {
            diasCalendario.add(cursor);
            cursor = cursor.plusDays(1);
        }

        request.setAttribute("primerDiaMes", primerDiaMes);
        request.setAttribute("diasCalendario", diasCalendario);
        request.setAttribute("conteoPorDia", conteoPorDia);
    }

    private LocalDate parsearFecha(String texto) {
        if (texto == null || texto.isBlank()) {
            return LocalDate.now();
        }
        try {
            return LocalDate.parse(texto.trim());
        } catch (Exception ex) {
            // Si el usuario manipula la URL con una fecha invalida, no tronamos: usamos hoy.
            return LocalDate.now();
        }
    }
}
