package com.sgc.especialista.modelo;

public class Cliente {

    private String idCliente;
    private String nombreCompleto;
    private String telefono;
    private String correo;
    private String rutaFoto;
    private boolean frecuente;
    private int faltas;
    private boolean vetado;

    public Cliente() {
    }

    public Cliente(String idCliente, String nombreCompleto, String telefono, boolean frecuente) {
        this.idCliente = idCliente;
        this.nombreCompleto = nombreCompleto;
        this.telefono = telefono;
        this.frecuente = frecuente;
    }

    public String getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(String idCliente) {
        this.idCliente = idCliente;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getRutaFoto() {
        return rutaFoto;
    }

    public void setRutaFoto(String rutaFoto) {
        this.rutaFoto = rutaFoto;
    }

    public boolean isFrecuente() {
        return frecuente;
    }

    public void setFrecuente(boolean frecuente) {
        this.frecuente = frecuente;
    }

    /**
     * Numero de faltas consecutivas (citas a las que no se presento). Segun el documento
     * del proyecto, con 3 faltas consecutivas el sistema le restringe agendar citas nuevas
     * hasta que el administrador le quite el bloqueo (ver Cliente.isVetado()).
     */
    public int getFaltas() {
        return faltas;
    }

    public void setFaltas(int faltas) {
        this.faltas = faltas;
    }

    public boolean isVetado() {
        return vetado;
    }

    public void setVetado(boolean vetado) {
        this.vetado = vetado;
    }

    public String getEstadoTexto() {
        return vetado ? "Vetado" : "Activo";
    }
}
