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
import java.util.*;

@WebServlet("/admin/servicios")
public class AdminServiciosServlet extends HttpServlet {

    private static final int REGISTROS_POR_PAGINA = 10;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        request.setAttribute("paginaActiva", "servicios");

        String q = request.getParameter("q");
        String busqueda = (q != null) ? q.trim() : "";

        int paginaActual = 1;
        String pagParam = request.getParameter("pagina");
        if (pagParam != null && !pagParam.isEmpty()) {
            try {
                paginaActual = Math.max(1, Integer.parseInt(pagParam));
            } catch (NumberFormatException ignored) {}
        }

        try (Connection conexion = ConexionBD.obtenerConexion(getServletContext())) {

            request.setAttribute("totalServicios", obtenerTotalServicios(conexion));
            request.setAttribute("serviciosActivos", obtenerServiciosActivosCount(conexion));
            request.setAttribute("duracionPromedio", obtenerDuracionPromedio(conexion));
            request.setAttribute("precioPromedio", obtenerPrecioPromedio(conexion));

            int totalRegistros = contarServiciosFiltrados(conexion, busqueda);
            int totalPaginas = (int) Math.ceil((double) totalRegistros / REGISTROS_POR_PAGINA);
            if (totalPaginas == 0) totalPaginas = 1;
            paginaActual = Math.min(paginaActual, totalPaginas);

            List<Map<String, Object>> servicios = obtenerServiciosPaginados(conexion, busqueda, paginaActual, REGISTROS_POR_PAGINA);

            request.setAttribute("servicios", servicios);
            request.setAttribute("busqueda", busqueda);
            request.setAttribute("paginaActual", paginaActual);
            request.setAttribute("totalPaginas", totalPaginas);

            request.getRequestDispatcher("/WEB-INF/administrador/servicios.jsp").forward(request, response);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error al cargar servicios: " + e.getMessage());
        }
    }

    private int obtenerTotalServicios(Connection conexion) {
        String sql = "SELECT COUNT(*) FROM servicios";
        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private int obtenerServiciosActivosCount(Connection conexion) {
        String sql = "SELECT COUNT(*) FROM servicios WHERE UPPER(estado) = 'ACTIVO'";
        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private int obtenerDuracionPromedio(Connection conexion) {
        // Extrae el valor numérico al inicio del texto (ej. de '60 minutos' extrae 60)
        String sql = "SELECT COALESCE(ROUND(AVG(TO_NUMBER(REGEXP_SUBSTR(duracion_estimada, '^[0-9]+')))), 0) FROM servicios";
        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private double obtenerPrecioPromedio(Connection conexion) {
        String sql = "SELECT COALESCE(AVG(costo), 0) FROM servicios";
        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getDouble(1);
        } catch (Exception e) { e.printStackTrace(); }
        return 0.0;
    }

    private int contarServiciosFiltrados(Connection conexion, String busqueda) {
        String sql = "SELECT COUNT(*) FROM servicios WHERE LOWER(nombre) LIKE ? OR LOWER(COALESCE(descripcion, '')) LIKE ?";
        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            String term = "%" + busqueda.toLowerCase() + "%";
            ps.setString(1, term);
            ps.setString(2, term);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return rs.getInt(1);
            }
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private List<Map<String, Object>> obtenerServiciosPaginados(Connection conexion, String busqueda, int pagina, int cantidad) {
        List<Map<String, Object>> lista = new ArrayList<>();
        int offset = (pagina - 1) * cantidad;

        String sql = "SELECT id_servicio, nombre, descripcion, duracion_estimada, costo AS precio, estado, foto_url AS ruta_foto "
                + "FROM servicios "
                + "WHERE LOWER(nombre) LIKE ? OR LOWER(COALESCE(descripcion, '')) LIKE ? "
                + "ORDER BY id_servicio DESC "
                + "OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";

        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            String term = "%" + busqueda.toLowerCase() + "%";
            ps.setString(1, term);
            ps.setString(2, term);
            ps.setInt(3, offset);
            ps.setInt(4, cantidad);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> s = new HashMap<>();
                    s.put("idServicio", rs.getInt("id_servicio"));
                    s.put("nombre", rs.getString("nombre"));
                    s.put("descripcion", rs.getString("descripcion") != null ? rs.getString("descripcion") : "");

                    // Tratamiento de duracion_estimada como Texto y extracción de enteros
                    String duracionStr = rs.getString("duracion_estimada");
                    s.put("duracionTexto", duracionStr != null ? duracionStr : "");

                    int duracionNum = 0;
                    if (duracionStr != null) {
                        String numLimpio = duracionStr.replaceAll("[^0-9]", "");
                        if (!numLimpio.isEmpty()) {
                            duracionNum = Integer.parseInt(numLimpio);
                        }
                    }
                    s.put("duracionMinutos", duracionNum);

                    double precio = rs.getDouble("precio");
                    s.put("precio", precio);
                    s.put("precioFormateado", String.format("$%.2f", precio));

                    String estado = rs.getString("estado");
                    boolean disponible = "ACTIVO".equalsIgnoreCase(estado);
                    s.put("disponible", disponible);
                    s.put("estadoTexto", disponible ? "Activo" : "Inactivo");

                    s.put("rutaFoto", rs.getString("ruta_foto") != null ? rs.getString("ruta_foto") : "");
                    lista.add(s);
                }
            }
        } catch (Exception e) { e.printStackTrace(); }
        return lista;
    }
}