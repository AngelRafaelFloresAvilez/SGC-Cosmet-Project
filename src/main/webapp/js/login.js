window.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('loginPassword');
    const showPasswordCheckbox = document.getElementById('showPassword');
    const loginForm = document.getElementById('loginForm');

    // Mantenemos la función visual de mostrar/ocultar contraseña
    if (passwordInput && showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener('change', function () {
            passwordInput.type = this.checked ? 'text' : 'password';
        });
    }

    // Interceptamos el formulario para validar que no esté vacío y el formato de correo
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            const email = (document.getElementById('loginEmail')?.value || '').trim();
            const password = document.getElementById('loginPassword')?.value || '';

            // 1. Validación de campos vacíos
            if (!email || !password) {
                // Detenemos el envío porque faltan datos
                event.preventDefault();

                if (window.showSiteAlert) {
                    window.showSiteAlert('Ingresa tu correo y contraseña para iniciar sesión.', 'warning');
                } else {
                    alert('Ingresa tu correo y contraseña para iniciar sesión.');
                }
                return;
            }

            // 2. Validación de formato de correo electrónico
            const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
            if (!emailPattern.test(email)) {
                // Detenemos el envío porque el formato es incorrecto
                event.preventDefault();

                if (window.showSiteAlert) {
                    window.showSiteAlert('Ingresa un correo electrónico válido.', 'error');
                } else {
                    alert('Ingresa un correo electrónico válido.');
                }
                return;
            }

            // Si llegamos aquí, el formulario tiene datos y el correo tiene buen formato.
            // NO ponemos preventDefault().
            // El formulario viajará automáticamente a tu AutenticarUsuarioServlet.
        });
    }
});