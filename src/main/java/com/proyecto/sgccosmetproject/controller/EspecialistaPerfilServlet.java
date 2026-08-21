package com.proyecto.sgccosmetproject.controller;

import com.proyecto.sgccosmetproject.model.Usuario;
import com.proyecto.sgccosmetproject.util.ConexionBD;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;

@WebServlet("/especialista/perfil")
public class EspecialistaPerfilServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        Usuario usuario = (Usuario) session.getAttribute("usuarioSesion");
        request.setAttribute("paginaActiva", "perfil");

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {
            Map<String, Object> empleado = cargarDatosPerfil(conexion, usuario.getIdUsuario());

            if (empleado == null) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "El usuario no existe en el sistema.");
                return;
            }

            request.setAttribute("empleado", empleado);
            request.getRequestDispatcher("/WEB-INF/especialista/perfil_especialista.jsp").forward(request, response);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error al cargar perfil: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        Usuario usuario = (Usuario) session.getAttribute("usuarioSesion");

        String nombreCompleto = request.getParameter("nombreCompleto");
        String fechaNacimiento = request.getParameter("fechaNacimiento");
        String especialidad = request.getParameter("especialidad");
        String telefono = request.getParameter("telefono");
        String correo = request.getParameter("correo");

        Map<String, String> errores = new HashMap<>();

        if (nombreCompleto == null || nombreCompleto.trim().isEmpty()) {
            errores.put("nombreCompleto", "El nombre completo es requerido.");
        }
        if (correo == null || correo.trim().isEmpty()) {
            errores.put("correo", "El correo electrónico es requerido.");
        }

        if (!errores.isEmpty()) {
            Map<String, Object> valores = new HashMap<>();
            valores.put("nombreCompleto", nombreCompleto);
            valores.put("fechaNacimiento", fechaNacimiento);
            valores.put("especialidad", especialidad);
            valores.put("telefono", telefono);
            valores.put("correo", correo);

            request.setAttribute("errores", errores);
            request.setAttribute("valoresEnviados", valores);

            doGet(request, response);
            return;
        }

        String sqlUsuario = "UPDATE usuarios SET nombre_completo = ?, correo = ?, telefono = ?, fecha_nacimiento = TO_DATE(?, 'YYYY-MM-DD') WHERE id_usuario = ?";

        // Se usa MERGE para insertar en 'empleados' si no existía el registro previo
        String sqlEmpleado = "MERGE INTO empleados e "
                + "USING (SELECT ? AS id_u, ? AS esp FROM DUAL) src "
                + "ON (e.id_usuario = src.id_u) "
                + "WHEN MATCHED THEN UPDATE SET e.especialidad = src.esp "
                + "WHEN NOT MATCHED THEN INSERT (id_usuario, especialidad) VALUES (src.id_u, src.esp)";

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {
            conexion.setAutoCommit(false);

            try (PreparedStatement psU = conexion.prepareStatement(sqlUsuario);
                 PreparedStatement psE = conexion.prepareStatement(sqlEmpleado)) {

                psU.setString(1, nombreCompleto);
                psU.setString(2, correo);
                psU.setString(3, telefono);
                psU.setString(4, (fechaNacimiento != null && !fechaNacimiento.trim().isEmpty()) ? fechaNacimiento : null);
                psU.setInt(5, usuario.getIdUsuario());
                psU.executeUpdate();

                psE.setInt(1, usuario.getIdUsuario());
                psE.setString(2, (especialidad != null && !especialidad.trim().isEmpty()) ? especialidad : "General");
                psE.executeUpdate();

                conexion.commit();

                // Actualizar sesión del usuario
                usuario.setNombreCompleto(nombreCompleto);
                usuario.setCorreo(correo);

            } catch (Exception ex) {
                conexion.rollback();
                throw ex;
            }

            session.setAttribute("mensajeExito", "Perfil actualizado correctamente.");
            response.sendRedirect(request.getContextPath() + "/especialista/perfil");

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error actualizando perfil: " + e.getMessage());
        }
    }

    private Map<String, Object> cargarDatosPerfil(Connection conexion, int idUsuario) throws Exception {
        Map<String, Object> emp = new HashMap<>();

        // LEFT JOIN para permitir usuarios sin fila previa en 'empleados'
        String sql = "SELECT e.id_empleado, e.especialidad, "
                + "u.nombre_completo, u.correo, u.telefono, TO_CHAR(u.fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nac "
                + "FROM usuarios u "
                + "LEFT JOIN empleados e ON e.id_usuario = u.id_usuario "
                + "WHERE u.id_usuario = ?";

        int idEmpleado = 0;

        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setInt(1, idUsuario);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    idEmpleado = rs.getInt("id_empleado");

                    // Si el usuario no tiene registro en 'empleados', lo creamos dinámicamente
                    if (rs.wasNull() || idEmpleado == 0) {
                        idEmpleado = crearEmpleadoSiNoExiste(conexion, idUsuario);
                        emp.put("especialidad", "General");
                    } else {
                        emp.put("especialidad", rs.getString("especialidad"));
                    }

                    emp.put("idEmpleado", idEmpleado);
                    emp.put("nombreCompleto", rs.getString("nombre_completo"));
                    emp.put("correo", rs.getString("correo"));
                    emp.put("telefono", rs.getString("telefono"));
                    emp.put("fechaNacimientoIso", rs.getString("fecha_nac"));

                    String nombre = rs.getString("nombre_completo");
                    emp.put("iniciales", generarIniciales(nombre));
                } else {
                    return null;
                }
            }
        }

        // Días de la semana
        String[] nombresDias = {"", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"};
        Map<String, String> horario = new LinkedHashMap<>();
        for (int i = 1; i <= 7; i++) {
            horario.put(nombresDias[i], null);
        }

        if (idEmpleado > 0) {
            String sqlHorario = "SELECT dia_semana, hora_inicio, hora_fin FROM horarios_laborales WHERE id_empleado = ?";
            try (PreparedStatement psH = conexion.prepareStatement(sqlHorario)) {
                psH.setInt(1, idEmpleado);
                try (ResultSet rsH = psH.executeQuery()) {
                    while (rsH.next()) {
                        int numDia = rsH.getInt("dia_semana");
                        if (numDia >= 1 && numDia <= 7) {
                            String rango = rsH.getString("hora_inicio") + " - " + rsH.getString("hora_fin");
                            horario.put(nombresDias[numDia], rango);
                        }
                    }
                }
            }
        }
        emp.put("horario", horario);

        return emp;
    }

    private int crearEmpleadoSiNoExiste(Connection conexion, int idUsuario) throws Exception {
        String sql = "INSERT INTO empleados (id_usuario, especialidad) VALUES (?, 'General')";
        try (PreparedStatement ps = conexion.prepareStatement(sql, new String[]{"ID_EMPLEADO"})) {
            ps.setInt(1, idUsuario);
            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        return 0;
    }

    private String generarIniciales(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) return "EX";
        String[] partes = nombre.trim().split("\\s+");
        if (partes.length >= 2) {
            return (partes[0].substring(0, 1) + partes[1].substring(0, 1)).toUpperCase();
        }
        return partes[0].substring(0, Math.min(2, partes[0].length())).toUpperCase();
    }
}