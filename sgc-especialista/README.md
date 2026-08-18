# SGC Cosmetic - Modulo Especialista

Proyecto Jakarta EE (Servlets + JSP/JSTL) para el modulo del especialista de SGC
Cosmetic. Incluye:

- **Publico:** landing, login, recuperar/restablecer contrasena.
- **Especialista:** Dashboard, Agenda, Detalle de cita, Mi perfil profesional.

## Stack usado

- Jakarta EE (`jakarta.servlet-api` 6.0) — pensado para **Tomcat 10.1.x**
- JSP + JSTL 3.0 (`jakarta.tags.*`)
- Servlets con anotaciones (`@WebServlet`, `@WebFilter`, `@MultipartConfig`), sin frameworks extra
- Bootstrap 5 (CDN) + Bootstrap Icons (CDN) para la interfaz
- Google Fonts "Playfair Display" para los titulos
- Datos en memoria (`AlmacenDatos`, `AlmacenUsuarios`) mientras no este conectado Oracle

## Estructura

```
src/main/java/com/sgc/
  auth/         Login, recuperar/restablecer contrasena
    modelo/     Rol, Usuario
    dao/        AlmacenUsuarios (datos de ejemplo), UsuarioDAO
    servlet/    Login, RecuperarContrasena, RestablecerContrasena, CerrarSesion
    util/       PasswordUtil (hash+salt), ValidacionAuthUtil

  especialista/
    modelo/     Empleado, Cliente, Cita, Resena, Recordatorio
    dao/        AlmacenDatos (datos de ejemplo) + EmpleadoDAO, CitaDAO, ClienteDAO
    servlet/    Dashboard, Agenda, DetalleCita, AccionCita, Perfil, FotoPerfil
    filtro/     AutenticacionFiltro (protege /especialista/*)
    util/       ValidacionUtil (formularios), ArchivoUtil (subida de foto)

src/main/webapp/
  index.jsp                        landing publica
  WEB-INF/vistas/publico/          login, recuperar/restablecer-contrasena.jsp
  WEB-INF/vistas/                  dashboard.jsp, agenda.jsp, detalleCita.jsp, perfil.jsp
  WEB-INF/vistas/includes/         head.jsp, sidebar.jsp, topbar.jsp, alertas.jsp
  WEB-INF/vistas/error/            no-encontrado.jsp, error-servidor.jsp
  assets/css/estilos.css           paleta de colores + estilos compartidos
  assets/css/publico.css           estilos de landing/login/recuperar/restablecer
  assets/js/app.js                 preview de foto, confirmaciones, notificaciones, auto-cierre de alertas
```

## Como probarlo

1. `mvn clean package` (genera `target/sgc-especialista.war`)
2. Copia el WAR a `webapps/` de tu Tomcat 10.1 y arrancalo
3. Abre `http://localhost:8080/sgc-especialista/` (te manda a la landing publica)
4. Inicia sesion con la cuenta de prueba de abajo

## Rutas principales

| Ruta | Metodo | Descripcion |
|---|---|---|
| `/` | GET | Landing publica. Si ya hay sesion, redirige al dashboard. |
| `/login` | GET / POST | Inicio de sesion |
| `/recuperar-contrasena` | GET / POST | Genera un enlace de recuperacion (se muestra en pantalla, no hay SMTP configurado) |
| `/restablecer-contrasena?token=...` | GET / POST | Define una contrasena nueva a partir del token |
| `/cerrar-sesion` | GET | Logout |
| `/especialista/dashboard` | GET | Pantalla principal con resumen del dia |
| `/especialista/agenda?vista=dia\|semana\|mes&fecha=YYYY-MM-DD` | GET | Agenda con 3 vistas |
| `/especialista/cita?id=123` | GET | Detalle de una cita |
| `/especialista/cita/accion` | POST | `id` + `accion` = confirmar/cancelar/completar |
| `/especialista/perfil` | GET / POST | Ver y editar informacion personal |
| `/especialista/perfil/foto` | POST (multipart) | Subir nueva foto de perfil |

**Cuenta de prueba:** `peterparker123@gmail.com` / `Sgc12345`

