package com.sgc.especialista.modelo;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class Resena {

    private static final DateTimeFormatter FORMATO_FECHA =
            DateTimeFormatter.ofPattern("dd MMM, yyyy", new Locale("es", "MX"));
    private long idResena;
    private String idCliente;
    private String servicio;
    private LocalDate fecha;
    private double calificacion; // 0.0 - 5.0
    private String icono;        // clase de bootstrap-icons para el servicio

    public long getIdResena() {
        return idResena;
    }

    public void setIdResena(long idResena) {
        this.idResena = idResena;
    }

    public String getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(String idCliente) {
        this.idCliente = idCliente;
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

    public double getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(double calificacion) {
        this.calificacion = calificacion;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

    // ---------- Helpers de presentacion ----------

    public String getFechaFormateada() {
        return fecha != null ? fecha.format(FORMATO_FECHA) : "";
    }

    public int getEstrellasLlenas() {
        return (int) Math.floor(calificacion);
    }

    public boolean isTieneMediaEstrella() {
        return (calificacion - getEstrellasLlenas()) >= 0.5;
    }

    public int getEstrellasVacias() {
        int llenas = getEstrellasLlenas();
        int media = isTieneMediaEstrella() ? 1 : 0;
        return Math.max(0, 5 - llenas - media);
    }
}
