package com.sgc.auth.dao;

import com.sgc.auth.modelo.Usuario;
import com.sgc.auth.util.PasswordUtil;

public class UsuarioDAO {

    public Usuario buscarPorCorreo(String correo) {
        return AlmacenUsuarios.buscarPorCorreo(correo);
    }

    public boolean existeCorreo(String correo) {
        return AlmacenUsuarios.existeCorreo(correo);
    }

    /**
     * Intenta autenticar. Devuelve el Usuario si las credenciales son correctas,
     * o null si el correo no existe o la contrasena no coincide (sin distinguir cual
     * de los dos fallo, para no dar pistas a quien intente adivinar cuentas validas).
     */
    public Usuario autenticar(String correo, String contrasena) {
        Usuario u = AlmacenUsuarios.buscarPorCorreo(correo);
        if (u == null || !AlmacenUsuarios.validarContrasena(u, contrasena)) {
            return null;
        }
        return u;
    }

    /**
     * Genera un token de recuperacion valido por 30 minutos y lo asocia al usuario.
     * Devuelve el token generado (en un sistema real, este token se enviaria por correo
     * en lugar de mostrarse en pantalla).
     */
    public String generarTokenRecuperacion(Usuario usuario) {
        String token = PasswordUtil.generarToken();
        usuario.setTokenRecuperacion(token);
        usuario.setTokenExpiraEn(System.currentTimeMillis() + 30 * 60 * 1000L);
        return token;
    }

    /** Devuelve el usuario dueno del token si es valido y no ha expirado; null en otro caso. */
    public Usuario validarToken(String token) {
        Usuario u = AlmacenUsuarios.buscarPorToken(token);
        if (u == null) return null;
        if (u.getTokenExpiraEn() < System.currentTimeMillis()) {
            return null;
        }
        return u;
    }

    public void actualizarContrasena(Usuario usuario, String nuevaContrasena) {
        AlmacenUsuarios.actualizarContrasena(usuario, nuevaContrasena);
    }
}
