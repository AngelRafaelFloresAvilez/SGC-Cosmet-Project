package com.proyecto.sgccosmetproject.util;

/**
 * Proveedor de plantillas HTML con diseño responsivo y estética de marca
 * para los correos electrónicos emitidos por el sistema <strong>SGC-Cosmetics</strong>.
 * <p>
 * Incluye plantillas para recuperación de contraseñas y notificaciones
 * de bienvenida por registro de nueva cuenta, optimizadas para clientes de correo.
 * </p>
 *
 * @author alearr1ola
 * @version 1.0
 */
public class MailTemplates {

    /**
     * Constructor privado para prevenir instanciación de la clase utilitaria.
     */
    private MailTemplates() {
        // Clase utilitaria
    }

    /**
     * Genera el cuerpo en formato HTML para el correo de recuperación de contraseña.
     * Presenta el código de 6 dígitos con diseño destacado y advertencia de expiración.
     *
     * @param nombreUsuario     Nombre del usuario que solicitó el restablecimiento.
     * @param codigoRecuperacion Código numérico de verificación de 6 dígitos.
     * @return Cadena con el documento HTML listo para enviar.
     */
    public static String plantillaRecuperacion(String nombreUsuario, String codigoRecuperacion) {
        String nombre = (nombreUsuario != null && !nombreUsuario.trim().isEmpty()) ? nombreUsuario.trim() : "Estimado/a cliente";
        String codigo = (codigoRecuperacion != null) ? codigoRecuperacion : "------";

        return "<!DOCTYPE html>"
                + "<html lang=\"es\">"
                + "<head>"
                + "  <meta charset=\"UTF-8\">"
                + "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
                + "  <title>Recuperación de Contraseña - SGC-Cosmetics</title>"
                + "</head>"
                + "<body style=\"margin:0; padding:0; background-color:#F5F3EF; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased;\">"
                + "  <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"background-color:#F5F3EF; padding:30px 15px;\">"
                + "    <tr>"
                + "      <td align=\"center\">"
                + "        <!-- Tarjeta Principal -->"
                + "        <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"max-width:580px; background-color:#FFFFFF; border-radius:18px; overflow:hidden; box-shadow:0 12px 30px rgba(44,53,39,0.08); border:1px solid #E6E2D8;\">"
                + "          <!-- Encabezado con Identidad de Marca -->"
                + "          <tr>"
                + "            <td style=\"background: linear-gradient(135deg, #2C3527 0%, #3D4D36 100%); padding:35px 30px; text-align:center;\">"
                + "              <h1 style=\"margin:0; color:#FFFFFF; font-size:26px; font-weight:700; letter-spacing:2px; text-transform:uppercase;\">SGC-Cosmetics</h1>"
                + "              <p style=\"margin:6px 0 0 0; color:#D3E4C7; font-size:13px; letter-spacing:0.5px;\">Sistema de Gestión de Servicios Cosmetológicos</p>"
                + "            </td>"
                + "          </tr>"
                + "          <!-- Cuerpo del Mensaje -->"
                + "          <tr>"
                + "            <td style=\"padding:36px 36px 25px 36px; color:#2C3527;\">"
                + "              <h2 style=\"margin:0 0 14px 0; font-size:20px; font-weight:600; color:#2C3527;\">Recuperación de Contraseña</h2>"
                + "              <p style=\"margin:0 0 16px 0; font-size:15px; line-height:1.6; color:#5A6253;\">"
                + "                Hola <strong>" + escapeHtml(nombre) + "</strong>,<br>"
                + "                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>SGC-Cosmetics</strong>."
                + "              </p>"
                + "              <p style=\"margin:0 0 24px 0; font-size:14px; line-height:1.5; color:#6B7264;\">"
                + "                Introduce el siguiente código de verificación en el formulario de la página web para continuar:"
                + "              </p>"
                + "              <!-- Caja de Código -->"
                + "              <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-bottom:24px;\">"
                + "                <tr>"
                + "                  <td align=\"center\" style=\"background-color:#F0F6EC; border:2px dashed #8EA77F; border-radius:12px; padding:20px;\">"
                + "                    <span style=\"display:block; font-size:11px; font-weight:700; color:#526B4A; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:6px;\">Tu código de seguridad</span>"
                + "                    <span style=\"font-size:34px; font-weight:800; color:#2C3527; letter-spacing:8px; font-family:'Courier New', monospace;\">" + codigo + "</span>"
                + "                  </td>"
                + "                </tr>"
                + "              </table>"
                + "              <!-- Aviso de Expiración -->"
                + "              <div style=\"background-color:#FFF8EC; border-left:4px solid #D4A373; padding:12px 16px; border-radius:6px; margin-bottom:24px;\">"
                + "                <p style=\"margin:0; font-size:13px; color:#7D5A2B; line-height:1.5;\">"
                + "                  ⏱ <strong>Importante:</strong> Este código es válido por <strong>15 minutos</strong>. Si tú no realizaste esta solicitud, puedes ignorar este mensaje de manera segura."
                + "                </p>"
                + "              </div>"
                + "            </td>"
                + "          </tr>"
                + "          <!-- Pie de Correo -->"
                + "          <tr>"
                + "            <td style=\"background-color:#FAF8F5; padding:20px 30px; text-align:center; border-top:1px solid #EBE7DF;\">"
                + "              <p style=\"margin:0 0 6px 0; font-size:12px; color:#87775F;\">"
                + "                © 2026 SGC-Cosmetics. Todos los derechos reservados."
                + "              </p>"
                + "              <p style=\"margin:0; font-size:11px; color:#A89C8A;\">"
                + "                Este es un mensaje automático, por favor no respondas directamente a este correo."
                + "              </p>"
                + "            </td>"
                + "          </tr>"
                + "        </table>"
                + "      </td>"
                + "    </tr>"
                + "  </table>"
                + "</body>"
                + "</html>";
    }

