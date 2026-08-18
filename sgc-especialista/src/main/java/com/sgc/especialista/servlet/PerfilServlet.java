package com.sgc.especialista.servlet;

import com.sgc.especialista.dao.EmpleadoDAO;
import com.sgc.especialista.modelo.Empleado;
import com.sgc.especialista.util.ValidacionUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/especialista/perfil")
public class PerfilServlet extends HttpServlet {

    private final EmpleadoDAO empleadoDAO = new EmpleadoDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        mostrarPerfil(request, response, null, null);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String idEmpleado = (String) request.getSession().getAttribute("idEmpleado");

        String nombre = request.getParameter("nombreCompleto");
        String fechaNacimiento = request.getParameter("fechaNacimiento");
        String genero = request.getParameter("genero");
        String especialidad = request.getParameter("especialidad");
        String experiencia = request.getParameter("experienciaAnios");
        String telefono = request.getParameter("telefono");
        String correo = request.getParameter("correo");

        Map<String, String> errores = ValidacionUtil.validarPerfil(
                nombre, fechaNacimiento, genero, especialidad, experiencia, telefono, correo);

        if (!errores.isEmpty()) {
            mostrarPerfil(request, response, errores, construirValoresEnviados(request));
            return;
        }

        boolean actualizado = empleadoDAO.actualizarInformacionPersonal(
                idEmpleado,
                nombre.trim(),
                LocalDate.parse(fechaNacimiento.trim()),
                genero.trim(),
                especialidad.trim(),
                Integer.parseInt(experiencia.trim()),
                telefono.trim(),
                correo.trim());

        if (!actualizado) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Empleado no encontrado.");
            return;
        }

        request.getSession().setAttribute("flashExito", "Tu informacion se actualizo correctamente.");
        response.sendRedirect(request.getContextPath() + "/especialista/perfil");
    }

    private void mostrarPerfil(HttpServletRequest request, HttpServletResponse response,
                                Map<String, String> errores, Map<String, String> valoresEnviados)
            throws ServletException, IOException {

        String idEmpleado = (String) request.getSession().getAttribute("idEmpleado");
        Empleado empleado = empleadoDAO.buscarPorId(idEmpleado);
        if (empleado == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Empleado no encontrado.");
            return;
        }

        HttpSessionMensaje.trasladarAlRequest(request);
        request.setAttribute("empleado", empleado);
        request.setAttribute("errores", errores);
        request.setAttribute("valoresEnviados", valoresEnviados);
        request.setAttribute("paginaActiva", "perfil");
        request.getRequestDispatcher("/WEB-INF/vistas/perfil.jsp").forward(request, response);
    }

    private Map<String, String> construirValoresEnviados(HttpServletRequest request) {
        Map<String, String> valores = new HashMap<>();
        valores.put("nombreCompleto", vacioSiNulo(request.getParameter("nombreCompleto")));
        valores.put("fechaNacimiento", vacioSiNulo(request.getParameter("fechaNacimiento")));
        valores.put("genero", vacioSiNulo(request.getParameter("genero")));
        valores.put("especialidad", vacioSiNulo(request.getParameter("especialidad")));
        valores.put("experienciaAnios", vacioSiNulo(request.getParameter("experienciaAnios")));
        valores.put("telefono", vacioSiNulo(request.getParameter("telefono")));
        valores.put("correo", vacioSiNulo(request.getParameter("correo")));
        return valores;
    }

    private String vacioSiNulo(String texto) {
        return texto == null ? "" : texto;
    }
}
