// ==========================================
//  Mis Citas — diseño de copia sobre servlets de demo
// ==========================================

let misCitas = [];
let tabActual = 'pending';
const paginaPorTab = { pending: 1, previous: 1, cancelled: 1 };
const PAGE_SIZE = 3;
let citaACancelarId = null;
let ratingCitaSeleccionada = null;
let ratingValor = 0;

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=160';

// ---------- Menú ----------
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
  if (menu && menu.classList.contains('active')) cerrarMenu(); else abrirMenu();
}

// ---------- Alerta ----------
function mostrarAlerta(titulo, mensaje, esError = false) {
  const modal = document.getElementById('customAlertModal');
  if (!modal) { alert(mensaje); return; }
  const iconDiv = document.getElementById('customAlertIcon');
  const iconI = document.getElementById('customAlertIconI');
  iconDiv.className = 'custom-alert-icon ' + (esError ? 'error' : 'success');
  iconI.className = 'fa-solid ' + (esError ? 'fa-triangle-exclamation' : 'fa-check');
  document.getElementById('customAlertTitle').innerText = titulo;
  document.getElementById('customAlertMessage').innerText = mensaje;
  modal.classList.add('active');
}
function cerrarAlerta() { document.getElementById('customAlertModal')?.classList.remove('active'); }

// ---------- Mapeo de estados ----------
function statusKey(estado) {
  const st = (estado || '').toLowerCase();
  if (st.includes('cancel')) return 'cancelled';
  if (st.includes('complet') || st.includes('realiz') || st.includes('atend')) return 'previous';
  if (st.includes('confirm')) return 'confirmed';
  return 'pending';
}
function categoria(estado) {
  const k = statusKey(estado);
  return k === 'confirmed' ? 'pending' : k;
}
function statusLabel(estado) {
  switch (statusKey(estado)) {
    case 'cancelled': return 'Cancelada';
    case 'previous': return 'Completado';
    case 'confirmed': return 'Confirmada';
    default: return 'Pendiente';
  }
}

// ---------- Carga ----------
async function cargarCitas() {
  try {
    const context = window.contextPath || '';
    const res = await fetch(`${context}/CitasServlet?action=obtenerCitas`, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    misCitas = await res.json();
    actualizarResumen();
    render();
  } catch (e) {
    console.error('Error al cargar citas:', e);
    const cont = document.getElementById('appointmentsList');
    if (cont) cont.innerHTML = '<div class="empty-state">Ocurrió un error al cargar tus citas.</div>';
  }
}

function actualizarResumen() {
  const cuenta = (cat) => misCitas.filter(c => categoria(c.estado) === cat).length;
  const setText = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
  setText('pendingCount', cuenta('pending'));
  setText('previousCount', cuenta('previous'));
  setText('cancelledSummaryCount', cuenta('cancelled'));
  setText('cancelledCount', cuenta('cancelled'));

  const canceladas = cuenta('cancelled');
  const countEl = document.querySelector('.profile-cancel-count');
  if (countEl) countEl.innerText = canceladas;
  const bar = document.querySelector('.profile-absence-progress');
  if (bar) bar.style.width = `${Math.min(100, (canceladas / 3) * 100)}%`;
}

// ---------- Render lista ----------
function render() {
  const list = document.getElementById('appointmentsList');
  const pagination = document.getElementById('appointmentPagination');
  cerrarDetalle();
  if (!list) return;

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.statusTab === tabActual);
  });

  const filtradas = misCitas.filter(c => categoria(c.estado) === tabActual);
  if (!filtradas.length) {
    list.innerHTML = '<div class="empty-state">No hay citas en esta sección.</div>';
    if (pagination) pagination.innerHTML = '';
    return;
  }

  const pageCount = Math.max(1, Math.ceil(filtradas.length / PAGE_SIZE));
  let page = Math.min(Math.max(paginaPorTab[tabActual] || 1, 1), pageCount);
  paginaPorTab[tabActual] = page;
  const items = filtradas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  list.innerHTML = items.map((c) => {
    const k = statusKey(c.estado);
    const acciones = k === 'pending' || k === 'confirmed'
      ? `<span class="appointment-cancel-trigger" role="button" tabindex="0" data-cancel-id="${c.id}" aria-label="Cancelar cita"><i class="fa-solid fa-xmark"></i></span>`
      : (k === 'previous'
        ? `<span class="appointment-favorite-trigger" role="button" tabindex="0" data-rate-id="${c.id}" aria-label="Calificar"><i class="fa-solid fa-star"></i></span>`
        : '');
    return `
      <button class="appointment-item" data-appointment-id="${c.id}">
        <img class="appointment-item-image" src="${DEFAULT_IMG}" alt="">
        <div class="appointment-item-body">
          <div class="appointment-item-head">
            <div><strong>${c.servicio}</strong><small>Servicio estético.</small></div>
            <span class="appointment-badge appointment-status-${k}">${statusLabel(c.estado)}</span>
          </div>
          <div class="appointment-item-meta"><span><i class="fa-regular fa-calendar"></i> Fecha<br>${c.fecha}</span><span><i class="fa-regular fa-clock"></i> Hora<br>${c.hora}</span><span><i class="fa-regular fa-user"></i> Profesional<br>Disponible</span></div>
        </div>
        <span class="appointment-item-actions appointment-actions-${k}"><i class="fa-regular fa-eye"></i>${acciones}</span>
      </button>`;
  }).join('');

  if (pagination) {
    pagination.innerHTML = [
      `<button type="button" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>‹</button>`,
      ...Array.from({ length: pageCount }, (_, i) => `<button type="button" class="${i + 1 === page ? 'active' : ''}" data-page="${i + 1}">${i + 1}</button>`),
      `<button type="button" data-page="${page + 1}" ${page === pageCount ? 'disabled' : ''}>›</button>`
    ].join('');
    pagination.querySelectorAll('button:not(:disabled)').forEach(b => {
      b.onclick = () => { paginaPorTab[tabActual] = Number(b.dataset.page); render(); };
    });
  }

  list.querySelectorAll('.appointment-item').forEach(btn => {
    btn.querySelector('.appointment-cancel-trigger')?.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirModalCancelar(e.currentTarget.dataset.cancelId);
    });
    btn.querySelector('.appointment-favorite-trigger')?.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirModalRating(e.currentTarget.dataset.rateId);
    });
    btn.addEventListener('click', () => mostrarDetalle(btn.dataset.appointmentId));
  });
}

