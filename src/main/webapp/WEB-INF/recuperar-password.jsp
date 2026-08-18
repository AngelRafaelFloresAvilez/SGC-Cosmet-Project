<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar Contraseña - SGC-Cosmetics</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/styles.css">

    <style>
        .alert-box {
            padding: 14px 16px;
            border-radius: 12px;
            margin-bottom: 20px;
            font-size: 14px;
            font-family: 'Inter', sans-serif;
            line-height: 1.5;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .alert-error {
            background-color: #FDF2F2;
            color: #9B1C1C;
            border: 1px solid #F8B4B4;
        }
        .alert-info {
            background-color: #F0FDF4;
            color: #166534;
            border: 1px solid #BBF7D0;
        }
        .form-side-image-recover {
            min-height: 620px;
            background: linear-gradient(135deg, rgba(44, 53, 39, 0.4), rgba(44, 53, 39, 0.7)),
                        url('${pageContext.request.contextPath}/assets/img/ImagenFondoLogin.png') center/cover no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            color: #ffffff;
            text-align: center;
        }
        .side-quote {
            max-width: 380px;
        }
        .side-quote h2 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 38px;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 16px;
            color: #FAF7F2;
        }
        .side-quote p {
            font-size: 15px;
            line-height: 1.6;
            color: #E2ECE0;
        }
    </style>
</head>
<body>
<div class="screen">
    <div class="form-card">
        <div class="form-content">
            <div class="form-header">
                <h1>Recuperar Contraseña</h1>
                <p class="hero-copy">Ingresa el correo electrónico asociado a tu cuenta de <strong>SGC-Cosmetics</strong> y te enviaremos un código de seguridad para restablecerla.</p>
            </div>

            <%-- Mensajes de error --%>
            <% String error = (String) request.getAttribute("error"); %>
            <% if ("invalidEmail".equals(error)) { %>
                <div class="alert-box alert-error">
                    <span>⚠️ Por favor ingresa una dirección de correo electrónico válida.</span>
                </div>
            <% } else if ("userNotFound".equals(error)) { %>
                <div class="alert-box alert-error">
                    <span>⚠️ No se encontró ninguna cuenta registrada con el correo especificado.</span>
                </div>
            <% } else if ("dbError".equals(error)) { %>
                <div class="alert-box alert-error">
                    <span>⚠️ <%= request.getAttribute("errorMessage") != null ? request.getAttribute("errorMessage") : "Error al procesar la solicitud." %></span>
                </div>
            <% } %>

            <form id="recoverForm" class="form-grid" action="${pageContext.request.contextPath}/recuperar-password" method="post">
                <label for="email">
                    <span class="field-label">Correo Electrónico</span>
                    <input id="email"
                           name="email"
                           type="email"
                           placeholder="ejemplo@correo.com"
                           value="<%= request.getAttribute("emailIngresado") != null ? request.getAttribute("emailIngresado") : "" %>"
                           required
                           autofocus>
                </label>

                <button type="submit" class="btn-primary" id="btnSubmit">
                    Enviar Código de Seguridad
                </button>

                <div class="footer-link">
                    <span>¿Recordaste tu contraseña?</span>
                    <a href="${pageContext.request.contextPath}/login">Volver al inicio de sesión</a>
                </div>
            </form>
        </div>

        <div class="form-side-image-recover" aria-hidden="true">
            <div class="side-quote">
                <h2>SGC-Cosmetics</h2>
                <p>Tu belleza y bienestar en manos expertas. Cuidamos cada detalle para ofrecerte la mejor experiencia.</p>
            </div>
        </div>
    </div>
</div>

<script>
    // Validación de formulario en el cliente
    const recoverForm = document.getElementById('recoverForm');
    const emailInput = document.getElementById('email');
    const btnSubmit = document.getElementById('btnSubmit');

    recoverForm.addEventListener('submit', function(e) {
        const emailVal = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailVal)) {
            e.preventDefault();
            alert('Por favor introduce un formato de correo electrónico válido.');
            emailInput.focus();
            return false;
        }

        // Estado visual de carga
        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Enviando código...';
    });
</script>
</body>
</html>
