package com.proyecto.sgccosmetproject.controller;

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

@WebServlet("/admin/empleados/guardar")
public class AdminEmpleadosGuardarServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        request.setCharacterEncoding("UTF-8");

        String idStr = request.getParameter("id");
        String nombre = request.getParameter("nombre");
        String especialidad = request.getParameter("especialidad");
        String correo = request.getParameter("correo");
        String telefono = request.getParameter("telefono");
        String horaInicio = request.getParameter("horaInicio");
        String horaFin = request.getParameter("horaFin");
        String[] dias = request.getParameterValues("dias");

        // Formatear horas a HH24:MI:SS si vienen en formato HH:MM
        if (horaInicio != null && horaInicio.length() == 5) {
            horaInicio += ":00";
        }
        if (horaFin != null && horaFin.length() == 5) {
            horaFin += ":00";
        }

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {
            conexion.setAutoCommit(false); // Transacción para asegurar la inserción múltiple

            if (idStr == null || idStr.trim().isEmpty()) {
                // --- 1. CREAR NUEVO EMPLEADO ---

                // A. Insertar en tabla USUARIOS
                String sqlUsuario = "INSERT INTO usuarios (nombre_completo, correo, telefono, fecha_nacimiento, contrasena, id_rol, estado_veto, faltas_consecutivas) "
                        + "VALUES (?, ?, ?, SYSDATE, '123456', (SELECT id_rol FROM roles WHERE UPPER(nombre_rol) LIKE '%EMPLEADO%' AND ROWNUM = 1), 'FALSE', 0)";

                int idUsuarioGenerado = 0;
                try (PreparedStatement psUser = conexion.prepareStatement(sqlUsuario, new String[]{"ID_USUARIO"})) {
                    psUser.setString(1, nombre);
                    psUser.setString(2, correo);
                    psUser.setString(3, telefono);
                    psUser.executeUpdate();

                    try (ResultSet rs = psUser.getGeneratedKeys()) {
                        if (rs.next()) {
                            idUsuarioGenerado = rs.getInt(1);
                        }
                    }
                }

                // B. Insertar en tabla EMPLEADOS
                String sqlEmpleado = "INSERT INTO empleados (id_usuario, especialidad) VALUES (?, ?)";
                int idEmpleadoGenerado = 0;
                try (PreparedStatement psEmp = conexion.prepareStatement(sqlEmpleado, new String[]{"ID_EMPLEADO"})) {
                    psEmp.setInt(1, idUsuarioGenerado);
                    psEmp.setString(2, especialidad);
                    psEmp.executeUpdate();

                    try (ResultSet rs = psEmp.getGeneratedKeys()) {
                        if (rs.next()) {
                            idEmpleadoGenerado = rs.getInt(1);
                        }
                    }
                }

                // C. Insertar en HORARIOS_LABORALES
                if (dias != null && idEmpleadoGenerado > 0) {
                    insertarHorarios(conexion, idEmpleadoGenerado, dias, horaInicio, horaFin);
                }

                session.setAttribute("mensajeExito", "Empleado registrado correctamente.");

            } else {
                // --- 2. EDITAR EMPLEADO EXISTENTE ---
                int idEmpleado = Integer.parseInt(idStr);

                // A. Actualizar USUARIOS
                String sqlUpdateUser = "UPDATE usuarios SET nombre_completo = ?, correo = ?, telefono = ? "
                        + "WHERE id_usuario = (SELECT id_usuario FROM empleados WHERE id_empleado = ?)";
                try (PreparedStatement psUpUser = conexion.prepareStatement(sqlUpdateUser)) {
                    psUpUser.setString(1, nombre);
                    psUpUser.setString(2, correo);
                    psUpUser.setString(3, telefono);
                    psUpUser.setInt(4, idEmpleado);
                    psUpUser.executeUpdate();
                }

                // B. Actualizar EMPLEADOS
                String sqlUpdateEmp = "UPDATE empleados SET especialidad = ? WHERE id_empleado = ?";
                try (PreparedStatement psUpEmp = conexion.prepareStatement(sqlUpdateEmp)) {
                    psUpEmp.setString(1, especialidad);
                    psUpEmp.setInt(2, idEmpleado);
                    psUpEmp.executeUpdate();
                }

                // C. Reemplazar HORARIOS_LABORALES
                String sqlDeleteHorarios = "DELETE FROM horarios_laborales WHERE id_empleado = ?";
                try (PreparedStatement psDel = conexion.prepareStatement(sqlDeleteHorarios)) {
                    psDel.setInt(1, idEmpleado);
                    psDel.executeUpdate();
                }

                if (dias != null) {
                    insertarHorarios(conexion, idEmpleado, dias, horaInicio, horaFin);
                }

                session.setAttribute("mensajeExito", "Empleado actualizado correctamente.");
            }

            conexion.commit(); // Confirmar cambios en la BD

        } catch (Exception e) {
            e.printStackTrace();
            session.setAttribute("mensajeError", "Error al procesar el empleado: " + e.getMessage());
        }

        response.sendRedirect(request.getContextPath() + "/admin/empleados");
    }

    private void insertarHorarios(Connection conexion, int idEmpleado, String[] dias, String horaInicio, String horaFin) throws Exception {
        String sqlHorario = "INSERT INTO horarios_laborales (id_empleado, dia_semana, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)";
        try (PreparedStatement psHorario = conexion.prepareStatement(sqlHorario)) {
            for (String dia : dias) {
                int numDia = mapearDiaANumero(dia);
                if (numDia > 0) {
                    psHorario.setInt(1, idEmpleado);
                    psHorario.setInt(2, numDia);
                    psHorario.setString(3, horaInicio);
                    psHorario.setString(4, horaFin);
                    psHorario.addBatch();
                }
            }
            psHorario.executeBatch();
        }
    }

    private int mapearDiaANumero(String dia) {
        switch (dia.toUpperCase()) {
            case "LUNES": return 1;
            case "MARTES": return 2;
            case "MIERCOLES": return 3;
            case "JUEVES": return 4;
            case "VIERNES": return 5;
            case "SABADO": return 6;
            case "DOMINGO": return 7;
            default: return 0;
        }
    }
}