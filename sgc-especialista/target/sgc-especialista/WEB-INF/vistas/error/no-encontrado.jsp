<%@ page contentType="text/html;charset=UTF-8" isErrorPage="true" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>No encontrado - SGC Cosmetic</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="<%= request.getContextPath() %>/assets/css/estilos.css">
</head>
<body class="d-flex align-items-center justify-content-center vh-100" style="background: var(--sgc-fondo);">
    <div class="text-center p-5 bg-white rounded-4 shadow-sm">
        <i class="bi bi-emoji-frown display-1" style="color: var(--sgc-verde-medio);"></i>
        <h1 class="mt-3">Pagina no encontrada</h1>
        <p class="text-muted">${mensajeError != null ? mensajeError : 'El recurso que buscas no existe o fue movido.'}</p>
        <a href="<%= request.getContextPath() %>/" class="btn btn-sgc mt-2">Volver al inicio</a>
    </div>
</body>
</html>
