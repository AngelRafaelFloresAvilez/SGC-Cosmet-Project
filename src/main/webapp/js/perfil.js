// ==========================================
//  Perfil del cliente — diseño de copia sobre servlets de demo
// ==========================================

let fotoBase64Nueva = null;
let citasCache = [];
let pagosCache = [];
let promocionesCache = [];
let historyPage = 1;
let paymentsPage = 1;
const HISTORY_PAGE_SIZE = 4;
const PAYMENTS_PAGE_SIZE = 3;

// ---------- Menú lateral / notificaciones ----------
function abrirMenu() {
  document.getElementById('sidebarMenu')?.classList.add('active');
  document.getElementById('menuOverlay')?.classList.add('active');
  document.querySelector('.menu-btn')?.classList.add('active');
}
function cerrarMenu() {
  document.getElementById('sidebarMenu')?.classList.remove('active');
  document.getElementById('menuOverlay')?.classList.remove('active');
  document.querySelector('.menu-btn')?.classList.remove('active');
}
function toggleMenu() {
  const menu = document.getElementById('sidebarMenu');
  if (menu && menu.classList.contains('active')) cerrarMenu();
  else abrirMenu();
}
function mostrarNotificaciones() {
  document.getElementById('notificationPanel')?.classList.toggle('active');
}

// ---------- Popup de alerta ----------
function mostrarAlerta(titulo, mensaje, esError = false) {
  const modal = document.getElementById('customAlertModal');
  const iconDiv = document.getElementById('customAlertIcon');
  const iconI = document.getElementById('customAlertIconI');
  const titleEl = document.getElementById('customAlertTitle');
  const msgEl = document.getElementById('customAlertMessage');
  if (!modal) { alert(mensaje); return; }
  if (esError) {
    iconDiv.className = 'custom-alert-icon error';
    iconI.className = 'fa-solid fa-triangle-exclamation';
  } else {
    iconDiv.className = 'custom-alert-icon success';
    iconI.className = 'fa-solid fa-check';
  }
  titleEl.innerText = titulo;
  msgEl.innerText = mensaje;
  modal.classList.add('active');
}
function cerrarAlerta() {
  document.getElementById('customAlertModal')?.classList.remove('active');
}

