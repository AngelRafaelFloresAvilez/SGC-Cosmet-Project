if (!window.location.pathname.includes('/.idea/')) {
  const base = document.createElement('base');
  base.href = './.idea/';
  document.head.appendChild(base);
}

window.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('loginPassword');
  const showPasswordCheckbox = document.getElementById('showPassword');
  const loginButton = document.getElementById('loginSubmitButton');

  if (passwordInput && showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener('change', function () {
      passwordInput.type = this.checked ? 'text' : 'password';
    });
  }

  if (loginButton) {
    loginButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      const email = (document.getElementById('loginEmail')?.value || '').trim();
      const password = document.getElementById('loginPassword')?.value || '';

      if (!email || !password) {
        window.showSiteAlert ? window.showSiteAlert('Ingresa tu correo y contraseña para iniciar sesión.', 'info') : alert('Ingresa tu correo y contraseña para iniciar sesión.');
        return;
      }

      if (window.appointmentsSystem && typeof window.appointmentsSystem.loginUser === 'function') {
        const result = window.appointmentsSystem.loginUser(email, password);
        if (!result.ok) {
          window.showSiteAlert ? window.showSiteAlert('Credenciales inválidas.', 'error') : alert('Credenciales inválidas.');
          return;
        }

        if (typeof window.appointmentsSystem.navigateByRole === 'function') {
          window.appointmentsSystem.navigateByRole(result.user.role);
          return;
        }
      }

      window.location.href = 'dashboard.html';
    });
  }
});