El login guarda en sesion `idUsuario`, `correo`, `rol`, `idPerfil` e `idEmpleado`.

## Validaciones implementadas (no solo "happy path")

**Perfil (`ValidacionUtil`):**
- Nombre: solo letras/espacios, 2-80 caracteres
- Fecha de nacimiento: formato valido, no futura, especialista mayor de 18 y menor de 90 anios
- Genero: obligatorio
- Especialidad: 2-60 caracteres
- Experiencia: numero entero entre 0 y 65
- Telefono: patron flexible pero acotado (7-20 caracteres, digitos/+/espacios/guiones)
- Correo: formato basico de email
- Si algo falla, se recarga el formulario con los valores que el usuario habia escrito
  (no se pierden los datos) y con el mensaje de error debajo de cada campo

**Foto de perfil (`ArchivoUtil` + `FotoPerfilServlet`):**
- Rechaza si no se selecciono archivo
- Tamano maximo 2 MB (validado en cliente, en el servlet y en `@MultipartConfig`)
- Solo JPG/PNG/WEBP, revisando `content-type` real, no solo la extension
- El nombre del archivo final se genera en el servidor (no se usa el nombre que manda el
  navegador) para evitar path traversal o colisiones

**Acciones sobre citas (`CitaDAO.cambiarEstado` / `AccionCitaServlet`):**
- Las acciones se reciben solo por POST (no por un link GET)
- Se valida que el id sea numerico
- Se valida que la accion sea una de las permitidas (confirmar/cancelar/completar)
- Se valida que la cita exista y pertenezca al especialista de la sesion actual
- No se puede modificar una cita ya cancelada o ya completada
- No se puede marcar como completada una cita que todavia no ha ocurrido

**Login / recuperacion (`ValidacionAuthUtil` + servlets de `com.sgc.auth`):**
- Login: mensaje de error generico si el correo o la contrasena fallan (no se distingue
  cual de los dos, para no ayudar a adivinar cuentas validas)
- Recuperar contrasena: siempre muestra el mismo mensaje de exito exista o no el correo
  (para no revelar que correos estan registrados); el token expira a los 30 minutos
- Restablecer contrasena: valida que el token no haya expirado o no exista, y vuelve a
  exigir contrasena fuerte + confirmacion

**Rutas protegidas:**
- `AutenticacionFiltro` protege `/especialista/*` (exige rol ESPECIALISTA); si no hay
  sesion valida, redirige al login (`/login`)

## Migracion a Oracle (a futuro)

Todo el acceso a datos pasa por los DAO (`EmpleadoDAO`, `CitaDAO`, `ClienteDAO`,
`UsuarioDAO`), que hoy delegan en almacenes en memoria (`AlmacenDatos`,
`AlmacenUsuarios`). Cuando conecten Oracle:

1. Configura un `DataSource` JNDI en `context.xml` de Tomcat apuntando a Oracle (driver `ojdbc`).
2. Reescribe el cuerpo de los metodos de esos DAO para usar `java.sql.Connection` /
   `PreparedStatement` en vez de los almacenes en memoria. Las firmas de los metodos
   (parametros y tipo de retorno) estan pensadas para no tener que tocar los servlets
   ni las vistas.
3. Para las fotos de perfil, revisa el comentario en `FotoPerfilServlet`: lo ideal en
   produccion es usar almacenamiento en la nube (o un BLOB) en vez de guardar el
   archivo en el disco del server.
4. Para las contrasenas, revisa el comentario en `PasswordUtil`: el hash con SHA-256 +
   salt es mejor que texto plano, pero para produccion real conviene BCrypt/Argon2.
5. Para el correo de recuperacion de contrasena, revisa el comentario en
   `RecuperarContrasenaServlet`: hoy el enlace se muestra en pantalla; en produccion se
   enviaria por correo real (por ejemplo con Jakarta Mail + un servidor SMTP).

## Notas / limitaciones conocidas

- Los datos son en memoria: se reinician cada vez que se reinicia Tomcat.
- La vista "Semana" y "Mes" de la agenda son funcionales pero mas simples que la vista "Dia".
- El boton de notificaciones en el topbar es decorativo.