// ---------- Detalle ----------
function cerrarDetalle() {
  const panel = document.getElementById('appointmentDetailPanel');
  const detail = document.getElementById('appointmentDetail');
  panel?.classList.remove('is-open');
  panel?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('detail-open');
  if (detail) detail.innerHTML = '<div class="empty-state">Selecciona una cita para ver su información.</div>';
}

function mostrarDetalle(id) {
  const c = misCitas.find(x => x.id == id);
  if (!c) return;
  const panel = document.getElementById('appointmentDetailPanel');
  const detail = document.getElementById('appointmentDetail');
  const k = statusKey(c.estado);
  const statusClass = k === 'cancelled' ? 'appointment-status-cancelled' : 'appointment-status-confirmed';
  const duracion = c.duracion ? `${c.duracion}` : '60 minutos';

  panel?.classList.add('is-open');
  panel?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('detail-open');

  detail.innerHTML = `
    <div class="detail-card">
      <div class="detail-card-head">
        <h3>Resumen de la cita</h3>
        <button type="button" class="detail-close" aria-label="Cerrar información"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="appointment-summary-service">
        <img src="${DEFAULT_IMG}" alt="${c.servicio}" class="appointment-summary-image">
        <div class="appointment-summary-copy"><h4>${c.servicio}</h4><p>Servicio estético</p><span class="appointment-badge ${statusClass}">${statusLabel(c.estado)}</span></div>
      </div>
      <div class="appointment-summary-meta">
        <div><i class="fa-regular fa-calendar"></i><span>Fecha<strong>${c.fecha}</strong></span></div>
        <div><i class="fa-regular fa-clock"></i><span>Hora<strong>${c.hora}</strong></span></div>
        <div><i class="fa-regular fa-user"></i><span>Profesional<strong>Disponible</strong></span></div>
      </div>
      <div class="appointment-summary-info">
        <h4>Información de la cita</h4>
        <div><span>Estado</span><strong class="appointment-badge ${statusClass}">${statusLabel(c.estado)}</strong></div>
        <div><span>Duración</span><strong>${duracion}</strong></div>
        <div><span>Precio</span><strong>${c.precio || '--'}</strong></div>
      </div>
      ${(k === 'pending' || k === 'confirmed') ? `<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn-cancel" data-cancel-id="${c.id}"><i class="fa-solid fa-ban"></i> Cancelar cita</button></div>` : ''}
    </div>`;

  detail.querySelector('.detail-close')?.addEventListener('click', (e) => { e.stopPropagation(); cerrarDetalle(); });
  detail.querySelector('.btn-cancel')?.addEventListener('click', (e) => abrirModalCancelar(e.currentTarget.dataset.cancelId));
}

// ---------- Cancelar ----------
function abrirModalCancelar(id) {
  citaACancelarId = id;
  const sel = document.getElementById('cancelReason');
  if (sel) sel.value = '';
  document.getElementById('cancelAppointmentModal')?.classList.add('active');
}
function cerrarModalCancelar() {
  citaACancelarId = null;
  document.getElementById('cancelAppointmentModal')?.classList.remove('active');
}
async function confirmarCancelacion() {
  if (!citaACancelarId) return;
  try {
    const context = window.contextPath || '';
    const params = new URLSearchParams();
    params.append('action', 'cancelarCita');
    params.append('id', citaACancelarId);
    const res = await fetch(`${context}/CitasServlet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const data = await res.json();
    cerrarModalCancelar();
    if (data.success) {
      mostrarAlerta('Cita Cancelada', 'Tu cita ha sido cancelada correctamente.', false);
      cargarCitas();
    } else {
      mostrarAlerta('Error', data.error || 'No se pudo cancelar la cita.', true);
    }
  } catch (e) {
    console.error('Error al cancelar:', e);
    cerrarModalCancelar();
    mostrarAlerta('Error de Conexión', 'Ocurrió un problema con el servidor.', true);
  }
}

