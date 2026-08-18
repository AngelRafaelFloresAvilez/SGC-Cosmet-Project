<%@ page contentType="text/html;charset=UTF-8" isErrorPage="true" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Error - SGC Cosmetic</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="<%= request.getContextPath() %>/assets/css/estilos.css">
</head>
<body class="d-flex align-items-center justify-content-center vh-100" style="background: var(--sgc-fondo);">
    <div class="text-center p-5 bg-white rounded-4 shadow-sm">
        <i class="bi bi-exclamation-triangle display-1 text-danger"></i>
        <h1 class="mt-3">Algo salio mal</h1>
        <p class="text-muted">Ocurrio un error inesperado. Intenta de nuevo en unos minutos.</p>
        <a href="<%= request.getContextPath() %>/" class="btn btn-sgc mt-2">Volver al inicio</a>
    </div>
</body>
</html>
