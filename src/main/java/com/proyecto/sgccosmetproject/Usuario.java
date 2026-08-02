package com.proyecto.sgccosmetproject;
import java.sql.Date;
// Clase de usuario (Se usa en UsuariosServlet para convertir el contenido devuelto
// de la peticion al servidor que pide todos los usuarios, para luego ser
// empaquetados en objetos y enviados al jsp de usuarios
public class Usuario {
    private String nombreCompleto;
    private String correo;
    private String telefono;
    private Date fechaNacimiento;
    private int idRol;
    private String estadoVeto;

    public Usuario(String nombreCompleto, String correo, String telefono, Date fechaNacimiento, int idRol, String estadoVeto) {
        this.nombreCompleto = nombreCompleto;
        this.correo = correo;
        this.telefono = telefono;
        this.fechaNacimiento = fechaNacimiento;
        this.idRol = idRol;
        this.estadoVeto = estadoVeto;
    }

    public String getNombreCompleto() { return nombreCompleto; }
    public String getCorreo() { return correo; }
    public String getTelefono() { return telefono; }
    public Date getFechaNacimiento() { return fechaNacimiento; }
    public int getIdRol() { return idRol; }
    public String getEstadoVeto() { return estadoVeto; }
}