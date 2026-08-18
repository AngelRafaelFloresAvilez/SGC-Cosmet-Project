<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer contrasena - SGC Cosmetic</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${ctx}/assets/css/estilos.css">
    <link rel="stylesheet" href="${ctx}/assets/css/publico.css">
</head>
<body class="sgc-auth-body">

<div class="sgc-auth-panel">
    <div class="sgc-auth-formulario">
        <div class="sgc-auth-icono-circulo"><i class="bi bi-lock"></i></div>

        <c:choose>
            <c:when test="${tokenInvalido}">
                <h1 class="fuente-titulo">Enlace invalido</h1>
                <p class="sgc-auth-intro">
                    Este enlace de recuperacion ya no es valido o ha expirado (los enlaces duran 30 minutos).
                    Solicita uno nuevo desde la pantalla de recuperar contrasena.
                </p>
                <a href="${ctx}/recuperar-contrasena" class="btn-submit d-block text-center text-decoration-none">
                    Solicitar nuevo enlace
                </a>
            </c:when>
            <c:otherwise>
                <h1 class="fuente-titulo">Restablecer<br>contrasena</h1>
                <p class="sgc-auth-intro">
                    Ingresa y confirma tu nueva contrasena. Asegurate de que sea segura y facil de recordar.
                </p>

                <c:if test="${not empty error}">
                    <div class="alert alert-danger py-2"><c:out value="${error}" /></div>
                </c:if>

                <form method="post" action="${ctx}/restablecer-contrasena">
                    <input type="hidden" name="token" value="${token}">

                    <label for="nuevaContrasena">Introduce tu nueva contrasena</label>
                    <div class="sgc-auth-input-group">
                        <i class="bi bi-lock"></i>
                        <input type="password" id="nuevaContrasena" name="nuevaContrasena" placeholder="Nueva contrasena" required>
                    </div>

                    <label for="confirmarContrasena">Introduce de nuevo tu contrasena</label>
                    <div class="sgc-auth-input-group">
                        <i class="bi bi-eye-slash"></i>
                        <input type="password" id="confirmarContrasena" name="confirmarContrasena" placeholder="Confirmar contrasena" required>
                    </div>

                    <button type="submit" class="btn-submit mt-2">Restablecer contrasena</button>
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
