package com.proyecto.sgccosmetproject.util;

import java.security.SecureRandom;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

/**
 * Gestor de tokens y códigos de verificación en memoria para el flujo de
 * recuperación de contraseñas del sistema <strong>SGC-Cosmetics</strong>.
 *
 * Genera códigos numéricos seguros de 6 dígitos con tiempo de expiración
 * configurable (por defecto 15 minutos) y validación concurrente segura.
 *
 *
 * @author alearr1ola
 * @version 1.0
 */
public class TokenManager {

    private static final Logger LOGGER = Logger.getLogger(TokenManager.class.getName());

    /**
     * Tiempo de vida del token en milisegundos (15 minutos).
     */
    public static final long EXPIRATION_TIME_MS = 15 * 60 * 1000L;

    /**
     * Almacenamiento concurrente de tokens: Código -> Datos del Token.
     */
    private static final Map<String, ResetToken> tokenStore = new ConcurrentHashMap<>();

    /**
     * Mapeo auxiliar de Correo -> Código activo para evitar tokens duplicados por usuario.
     */
    private static final Map<String, String> emailToCodeMap = new ConcurrentHashMap<>();

    private static final SecureRandom secureRandom = new SecureRandom();

    /**
     * Constructor privado para prevenir la instanciación de la clase utilitaria.
     */
    private TokenManager() {
        // Clase utilitaria
    }

    /**
     * Estructura interna que encapsula los datos de un token de recuperación.
     */
    public static class ResetToken {
        private final String email;
        private final String code;
        private final long createdAt;

        /**
         * Crea una instancia de un token de recuperación con fecha actual.
         *
         * @param email Correo electrónico asociado.
         * @param code  Código numérico de 6 dígitos.
         */
        public ResetToken(String email, String code) {
            this.email = email;
            this.code = code;
            this.createdAt = System.currentTimeMillis();
        }

        /**
         * Determina si el token ha superado su tiempo de vida límite.
         *
         * @return {@code true} si el token ha expirado, {@code false} en caso contrario.
         */
        public boolean isExpired() {
            return (System.currentTimeMillis() - createdAt) > EXPIRATION_TIME_MS;
        }

        /**
         * Obtiene el correo electrónico asociado.
         *
         * @return Correo del usuario.
         */
        public String getEmail() {
            return email;
        }

        /**
         * Obtiene el código de verificación generado.
         *
         * @return Código numérico.
         */
        public String getCode() {
            return code;
        }

        /**
         * Obtiene la marca de tiempo de creación en milisegundos.
         *
         * @return Timestamp de creación.
         */
        public long getCreatedAt() {
            return createdAt;
        }
    }

    /**
     * Genera un nuevo código de recuperación de 6 dígitos para el correo especificado.
     * Si ya existía un código activo previo para este correo, es invalidado automáticamente.
     *
     * @param email Correo electrónico del usuario que solicita la recuperación.
     * @return Código de verificación de 6 dígitos generado.
     */
    public static String generarToken(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("El correo electronico no puede ser nulo o vacio");
        }
        String cleanEmail = email.trim().toLowerCase();

        // Limpiar token anterior del mismo correo si existía
        String oldCode = emailToCodeMap.remove(cleanEmail);
        if (oldCode != null) {
            tokenStore.remove(oldCode);
        }

        // Generar un código aleatorio de 6 dígitos (100000 - 999999)
        int num = 100000 + secureRandom.nextInt(900000);
        String code = String.valueOf(num);

        ResetToken token = new ResetToken(cleanEmail, code);
        tokenStore.put(code, token);
        emailToCodeMap.put(cleanEmail, code);

        LOGGER.info("Token de recuperacion generado satisfactoriamente para: " + cleanEmail);
        return code;
    }

    /**
     * Valida un código de recuperación.
     * Comprueba si el código existe y si aún se encuentra dentro del periodo de validez.
     *
     * @param code Código de 6 dígitos introducido por el usuario.
     * @return El correo electrónico asociado si el token es válido y vigente; {@code null} si es inválido o expiró.
     */
    public static String validarToken(String code) {
        if (code == null || code.trim().isEmpty()) {
            return null;
        }
        String cleanCode = code.trim();
        ResetToken token = tokenStore.get(cleanCode);

        if (token == null) {
            LOGGER.warning("Intento de validacion con codigo inexistente: " + cleanCode);
            return null;
        }

        if (token.isExpired()) {
            LOGGER.warning("El codigo " + cleanCode + " para " + token.getEmail() + " ha expirado.");
            invalidarToken(cleanCode);
            return null;
        }

        return token.getEmail();
    }

    /**
     * Invalida y elimina un código de recuperación una vez ha sido utilizado exitosamente.
     *
     * @param code Código a invalidar.
     */
    public static void invalidarToken(String code) {
        if (code != null) {
            String cleanCode = code.trim();
            ResetToken token = tokenStore.remove(cleanCode);
            if (token != null) {
                emailToCodeMap.remove(token.getEmail());
                LOGGER.info("Token " + cleanCode + " invalidado exitosamente para " + token.getEmail());
            }
        }
    }

    /**
     * Elimina periódicamente de la memoria los tokens expirados.
     */
    public static void limpiarTokensExpirados() {
        Iterator<Map.Entry<String, ResetToken>> it = tokenStore.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, ResetToken> entry = it.next();
            if (entry.getValue().isExpired()) {
                emailToCodeMap.remove(entry.getValue().getEmail());
                it.remove();
            }
        }
    }
}