// ---------- Carga de datos ----------
async function cargarDatosPerfil() {
  try {
    const context = window.contextPath || '';
    const response = await fetch(`${context}/PerfilServlet?action=obtenerDatos`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();

    if (data.fotoPerfil && data.fotoPerfil.trim() !== '') {
      actualizarAvatares(data.fotoPerfil);
    }

    citasCache = data.citas || [];
    pagosCache = data.pagos || [];
    promocionesCache = data.promociones || [];

    renderHistorial();
    renderPagos();
    renderPromociones();
    actualizarAusencias();
  } catch (error) {
    console.error('Error al cargar datos del perfil:', error);
    const h = document.getElementById('historyList');
    const p = document.getElementById('paymentsList');
    if (h) h.innerHTML = `<div class="empty-state">No se pudo cargar el historial.</div>`;
    if (p) p.innerHTML = `<div class="empty-state">No se pudieron cargar los pagos.</div>`;
  }
}

function actualizarAvatares(url) {
  const img = document.getElementById('profileAvatarImg');
  const sidebar = document.getElementById('sidebarProfileImg');
  if (img) img.src = url;
  if (sidebar) sidebar.src = url;
  document.querySelectorAll('.user-profile .user-avatar img').forEach(i => i.src = url);
}

// ---------- Historial de citas (con paginación) ----------
function renderHistorial() {
  const cont = document.getElementById('historyList');
  const pag = document.getElementById('profileHistoryPagination');
  if (!cont) return;

  if (!citasCache.length) {
    cont.innerHTML = '<div class="empty-state">Aún no tienes historial de citas.</div>';
    if (pag) pag.innerHTML = '';
    return;
  }

  const pageCount = Math.max(1, Math.ceil(citasCache.length / HISTORY_PAGE_SIZE));
  historyPage = Math.min(Math.max(historyPage, 1), pageCount);
  const visibles = citasCache.slice((historyPage - 1) * HISTORY_PAGE_SIZE, historyPage * HISTORY_PAGE_SIZE);

  cont.innerHTML = visibles.map((c) => `
    <div class="history-item">
      <div>
        <strong>${c.nombreServicio || 'Tratamiento Estético'}</strong>
        <p>${c.fecha || ''} · ${c.hora || ''}</p>
      </div>
      <span class="history-badge">${c.estadoCita || 'Pendiente'}</span>
    </div>
  `).join('');

  if (pag) {
    pag.innerHTML = [
      `<button type="button" data-page="${Math.max(1, historyPage - 1)}">‹</button>`,
      ...Array.from({ length: pageCount }, (_, i) =>
        `<button type="button" data-page="${i + 1}" class="${i + 1 === historyPage ? 'active' : ''}">${i + 1}</button>`),
      `<button type="button" data-page="${Math.min(pageCount, historyPage + 1)}">›</button>`
    ].join('');
    pag.querySelectorAll('button').forEach((b) => {
      b.onclick = () => { historyPage = Number(b.dataset.page); renderHistorial(); };
    });
  }
}

// ---------- Historial de pagos (con paginación) ----------
function renderPagos() {
  const cont = document.getElementById('paymentsList');
  const pag = document.getElementById('profilePaymentsPagination');
  if (!cont) return;

  if (!pagosCache.length) {
    cont.innerHTML = '<div class="empty-state">No tienes pagos registrados.</div>';
    if (pag) pag.innerHTML = '';
    return;
  }

  const pageCount = Math.max(1, Math.ceil(pagosCache.length / PAYMENTS_PAGE_SIZE));
  paymentsPage = Math.min(Math.max(paymentsPage, 1), pageCount);
  const visibles = pagosCache.slice((paymentsPage - 1) * PAYMENTS_PAGE_SIZE, paymentsPage * PAYMENTS_PAGE_SIZE);

  cont.innerHTML = visibles.map((p) => `
    <div class="payment-item">
      <div>
        <strong>${p.metodoPago || 'Pago'}</strong>
        <p>$${Number(p.montoTotal || 0).toFixed(2)} MXN</p>
      </div>
      <span class="payment-status">${p.estadoPago || 'Completado'}</span>
    </div>
  `).join('');

  if (pag) {
    pag.innerHTML = [
      `<button type="button" data-payment-page="${Math.max(1, paymentsPage - 1)}">‹</button>`,
      `<button type="button" data-payment-page="${Math.min(pageCount, paymentsPage + 1)}">›</button>`
    ].join('');
    pag.querySelectorAll('button').forEach((b) => {
      b.onclick = () => { paymentsPage = Number(b.dataset.paymentPage); renderPagos(); };
    });
  }
}

// ---------- Promociones ----------
function renderPromociones() {
  const cont = document.getElementById('promotionsList');
  if (!cont) return;
  if (!promocionesCache.length) {
    cont.innerHTML = '<div class="empty-state">No hay promociones disponibles.</div>';
    return;
  }
  cont.innerHTML = promocionesCache.map((promo) => `
    <div class="promo-item">
      <div>
        <strong>${promo.nombre || 'Promoción'}</strong>
        <p>${promo.descripcion || ''}</p>
        <small>Válido hasta ${promo.fechaFin || ''}</small>
      </div>
      <button class="promo-btn" type="button">${promo.descuento || 'Ver'}</button>
    </div>
  `).join('');
}

// ---------- Ausencias / estado ----------
function actualizarAusencias() {
  const canceladas = citasCache.filter(c => (c.estadoCita || '').toLowerCase() === 'cancelada').length;
  const countEl = document.getElementById('profileCancelledCount');
  if (countEl) countEl.innerText = canceladas;
  const bar = document.querySelector('.absence-bar span');
  if (bar) bar.style.width = `${Math.min(100, (canceladas / 3) * 100)}%`;

  const proxima = citasCache.find(c => ['pendiente', 'confirmada'].includes((c.estadoCita || '').toLowerCase()));
  const next = document.getElementById('profileNextAppointment');
  const nextCompact = document.getElementById('profileNextAppointmentCompact');
  if (proxima) {
    if (next) next.innerText = `${proxima.nombreServicio || 'Servicio'} - ${proxima.fecha} (${proxima.hora})`;
    if (nextCompact) nextCompact.innerText = proxima.fecha;
  }
}

// ---------- Edición de perfil ----------
function toDateInputValue(value) {
  const n = String(value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(n)) return n;
  const m = n.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
}

function configurarEdicionPerfil() {
  const editBtn = document.getElementById('editProfileBtn');
  const saveBtn = document.getElementById('saveProfileBtn');
  const cancelBtn = document.getElementById('cancelProfileBtn');
  if (!editBtn || !saveBtn || !cancelBtn) return;

  const emailEl = document.querySelector('.profile-email');
  const phoneEl = document.querySelector('.profile-phone');
  const birthEl = document.querySelector('.profile-birth');

  function enterEdit() {
    [emailEl, phoneEl, birthEl].forEach(el => { if (el) el.dataset.value = el.textContent.trim(); });
    if (emailEl) emailEl.innerHTML = `<input id="editEmailInput" type="email" value="${emailEl.dataset.value === 'Sin registro' ? '' : emailEl.dataset.value}">`;
    if (phoneEl) phoneEl.innerHTML = `<input id="editPhoneInput" type="tel" value="${phoneEl.dataset.value === 'Sin registro' ? '' : phoneEl.dataset.value}">`;
    if (birthEl) birthEl.innerHTML = `<input id="editBirthInput" type="date" value="${toDateInputValue(birthEl.dataset.value)}">`;
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
  }

  function exitEdit(discard, data) {
    if (discard) {
      if (emailEl) emailEl.textContent = emailEl.dataset.value || 'Sin registro';
      if (phoneEl) phoneEl.textContent = phoneEl.dataset.value || 'Sin registro';
      if (birthEl) birthEl.textContent = birthEl.dataset.value || 'Sin registro';
    } else if (data) {
      if (emailEl) emailEl.textContent = data.correo || 'Sin registro';
      if (phoneEl) phoneEl.textContent = data.telefono || 'Sin registro';
      if (birthEl) birthEl.textContent = data.fecha || 'Sin registro';
    }
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    fotoBase64Nueva = null;
  }

  editBtn.addEventListener('click', enterEdit);
  cancelBtn.addEventListener('click', () => exitEdit(true));

  saveBtn.addEventListener('click', async () => {
    const nombre = (document.querySelector('.profile-name')?.textContent || '').trim();
    const correo = (document.getElementById('editEmailInput')?.value || '').trim();
    const telefono = (document.getElementById('editPhoneInput')?.value || '').trim();
    const fecha = document.getElementById('editBirthInput')?.value || '';

    const errores = [];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errores.push('El correo no tiene un formato válido.');
    if (telefono && telefono.replace(/\D/g, '').length < 10) errores.push('El teléfono debe tener al menos 10 dígitos.');
    if (fecha) {
      const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
      const b = new Date(`${fecha}T00:00:00`);
      if (Number.isNaN(b.getTime()) || b > hoy || b.getFullYear() < 1900) errores.push('La fecha de nacimiento no es válida.');
    }
    if (errores.length) { mostrarAlerta('Datos inválidos', errores.join(' '), true); return; }

    try {
      const context = window.contextPath || '';
      const params = new URLSearchParams();
      params.append('action', 'actualizarPerfil');
      params.append('nombre', nombre);
      params.append('correo', correo);
      params.append('telefono', telefono);
      params.append('fechaNacimiento', fecha);
      if (fotoBase64Nueva) params.append('fotoPerfil', fotoBase64Nueva);

      const response = await fetch(`${context}/PerfilServlet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const res = await response.json();
      if (res.success) {
        exitEdit(false, { correo, telefono, fecha });
        mostrarAlerta('¡Perfil Actualizado!', 'Tus datos han sido guardados correctamente.', false);
      } else {
        mostrarAlerta('Error al guardar', res.error || 'No se pudo actualizar.', true);
      }
    } catch (err) {
      console.error('Error guardando perfil:', err);
      mostrarAlerta('Error del servidor', 'Ocurrió un fallo de conexión al guardar.', true);
    }
  });
}

// ---------- Inicialización ----------
function initPerfil() {
  document.querySelector('.menu-btn')?.addEventListener('click', toggleMenu);
  document.getElementById('menuOverlay')?.addEventListener('click', cerrarMenu);
  document.querySelector('[data-notification-toggle]')?.addEventListener('click', mostrarNotificaciones);
  document.getElementById('customAlertCloseBtn')?.addEventListener('click', cerrarAlerta);

  const inputAvatar = document.getElementById('profileAvatarInput');
  if (inputAvatar) {
    inputAvatar.addEventListener('change', function () {
      const file = inputAvatar.files && inputAvatar.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => { fotoBase64Nueva = e.target.result; actualizarAvatares(fotoBase64Nueva); };
      reader.readAsDataURL(file);
    });
  }

  configurarEdicionPerfil();
  cargarDatosPerfil();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPerfil);
} else {
  initPerfil();
}
