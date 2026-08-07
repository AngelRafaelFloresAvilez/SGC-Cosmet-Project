(function () {
  const STORE_KEY = 'sgc_password_reset_v1';
  const AUTH_KEY = 'sgc_auth_users_v1';

  function readTokens() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch (e) { return {}; }
  }
  function removeToken(token) {
    try {
      const s = readTokens();
      delete s[token];
      localStorage.setItem(STORE_KEY, JSON.stringify(s));
    } catch (e) { }
  }

  function saveNewPasswordForEmail(email, password) {
    try {
      const users = JSON.parse(localStorage.getItem(AUTH_KEY) || '[]');
      const idx = users.findIndex(u => u.email && u.email.toLowerCase() === email.toLowerCase());
      if (idx === -1) return false;
      users[idx].password = password;
      localStorage.setItem(AUTH_KEY, JSON.stringify(users));
      return true;
    } catch (e) { return false; }
  }

  function getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  const token = getParam('token');
  const email = (getParam('email') || '').toLowerCase();
  const content = document.querySelector('.reset-content');
  const btn = document.querySelector('.reset-btn');

  if (!token || !email) {
    if (content) content.innerHTML = '<p>Enlace inválido o incompleto. Solicita un nuevo enlace desde la pantalla de recuperación.</p>';
  } else {
    const tokens = readTokens();
    const entry = tokens[token];
    if (!entry || entry.email !== email || entry.expires < Date.now()) {
      if (content) content.innerHTML = '<p>Enlace inválido o caducado. Solicita un nuevo enlace desde la pantalla de recuperación.</p>';
    } else {
      // valid token — bind reset action
      if (btn) {
        btn.addEventListener('click', function () {
          const pw = document.getElementById('new-password')?.value || '';
          const pw2 = document.getElementById('confirm-password')?.value || '';
          if (!pw || !pw2) { alert('Completa ambos campos de contraseña.'); return; }
          if (pw !== pw2) { alert('Las contraseñas no coinciden.'); return; }
          if (!/^[A-Za-z0-9]{4,16}$/.test(pw)) { alert('La contraseña debe tener entre 4 y 16 caracteres alfanuméricos.'); return; }
          const ok = saveNewPasswordForEmail(email, pw);
          if (!ok) { alert('No se pudo actualizar la contraseña. Intenta de nuevo.'); return; }
          removeToken(token);
          alert('Contraseña restablecida correctamente. Ahora puedes iniciar sesión.');
          const redirect = window.location.pathname.includes('/.idea/') ? 'Loggin.html' : '.idea/Loggin.html';
          window.location.href = redirect;
        });
      }
    }
  }
})();
