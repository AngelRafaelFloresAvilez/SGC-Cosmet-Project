package com.sgc.especialista.servlet;

import com.sgc.especialista.dao.EmpleadoDAO;
import com.sgc.especialista.util.ArchivoUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;

/**
 * Recibe la nueva foto de perfil del especialista (multipart/form-data), la valida
 * y la guarda en disco dentro de la carpeta de subidas de la aplicacion.
 *
 * NOTA DE PRODUCCION: guardar archivos en el propio despliegue de Tomcat funciona bien
 * para practicas, pero se pierde en cada redeploy y no escala si hay varias instancias.
 * Cuando el proyecto se despliegue apuntando a Oracle Cloud Infrastructure, lo recomendable
 * es mover las fotos a Oracle Object Storage (o guardarlas como BLOB) y que esta clase
 * solo suba el archivo y guarde la URL/referencia en la base de datos.
 */
@WebServlet("/especialista/perfil/foto")
@MultipartConfig(
        maxFileSize = 2 * 1024 * 1024,       // 2 MB por archivo
        maxRequestSize = 3 * 1024 * 1024,    // margen para el resto del formulario
        fileSizeThreshold = 0
)
public class FotoPerfilServlet extends HttpServlet {

    private static final String CARPETA_SUBIDAS = "/assets/uploads";

    private final EmpleadoDAO empleadoDAO = new EmpleadoDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String idEmpleado = (String) request.getSession().getAttribute("idEmpleado");

        Part parte;
        try {
            parte = request.getPart("foto");
        } catch (IllegalStateException ex) {
            // Se dispara si el archivo enviado supera maxFileSize/maxRequestSize del @MultipartConfig.
            redirigirConError(request, response, "La imagen es demasiado pesada (limite 2 MB).");
            return;
        }

        String error = ArchivoUtil.validar(parte);
        if (error != null) {
            redirigirConError(request, response, error);
            return;
        }

        String nombreOriginal = ArchivoUtil.obtenerNombreArchivo(parte);
        String extension = ArchivoUtil.extraerExtension(nombreOriginal);
        String nombreSeguro = ArchivoUtil.generarNombreSeguro(idEmpleado, extension);

        String directorioReal = getServletContext().getRealPath(CARPETA_SUBIDAS);
        File directorio = new File(directorioReal);
        if (!directorio.exists() && !directorio.mkdirs()) {
            redirigirConError(request, response, "No se pudo preparar el almacenamiento del servidor.");
            return;
        }

        File destino = new File(directorio, nombreSeguro);

        // Copiamos manualmente en lugar de usar part.write(...) para controlar el nombre final
        // (evita que un nombre de archivo manipulado por el usuario se use tal cual en disco).
        try (InputStream entrada = parte.getInputStream();
             OutputStream salida = Files.newOutputStream(destino.toPath())) {
            entrada.transferTo(salida);
        }

        String rutaPublica = request.getContextPath() + CARPETA_SUBIDAS + "/" + nombreSeguro;
        boolean actualizado = empleadoDAO.actualizarFoto(idEmpleado, rutaPublica);

        if (!actualizado) {
            redirigirConError(request, response, "No se encontro el perfil a actualizar.");
            return;
        }

        request.getSession().setAttribute("flashExito", "Tu foto de perfil se actualizo correctamente.");
        response.sendRedirect(request.getContextPath() + "/especialista/perfil");
    }

    private void redirigirConError(HttpServletRequest request, HttpServletResponse response, String mensaje)
            throws IOException {
        request.getSession().setAttribute("flashError", mensaje);
        response.sendRedirect(request.getContextPath() + "/especialista/perfil");
    }
}
