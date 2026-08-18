package com.sgc.especialista.dao;

import com.sgc.especialista.modelo.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Simula la base de datos mientras no esta conectado Oracle. Todos los datos se
 * guardan aqui en listas y mapas normales, mientras el servidor esta prendido
 * (se pierden si se reinicia Tomcat).
 *
 * IMPORTANTE PARA LA MIGRACION A ORACLE:
 * Cuando conecten el proyecto a Oracle, esta clase deja de usarse y los DAO
 * (EmpleadoDAO, CitaDAO, ClienteDAO) deben reescribir sus metodos usando
 * java.sql.Connection. Los metodos de los DAO no tendrian que cambiar de nombre,
 * solo su interior, para no tener que tocar los servlets ni las vistas.
 */
public final class AlmacenDatos {

    private static final Map<String, Empleado> empleados = new HashMap<>();
    private static final Map<String, Cliente> clientes = new HashMap<>();
    private static final List<Cita> citas = new ArrayList<>();
    private static final List<Resena> resenas = new ArrayList<>();
    private static final List<Recordatorio> recordatorios = new ArrayList<>();
    private static long contadorCitas = 1;
    private static long contadorResenas = 1;

    public static final String ID_EMPLEADO_DEMO = "EMP_1234";

    // Los datos de ejemplo se cargan una sola vez, cuando la clase se usa por primera vez.
    static {
        sembrarDatos();
    }

    private AlmacenDatos() {
    }

    // ---------- Acceso a colecciones ----------

    public static Empleado getEmpleado(String id) {
        return empleados.get(id);
    }

    public static Cliente getCliente(String id) {
        return clientes.get(id);
    }

    public static List<Cita> getCitasPorEmpleado(String idEmpleado) {
        List<Cita> resultado = new ArrayList<>();
        for (Cita c : citas) {
            if (c.getIdEmpleado().equals(idEmpleado)) {
                resultado.add(c);
            }
        }
        return resultado;
    }

    public static Cita getCita(long id) {
        for (Cita c : citas) {
            if (c.getIdCita() == id) {
                return c;
            }
        }
        return null;
    }

    public static List<Resena> getResenasPorCliente(String idCliente) {
        List<Resena> resultado = new ArrayList<>();
        for (Resena r : resenas) {
            if (r.getIdCliente().equals(idCliente)) {
                resultado.add(r);
            }
        }
        return resultado;
    }

    public static List<Recordatorio> getRecordatorios() {
        return recordatorios;
    }

    public static long siguienteIdCita() {
        long id = contadorCitas;
        contadorCitas++;
        return id;
    }

    // ---------- Datos de ejemplo basados en las capturas de Figma ----------

