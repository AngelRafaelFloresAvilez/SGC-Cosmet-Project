<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar contrasena - SGC Cosmetic</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${ctx}/assets/css/estilos.css">
    <link rel="stylesheet" href="${ctx}/assets/css/publico.css">
</head>
<body class="sgc-auth-body">

<div class="sgc-auth-panel">
    <div class="sgc-auth-formulario">
        <div class="sgc-auth-icono-circulo"><i class="bi bi-envelope"></i></div>

        <c:choose>
            <c:when test="${enviado}">
                <h1 class="fuente-titulo">Revisa tu correo</h1>
                <p class="sgc-auth-intro">
                    Si el correo que ingresaste esta registrado, te enviamos un enlace para
                    restablecer tu contrasena. Revisa tu bandeja de entrada (y la de spam, por si acaso).
                </p>

                <c:if test="${not empty enlaceDemo}">
                    <div class="alert alert-success small">
                        Este proyecto no tiene un servidor de correo configurado, asi que aqui te dejamos
                        el enlace directo solo para poder probar el flujo completo:<br>
                        <a href="${enlaceDemo}"><c:out value="${enlaceDemo}" /></a>
                    </div>
                </c:if>
            </c:when>
            <c:otherwise>
                <h1 class="fuente-titulo">Recuperar<br>contrasena</h1>
                <p class="sgc-auth-intro">
                    Ingresa tu direccion de correo electronico y te enviaremos un enlace para
                    reestablecer tu contrasena.
                </p>

                <c:if test="${not empty error}">
                    <div class="alert alert-danger py-2"><c:out value="${error}" /></div>
                </c:if>

                <form method="post" action="${ctx}/recuperar-contrasena">
                    <div class="sgc-auth-input-group">
                        <i class="bi bi-envelope"></i>
                        <input type="email" name="correo" placeholder="Introduce tu correo electronico"
                               value="${correoEnviado}" required>
                    </div>
                    <button type="submit" class="btn-submit mt-2">Enviar enlace</button>
                </form>
            </c:otherwise>
        </c:choose>

        <div class="sgc-auth-separador-texto">o</div>
        <p class="sgc-auth-pie">
            <a href="${ctx}/login">Volver al inicio de sesion</a>
        </p>
    </div>

    <jsp:include page="/WEB-INF/vistas/publico/includes/panel-foto.jsp" />
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
