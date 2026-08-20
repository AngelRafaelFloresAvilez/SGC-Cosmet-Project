package com.proyecto.sgccosmetproject.model;

import java.sql.Date;

public class Usuario {
    private String fotoPerfil;

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    private int idUsuario;

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    private String nombreCompleto;
    private String correo;

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    private String telefono;

    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    private Date fechaNacimiento;
    private int idRol;

    public void setEstadoVeto(String estadoVeto) {
        this.estadoVeto = estadoVeto;
    }

    private String estadoVeto;

    public void setIdRol(int idRol) {
        this.idRol = idRol;
    }

    // Constructor completo (incluye idUsuario devuelto por la BD)
    public Usuario(int idUsuario, String nombreCompleto, String correo, String telefono, Date fechaNacimiento, int idRol, String estadoVeto) {
        this.idUsuario = idUsuario;
        this.nombreCompleto = nombreCompleto;
        this.correo = correo;
        this.telefono = telefono;
        this.fechaNacimiento = fechaNacimiento;
        this.idRol = idRol;
        this.estadoVeto = estadoVeto;
    }

    // Constructor secundario (útil cuando registras un usuario nuevo antes de insertarlo en BD)
    public Usuario(String nombreCompleto, String correo, String telefono, Date fechaNacimiento, int idRol, String estadoVeto) {
        this.nombreCompleto = nombreCompleto;
        this.correo = correo;
        this.telefono = telefono;
        this.fechaNacimiento = fechaNacimiento;
        this.idRol = idRol;
        this.estadoVeto = estadoVeto;
    }

    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }
    public String getNombreCompleto() { return nombreCompleto; }
    public String getCorreo() { return correo; }
    public String getTelefono() { return telefono; }
    public Date getFechaNacimiento() { return fechaNacimiento; }
    public int getIdRol() { return idRol; }
    public String getEstadoVeto() { return estadoVeto; }
}