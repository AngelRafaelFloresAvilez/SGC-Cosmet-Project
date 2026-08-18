package com.sgc.especialista.modelo;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class Cita {

    private static final DateTimeFormatter FORMATO_HORA =
            DateTimeFormatter.ofPattern("hh:mm a", new Locale("es", "MX"));
    private static final DateTimeFormatter FORMATO_FECHA_LARGA =
            DateTimeFormatter.ofPattern("d 'de' MMMM, yyyy", new Locale("es", "MX"));
    private static final DateTimeFormatter FORMATO_FECHA_CORTA =
            DateTimeFormatter.ofPattern("dd MMM", new Locale("es", "MX"));

    // El estado de la cita antes era un "enum". Como en clase solo hemos visto clases
    // normales, lo dejamos como texto y usamos estas constantes para no escribir el
    // texto a mano en cada lado (y evitar errores de dedo).
    public static final String PENDIENTE = "PENDIENTE";
    public static final String CONFIRMADA = "CONFIRMADA";
    public static final String COMPLETADA = "COMPLETADA";
    public static final String CANCELADA = "CANCELADA";

    private long idCita;
    private Cliente cliente;
    private String servicio;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private int duracionMinutos;
    private String ubicacion;
    private double precio;
    private String estado; // PENDIENTE, CONFIRMADA, COMPLETADA o CANCELADA
    private String notas;
    private String idEmpleado; // dueño de la cita, para validar pertenencia

    public long getIdCita() {
        return idCita;
    }

    public void setIdCita(long idCita) {
        this.idCita = idCita;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public String getServicio() {
        return servicio;
    }

    public void setServicio(String servicio) {
        this.servicio = servicio;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public int getDuracionMinutos() {
        return duracionMinutos;
    }

    public void setDuracionMinutos(int duracionMinutos) {
        this.duracionMinutos = duracionMinutos;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public String getIdEmpleado() {
        return idEmpleado;
    }

    public void setIdEmpleado(String idEmpleado) {
        this.idEmpleado = idEmpleado;
    }

    // ---------- Metodos que ayudan a mostrar los datos en las vistas JSP ----------

    public String getHoraInicioFormateada() {
        return horaInicio != null ? horaInicio.format(FORMATO_HORA).toUpperCase(Locale.ROOT) : "";
    }

    public String getHoraFinFormateada() {
        return horaFin != null ? horaFin.format(FORMATO_HORA).toUpperCase(Locale.ROOT) : "";
    }

    public String getFechaFormateadaLarga() {
        return fecha != null ? fecha.format(FORMATO_FECHA_LARGA) : "";
    }

    public String getFechaFormateadaCorta() {
        return fecha != null ? fecha.format(FORMATO_FECHA_CORTA) : "";
    }

    public String getPrecioFormateado() {
        return String.format(new Locale("es", "MX"), "$%,.2f MXN", precio);
    }

    /** Texto bonito para mostrar el estado en pantalla (Pendiente, Confirmada, etc.). */
    public String getEtiquetaEstado() {
        if (estado == null) return "";
        if (estado.equals(PENDIENTE)) return "Pendiente";
        if (estado.equals(CONFIRMADA)) return "Confirmada";
        if (estado.equals(COMPLETADA)) return "Completada";
        if (estado.equals(CANCELADA)) return "Cancelada";
        return estado;
    }

    /** Clase CSS del badge segun el estado, usada directamente desde el JSP. */
    public String getClaseBadge() {
        if (estado == null) return "badge-pendiente";
        if (estado.equals(CONFIRMADA)) return "badge-confirmada";
        if (estado.equals(CANCELADA)) return "badge-cancelada";
        if (estado.equals(COMPLETADA)) return "badge-completada";
        return "badge-pendiente";
    }
}
