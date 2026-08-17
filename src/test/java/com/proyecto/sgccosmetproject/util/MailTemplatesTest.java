package com.proyecto.sgccosmetproject.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas unitarias para la generación de plantillas HTML de correo {@link MailTemplates}.
 */
public class MailTemplatesTest {

    @Test
    @DisplayName("La plantilla de recuperación debe contener el nombre, código y marca SGC-Cosmetics")
    void testPlantillaRecuperacion() {
        String nombre = "María González";
        String codigo = "749102";

        String html = MailTemplates.plantillaRecuperacion(nombre, codigo);

        assertNotNull(html);
        assertTrue(html.contains("SGC-Cosmetics"), "Debe incluir el nombre oficial SGC-Cosmetics");
        assertTrue(html.contains("María González"), "Debe incluir el nombre del usuario");
        assertTrue(html.contains("749102"), "Debe contener el código de 6 dígitos");
        assertTrue(html.contains("15 minutos"), "Debe advertir sobre los 15 minutos de expiración");
    }

    @Test
    @DisplayName("La plantilla de bienvenida debe incluir nombre, correo y detalles de la cuenta")
    void testPlantillaBienvenida() {
        String nombre = "Carlos Mendoza";
        String correo = "carlos.m@correo.com";

        String html = MailTemplates.plantillaBienvenida(nombre, correo);

        assertNotNull(html);
        assertTrue(html.contains("SGC-Cosmetics"), "Debe incluir la marca SGC-Cosmetics");
        assertTrue(html.contains("Carlos Mendoza"), "Debe incluir el nombre del usuario");
        assertTrue(html.contains("carlos.m@correo.com"), "Debe incluir el correo registrado");
        assertTrue(html.contains("¡Tu cuenta ha sido creada con éxito!"), "Debe contener el saludo de bienvenida");
    }

    @Test
    @DisplayName("Debe escapar caracteres especiales para prevenir XSS en correos HTML")
    void testEscaparCaracteresEspeciales() {
        String nombreMalicioso = "<script>alert('xss')</script>";
        String codigo = "123456";

        String html = MailTemplates.plantillaRecuperacion(nombreMalicioso, codigo);

        assertFalse(html.contains("<script>"), "No debe contener etiquetas script sin escapar");
        assertTrue(html.contains("&lt;script&gt;"), "Debe contener entidades escapadas");
    }
}
