package com.sgc.especialista.modelo;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Representa al especialista (rol "Empleado" dentro del sistema SGC Cosmetic).
 * Cuando se conecte a Oracle, este objeto deberia poblarse desde la tabla EMPLEADO
 * (o EMPLEADOS) haciendo join con EMPLEADO_SERVICIO y EMPLEADO_HORARIO.
 */
public class Empleado {

    private String idEmpleado;      // ej. EMP_1234
    private String nombreCompleto;
    private LocalDate fechaNacimiento;
    private String genero;
    private String especialidad;
    private int experienciaAnios;
    private String telefono;
    private String correo;
    private String rutaFoto;        // ruta relativa servida por FotoPerfilServlet
    private double calificacionPromedio;
    private int numeroResenas;
    private int serviciosRealizados;
    private boolean activo = true;

    private List<String> servicios = new ArrayList<>();

    // Horario laboral: clave = dia (LUNES..DOMINGO), valor = "08:00 A.M - 06:00 P.M" o null si no trabaja
    private Map<String, String> horario = new LinkedHashMap<>();

    public Empleado() {
    }

    public Empleado(String idEmpleado, String nombreCompleto) {
        this.idEmpleado = idEmpleado;
        this.nombreCompleto = nombreCompleto;
    }

    public String getIdEmpleado() {
        return idEmpleado;
    }

    public void setIdEmpleado(String idEmpleado) {
        this.idEmpleado = idEmpleado;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public int getExperienciaAnios() {
        return experienciaAnios;
    }

    public void setExperienciaAnios(int experienciaAnios) {
        this.experienciaAnios = experienciaAnios;
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

    public double getCalificacionPromedio() {
        return calificacionPromedio;
    }

    public void setCalificacionPromedio(double calificacionPromedio) {
        this.calificacionPromedio = calificacionPromedio;
    }

    public int getNumeroResenas() {
        return numeroResenas;
    }

    public void setNumeroResenas(int numeroResenas) {
        this.numeroResenas = numeroResenas;
    }

    public int getServiciosRealizados() {
        return serviciosRealizados;
    }

    public void setServiciosRealizados(int serviciosRealizados) {
        this.serviciosRealizados = serviciosRealizados;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public List<String> getServicios() {
        return servicios;
    }

    public void setServicios(List<String> servicios) {
        this.servicios = servicios;
    }

    public Map<String, String> getHorario() {
        return horario;
    }

    public void setHorario(Map<String, String> horario) {
        this.horario = horario;
    }

    // ---------- Helpers de presentacion ----------

    /** Formato ISO (yyyy-MM-dd) requerido por <input type="date">. */
    public String getFechaNacimientoIso() {
        return fechaNacimiento != null ? fechaNacimiento.toString() : "";
    }

    public String getFechaNacimientoFormateada() {
        if (fechaNacimiento == null) return "";
        return String.format("%02d/%02d/%04d", fechaNacimiento.getDayOfMonth(),
                fechaNacimiento.getMonthValue(), fechaNacimiento.getYear());
    }

    public int getEdad() {
        return fechaNacimiento != null ? Period.between(fechaNacimiento, LocalDate.now()).getYears() : 0;
    }

    /** Iniciales usadas como respaldo cuando no hay foto de perfil. */
    public String getIniciales() {
        if (nombreCompleto == null || nombreCompleto.isBlank()) return "?";
        String[] partes = nombreCompleto.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < Math.min(2, partes.length); i++) {
            sb.append(Character.toUpperCase(partes[i].charAt(0)));
        }
        return sb.toString();
    }

    /** Resumen tipo "9:00 - 18:00" a partir del primer dia laboral que se encuentre. */
    public String getHorarioResumen() {
        for (String valor : horario.values()) {
            if (valor != null && !valor.isBlank()) {
                return valor.replace(" A.M", "").replace(" P.M", "");
            }
        }
        return "Sin horario";
    }

    /** Rango de dias laborales tipo "Lun - Vie", a partir de los dias con horario asignado. */
    public String getRangoDiasLaborales() {
        String[] orden = {"LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"};
        String[] abrev = {"Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"};
        int primero = -1, ultimo = -1;
        for (int i = 0; i < orden.length; i++) {
            if (horario.get(orden[i]) != null) {
                if (primero == -1) primero = i;
                ultimo = i;
            }
        }
        if (primero == -1) return "Sin dias asignados";
        return primero == ultimo ? abrev[primero] : abrev[primero] + " - " + abrev[ultimo];
    }

    /** Texto tipo "Sabado, Domingo" con los dias que no tienen horario asignado. */
    public String getDiasNoLaboralesTexto() {
        String[] orden = {"LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"};
        String[] nombres = {"Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"};
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < orden.length; i++) {
            if (horario.get(orden[i]) == null) {
                if (sb.length() > 0) sb.append(", ");
                sb.append(nombres[i]);
            }
        }
        return sb.length() == 0 ? "Ninguno" : sb.toString();
    }
}
