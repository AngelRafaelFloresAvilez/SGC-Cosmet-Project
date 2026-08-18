package com.sgc.especialista.util;

import jakarta.servlet.http.Part;

import java.util.Locale;

/**
 * Validaciones para la carga de la foto de perfil.
 * No confiamos solo en la extension: tambien revisamos el content-type que manda el navegador
 * y limitamos el tamanio, para reducir el riesgo de que suban un archivo malicioso disfrazado
 * de imagen o que llenen el disco del servidor.
 */
public final class ArchivoUtil {

    private ArchivoUtil() {
    }

    public static final long TAMANIO_MAXIMO_BYTES = 2L * 1024 * 1024; // 2 MB
    private static final String[] TIPOS_PERMITIDOS = {"image/jpeg", "image/png", "image/webp"};
    private static final String[] EXTENSIONES_PERMITIDAS = {"jpg", "jpeg", "png", "webp"};

    /** Busca un texto dentro de un arreglo (reemplaza el .contains() de las colecciones). */
    private static boolean estaEnLaLista(String[] lista, String valor) {
        for (String item : lista) {
            if (item.equals(valor)) {
                return true;
            }
        }
        return false;
    }

    /** Devuelve null si el archivo es valido, o un mensaje de error si no lo es. */
    public static String validar(Part parte) {
        if (parte == null || parte.getSize() <= 0) {
            return "Selecciona una imagen antes de guardar.";
        }
        if (parte.getSize() > TAMANIO_MAXIMO_BYTES) {
            return "La imagen supera el tamanio maximo permitido (2 MB).";
        }
        String contentType = parte.getContentType();
        if (contentType == null || !estaEnLaLista(TIPOS_PERMITIDOS, contentType.toLowerCase(Locale.ROOT))) {
            return "Formato no soportado. Solo se aceptan imagenes JPG, PNG o WEBP.";
        }
        String nombreOriginal = obtenerNombreArchivo(parte);
        String extension = extraerExtension(nombreOriginal);
        if (extension == null || !estaEnLaLista(EXTENSIONES_PERMITIDAS, extension)) {
            return "La extension del archivo no es valida.";
        }
        return null;
    }

    /** Extrae el nombre real del archivo desde el header Content-Disposition (Part.getSubmittedFileName() ya ayuda, esto es respaldo). */
    public static String obtenerNombreArchivo(Part parte) {
        String nombre = parte.getSubmittedFileName();
        if (nombre == null) {
            return "archivo";
        }
        // Nos quedamos solo con el nombre de archivo, ignorando cualquier ruta que
        // algunos navegadores antiguos podrian incluir (defensa contra path traversal).
        int slash = Math.max(nombre.lastIndexOf('/'), nombre.lastIndexOf('\\'));
        return slash >= 0 ? nombre.substring(slash + 1) : nombre;
    }

    public static String extraerExtension(String nombreArchivo) {
        if (nombreArchivo == null) return null;
        int punto = nombreArchivo.lastIndexOf('.');
        if (punto < 0 || punto == nombreArchivo.length() - 1) return null;
        return nombreArchivo.substring(punto + 1).toLowerCase(Locale.ROOT);
    }

    /** Genera un nombre de archivo seguro y unico para guardar en disco. */
    public static String generarNombreSeguro(String idEmpleado, String extension) {
        String base = idEmpleado.replaceAll("[^a-zA-Z0-9_-]", "_");
        return base + "_" + System.currentTimeMillis() + "." + extension;
    }
}
