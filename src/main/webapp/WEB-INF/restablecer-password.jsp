<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña - SGC-Cosmetics</title>

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
        .code-input-field {
            font-size: 24px !important;
            letter-spacing: 8px !important;
            text-align: center !important;
            font-weight: 700 !important;
            font-family: 'Courier New', monospace !important;
            background-color: #F4F7F2 !important;
            border: 2px dashed #8EA77F !important;
        }
        .password-strength-bar {
            height: 4px;
            width: 100%;
            background-color: #E2ECE0;
            border-radius: 2px;
            margin-top: 6px;
            overflow: hidden;
        }
        .password-strength-fill {
            height: 100%;
            width: 0%;
            transition: width 0.3s ease, background-color 0.3s ease;
        }
        .password-match-msg {
            font-size: 12px;
            margin-top: 4px;
            display: block;
        }
        .form-side-image-reset {
            min-height: 640px;
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
                <h1>Nueva Contraseña</h1>
                <p class="hero-copy">Introduce el código de 6 dígitos que enviamos a tu correo y define tu nueva clave de acceso.</p>
            </div>

            <%-- Mensajes de información --%>
            <% String info = (String) request.getAttribute("info"); %>
            <% if ("codeSent".equals(info)) { %>
                <div class="alert-box alert-info">
                    <span>📩 <strong>¡Código enviado!</strong> Revisa tu bandeja de entrada o spam. Es válido por 15 minutos.</span>
                </div>
            <% } %>

            <%-- Mensajes de error --%>
            <% String error = (String) request.getAttribute("error"); %>
            <% if ("invalidCode".equals(error)) { %>
                <div class="alert-box alert-error">
                    <span>⚠️ El código de verificación es incorrecto o ha expirado. Por favor solicita uno nuevo.</span>
                </div>
            <% } else if ("passwordMismatch".equals(error)) { %>
                <div class="alert-box alert-error">
                    <span>⚠️ Las contraseñas ingresadas no coinciden.</span>
                </div>
            <% } else if ("shortPassword".equals(error)) { %>
                <div class="alert-box alert-error">
                    <span>⚠️ La contraseña debe tener al menos 6 caracteres.</span>
                </div>
            <% } else if ("emptyCode".equals(error)) { %>
                <div class="alert-box alert-error">
                    <span>⚠️ Debes ingresar el código de 6 dígitos recibido por correo.</span>
                </div>
            <% } else if ("dbError".equals(error)) { %>
                <div class="alert-box alert-error">
                    <span>⚠️ <%= request.getAttribute("errorMessage") != null ? request.getAttribute("errorMessage") : "Error al actualizar la contraseña." %></span>
                </div>
            <% } %>

            <form id="resetForm" class="form-grid" action="${pageContext.request.contextPath}/restablecer-password" method="post">
                <label for="codigo">
                    <span class="field-label">Código de 6 dígitos</span>
                    <input id="codigo"
                           name="codigo"
                           type="text"
                           class="code-input-field"
                           placeholder="000000"
                           maxlength="6"
                           pattern="[0-9]{6}"
                           value="<%= request.getAttribute("codigoIngresado") != null ? request.getAttribute("codigoIngresado") : "" %>"
                           required
                           autofocus>
                </label>

                <label for="nuevaPassword">
                    <span class="field-label">Nueva Contraseña (mínimo 6 caracteres)</span>
                    <input id="nuevaPassword"
                           name="nuevaPassword"
                           type="password"
                           placeholder="Ingresa tu nueva contraseña"
                           minlength="6"
                           required>
                    <div class="password-strength-bar">
                        <div class="password-strength-fill" id="strengthFill"></div>
                    </div>
                </label>

                <label for="confirmarPassword">
                    <span class="field-label">Confirmar Nueva Contraseña</span>
                    <input id="confirmarPassword"
                           name="confirmarPassword"
                           type="password"
                           placeholder="Repite tu nueva contraseña"
                           minlength="6"
                           required>
                    <span id="matchMsg" class="password-match-msg"></span>
                </label>

                <div class="form-options">
                    <label class="checkbox-row" for="showPasswords">
                        <input id="showPasswords" type="checkbox">
                        <span>Mostrar contraseñas</span>
                    </label>
                    <a href="${pageContext.request.contextPath}/recuperar-password" class="secondary-link">¿No recibiste el código?</a>
                </div>

                <button type="submit" class="btn-primary" id="btnSubmit">
                    Actualizar Contraseña
                </button>

                <div class="footer-link">
                    <span>¿Quieres cancelar?</span>
                    <a href="${pageContext.request.contextPath}/login">Volver al inicio de sesión</a>
                </div>
            </form>
        </div>

        <div class="form-side-image-reset" aria-hidden="true">
            <div class="side-quote">
                <h2>SGC-Cosmetics</h2>
                <p>Protegemos la seguridad de tu cuenta con los mejores estándares de verificación.</p>
            </div>
        </div>
    </div>
</div>

<script>
    const resetForm = document.getElementById('resetForm');
    const codigoInput = document.getElementById('codigo');
    const nuevaPassword = document.getElementById('nuevaPassword');
    const confirmarPassword = document.getElementById('confirmarPassword');
    const showPasswordsCheckbox = document.getElementById('showPasswords');
    const strengthFill = document.getElementById('strengthFill');
    const matchMsg = document.getElementById('matchMsg');
    const btnSubmit = document.getElementById('btnSubmit');

    // Toggle de visibilidad de contraseñas
    showPasswordsCheckbox.addEventListener('change', function () {
        const type = this.checked ? 'text' : 'password';
        nuevaPassword.type = type;
        confirmarPassword.type = type;
    });

    // Indicador de fortaleza de contraseña
    nuevaPassword.addEventListener('input', function() {
        const val = this.value;
        let score = 0;
        if (val.length >= 6) score += 30;
        if (val.length >= 8) score += 20;
        if (/[A-Z]/.test(val)) score += 25;
        if (/[0-9]/.test(val)) score += 25;

        strengthFill.style.width = score + '%';
        if (score < 40) {
            strengthFill.style.backgroundColor = '#E02424';
        } else if (score < 75) {
            strengthFill.style.backgroundColor = '#D4A373';
        } else {
            strengthFill.style.backgroundColor = '#526B4A';
        }
        checkMatch();
    });

    // Indicador en tiempo real de coincidencia
    confirmarPassword.addEventListener('input', checkMatch);

    function checkMatch() {
        if (!confirmarPassword.value) {
            matchMsg.textContent = '';
            return;
        }
        if (nuevaPassword.value === confirmarPassword.value) {
            matchMsg.textContent = '✓ Las contraseñas coinciden';
            matchMsg.style.color = '#166534';
        } else {
            matchMsg.textContent = '✗ Las contraseñas no coinciden';
            matchMsg.style.color = '#9B1C1C';
        }
    }

    // Validación al enviar el formulario
    resetForm.addEventListener('submit', function(e) {
        if (codigoInput.value.trim().length !== 6) {
            e.preventDefault();
            alert('El código de verificación debe contener exactamente 6 dígitos numéricos.');
            codigoInput.focus();
            return false;
        }
        if (nuevaPassword.value.length < 6) {
            e.preventDefault();
            alert('La nueva contraseña debe tener al menos 6 caracteres.');
            nuevaPassword.focus();
            return false;
        }
        if (nuevaPassword.value !== confirmarPassword.value) {
            e.preventDefault();
            alert('Las contraseñas no coinciden. Por favor verifícalas.');
            confirmarPassword.focus();
            return false;
        }

        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Actualizando contraseña...';
    });
</script>
</body>
</html>
