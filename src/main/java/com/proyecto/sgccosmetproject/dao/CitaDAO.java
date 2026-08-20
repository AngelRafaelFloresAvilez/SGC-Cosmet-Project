package com.proyecto.sgccosmetproject.dao;

import com.proyecto.sgccosmetproject.model.Cita;
import com.proyecto.sgccosmetproject.model.Pago;
import com.proyecto.sgccosmetproject.util.ConexionBD;
import jakarta.servlet.ServletContext;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class CitaDAO {

    public boolean registrarCitaYPago(Cita cita, Pago pago, ServletContext context) {
        String sqlCita = "INSERT INTO citas (id_cliente, id_empleado, id_servicio, fecha, hora, costo_pactado, duracion_pactada, estado_cita) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        String sqlPago = "INSERT INTO pagos (id_cita, monto_total, metodo_pago, estado_pago) VALUES (?, ?, ?, ?)";

        Connection conn = null;
        PreparedStatement psCita = null;
        PreparedStatement psPago = null;
        ResultSet rsKeys = null;
        boolean exito = false;

        try {
            conn = ConexionBD.obtenerConexion(context);

            // 1. Desactivar el autocommit para manejar la transacción manualmente
            conn.setAutoCommit(false);

            // 2. Preparar e insertar la Cita solicitando el ID generado
            psCita = conn.prepareStatement(sqlCita, new String[] { "ID_CITA" });
            psCita.setInt(1, cita.getIdCliente());
            psCita.setInt(2, cita.getIdEmpleado());
            psCita.setInt(3, cita.getIdServicio());
            psCita.setDate(4, cita.getFecha());
            psCita.setString(5, cita.getHora());
            psCita.setDouble(6, cita.getCostoPactado());
            psCita.setString(7, cita.getDuracionPactada());
            psCita.setString(8, cita.getEstadoCita() != null ? cita.getEstadoCita() : "Pendiente");

            int filasAfectadas = psCita.executeUpdate();

            if (filasAfectadas > 0) {
                rsKeys = psCita.getGeneratedKeys();
                if (rsKeys.next()) {
                    int idCitaGenerado = rsKeys.getInt(1);

                    // 3. Preparar e insertar el Pago vinculado al ID obtenido
                    psPago = conn.prepareStatement(sqlPago);
                    psPago.setInt(1, idCitaGenerado);
                    psPago.setDouble(2, pago.getMontoTotal());
                    psPago.setString(3, pago.getMetodoPago());
                    psPago.setString(4, pago.getEstadoPago() != null ? pago.getEstadoPago() : "Completado");

                    psPago.executeUpdate();

                    // 4. Si ambas inserciones fueron exitosas, confirmamos en la BD
                    conn.commit();
                    exito = true;
                }
            }

        } catch (SQLException e) {
            // Si algo falla en el camino, revertimos cualquier cambio efectuado
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    System.err.println("Error durante el Rollback: " + ex.getMessage());
                }
            }
            System.err.println("Error en la transacción de Agendamiento: " + e.getMessage());
        } finally {
            // Limpieza de recursos JDBC
            try {
                if (rsKeys != null) rsKeys.close();
                if (psCita != null) psCita.close();
                if (psPago != null) psPago.close();
                if (conn != null) {
                    conn.setAutoCommit(true);
                    conn.close();
                }
            } catch (SQLException e) {
                System.err.println("Error al cerrar conexión: " + e.getMessage());
            }
        }
        return exito;
    }
}