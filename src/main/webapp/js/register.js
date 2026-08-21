// Ensure a minimal global showSiteAlert exists for early-loaded pages
if (typeof window.showSiteAlert !== 'function') {
    window.showSiteAlert = function (message, type = 'info', timeout = 4200) {
        try {
            if (window.appointmentsSystem && typeof window.appointmentsSystem.showSiteAlert === 'function') {
                return window.appointmentsSystem.showSiteAlert(message, type, timeout);
            }
        } catch (e) { /* ignore */ }

        try {
            let container = document.getElementById('sgc-alert-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'sgc-alert-container';
                container.className = 'sgc-alert-container';
                document.body.appendChild(container);
            }
            const el = document.createElement('div');
            el.className = 'sgc-alert ' + (type || 'info');
            el.textContent = message || '';
            container.appendChild(el);
            setTimeout(() => {
                el.style.transition = 'all 260ms ease';
                el.style.opacity = '0';
                setTimeout(() => { try { el.remove(); } catch (e) {} }, 300);
            }, timeout);
            return el;
        } catch (e) { /* ignore */ }
        return null;
    };
}

if (!window.location.pathname.includes('/.idea/')) {
    const base = document.createElement('base');
    base.href = './.idea/';
    document.head.appendChild(base);
}

// ---------------------------------------------------------
// VALIDACIONES DE FORMULARIO DE REGISTRO (Adaptado a Servidor)
// ---------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        // Formateo en vivo del teléfono (solo permite números y máximo 14 dígitos)
        const phoneInput = document.getElementById('telefono');
        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                const nextValue = phoneInput.value.replace(/\D/g, '').slice(0, 14);
                if (phoneInput.value !== nextValue) {
                    phoneInput.value = nextValue;
                }
            });
        }

        // Interceptamos el envío del formulario
        registerForm.addEventListener('submit', function (event) {
            const nombre = (document.getElementById('nombre')?.value || '').trim();
            const apellido = (document.getElementById('apellido')?.value || '').trim();
            const email = (document.getElementById('email')?.value || '').trim();
            const rawPhone = (document.getElementById('telefono')?.value || '').trim();
            const fecha = document.getElementById('fecha')?.value || '';
            const password = document.getElementById('password')?.value || '';
            const confirmPassword = document.getElementById('confirmPassword')?.value || '';

            // 1. Validar campos vacíos
            const missing = [];
            if (!nombre) missing.push('Nombre');
            if (!apellido) missing.push('Apellido');
            if (!email) missing.push('Correo');
            if (!rawPhone) missing.push('Teléfono');
            if (!fecha) missing.push('Fecha de nacimiento');
            if (!password) missing.push('Contraseña');
            if (!confirmPassword) missing.push('Confirmar contraseña');

            if (missing.length > 0) {
                event.preventDefault();
                window.showSiteAlert('Completa los campos: ' + missing.join(', '), 'warning');
                return;
            }

            // 2. Validar formato de nombre y apellido
            const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-]+$/;
            if (!namePattern.test(nombre) || !namePattern.test(apellido)) {
                event.preventDefault();
                window.showSiteAlert('El nombre y apellido contienen caracteres inválidos.', 'warning');
                return;
            }

            // 3. Validar formato de correo electrónico
            const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
            if (!emailPattern.test(email)) {
                event.preventDefault();
                window.showSiteAlert('Ingresa un correo electrónico válido.', 'error');
                return;
            }

            // 4. Validar teléfono (longitud de 8 a 14 dígitos)
            const phoneOnlyDigits = rawPhone.replace(/\D/g, '');
            const phonePattern = /^\d{8,14}$/;
            if (!phonePattern.test(phoneOnlyDigits)) {
                event.preventDefault();
                window.showSiteAlert('El teléfono debe tener entre 8 y 14 dígitos.', 'warning');
                return;
            }

            // 5. Validar reglas de la contraseña (letras/números, 4 a 16 caracteres)
            const passwordPattern = /^[A-Za-z0-9]{4,16}$/;
            if (!passwordPattern.test(password)) {
                event.preventDefault();
                window.showSiteAlert('La contraseña debe tener entre 4 y 16 caracteres y solo contener letras y números.', 'warning');
                return;
            }

            // 6. Validar coincidencia de contraseñas
            if (password !== confirmPassword) {
                event.preventDefault();
                window.showSiteAlert('Las contraseñas no coinciden.', 'error');
                return;
            }

            // 7. Validar Fecha de Nacimiento y Edad
            const birthDateObj = new Date(fecha);
            const today = new Date();

            if (Number.isNaN(birthDateObj.getTime())) {
                event.preventDefault();
                window.showSiteAlert('La fecha de nacimiento no es válida.', 'error');
                return;
            }

            if (birthDateObj > today) {
                event.preventDefault();
                window.showSiteAlert('La fecha de nacimiento no puede ser en el futuro.', 'error');
                return;
            }

            const age = today.getFullYear() - birthDateObj.getFullYear() -
                ((today.getMonth() < birthDateObj.getMonth() ||
                    (today.getMonth() === birthDateObj.getMonth() && today.getDate() < birthDateObj.getDate())) ? 1 : 0);

            if (age < 16 || age > 100) {
                event.preventDefault();
                window.showSiteAlert('Debes tener entre 16 y 100 años para registrarte.', 'warning');
                return;
            }

            // Si el código llega hasta aquí, significa que todo es válido.
            // NO usamos preventDefault().
            // El formulario viajará automáticamente a tu Servlet de Java.
        });
    }
});