// ---------- Rating / reseña ----------
function abrirModalRating(id) {
  ratingCitaSeleccionada = misCitas.find(x => x.id == id) || null;
  ratingValor = 0;
  pintarEstrellas(0);
  const coment = document.getElementById('ratingComment');
  if (coment) coment.value = '';
  document.getElementById('ratingModal')?.classList.add('active');
  document.getElementById('ratingModal')?.setAttribute('aria-hidden', 'false');
}
function cerrarModalRating() {
  ratingCitaSeleccionada = null;
  document.getElementById('ratingModal')?.classList.remove('active');
  document.getElementById('ratingModal')?.setAttribute('aria-hidden', 'true');
}
function pintarEstrellas(valor) {
  document.querySelectorAll('.rating-stars button').forEach(b => {
    b.classList.toggle('selected', Number(b.dataset.rating) <= valor);
  });
}
async function enviarResena() {
  if (!ratingCitaSeleccionada) { cerrarModalRating(); return; }
  if (ratingValor < 1) { mostrarAlerta('Calificación requerida', 'Selecciona al menos una estrella.', true); return; }
  try {
    const context = window.contextPath || '';
    const params = new URLSearchParams();
    params.append('idServicio', ratingCitaSeleccionada.idServicio);
    params.append('calificacion', ratingValor);
    params.append('comentario', document.getElementById('ratingComment')?.value || '');
    const res = await fetch(`${context}/guardarResena`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const data = await res.json();
    cerrarModalRating();
    if (data.success) mostrarAlerta('¡Gracias!', 'Tu calificación fue registrada.', false);
    else mostrarAlerta('Error', data.message || 'No se pudo guardar la reseña.', true);
  } catch (e) {
    console.error('Error al enviar reseña:', e);
    cerrarModalRating();
    mostrarAlerta('Error de Conexión', 'Ocurrió un problema con el servidor.', true);
  }
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  cargarCitas();

  document.querySelector('.menu-btn')?.addEventListener('click', toggleMenu);
  document.getElementById('menuOverlay')?.addEventListener('click', cerrarMenu);
  document.getElementById('customAlertCloseBtn')?.addEventListener('click', cerrarAlerta);
  document.querySelector('[data-notification-toggle]')?.addEventListener('click', () => {
    document.getElementById('notificationPanel')?.classList.toggle('active');
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => { tabActual = btn.dataset.statusTab; render(); });
  });

  // Cancelar modal
  document.querySelector('.cancel-cancel-btn')?.addEventListener('click', cerrarModalCancelar);
  document.querySelector('.cancel-modal-close')?.addEventListener('click', cerrarModalCancelar);
  document.querySelector('.cancel-confirm-btn')?.addEventListener('click', confirmarCancelacion);

  // Rating modal
  document.querySelector('.rating-close')?.addEventListener('click', cerrarModalRating);
  document.querySelector('.rating-cancel-btn')?.addEventListener('click', cerrarModalRating);
  document.querySelector('.rating-submit-btn')?.addEventListener('click', enviarResena);
  document.querySelectorAll('.rating-stars button').forEach(b => {
    b.addEventListener('click', () => { ratingValor = Number(b.dataset.rating); pintarEstrellas(ratingValor); });
  });

  // Cerrar modales al hacer clic en el backdrop
  ['cancelAppointmentModal', 'ratingModal'].forEach(id => {
    const m = document.getElementById(id);
    m?.addEventListener('click', (e) => { if (e.target === m) { m.classList.remove('active'); m.setAttribute('aria-hidden', 'true'); } });
  });
});
