package com.sgc.especialista.servlet;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

/**
 * Utilidad sencilla de "flash messages": guarda un mensaje en la sesion para que sobreviva
 * a un sendRedirect (donde los atributos de request se pierden) y lo retira apenas alguna
 * vista lo consuma, para que no se repita si el usuario recarga la pagina.
 */
final class HttpSessionMensaje {

    private static final String CLAVE_EXITO = "flashExito";
    private static final String CLAVE_ERROR = "flashError";

    private HttpSessionMensaje() {
    }

    static void setExito(HttpServletRequest request, String mensaje) {
        request.getSession().setAttribute(CLAVE_EXITO, mensaje);
    }

    static void setError(HttpServletRequest request, String mensaje) {
        request.getSession().setAttribute(CLAVE_ERROR, mensaje);
    }

    /** Debe llamarse desde los servlets que hacen forward a una vista, para exponer y limpiar el flash. */
    static void trasladarAlRequest(HttpServletRequest request) {
        HttpSession sesion = request.getSession(false);
        if (sesion == null) return;
        Object exito = sesion.getAttribute(CLAVE_EXITO);
        Object error = sesion.getAttribute(CLAVE_ERROR);
        if (exito != null) {
            request.setAttribute("mensajeExito", exito);
            sesion.removeAttribute(CLAVE_EXITO);
        }
        if (error != null) {
            request.setAttribute("mensajeError", error);
            sesion.removeAttribute(CLAVE_ERROR);
        }
    }
}
