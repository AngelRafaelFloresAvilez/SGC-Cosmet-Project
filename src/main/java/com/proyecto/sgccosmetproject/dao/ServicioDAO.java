package com.proyecto.sgccosmetproject.dao;

import com.proyecto.sgccosmetproject.model.Servicio;
import com.proyecto.sgccosmetproject.util.ConexionBD;
import jakarta.servlet.ServletContext;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ServicioDAO {

    public List<Servicio> obtenerTodos(ServletContext context) {
        List<Servicio> listaServicios = new ArrayList<>();
        // Traemos solo los servicios que estén activos
        String sql = "SELECT ID_SERVICIO, NOMBRE, DESCRIPCION, COSTO, DURACION_ESTIMADA, FOTO_URL, ESTADO, CATEGORIA, INCLUYE FROM SERVICIOS WHERE ESTADO = 'Activo'";

        try (Connection conn = ConexionBD.obtenerConexion(context);
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Servicio s = new Servicio();
                s.setIdServicio(rs.getInt("ID_SERVICIO"));
                s.setNombre(rs.getString("NOMBRE"));
                s.setDescripcion(rs.getString("DESCRIPCION"));
                s.setPrecio(rs.getDouble("COSTO"));
                s.setDuracion(rs.getString("DURACION_ESTIMADA"));
                s.setImagenUrl(rs.getString("FOTO_URL"));
                s.setEstado(rs.getString("ESTADO"));
                s.setCategoria(rs.getString("CATEGORIA"));
                s.setIncluye(rs.getString("INCLUYE"));

                listaServicios.add(s);
            }
        } catch (SQLException e) {
            System.err.println("Error al obtener los servicios: " + e.getMessage());
        }

        return listaServicios;
    }
}