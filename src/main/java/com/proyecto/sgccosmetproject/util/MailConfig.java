package com.proyecto.sgccosmetproject.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Clase utilitaria para la carga y gestión de las propiedades de configuración
 * del servidor de correo SMTP para el sistema <strong>SGC-Cosmetics</strong>.
 *
 * Lee el archivo de configuración {@code mail.properties} ubicado en el directorio
 * {@code resources} del classpath y proporciona métodos de acceso tipados
 * para construir sesiones de correo seguras.
 *
 *
 * @author alearr1ola
 * @version 1.0
 */
public class MailConfig {

    private static final Logger LOGGER = Logger.getLogger(MailConfig.class.getName());
    private static final String PROPERTIES_FILE = "mail.properties";
    private static final Properties properties = new Properties();

    static {
        cargarPropiedades();
    }

    /**
     * Constructor privado para prevenir la instanciación de la clase utilitaria.
     */
    private MailConfig() {
        // Clase utilitaria, no instanciable
    }

    /**
     * Carga las propiedades del archivo {@code mail.properties} presente en el classpath.
     * En caso de error o ausencia del archivo, se establecen valores por defecto seguros.
     */
    private static void cargarPropiedades() {
        try (InputStream is = MailConfig.class.getClassLoader().getResourceAsStream(PROPERTIES_FILE)) {
            if (is != null) {
                properties.load(is);
                LOGGER.info("Configuracion de correo cargada exitosamente desde " + PROPERTIES_FILE);
            } else {
                LOGGER.log(Level.WARNING, "No se encontro el archivo " + PROPERTIES_FILE + " en el classpath. Usando valores predeterminados.");
                establecerValoresPorDefecto();
            }
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error al leer " + PROPERTIES_FILE + ": " + e.getMessage(), e);
            establecerValoresPorDefecto();
        }
    }

    /**
     * Establece valores de contingencia por defecto si el archivo properties no está disponible.
     */
    private static void establecerValoresPorDefecto() {
        properties.setProperty("mail.smtp.host", "smtp.gmail.com");
        properties.setProperty("mail.smtp.port", "587");
        properties.setProperty("mail.smtp.auth", "true");
        properties.setProperty("mail.smtp.starttls.enable", "true");
        properties.setProperty("mail.from", "sgccosmetics@gmail.com");
        properties.setProperty("mail.from.name", "SGC-Cosmetics");
        properties.setProperty("mail.username", "sgccosmetics@gmail.com");
        properties.setProperty("mail.password", "");
    }

    /**
     * Obtiene el valor de una propiedad como String.
     *
     * @param key Clave de la propiedad en el archivo de configuración.
     * @return Valor asignado a la clave, o {@code null} si no existe.
     */
    public static String get(String key) {
        return properties.getProperty(key);
    }

    /**
     * Obtiene el valor de una propiedad como String con valor de respaldo si es nula o vacía.
     *
     * @param key          Clave de la propiedad.
     * @param defaultValue Valor predeterminado a retornar si la clave no existe.
     * @return Valor de la propiedad o {@code defaultValue}.
     */
    public static String get(String key, String defaultValue) {
        String val = properties.getProperty(key);
        return (val != null && !val.trim().isEmpty()) ? val.trim() : defaultValue;
    }

    /**
     * Obtiene el usuario/correo configurado para la autenticación SMTP.
     *
     * @return Nombre de usuario o correo de la cuenta emisora.
     */
    public static String getUsername() {
        return get("mail.username", "sgccosmetics@gmail.com");
    }

    /**
     * Obtiene la contraseña o clave de aplicación configurada para SMTP.
     *
     * @return Contraseña o clave de aplicación de la cuenta de correo.
     */
    public static String getPassword() {
        return get("mail.password", "");
    }

    /**
     * Obtiene la dirección de correo remitente predeterminada.
     *
     * @return Dirección de correo remitente.
     */
    public static String getFromAddress() {
        return get("mail.from", getUsername());
    }

    /**
     * Obtiene el nombre legible para mostrar del remitente (ej. "SGC-Cosmetics").
     *
     * @return Nombre visual del remitente.
     */
    public static String getFromName() {
        return get("mail.from.name", "SGC-Cosmetics");
    }

    /**
     * Construye y retorna las propiedades requeridas por Jakarta Mail
     * para inicializar una sesión SMTP con soporte STARTTLS y autenticación.
     *
     * @return Objeto {@link Properties} configurado para la sesión de Jakarta Mail.
     */
    public static Properties getMailSessionProperties() {
        Properties sessionProps = new Properties();
        sessionProps.put("mail.smtp.host", get("mail.smtp.host", "smtp.gmail.com"));
        sessionProps.put("mail.smtp.port", get("mail.smtp.port", "587"));
        sessionProps.put("mail.smtp.auth", get("mail.smtp.auth", "true"));
        sessionProps.put("mail.smtp.starttls.enable", get("mail.smtp.starttls.enable", "true"));
        sessionProps.put("mail.smtp.ssl.protocols", "TLSv1.2 TLSv1.3");
        sessionProps.put("mail.smtp.ssl.trust", get("mail.smtp.host", "smtp.gmail.com"));
        // Timeouts para evitar bloquear hilos si no hay conexion
        sessionProps.put("mail.smtp.connectiontimeout", "5000");
        sessionProps.put("mail.smtp.timeout", "5000");
        sessionProps.put("mail.smtp.writetimeout", "5000");
        return sessionProps;
    }
}
