package com.proyecto.sgccosmetproject.util;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Servicio centralizado para el despacho de correos electrónicos en <strong>SGC-Cosmetics</strong>.
 * <p>
 * Implementa el protocolo SMTP mediante Jakarta Mail con autenticación segura y soporte
 * asíncrono en segundo plano para no bloquear las solicitudes HTTP del usuario.
 * </p>
 *
 * @author alearr1ola
 * @version 1.0
 */
public class MailSender {

    private static final Logger LOGGER = Logger.getLogger(MailSender.class.getName());

    /**
     * Pool de hilos para envíos de correo en segundo plano (asíncronos).
     */
    private static final ExecutorService executorService = Executors.newFixedThreadPool(3, r -> {
        Thread t = new Thread(r);
        t.setDaemon(true);
        t.setName("SGC-MailSender-Worker");
        return t;
    });

    /**
     * Constructor privado para prevenir instanciación de la clase utilitaria.
     */
    private MailSender() {
        // Clase utilitaria
    }

    /**
     * Crea una sesión de Jakarta Mail autenticada con las credenciales de {@link MailConfig}.
     *
     * @return Objeto {@link Session} listo para transmitir mensajes.
     */
    private static Session crearSesion() {
        Properties props = MailConfig.getMailSessionProperties();
        final String user = MailConfig.getUsername();
        final String password = MailConfig.getPassword();

        return Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(user, password);
            }
        });
    }

    /**
     * Envía un correo electrónico en formato HTML de manera síncrona.
     *
     * @param destinatario  Dirección de correo del receptor.
     * @param asunto        Título del mensaje.
     * @param contenidoHtml Código HTML con el cuerpo del correo.
     * @throws MessagingException           Si ocurre un error durante el protocolo SMTP.
     * @throws UnsupportedEncodingException Si la codificación del remitente no es soportada.
     */
    public static void enviarCorreo(String destinatario, String asunto, String contenidoHtml)
            throws MessagingException, UnsupportedEncodingException {

        if (destinatario == null || destinatario.trim().isEmpty()) {
            throw new IllegalArgumentException("La direccion de destinatario no puede ser nula o vacia");
        }

        Session session = crearSesion();
        MimeMessage message = new MimeMessage(session);

        String fromAddress = MailConfig.getFromAddress();
        String fromName = MailConfig.getFromName();

        message.setFrom(new InternetAddress(fromAddress, fromName, "UTF-8"));
        message.setRecipient(Message.RecipientType.TO, new InternetAddress(destinatario.trim()));
        message.setSubject(asunto, "UTF-8");
        message.setContent(contenidoHtml, "text/html; charset=UTF-8");

        LOGGER.info("Iniciando envio de correo a: " + destinatario + " con asunto: '" + asunto + "'");
        Transport.send(message);
        LOGGER.info("Correo enviado exitosamente a: " + destinatario);
    }

    /**
     * Envía un correo electrónico en segundo plano de manera no bloqueante.
     * Si ocurre un error, se registra en el log sin interrumpir el flujo del usuario.
     *
     * @param destinatario  Dirección de correo del receptor.
     * @param asunto        Título del mensaje.
     * @param contenidoHtml Código HTML con el cuerpo del correo.
     */
    public static void enviarCorreoAsync(String destinatario, String asunto, String contenidoHtml) {
        executorService.submit(() -> {
            try {
                enviarCorreo(destinatario, asunto, contenidoHtml);
            } catch (Exception e) {
                LOGGER.log(Level.WARNING, "Error al enviar correo asincrono a " + destinatario + ": " + e.getMessage(), e);
            }
        });
    }

    /**
     * Envía el correo de recuperación de contraseña con código de verificación (asíncrono).
     *
     * @param correo        Dirección de correo del usuario.
     * @param nombreUsuario Nombre del usuario.
     * @param codigo        Código de verificación de 6 dígitos.
     */
    public static void enviarCorreoRecuperacion(String correo, String nombreUsuario, String codigo) {
        String asunto = "SGC-Cosmetics - Código de recuperación de contraseña";
        String html = MailTemplates.plantillaRecuperacion(nombreUsuario, codigo);
        enviarCorreoAsync(correo, asunto, html);
    }

    /**
     * Envía el correo de notificación y bienvenida tras un nuevo registro (asíncrono).
     *
     * @param correo        Dirección de correo del usuario recién registrado.
     * @param nombreUsuario Nombre del usuario registrado.
     */
    public static void enviarCorreoBienvenida(String correo, String nombreUsuario) {
        String asunto = "¡Bienvenido/a a SGC-Cosmetics! Tu cuenta ha sido creada";
        String html = MailTemplates.plantillaBienvenida(nombreUsuario, correo);
        enviarCorreoAsync(correo, asunto, html);
    }
}
