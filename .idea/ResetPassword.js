(function () {
  const SEND_STORE_KEY = 'sgc_password_reset_v1';
  function getUsers() {
    try {
      return (window.appointmentsSystem && typeof window.appointmentsSystem.readUsers === 'function')
        ? window.appointmentsSystem.readUsers()
        : JSON.parse(localStorage.getItem('sgc_auth_users_v1') || '[]');
    } catch (e) { return []; }
  }

  function saveResetToken(token, email) {
    const store = JSON.parse(localStorage.getItem(SEND_STORE_KEY) || '{}');
    store[token] = { email: email.toLowerCase(), expires: Date.now() + 1000 * 60 * 30 }; // 30min
    localStorage.setItem(SEND_STORE_KEY, JSON.stringify(store));
  }

  function buildResetLink(token, email) {
    const relative = window.location.pathname.includes('/.idea/') ? 'restablecer.html' : '.idea/restablecer.html';
    return relative + '?token=' + encodeURIComponent(token) + '&email=' + encodeURIComponent(email);
  }

  function openGmailCompose(to, subject, body) {
    const url = 'https://mail.google.com/mail/?view=cm&fs=1' +
      '&to=' + encodeURIComponent(to) +
      '&su=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    // open in a new tab/window; many browsers may block popups, so caller should handle fallback
    window.open(url, '_blank');
  }

  const sendBtn = document.querySelector('.reset-btn');
  if (!sendBtn) return;

  sendBtn.addEventListener('click', function () {
    const emailEl = document.getElementById('email');
    const email = (emailEl?.value || '').trim().toLowerCase();
    if (!email) { alert('Ingresa tu correo electrónico.'); return; }

    // Basic validation: must contain @ and .
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      alert('Ingresa un correo válido.');
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.email && u.email.toLowerCase() === email);
    if (!user) {
      alert('No existe una cuenta asociada a ese correo.');
      return;
    }

    const token = Math.random().toString(36).slice(2, 12);
    saveResetToken(token, email);

    const link = buildResetLink(token, email);

    // Compose a Gmail draft (user must send it). Also show confirmation.
    const subject = 'Restablece tu contraseña';
    // Prefer absolute URL when served over HTTP(S); otherwise provide relative link
    const displayLink = (window.location.protocol && window.location.protocol.indexOf('http') === 0)
      ? (window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/') + link)
      : link;
    const body = 'Hola,\n\nHaz clic en el siguiente enlace para restablecer tu contraseña (válido 30 minutos):\n\n' + displayLink + '\n\nSi no pediste este enlace, ignora este correo.';

    // Send via server API if available, otherwise fallback to Gmail compose
    const API = window.SGC_EMAIL_API || 'http://localhost:4000/send-reset';
    const absoluteLink = (window.location.protocol && window.location.protocol.indexOf('http') === 0)
      ? (window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/') + link)
      : link;

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: email, link: absoluteLink })
    }).then((res) => res.json()).then((json) => {
      if (json && json.ok) {
        showSentConfirmation();
      } else {
        // fallback to opening compose if server failed
        try { openGmailCompose(email, subject, body); } catch (e) { window.open('mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body), '_blank'); }
        showSentConfirmation();
      }
    }).catch((err) => {
      // network error — fallback to compose
      try { openGmailCompose(email, subject, body); } catch (e) { window.open('mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body), '_blank'); }
      showSentConfirmation();
    });
  });
})();

function showSentConfirmation() {
  // avoid duplicate modal
  if (document.getElementById('sgc-reset-sent-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'sgc-reset-sent-modal';
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.background = 'rgba(0,0,0,0.45)';
  modal.style.zIndex = '9999';

  const card = document.createElement('div');
  card.style.background = '#fff';
  card.style.padding = '20px 24px';
  card.style.borderRadius = '12px';
  card.style.maxWidth = '420px';
  card.style.width = '90%';
  card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';

  const h = document.createElement('h3');
  h.textContent = 'Enlace enviado';
  h.style.margin = '0 0 8px 0';
  h.style.fontFamily = 'Inter, sans-serif';

  const p = document.createElement('p');
  p.textContent = 'Hemos preparado un correo con el enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y carpeta de SPAM.';
  p.style.margin = '0 0 16px 0';
  p.style.color = '#444';

  const btn = document.createElement('button');
  btn.textContent = 'Ir a iniciar sesión';
  btn.style.background = 'linear-gradient(135deg, #a88f67 0%, #7e6949 100%)';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.padding = '10px 14px';
  btn.style.borderRadius = '10px';
  btn.style.cursor = 'pointer';

  btn.addEventListener('click', function () {
    const redirect = window.location.pathname.includes('/.idea/') ? 'Loggin.html' : '.idea/Loggin.html';
    document.body.removeChild(modal);
    window.location.href = redirect;
  });

  card.appendChild(h);
  card.appendChild(p);
  card.appendChild(btn);
  modal.appendChild(card);
  document.body.appendChild(modal);
}
