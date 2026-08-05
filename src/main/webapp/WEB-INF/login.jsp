<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar sesión - SGC Cosmetic</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">

    <!-- Ruta corregida para el archivo CSS estático -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/styles.css">
</head>
<body>
<div class="screen">
    <div class="form-card">
        <div class="form-content">
            <div class="form-header">
                <h1>Iniciar Sesion</h1>
                <p class="hero-copy">¡Bienvenido/a! Hemos preparado este espacio para facilitarte la vida. Comienza a gestionar tus servicios o descubre nuestras promociones exclusivas.</p>
            </div>

            <%-- Cambiamos request.getParameter por request.getAttribute --%>
            <% if ("invalid".equals(request.getAttribute("error"))) { %>
            <div style="background-color: #fde8e8; color: #e02424; padding: 12px; border-radius: 6px; margin-bottom: 15px; font-size: 14px; font-family: 'Inter', sans-serif; border: 1px solid #f8b4b4;">
                El correo electrónico o la contraseña son incorrectos. Por favor, verifica tus datos.
            </div>
            <% } %>

            <form id="loginForm" class="form-grid" action="${pageContext.request.contextPath}/autenticar-usuario" method="post">
                <label for="loginEmail">
                    <span class="field-label">Correo</span>
                    <input id="loginEmail" name="loginEmail" type="email" placeholder="introduce tu correo" required>
                </label>

                <label for="loginPassword">
                    <span class="field-label">Contraseña</span>
                    <input id="loginPassword" name="loginPassword" type="password" placeholder="introduce tu contraseña" required>
                </label>

                <div class="form-options">
                    <label class="checkbox-row" for="showPassword">
                        <input id="showPassword" type="checkbox">
                        <span>Mostrar contraseña</span>
                    </label>
                    <a href="${pageContext.request.contextPath}/recuperar-password" class="secondary-link">¿Olvidaste la contraseña?</a>
                </div>

                <button type="submit" class="btn-primary">Iniciar Sesion</button>

                <div class="footer-link">
                    <span>¿No tienes una cuenta de sgc-cosmetic?</span>
                    <a href="${pageContext.request.contextPath}/registro">Regístrate ahora</a>
                </div>
            </form>
        </div>

        <div class="form-side-image" aria-hidden="true">
            <img src="${pageContext.request.contextPath}/assets/img/ImagenFondoLogin.png" alt="SGC Logo" class="footer-logo">
        </div>
    </div>
</div>

<script>
    // Conservamos este script simple que es muy útil para la experiencia del usuario
    const passwordInput = document.getElementById('loginPassword');
    const showPasswordCheckbox = document.getElementById('showPassword');

    if (passwordInput && showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener('change', function () {
            passwordInput.type = this.checked ? 'text' : 'password';
        });
    }
</script>
<%-- Eliminamos el JS loquillo de 1300 líneas --%>
</body>
</html>