package com.sgc.auth.util;

import java.util.regex.Pattern;

/** Validaciones de servidor para login y recuperacion de contrasena. */
public final class ValidacionAuthUtil {

    private ValidacionAuthUtil() {
    }

    private static final Pattern PATRON_CORREO = Pattern.compile("^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$");
    // Al menos 8 caracteres, una mayuscula, una minuscula y un numero.
    private static final Pattern PATRON_CONTRASENA_FUERTE =
            Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,64}$");

    public static boolean esVacio(String texto) {
        return texto == null || texto.trim().isEmpty();
    }

    public static boolean correoValido(String correo) {
        return !esVacio(correo) && PATRON_CORREO.matcher(correo.trim()).matches();
    }

    public static boolean contrasenaFuerte(String contrasena) {
        return contrasena != null && PATRON_CONTRASENA_FUERTE.matcher(contrasena).matches();
    }
}
