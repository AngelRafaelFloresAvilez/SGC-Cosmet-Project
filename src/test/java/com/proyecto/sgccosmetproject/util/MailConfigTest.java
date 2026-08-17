package com.proyecto.sgccosmetproject.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Properties;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas unitarias para la carga de configuración SMTP {@link MailConfig}.
 */
public class MailConfigTest {

    @Test
    @DisplayName("Debe cargar correctamente las propiedades SMTP del archivo o valores por defecto")
    void testLecturaPropiedades() {
        assertNotNull(MailConfig.getFromAddress(), "El remitente no debe ser nulo");
        assertEquals("SGC-Cosmetics", MailConfig.getFromName(), "El nombre del remitente debe ser SGC-Cosmetics");
    }

    @Test
    @DisplayName("Debe construir propiedades de sesión válidas para Jakarta Mail")
    void testSessionProperties() {
        Properties sessionProps = MailConfig.getMailSessionProperties();
        assertNotNull(sessionProps);
        assertTrue(sessionProps.containsKey("mail.smtp.host"), "Debe configurar mail.smtp.host");
        assertTrue(sessionProps.containsKey("mail.smtp.port"), "Debe configurar mail.smtp.port");
        assertTrue(sessionProps.containsKey("mail.smtp.auth"), "Debe configurar mail.smtp.auth");
        assertTrue(sessionProps.containsKey("mail.smtp.starttls.enable"), "Debe habilitar STARTTLS");
    }
}
