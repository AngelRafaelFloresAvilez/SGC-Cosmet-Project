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
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "El perfil de especialista no fue encontrado.");
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
        String genero = request.getParameter("genero");
        String especialidad = request.getParameter("especialidad");
        String experienciaStr = request.getParameter("experienciaAnios");
        String telefono = request.getParameter("telefono");
        String correo = request.getParameter("correo");

        Map<String, String> errores = new HashMap<>();

        if (nombreCompleto == null || nombreCompleto.trim().isEmpty()) {
            errores.put("nombreCompleto", "El nombre completo es requerido.");
        }
        if (correo == null || correo.trim().isEmpty()) {
            errores.put("correo", "El correo electrónico es requerido.");
        }

        int experienciaAnios = 0;
        try {
            if (experienciaStr != null && !experienciaStr.trim().isEmpty()) {
                experienciaAnios = Integer.parseInt(experienciaStr);
            }
        } catch (NumberFormatException e) {
            errores.put("experienciaAnios", "Ingresa un número válido de años.");
        }

        if (!errores.isEmpty()) {
            Map<String, Object> valores = new HashMap<>();
            valores.put("nombreCompleto", nombreCompleto);
            valores.put("fechaNacimiento", fechaNacimiento);
            valores.put("genero", genero);
            valores.put("especialidad", especialidad);
            valores.put("experienciaAnios", experienciaStr);
            valores.put("telefono", telefono);
            valores.put("correo", correo);

            request.setAttribute("errores", errores);
            request.setAttribute("valoresEnviados", valores);

            doGet(request, response);
            return;
        }

        String sqlUsuario = "UPDATE usuarios SET nombre_completo = ?, correo = ?, telefono = ?, fecha_nacimiento = TO_DATE(?, 'YYYY-MM-DD'), genero = ? WHERE id_usuario = ?";
        String sqlEmpleado = "UPDATE empleados SET especialidad = ?, experiencia_anios = ? WHERE id_usuario = ?";

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {
            conexion.setAutoCommit(false);

            try (PreparedStatement psU = conexion.prepareStatement(sqlUsuario);
                 PreparedStatement psE = conexion.prepareStatement(sqlEmpleado)) {

                psU.setString(1, nombreCompleto);
                psU.setString(2, correo);
                psU.setString(3, telefono);
                psU.setString(4, (fechaNacimiento != null && !fechaNacimiento.trim().isEmpty()) ? fechaNacimiento : null);
                psU.setString(5, genero);
                psU.setInt(6, usuario.getIdUsuario());
                psU.executeUpdate();

                psE.setString(1, especialidad);
                psE.setInt(2, experienciaAnios);
                psE.setInt(3, usuario.getIdUsuario());
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

        String sql = "SELECT e.id_empleado, e.especialidad, e.experiencia_anios, "
                + "u.nombre_completo, u.correo, u.telefono, TO_CHAR(u.fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nac, "
                + "u.genero, u.ruta_foto "
                + "FROM empleados e "
                + "JOIN usuarios u ON e.id_usuario = u.id_usuario "
                + "WHERE u.id_usuario = ?";

        int idEmpleado = 0;

        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setInt(1, idUsuario);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    idEmpleado = rs.getInt("id_empleado");
                    emp.put("idEmpleado", idEmpleado);
                    emp.put("nombreCompleto", rs.getString("nombre_completo"));
                    emp.put("correo", rs.getString("correo"));
                    emp.put("telefono", rs.getString("telefono"));
                    emp.put("fechaNacimientoIso", rs.getString("fecha_nac"));
                    emp.put("genero", rs.getString("genero"));
                    emp.put("especialidad", rs.getString("especialidad"));
                    emp.put("experienciaAnios", rs.getInt("experiencia_anios"));
                    emp.put("rutaFoto", rs.getString("ruta_foto"));

                    String nombre = rs.getString("nombre_completo");
                    emp.put("iniciales", generarIniciales(nombre));
                } else {
                    return null;
                }
            }
        }

        // Cargar Servicios asignados
        List<String> servicios = new ArrayList<>();
        String sqlServicios = "SELECT s.nombre FROM servicios s "
                + "JOIN empleados_servicios es ON s.id_servicio = es.id_servicio "
                + "WHERE es.id_empleado = ?";
        try (PreparedStatement psS = conexion.prepareStatement(sqlServicios)) {
            psS.setInt(1, idEmpleado);
            try (ResultSet rsS = psS.executeQuery()) {
                while (rsS.next()) {
                    servicios.add(rsS.getString("nombre"));
                }
            }
        }
        emp.put("servicios", servicios);

        // Cargar Horarios laborales
        Map<String, String> horario = new LinkedHashMap<>();
        String[] dias = {"Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"};
        for (String d : dias) horario.put(d, null);

        String sqlHorario = "SELECT dia_semana, hora_inicio, hora_fin FROM horarios_laborales WHERE id_empleado = ?";
        try (PreparedStatement psH = conexion.prepareStatement(sqlHorario)) {
            psH.setInt(1, idEmpleado);
            try (ResultSet rsH = psH.executeQuery()) {
                while (rsH.next()) {
                    String dia = rsH.getString("dia_semana");
                    String rango = rsH.getString("hora_inicio") + " - " + rsH.getString("hora_fin");
                    horario.put(dia, rango);
                }
            }
        }
        emp.put("horario", horario);

        return emp;
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