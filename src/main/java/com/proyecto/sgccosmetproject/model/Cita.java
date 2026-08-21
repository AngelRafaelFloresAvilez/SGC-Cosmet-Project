package com.proyecto.sgccosmetproject.model;

import java.sql.Date;

public class Cita {
    private int idCita;
    private int idCliente;
    private int idEmpleado;

    public int getIdCita() {
        return idCita;
    }

    public void setIdCita(int idCita) {
        this.idCita = idCita;
    }

    public int getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(int idCliente) {
        this.idCliente = idCliente;
    }

    public int getIdEmpleado() {
        return idEmpleado;
    }

    public void setIdEmpleado(int idEmpleado) {
        this.idEmpleado = idEmpleado;
    }

    public int getIdServicio() {
        return idServicio;
    }

    public void setIdServicio(int idServicio) {
        this.idServicio = idServicio;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public double getCostoPactado() {
        return costoPactado;
    }

    public void setCostoPactado(double costoPactado) {
        this.costoPactado = costoPactado;
    }

    public String getDuracionPactada() {
        return duracionPactada;
    }

    public void setDuracionPactada(String duracionPactada) {
        this.duracionPactada = duracionPactada;
    }

    public String getEstadoCita() {
        return estadoCita;
    }

    public void setEstadoCita(String estadoCita) {
        this.estadoCita = estadoCita;
    }

    private int idServicio;
    private Date fecha;
    private String hora;
    private double costoPactado;
    private String duracionPactada;
    private String estadoCita; // 'Pendiente', 'Confirmada', etc.

    public Cita() {}

    // ¡Agrega aquí tus Getters y Setters!
}