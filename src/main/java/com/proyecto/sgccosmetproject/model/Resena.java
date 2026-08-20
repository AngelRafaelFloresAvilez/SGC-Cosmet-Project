package com.proyecto.sgccosmetproject.model;

public class Resena {
    private int idResena;
    private int idCliente;
    private String nombreCliente;
    private int idServicio;
    private int calificacion;
    private String comentario;

    public Resena() {}

    public Resena(int idResena, int idCliente, String nombreCliente, int idServicio, int calificacion, String comentario) {
        this.idResena = idResena;
        this.idCliente = idCliente;
        this.nombreCliente = nombreCliente;
        this.idServicio = idServicio;
        this.calificacion = calificacion;
        this.comentario = comentario;
    }

    public int getIdResena() {
        return idResena;
    }

    public void setIdResena(int idResena) {
        this.idResena = idResena;
    }

    public int getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(int idCliente) {
        this.idCliente = idCliente;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public int getIdServicio() {
        return idServicio;
    }

    public void setIdServicio(int idServicio) {
        this.idServicio = idServicio;
    }

    public int getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(int calificacion) {
        this.calificacion = calificacion;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}