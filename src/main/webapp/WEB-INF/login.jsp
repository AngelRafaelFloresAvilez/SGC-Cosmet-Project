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

    <!-- Tus estilos -->
    <script src="${pageContext.request.contextPath}/js/login.js"></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/stylesLogin.css"></head>
<body>
<div class="screen">
    <div class="form-card">
        <div class="form-content">
            <div class="form-header">
                <h1>Iniciar Sesion</h1>
                <p class="hero-copy">¡Bienvenido/a! Hemos preparado este espacio para ti. Comienza a gestionar tus servicios o accede para conocer todo lo que te ofrecemos.</p>
            </div>

            <%-- Mensajes de estado integrados del JSP original --%>
            <% if ("invalid".equals(request.getAttribute("error"))) { %>
            <div style="background-color: #fde8e8; color: #e02424; padding: 12px 16px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; font-family: 'Inter', sans-serif; border: 1px solid #f8b4b4;">
                ⚠️ El correo electrónico o la contraseña son incorrectos. Por favor, verifica tus datos.
            </div>
            <% } %>
            <% if ("true".equals(request.getParameter("resetSuccess")) || "true".equals(request.getAttribute("resetSuccess"))) { %>
            <div style="background-color: #f0fdf4; color: #166534; padding: 12px 16px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; font-family: 'Inter', sans-serif; border: 1px solid #bbf7d0;">
                ✅ ¡Tu contraseña ha sido restablecida exitosamente! Ya puedes iniciar sesión.
            </div>
            <% } %>
            <% if ("true".equals(request.getParameter("registered")) || "true".equals(request.getAttribute("registered"))) { %>
            <div style="background-color: #f0fdf4; color: #166534; padding: 12px 16px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; font-family: 'Inter', sans-serif; border: 1px solid #bbf7d0;">
                ✅ ¡Cuenta creada con éxito! Te hemos enviado un correo de bienvenida a tu bandeja.
            </div>
            <% } %>

            <!-- Formulario apuntando al Servlet -->
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
                    <!-- Ruta corregida hacia el recuperador de contraseña -->
                    <a href="${pageContext.request.contextPath}/recuperar-password" class="secondary-link">¿Olvidaste tu contraseña?</a>
                </div>

                <button id="loginSubmitButton" type="submit" class="btn-primary">Iniciar Sesion</button>

                <div class="footer-link">
                    <span>¿No tienes una cuenta de sgc-cosmetic?</span>
                    <!-- Ruta corregida hacia el registro -->
                    <p><a href="${pageContext.request.contextPath}/registro">Regístrate ahora</a></p>
                </div>
            </form>
        </div>

        <svg class="wave-separator" viewBox="0 0 240 600" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 0 C60 120, 60 240, 0 360 C-60 480, 60 540, 0 600 L240 600 L240 0 Z" fill="#ffffff" />
        </svg>
        <div class="form-side-image" aria-hidden="true">
            <svg class="side-image-svg" viewBox="0 0 480 600" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <clipPath id="clipRight">
                        <path d="M120 0 C80 120,80 240,120 360 C160 480,80 540,120 600 L480 600 L480 0 Z" />
                    </clipPath>
                </defs>
                <!-- Se ajustó la ruta para usar el pageContext al servidor en lugar de la carpeta de producción local -->
                <image href="${pageContext.request.contextPath}/assets/img/ImagenFondoLogin.png" width="480" height="600" clip-path="url(#clipRight)" preserveAspectRatio="xMidYMid slice" />
            </svg>
        </div>
    </div>
</div>

<!-- Scripts -->


<!-- Lógica simple para mostrar contraseña conservada del JSP original -->
<script>
    const passwordInput = document.getElementById('loginPassword');
    const showPasswordCheckbox = document.getElementById('showPassword');

    if (passwordInput && showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener('change', function () {
            passwordInput.type = this.checked ? 'text' : 'password';
        });
    }
</script>
</body>
</html>