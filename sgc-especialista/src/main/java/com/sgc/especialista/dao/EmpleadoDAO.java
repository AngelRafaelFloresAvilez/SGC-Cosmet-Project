package com.sgc.especialista.dao;

import com.sgc.especialista.modelo.Empleado;

/**
 * Acceso a datos del especialista. Hoy delega en AlmacenDatos (memoria).
 * Cuando exista conexion a Oracle, reemplazar el cuerpo de estos metodos por
 * consultas JDBC (SELECT / UPDATE sobre la tabla EMPLEADO) manteniendo la firma.
 */
public class EmpleadoDAO {

    public Empleado buscarPorId(String idEmpleado) {
        return AlmacenDatos.getEmpleado(idEmpleado);
    }

    /**
     * Actualiza los datos editables del perfil. Devuelve true si el empleado existia
     * y se actualizo correctamente.
     */
    public boolean actualizarInformacionPersonal(String idEmpleado, String nombreCompleto,
                                                  java.time.LocalDate fechaNacimiento, String genero,
                                                  String especialidad, int experienciaAnios,
                                                  String telefono, String correo) {
        Empleado e = AlmacenDatos.getEmpleado(idEmpleado);
        if (e == null) {
            return false;
        }
        e.setNombreCompleto(nombreCompleto);
        e.setFechaNacimiento(fechaNacimiento);
        e.setGenero(genero);
        e.setEspecialidad(especialidad);
        e.setExperienciaAnios(experienciaAnios);
        e.setTelefono(telefono);
        e.setCorreo(correo);
        return true;
    }

    public boolean actualizarFoto(String idEmpleado, String rutaFoto) {
        Empleado e = AlmacenDatos.getEmpleado(idEmpleado);
        if (e == null) {
            return false;
        }
        e.setRutaFoto(rutaFoto);
        return true;
    }
}
