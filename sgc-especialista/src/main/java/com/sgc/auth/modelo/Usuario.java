package com.sgc.auth.modelo;

// Datos de acceso de un especialista (correo, contrasena y rol). Es distinto del
// "perfil" (Empleado): el login solo necesita correo, contrasena y rol; el resto de
// los datos del especialista vive en com.sgc.especialista.modelo.Empleado.
public class Usuario {

    private String idUsuario;
    private String correo;
    private String contrasenaHash;
    private String sal;
    private String rol; // siempre "ESPECIALISTA" (ver clase Rol)
    private String idPerfil;           // referencia a Empleado.idEmpleado
    private String tokenRecuperacion;  // token temporal para restablecer contrasena
    private long tokenExpiraEn;        // epoch millis; 0 = sin token activo

    public Usuario() {
    }

    public Usuario(String idUsuario, String correo, String contrasenaHash, String rol, String idPerfil) {
        this.idUsuario = idUsuario;
        this.correo = correo;
        this.contrasenaHash = contrasenaHash;
        this.rol = rol;
        this.idPerfil = idPerfil;
    }

    public String getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasenaHash() {
        return contrasenaHash;
    }

    public void setContrasenaHash(String contrasenaHash) {
        this.contrasenaHash = contrasenaHash;
    }

    public String getSal() {
        return sal;
    }

    public void setSal(String sal) {
        this.sal = sal;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getIdPerfil() {
        return idPerfil;
    }

    public void setIdPerfil(String idPerfil) {
        this.idPerfil = idPerfil;
    }

    public String getTokenRecuperacion() {
        return tokenRecuperacion;
    }

    public void setTokenRecuperacion(String tokenRecuperacion) {
        this.tokenRecuperacion = tokenRecuperacion;
    }

    public long getTokenExpiraEn() {
        return tokenExpiraEn;
    }

    public void setTokenExpiraEn(long tokenExpiraEn) {
        this.tokenExpiraEn = tokenExpiraEn;
    }
}
