<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar sesion - SGC Cosmetic</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${ctx}/assets/css/estilos.css">
    <link rel="stylesheet" href="${ctx}/assets/css/publico.css">
</head>
<body class="sgc-auth-body">

<div class="sgc-auth-panel">
    <div class="sgc-auth-formulario">
        <h1 class="fuente-titulo">Iniciar Sesion</h1>
        <p class="sgc-auth-intro">
            &iexcl;Bienvenido/a! Hemos preparado este espacio para facilitarte la vida.
            Comienza a gestionar tus servicios o descubre nuestras promociones exclusivas.
        </p>

        <c:if test="${not empty error}">
            <div class="alert alert-danger py-2"><c:out value="${error}" /></div>
        </c:if>
        <c:if test="${param.restablecida == '1'}">
            <div class="alert alert-success py-2">Tu contrasena se actualizo. Ya puedes iniciar sesion.</div>
        </c:if>

        <form method="post" action="${ctx}/login">
            <label for="correo">Usuario</label>
            <div class="sgc-auth-input-group">
                <i class="bi bi-person"></i>
                <input type="email" id="correo" name="correo" placeholder="introduce tu usuario"
                       value="${correoEnviado}" required>
            </div>

            <label for="contrasena">Contrasena</label>
            <div class="sgc-auth-input-group">
                <i class="bi bi-lock"></i>
                <input type="password" id="contrasena" name="contrasena" placeholder="introduce tu contrasena" required>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="form-check sgc-auth-checkbox">
                    <input class="form-check-input" type="checkbox" id="mantenerSesion" name="mantenerSesion">
                    <label class="form-check-label" for="mantenerSesion">Mantener la sesion iniciada?</label>
                </div>
                <a href="${ctx}/recuperar-contrasena" class="sgc-auth-link-derecha">Olvidaste la contrasena?</a>
            </div>

            <button type="submit" class="btn-submit">Iniciar Sesion</button>
        </form>

    </div>

    <jsp:include page="/WEB-INF/vistas/publico/includes/panel-foto.jsp" />
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
