package com.sgc.especialista.dao;

import com.sgc.especialista.modelo.Cita;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Acceso a datos de citas. Hoy delega en AlmacenDatos (memoria).
 * En Oracle esto seria una tabla CITA con FK a CLIENTE, EMPLEADO y SERVICIO.
 */
public class CitaDAO {

    public Cita buscarPorId(long idCita) {
        return AlmacenDatos.getCita(idCita);
    }

    public List<Cita> listarPorEmpleadoYFecha(String idEmpleado, LocalDate fecha) {
        List<Cita> resultado = new ArrayList<>();
        for (Cita c : AlmacenDatos.getCitasPorEmpleado(idEmpleado)) {
            if (c.getFecha().equals(fecha)) {
                resultado.add(c);
            }
        }
        ordenarPorHora(resultado);
        return resultado;
    }

    public List<Cita> listarPorEmpleadoEntreFechas(String idEmpleado, LocalDate desde, LocalDate hasta) {
        List<Cita> resultado = new ArrayList<>();
        for (Cita c : AlmacenDatos.getCitasPorEmpleado(idEmpleado)) {
            if (!c.getFecha().isBefore(desde) && !c.getFecha().isAfter(hasta)) {
                resultado.add(c);
            }
        }
        ordenarPorFechaYHora(resultado);
        return resultado;
    }

    public List<Cita> listarProximas(String idEmpleado, LocalDate desdeExclusive, int max) {
        List<Cita> resultado = new ArrayList<>();
        for (Cita c : AlmacenDatos.getCitasPorEmpleado(idEmpleado)) {
            if (c.getFecha().isAfter(desdeExclusive) && !c.getEstado().equals(Cita.CANCELADA)) {
                resultado.add(c);
            }
        }
        ordenarPorFechaYHora(resultado);
        while (resultado.size() > max) {
            resultado.remove(resultado.size() - 1);
        }
        return resultado;
    }

    /**
     * Cambia el estado de una cita validando que pertenezca al empleado indicado.
     * Devuelve un mensaje null si todo salio bien, o un texto de error si algo no es valido.
     */
    public String cambiarEstado(long idCita, String idEmpleado, String nuevoEstado) {
        Cita cita = AlmacenDatos.getCita(idCita);
        if (cita == null) {
            return "La cita indicada no existe.";
        }
        if (!cita.getIdEmpleado().equals(idEmpleado)) {
            return "No tienes permiso para modificar esta cita.";
        }
        if (cita.getEstado().equals(Cita.CANCELADA)) {
            return "No es posible modificar una cita que ya fue cancelada.";
        }
        if (cita.getEstado().equals(Cita.COMPLETADA)) {
            return "No es posible modificar una cita que ya fue completada.";
        }
        if (nuevoEstado.equals(Cita.COMPLETADA) && cita.getFecha().isAfter(LocalDate.now())) {
            return "No puedes marcar como completada una cita que aun no ha ocurrido.";
        }
        cita.setEstado(nuevoEstado);
        return null;
    }

    // ---------- Ordenamiento manual (sin streams ni Comparator) ----------

    /** Ordena por hora de inicio, de la mas temprana a la mas tarde (ordenamiento por burbuja). */
    private void ordenarPorHora(List<Cita> citas) {
        for (int i = 0; i < citas.size() - 1; i++) {
            for (int j = 0; j < citas.size() - 1 - i; j++) {
                if (citas.get(j).getHoraInicio().isAfter(citas.get(j + 1).getHoraInicio())) {
                    Cita temp = citas.get(j);
                    citas.set(j, citas.get(j + 1));
                    citas.set(j + 1, temp);
                }
            }
        }
    }

    /** Ordena por fecha y, dentro del mismo dia, por hora de inicio. */
    private void ordenarPorFechaYHora(List<Cita> citas) {
        for (int i = 0; i < citas.size() - 1; i++) {
            for (int j = 0; j < citas.size() - 1 - i; j++) {
                Cita a = citas.get(j);
                Cita b = citas.get(j + 1);
                boolean fueraDeOrden = a.getFecha().isAfter(b.getFecha())
                        || (a.getFecha().equals(b.getFecha()) && a.getHoraInicio().isAfter(b.getHoraInicio()));
                if (fueraDeOrden) {
                    citas.set(j, b);
                    citas.set(j + 1, a);
                }
            }
        }
    }
}
