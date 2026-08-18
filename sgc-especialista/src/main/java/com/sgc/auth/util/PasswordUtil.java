package com.sgc.auth.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Utilidad de contrasenas para esta demo academica.
 *
 * IMPORTANTE: SHA-256 con "salt" es mejor que texto plano, pero NO es el estandar
 * recomendado para produccion (ahi se usaria BCrypt/Argon2, con una libreria como
 * jBCrypt o Spring Security Crypto). Se documenta aqui para que quede claro que es
 * una simplificacion pensada para el proyecto escolar, no para un sistema real.
 */
public final class PasswordUtil {

    private PasswordUtil() {
    }

    public static String hash(String contrasenaPlano, String salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(salt.getBytes(StandardCharsets.UTF_8));
            byte[] hashed = digest.digest(contrasenaPlano.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashed);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Algoritmo de hash no disponible", ex);
        }
    }

    public static String generarSalt() {
        byte[] bytes = new byte[16];
        new SecureRandom().nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }

    public static String generarToken() {
        byte[] bytes = new byte[24];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