    private static void sembrarDatos() {
        LocalDate hoy = LocalDate.now();

        Empleado peter = new Empleado(ID_EMPLEADO_DEMO, "Peter Parker");
        peter.setFechaNacimiento(LocalDate.of(2001, 8, 10));
        peter.setGenero("Masculino");
        peter.setEspecialidad("Masajista");
        peter.setExperienciaAnios(8);
        peter.setTelefono("+52 55 777 134 4967");
        peter.setCorreo("peterparker123@gmail.com");
        peter.setRutaFoto(null);
        peter.setCalificacionPromedio(4.8);
        List<String> serviciosPeter = new ArrayList<>();
        serviciosPeter.add("Masaje de espalda");
        serviciosPeter.add("Masaje descontracturante");
        serviciosPeter.add("Masaje relajante");
        serviciosPeter.add("Facial hidratante");
        peter.setServicios(serviciosPeter);

        Map<String, String> horario = peter.getHorario();
        horario.put("LUNES", "08:00 A.M - 06:00 P.M");
        horario.put("MARTES", "08:00 A.M - 06:00 P.M");
        horario.put("MIERCOLES", "08:00 A.M - 06:00 P.M");
        horario.put("JUEVES", "08:00 A.M - 06:00 P.M");
        horario.put("VIERNES", "08:00 A.M - 06:00 P.M");
        horario.put("SABADO", null);
        horario.put("DOMINGO", null);
        empleados.put(peter.getIdEmpleado(), peter);

        Cliente juan = registrarCliente("CLI_001", "Juan", "+52 777 100 0001", false);
        Cliente maria = registrarCliente("CLI_002", "Maria Perez", "+52 777 100 0002", false);
        Cliente steve = registrarCliente("CLI_003", "Steve Jobs", "+52 777 134 5867", true);
        Cliente ana = registrarCliente("CLI_004", "Ana Martinez", "+52 777 100 0004", false);
        Cliente carlos = registrarCliente("CLI_005", "Carlos Perez", "+52 777 100 0005", false);
        Cliente diego = registrarCliente("CLI_006", "Diego Estrada", "+52 777 100 0006", false);
        Cliente valeria = registrarCliente("CLI_007", "Valeria Chavez", "+52 777 100 0007", false);

        // Agenda de hoy
        crearCita(juan, "Masaje de espalda", hoy, "10:00 A.M", 60, "Sala 1", 450, Cita.PENDIENTE, null);
        crearCita(maria, "Masaje relajante", hoy, "11:25 A.M", 60, "Sala 2", 480, Cita.CONFIRMADA, null);
        crearCita(steve, "Masaje descontracturante", hoy, "12:30 P.M", 60, "Sala 2", 500, Cita.CONFIRMADA, "Cliente alergico al aceite de lavanda");
        crearCita(ana, "Facial hidratante", hoy, "02:00 P.M", 30, "Sala 3", 380, Cita.CONFIRMADA, null);
        crearCita(valeria, "Masaje descontracturante", hoy, "03:00 P.M", 60, "Sala 2", 500, Cita.CONFIRMADA, null);
        crearCita(carlos, "Masaje de espalda", hoy, "04:00 P.M", 60, "Sala 1", 450, Cita.PENDIENTE, null);

        // Proximas citas (manana), para reflejar el bloque "Proximas citas" del dashboard
        crearCita(juan, "Masaje relajante", hoy.plusDays(1), "08:00 A.M", 60, "Sala 1", 480, Cita.PENDIENTE, null);
        crearCita(diego, "Masaje relajante", hoy.plusDays(1), "11:30 A.M", 60, "Sala 1", 480, Cita.PENDIENTE, null);
        crearCita(valeria, "Masaje descontracturante", hoy.plusDays(1), "03:00 P.M", 60, "Sala 2", 500, Cita.PENDIENTE, null);
        crearCita(steve, "Masaje descontracturante", hoy.plusDays(6), "12:30 P.M", 60, "Sala 2", 500, Cita.PENDIENTE, "Cliente alergico al aceite de lavanda");

        // Historial de Steve Jobs (para el detalle de cita)
        crearResena(steve.getIdCliente(), "Masaje relajante", hoy.minusDays(1), 5.0, "bi-flower1");
        crearResena(steve.getIdCliente(), "Facial hidratante", hoy.minusDays(20), 5.0, "bi-emoji-smile");
        crearResena(steve.getIdCliente(), "Masaje de espalda", hoy.minusDays(28), 4.5, "bi-building");

        recordatorios.add(new Recordatorio("Tienes 2 citas pendientes por confirmar", "bi-calendar-event"));
        recordatorios.add(new Recordatorio("2 clientes nuevos esta semana", "bi-person-plus"));
        recordatorios.add(new Recordatorio("Tienes 2 nuevas resenas", "bi-star"));
    }

    private static Cliente registrarCliente(String id, String nombre, String telefono, boolean frecuente) {
        Cliente c = new Cliente(id, nombre, telefono, frecuente);
        clientes.put(id, c);
        return c;
    }

    private static long crearCita(Cliente cliente, String servicio, LocalDate fecha, String horaTexto,
                                   int duracionMin, String ubicacion, double precio, String estado, String notas) {
        Cita c = new Cita();
        c.setIdCita(siguienteIdCita());
        c.setIdEmpleado(ID_EMPLEADO_DEMO);
        c.setCliente(cliente);
        c.setServicio(servicio);
        c.setFecha(fecha);
        LocalTime inicio = parseHora12(horaTexto);
        c.setHoraInicio(inicio);
        c.setHoraFin(inicio.plusMinutes(duracionMin));
        c.setDuracionMinutos(duracionMin);
        c.setUbicacion(ubicacion);
        c.setPrecio(precio);
        c.setEstado(estado);
        c.setNotas(notas);
        citas.add(c);
        return c.getIdCita();
    }

    private static void crearResena(String idCliente, String servicio, LocalDate fecha, double calificacion, String icono) {
        Resena r = new Resena();
        r.setIdResena(contadorResenas);
        contadorResenas++;
        r.setIdCliente(idCliente);
        r.setServicio(servicio);
        r.setFecha(fecha);
        r.setCalificacion(calificacion);
        r.setIcono(icono);
        resenas.add(r);
    }

    private static LocalTime parseHora12(String texto) {
        // Formato "10:00 A.M" / "03:00 P.M"
        String limpio = texto.replace(".", "").trim().toUpperCase();
        boolean pm = limpio.endsWith("PM");
        String[] partes = limpio.substring(0, limpio.length() - 2).trim().split(":");
        int h = Integer.parseInt(partes[0].trim());
        int m = Integer.parseInt(partes[1].trim());
        if (pm && h != 12) h += 12;
        if (!pm && h == 12) h = 0;
        return LocalTime.of(h, m);
    }
}
