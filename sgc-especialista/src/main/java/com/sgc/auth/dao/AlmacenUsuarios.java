package com.sgc.auth.dao;

import com.sgc.auth.modelo.Rol;
import com.sgc.auth.modelo.Usuario;
import com.sgc.auth.util.PasswordUtil;
import com.sgc.especialista.dao.AlmacenDatos;

import java.util.HashMap;
import java.util.Map;

/**
 * Simula la tabla de USUARIOS mientras no esta conectado Oracle. Todos los usuarios
 * se guardan aqui en un Map mientras el servidor esta prendido (se pierden al reiniciar).
 *
 * Password del usuario de ejemplo: "Sgc12345" (para poder probar el login).
 */
public final class AlmacenUsuarios {

    private static final Map<String, Usuario> usuariosPorCorreo = new HashMap<>();
    private static long contador = 1;

    // El usuario de ejemplo se carga una sola vez, cuando la clase se usa por primera vez.
    static {
        sembrarDatos();
    }

    private AlmacenUsuarios() {
    }

    public static Usuario buscarPorCorreo(String correo) {
        if (correo == null) return null;
        return usuariosPorCorreo.get(correo.trim().toLowerCase());
    }

    public static boolean existeCorreo(String correo) {
        return buscarPorCorreo(correo) != null;
    }

    public static Usuario buscarPorToken(String token) {
        if (token == null || token.isBlank()) return null;
        for (Usuario u : usuariosPorCorreo.values()) {
            if (token.equals(u.getTokenRecuperacion())) {
                return u;
            }
        }
        return null;
    }

    public static Usuario crearUsuario(String correo, String contrasenaPlano, String rol, String idPerfil) {
        String sal = PasswordUtil.generarSalt();
        Usuario u = new Usuario("USR_" + contador, correo.trim().toLowerCase(),
                PasswordUtil.hash(contrasenaPlano, sal), rol, idPerfil);
        contador++;
        u.setSal(sal);
        usuariosPorCorreo.put(u.getCorreo(), u);
        return u;
    }

    public static boolean validarContrasena(Usuario usuario, String contrasenaPlano) {
        if (usuario == null || contrasenaPlano == null) return false;
        String intento = PasswordUtil.hash(contrasenaPlano, usuario.getSal());
        return intento.equals(usuario.getContrasenaHash());
    }

    public static void actualizarContrasena(Usuario usuario, String nuevaContrasenaPlano) {
        String sal = PasswordUtil.generarSalt();
        usuario.setSal(sal);
        usuario.setContrasenaHash(PasswordUtil.hash(nuevaContrasenaPlano, sal));
        usuario.setTokenRecuperacion(null);
        usuario.setTokenExpiraEn(0);
    }

    // ---------- Datos de ejemplo ----------

    private static void sembrarDatos() {
        crearUsuario("peterparker123@gmail.com", "Sgc12345", Rol.ESPECIALISTA, AlmacenDatos.ID_EMPLEADO_DEMO);
    }
}