    /**
     * Genera el cuerpo en formato HTML para el correo de notificación de bienvenida
     * ante la creación exitosa de una nueva cuenta.
     *
     * @param nombreUsuario Nombre completo del usuario registrado.
     * @param correoUsuario Dirección de correo electrónico asociada a la cuenta.
     * @return Cadena con el documento HTML listo para enviar.
     */
    public static String plantillaBienvenida(String nombreUsuario, String correoUsuario) {
        String nombre = (nombreUsuario != null && !nombreUsuario.trim().isEmpty()) ? nombreUsuario.trim() : "Estimado/a cliente";
        String correo = (correoUsuario != null) ? correoUsuario.trim() : "";

        return "<!DOCTYPE html>"
                + "<html lang=\"es\">"
                + "<head>"
                + "  <meta charset=\"UTF-8\">"
                + "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
                + "  <title>¡Bienvenido/a a SGC-Cosmetics!</title>"
                + "</head>"
                + "<body style=\"margin:0; padding:0; background-color:#F5F3EF; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased;\">"
                + "  <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"background-color:#F5F3EF; padding:30px 15px;\">"
                + "    <tr>"
                + "      <td align=\"center\">"
                + "        <!-- Tarjeta Principal -->"
                + "        <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"max-width:580px; background-color:#FFFFFF; border-radius:18px; overflow:hidden; box-shadow:0 12px 30px rgba(44,53,39,0.08); border:1px solid #E6E2D8;\">"
                + "          <!-- Encabezado con Identidad de Marca -->"
                + "          <tr>"
                + "            <td style=\"background: linear-gradient(135deg, #2C3527 0%, #465A3D 100%); padding:38px 30px; text-align:center;\">"
                + "              <h1 style=\"margin:0; color:#FFFFFF; font-size:26px; font-weight:700; letter-spacing:2px; text-transform:uppercase;\">SGC-Cosmetics</h1>"
                + "              <p style=\"margin:6px 0 0 0; color:#D3E4C7; font-size:13px; letter-spacing:0.5px;\">Sistema de Gestión de Servicios Cosmetológicos</p>"
                + "            </td>"
                + "          </tr>"
                + "          <!-- Cuerpo de Bienvenida -->"
                + "          <tr>"
                + "            <td style=\"padding:36px 36px 25px 36px; color:#2C3527;\">"
                + "              <h2 style=\"margin:0 0 12px 0; font-size:22px; font-weight:700; color:#2C3527;\">¡Tu cuenta ha sido creada con éxito! 🎉</h2>"
                + "              <p style=\"margin:0 0 16px 0; font-size:15px; line-height:1.6; color:#5A6253;\">"
                + "                Hola <strong>" + escapeHtml(nombre) + "</strong>,<br>"
                + "                Te damos una cálida bienvenida a la plataforma digital de <strong>SGC-Cosmetics</strong>. Ahora podrás gestionar y agendar tus servicios cosmetológicos de manera rápida y sencilla."
                + "              </p>"
                + "              <!-- Resumen de Datos -->"
                + "              <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"background-color:#F8FAF6; border:1px solid #DFE6DB; border-radius:12px; margin-bottom:24px; padding:16px;\">"
                + "                <tr>"
                + "                  <td style=\"padding:6px 0;\">"
                + "                    <strong style=\"color:#2C3527; font-size:13px;\">Nombre:</strong> <span style=\"color:#55604E; font-size:13px;\">" + escapeHtml(nombre) + "</span>"
                + "                  </td>"
                + "                </tr>"
                + "                <tr>"
                + "                  <td style=\"padding:6px 0;\">"
                + "                    <strong style=\"color:#2C3527; font-size:13px;\">Correo registrado:</strong> <span style=\"color:#55604E; font-size:13px;\">" + escapeHtml(correo) + "</span>"
                + "                  </td>"
                + "                </tr>"
                + "              </table>"
                + "              <!-- Beneficios -->"
                + "              <h3 style=\"margin:0 0 10px 0; font-size:15px; color:#3A4E32;\">¿Qué puedes hacer en SGC-Cosmetics?</h3>"
                + "              <ul style=\"margin:0 0 24px 0; padding-left:20px; color:#5A6253; font-size:14px; line-height:1.7;\">"
                + "                <li>Explorar nuestro catálogo exclusivo de tratamientos y servicios.</li>"
                + "                <li>Agendar y consultar tus citas en tiempo real.</li>"
                + "                <li>Recibir recordatorios y notificaciones personalizadas.</li>"
                + "              </ul>"
                + "            </td>"
                + "          </tr>"
                + "          <!-- Pie de Correo -->"
                + "          <tr>"
                + "            <td style=\"background-color:#FAF8F5; padding:20px 30px; text-align:center; border-top:1px solid #EBE7DF;\">"
                + "              <p style=\"margin:0 0 6px 0; font-size:12px; color:#87775F;\">"
                + "                © 2026 SGC-Cosmetics. Todos los derechos reservados."
                + "              </p>"
                + "              <p style=\"margin:0; font-size:11px; color:#A89C8A;\">"
                + "                Si no reconoces esta cuenta, contáctanos a soporte@sgccosmetic.com"
                + "              </p>"
                + "            </td>"
                + "          </tr>"
                + "        </table>"
                + "      </td>"
                + "    </tr>"
                + "  </table>"
                + "</body>"
                + "</html>";
    }

    /**
     * Escapa caracteres especiales en cadenas de texto para evitar vulnerabilidades XSS en correos HTML.
     *
     * @param input Texto a sanitizar.
     * @return Cadena con entidades HTML escapadas.
     */
    private static String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
