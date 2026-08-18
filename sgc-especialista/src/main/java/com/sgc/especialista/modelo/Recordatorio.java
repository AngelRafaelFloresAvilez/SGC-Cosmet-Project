package com.sgc.especialista.modelo;

public class Recordatorio {
    private String texto;
    private String icono; // clase bootstrap-icons

    public Recordatorio() {
    }

    public Recordatorio(String texto, String icono) {
        this.texto = texto;
        this.icono = icono;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }
}
