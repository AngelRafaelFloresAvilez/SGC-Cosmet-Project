package com.proyecto.sgccosmetproject.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas unitarias para el gestor de códigos de recuperación {@link TokenManager}.
 */
public class TokenManagerTest {

    @Test
    @DisplayName("Debe generar un código de 6 dígitos numéricos válido")
    void testGenerarTokenValido() {
        String email = "cliente@ejemplo.com";
        String token = TokenManager.generarToken(email);

        assertNotNull(token, "El token no debe ser nulo");
        assertEquals(6, token.length(), "El código debe tener exactamente 6 dígitos");
        assertTrue(token.matches("^[0-9]{6}$"), "El código debe contener únicamente números");
    }

    @Test
    @DisplayName("Debe validar un código existente y retornar el correo asociado")
    void testValidarTokenCorrecto() {
        String email = "usuario.prueba@sgccosmetics.com";
        String token = TokenManager.generarToken(email);

        String emailRecuperado = TokenManager.validarToken(token);
        assertEquals(email.toLowerCase(), emailRecuperado, "El correo recuperado debe coincidir con el original");
    }

    @Test
    @DisplayName("Debe retornar null al validar un código inexistente o vacío")
    void testValidarTokenInvalido() {
        assertNull(TokenManager.validarToken("000000"), "Código inexistente debe retornar null");
        assertNull(TokenManager.validarToken(null), "Código nulo debe retornar null");
        assertNull(TokenManager.validarToken("   "), "Código en blanco debe retornar null");
    }

    @Test
    @DisplayName("Debe invalidar el token tras su uso para evitar reusarlo")
    void testInvalidarToken() {
        String email = "seguridad@test.com";
        String token = TokenManager.generarToken(email);

        // Primera validación exitosa
        assertEquals(email, TokenManager.validarToken(token));

        // Invalidar
        TokenManager.invalidarToken(token);

        // Segunda validación debe fallar
        assertNull(TokenManager.validarToken(token), "El token no debe ser reutilizable una vez invalidado");
    }

    @Test
    @DisplayName("Debe reemplazar el token previo si se solicita uno nuevo para el mismo correo")
    void testSobrescribirTokenPrevio() {
        String email = "reemplazo@test.com";
        String token1 = TokenManager.generarToken(email);
        String token2 = TokenManager.generarToken(email);

        assertNull(TokenManager.validarToken(token1), "El token antiguo debe quedar invalidado");
        assertEquals(email, TokenManager.validarToken(token2), "El nuevo token debe ser válido");
    }
}
