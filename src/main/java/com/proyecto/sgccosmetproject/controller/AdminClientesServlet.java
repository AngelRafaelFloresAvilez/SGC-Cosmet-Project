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

@WebServlet("/admin/clientes")
public class AdminClientesServlet extends HttpServlet {

    private static final int REGISTROS_POR_PAGINA = 10;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        request.setAttribute("paginaActiva", "clientes");

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

            request.setAttribute("totalClientes", obtenerTotalClientes(conexion));
            request.setAttribute("clientesActivos", obtenerClientesActivosCount(conexion));

            int totalRegistros = contarClientesFiltrados(conexion, busqueda);
            int totalPaginas = (int) Math.ceil((double) totalRegistros / REGISTROS_POR_PAGINA);
            if (totalPaginas == 0) totalPaginas = 1;
            paginaActual = Math.min(paginaActual, totalPaginas);

            List<Map<String, Object>> clientes = obtenerClientesPaginados(conexion, busqueda, paginaActual, REGISTROS_POR_PAGINA);

            request.setAttribute("clientes", clientes);
            request.setAttribute("busqueda", busqueda);
            request.setAttribute("paginaActual", paginaActual);
            request.setAttribute("totalPaginas", totalPaginas);

            // RUTA RUTA CORREGIDA: Apunta a tu carpeta real de administrador
            request.getRequestDispatcher("/WEB-INF/administrador/clientes.jsp").forward(request, response);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error al cargar clientes: " + e.getMessage());
        }
    }

    private int obtenerTotalClientes(Connection conexion) {
        String sql = "SELECT COUNT(*) FROM usuarios WHERE id_rol <> 1";
        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private int obtenerClientesActivosCount(Connection conexion) {
        String sql = "SELECT COUNT(*) FROM usuarios WHERE id_rol <> 1 AND (estado_veto IS NULL OR UPPER(estado_veto) = 'FALSE')";
        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private int contarClientesFiltrados(Connection conexion, String busqueda) {
        String sql = "SELECT COUNT(*) FROM usuarios "
                + "WHERE id_rol <> 1 AND (LOWER(nombre_completo) LIKE ? OR LOWER(COALESCE(correo, '')) LIKE ? OR LOWER(COALESCE(telefono, '')) LIKE ?)";
        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            String term = "%" + busqueda.toLowerCase() + "%";
            ps.setString(1, term);
            ps.setString(2, term);
            ps.setString(3, term);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return rs.getInt(1);
            }
        } catch (Exception e) { e.printStackTrace(); }
        return 0;
    }

    private List<Map<String, Object>> obtenerClientesPaginados(Connection conexion, String busqueda, int pagina, int cantidad) {
        List<Map<String, Object>> lista = new ArrayList<>();
        int offset = (pagina - 1) * cantidad;

        String sql = "SELECT id_usuario, nombre_completo, correo, telefono, COALESCE(faltas_consecutivas, 0) AS faltas, estado_veto "
                + "FROM usuarios "
                + "WHERE id_rol <> 1 AND (LOWER(nombre_completo) LIKE ? OR LOWER(COALESCE(correo, '')) LIKE ? OR LOWER(COALESCE(telefono, '')) LIKE ?) "
                + "ORDER BY id_usuario DESC "
                + "OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";

        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            String term = "%" + busqueda.toLowerCase() + "%";
            ps.setString(1, term);
            ps.setString(2, term);
            ps.setString(3, term);
            ps.setInt(4, offset);
            ps.setInt(5, cantidad);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> c = new HashMap<>();
                    c.put("idCliente", rs.getInt("id_usuario"));
                    c.put("nombreCompleto", rs.getString("nombre_completo"));
                    c.put("correo", rs.getString("correo") != null ? rs.getString("correo") : "");
                    c.put("telefono", rs.getString("telefono") != null ? rs.getString("telefono") : "");
                    c.put("faltas", rs.getInt("faltas"));

                    String vetoStr = rs.getString("estado_veto");
                    boolean vetado = "TRUE".equalsIgnoreCase(vetoStr);

                    c.put("vetado", vetado);
                    c.put("estadoTexto", vetado ? "Vetado" : "Activo");

                    lista.add(c);
                }
            }
        } catch (Exception e) { e.printStackTrace(); }
        return lista;
    }
}