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
import java.text.SimpleDateFormat;
import java.util.*;

@WebServlet("/admin/promociones")
public class AdminPromocionesServlet extends HttpServlet {

    private static final int REGISTROS_POR_PAGINA = 10;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuarioSesion") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        request.setAttribute("paginaActiva", "promociones");

        String estadoFiltro = request.getParameter("estado");
        if (estadoFiltro == null || estadoFiltro.trim().isEmpty()) {
            estadoFiltro = "todas";
        }

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

            contarEstadosPromociones(conexion, request);

            int totalRegistros = contarPromocionesFiltradas(conexion, busqueda, estadoFiltro);
            int totalPaginas = (int) Math.ceil((double) totalRegistros / REGISTROS_POR_PAGINA);
            if (totalPaginas == 0) totalPaginas = 1;
            paginaActual = Math.min(paginaActual, totalPaginas);

            List<Map<String, Object>> promociones = obtenerPromocionesPaginadas(conexion, busqueda, estadoFiltro, paginaActual, REGISTROS_POR_PAGINA);

            request.setAttribute("promociones", promociones);
            request.setAttribute("pestanaActual", estadoFiltro);
            request.setAttribute("busqueda", busqueda);
            request.setAttribute("paginaActual", paginaActual);
            request.setAttribute("totalPaginas", totalPaginas);

            request.getRequestDispatcher("/WEB-INF/administrador/promociones.jsp").forward(request, response);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error al cargar promociones: " + e.getMessage());
        }
    }

    private void contarEstadosPromociones(Connection conexion, HttpServletRequest request) {
        String sql = "SELECT "
                + "COUNT(*) AS total, "
                + "SUM(CASE WHEN TRUNC(SYSDATE) BETWEEN fecha_inicio AND fecha_fin THEN 1 ELSE 0 END) AS activas, "
                + "SUM(CASE WHEN TRUNC(SYSDATE) < fecha_inicio THEN 1 ELSE 0 END) AS programadas, "
                + "SUM(CASE WHEN TRUNC(SYSDATE) > fecha_fin THEN 1 ELSE 0 END) AS expiradas "
                + "FROM promociones";

        try (PreparedStatement ps = conexion.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                request.setAttribute("totalTodas", rs.getInt("total"));
                request.setAttribute("totalActivas", rs.getInt("activas"));
                request.setAttribute("totalProgramadas", rs.getInt("programadas"));
                request.setAttribute("totalExpiradas", rs.getInt("expiradas"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("totalTodas", 0);
            request.setAttribute("totalActivas", 0);
            request.setAttribute("totalProgramadas", 0);
            request.setAttribute("totalExpiradas", 0);
        }
    }

    private int contarPromocionesFiltradas(Connection conexion, String busqueda, String estadoFiltro) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM promociones WHERE (LOWER(nombre) LIKE ? OR LOWER(COALESCE(descripcion, '')) LIKE ? OR LOWER(COALESCE(tipo, '')) LIKE ?)");

        aplicarFiltroEstado(sql, estadoFiltro);

        try (PreparedStatement ps = conexion.prepareStatement(sql.toString())) {
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

    private List<Map<String, Object>> obtenerPromocionesPaginadas(Connection conexion, String busqueda, String estadoFiltro, int pagina, int cantidad) {
        List<Map<String, Object>> lista = new ArrayList<>();
        int offset = (pagina - 1) * cantidad;

        StringBuilder sql = new StringBuilder("SELECT id_promocion, nombre, descripcion, tipo, descuento, fecha_inicio, fecha_fin, ")
                .append("CASE ")
                .append("  WHEN TRUNC(SYSDATE) < fecha_inicio THEN 'Programada' ")
                .append("  WHEN TRUNC(SYSDATE) > fecha_fin THEN 'Expirada' ")
                .append("  ELSE 'Activa' ")
                .append("END AS estado_calculado ")
                .append("FROM promociones ")
                .append("WHERE (LOWER(nombre) LIKE ? OR LOWER(COALESCE(descripcion, '')) LIKE ? OR LOWER(COALESCE(tipo, '')) LIKE ?) ");

        aplicarFiltroEstado(sql, estadoFiltro);

        sql.append("ORDER BY id_promocion DESC OFFSET ? ROWS FETCH NEXT ? ROWS ONLY");

        SimpleDateFormat sdfForm = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat sdfDisplay = new SimpleDateFormat("dd/MM/yyyy");

        try (PreparedStatement ps = conexion.prepareStatement(sql.toString())) {
            String term = "%" + busqueda.toLowerCase() + "%";
            ps.setString(1, term);
            ps.setString(2, term);
            ps.setString(3, term);
            ps.setInt(4, offset);
            ps.setInt(5, cantidad);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> p = new HashMap<>();
                    p.put("idPromocion", rs.getInt("id_promocion"));
                    p.put("nombre", rs.getString("nombre"));
                    p.put("descripcion", rs.getString("descripcion") != null ? rs.getString("descripcion") : "");

                    String tipo = rs.getString("tipo");
                    p.put("tipo", tipo);
                    p.put("etiquetaTipo", formatearTipo(tipo));
                    p.put("descuentoTexto", rs.getString("descuento"));

                    java.sql.Date fInicio = rs.getDate("fecha_inicio");
                    java.sql.Date fFin = rs.getDate("fecha_fin");

                    p.put("fechaInicio", fInicio != null ? sdfForm.format(fInicio) : "");
                    p.put("fechaFin", fFin != null ? sdfForm.format(fFin) : "");

                    String vigencia = (fInicio != null ? sdfDisplay.format(fInicio) : "") + " - " + (fFin != null ? sdfDisplay.format(fFin) : "");
                    p.put("vigenciaTexto", vigencia);

                    String estadoCalc = rs.getString("estado_calculado");
                    p.put("estadoTexto", estadoCalc);

                    if ("Activa".equals(estadoCalc)) {
                        p.put("claseBadgeEstado", "badge-confirmada");
                    } else if ("Programada".equals(estadoCalc)) {
                        p.put("claseBadgeEstado", "badge-pendiente");
                    } else {
                        p.put("claseBadgeEstado", "badge-cancelada");
                    }

                    lista.add(p);
                }
            }
        } catch (Exception e) { e.printStackTrace(); }
        return lista;
    }

    private void aplicarFiltroEstado(StringBuilder sql, String estadoFiltro) {
        if ("Activa".equalsIgnoreCase(estadoFiltro)) {
            sql.append(" AND TRUNC(SYSDATE) BETWEEN fecha_inicio AND fecha_fin ");
        } else if ("Programada".equalsIgnoreCase(estadoFiltro)) {
            sql.append(" AND TRUNC(SYSDATE) < fecha_inicio ");
        } else if ("Expirada".equalsIgnoreCase(estadoFiltro)) {
            sql.append(" AND TRUNC(SYSDATE) > fecha_fin ");
        }
    }

    private String formatearTipo(String tipo) {
        if (tipo == null) return "Promoción";
        switch (tipo.toUpperCase()) {
            case "DOS_POR_UNO": return "2x1";
            case "PORCENTAJE": return "Porcentaje";
            case "PAQUETE": return "Paquete";
            default: return tipo;
        }
    }
}