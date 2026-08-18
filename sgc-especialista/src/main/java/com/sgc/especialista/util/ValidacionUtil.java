package com.sgc.especialista.util;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Validaciones de servidor. No confiamos en las validaciones HTML5 del navegador
 * porque un usuario puede desactivar JS o mandar la peticion directo (Postman, curl, etc).
 */
public final class ValidacionUtil {

    private ValidacionUtil() {
    }

    private static final Pattern PATRON_NOMBRE =
            Pattern.compile("^[\\p{L} .'-]{2,80}$");
    private static final Pattern PATRON_TELEFONO =
            Pattern.compile("^[+]?[0-9 ()-]{7,20}$");
    private static final Pattern PATRON_CORREO =
            Pattern.compile("^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$");

    public static final int EDAD_MINIMA = 18;
    public static final int EDAD_MAXIMA = 90;
    public static final int EXPERIENCIA_MAXIMA = 65;

    /**
     * Valida los datos del formulario "Mi perfil profesional".
     * @return mapa de errores por campo; vacio si todo es valido.
     */
    public static Map<String, String> validarPerfil(String nombre, String fechaNacimientoTexto,
                                                      String genero, String especialidad,
                                                      String experienciaTexto, String telefono,
                                                      String correo) {
        Map<String, String> errores = new LinkedHashMap<>();

        if (esVacio(nombre) || !PATRON_NOMBRE.matcher(nombre.trim()).matches()) {
            errores.put("nombreCompleto", "Ingresa un nombre valido (solo letras, 2 a 80 caracteres).");
        }

        LocalDate fechaNacimiento = null;
        if (esVacio(fechaNacimientoTexto)) {
            errores.put("fechaNacimiento", "La fecha de nacimiento es obligatoria.");
        } else {
            try {
                fechaNacimiento = LocalDate.parse(fechaNacimientoTexto, DateTimeFormatter.ISO_LOCAL_DATE);
                if (fechaNacimiento.isAfter(LocalDate.now())) {
                    errores.put("fechaNacimiento", "La fecha de nacimiento no puede ser futura.");
                } else {
                    int edad = Period.between(fechaNacimiento, LocalDate.now()).getYears();
                    if (edad < EDAD_MINIMA) {
                        errores.put("fechaNacimiento", "El especialista debe ser mayor de " + EDAD_MINIMA + " anios.");
                    } else if (edad > EDAD_MAXIMA) {
                        errores.put("fechaNacimiento", "Verifica la fecha, la edad calculada no es valida.");
                    }
                }
            } catch (DateTimeParseException ex) {
                errores.put("fechaNacimiento", "Formato de fecha invalido.");
            }
        }

        if (esVacio(genero)) {
            errores.put("genero", "Selecciona un genero.");
        }

        if (esVacio(especialidad) || especialidad.trim().length() < 2 || especialidad.trim().length() > 60) {
            errores.put("especialidad", "Ingresa una especialidad valida.");
        }

        if (esVacio(experienciaTexto)) {
            errores.put("experienciaAnios", "La experiencia es obligatoria.");
        } else {
            try {
                int experiencia = Integer.parseInt(experienciaTexto.trim());
                if (experiencia < 0 || experiencia > EXPERIENCIA_MAXIMA) {
                    errores.put("experienciaAnios", "La experiencia debe estar entre 0 y " + EXPERIENCIA_MAXIMA + " anios.");
                }
            } catch (NumberFormatException ex) {
                errores.put("experienciaAnios", "La experiencia debe ser un numero entero.");
            }
        }

        if (esVacio(telefono) || !PATRON_TELEFONO.matcher(telefono.trim()).matches()) {
            errores.put("telefono", "Ingresa un telefono valido (7 a 20 digitos, puede incluir + y espacios).");
        }

        if (esVacio(correo) || !PATRON_CORREO.matcher(correo.trim()).matches()) {
            errores.put("correo", "Ingresa un correo electronico valido.");
        }

        return errores;
    }

    public static boolean esVacio(String texto) {
        return texto == null || texto.trim().isEmpty();
    }

    /** Escapa texto simple para insertarlo con seguridad fuera de JSTL (defensa extra ante XSS). */
    public static String escaparHtml(String texto) {
        if (texto == null) return "";
        return texto.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
