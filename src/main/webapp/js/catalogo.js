// ==========================================
//  Catálogo y agendado — diseño de copia sobre servlets de demo
// ==========================================

let reservaActual = {
  idServicio: 1,
  nombreServicio: '',
  precio: 0,
  duracion: '01:00:00',
  idEmpleado: 1,
  metodoPago: 'Efectivo'
};

// ---------- Calendario ----------
const bookingTimes = Array.from({ length: 24 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 30;
  const hour = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${String(displayHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${suffix}`;
});
const bookingDayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
let selectedBookingDate = new Date();
let bookingWeekOffset = 0;
let selectedBookingTime = null;
let bookingCalendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

function getMinimumBookingDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  return d;
}
selectedBookingDate = getMinimumBookingDate();

function formatBookingDate(date) { return `${bookingDayNames[date.getDay()]} ${date.getDate()}`; }
function localDateIso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function formatMonthLabel(date) {
  return date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }).replace(/^./, (l) => l.toUpperCase());
}
function isDateBeforeMinimum(date) {
  const c = new Date(date); c.setHours(0, 0, 0, 0);
  return c < getMinimumBookingDate();
}
function timeInMinutes(time) {
  const m = String(time || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return null;
  let hour = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') hour += 12;
  return hour * 60 + Number(m[2]);
}
function timeTo24h(time) {
  const mins = timeInMinutes(time);
  if (mins === null) return '12:00:00';
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}:00`;
}

function renderSmallBookingCalendar() {
  const calendar = document.getElementById('bookingCalendarDays');
  const monthLabel = document.getElementById('bookingMonthLabel');
  if (!calendar) return;
  const firstDay = new Date(bookingCalendarMonth.getFullYear(), bookingCalendarMonth.getMonth(), 1);
  const firstCell = new Date(firstDay);
  firstCell.setDate(firstDay.getDate() - firstDay.getDay());
  calendar.innerHTML = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstCell);
    date.setDate(firstCell.getDate() + index);
    const outsideMonth = date.getMonth() !== bookingCalendarMonth.getMonth();
    const beforeMinimum = isDateBeforeMinimum(date);
    const selected = date.toDateString() === selectedBookingDate.toDateString();
    return `<span class="${outsideMonth ? 'calendar-muted' : 'calendar-date'} ${beforeMinimum ? 'calendar-disabled' : ''} ${selected ? 'active' : ''}" data-iso-date="${localDateIso(date)}" ${beforeMinimum ? 'aria-disabled="true"' : ''}>${date.getDate()}</span>`;
  }).join('');
  if (monthLabel) monthLabel.textContent = formatMonthLabel(bookingCalendarMonth);
}

function renderBookingSchedule() {
  const dayHeader = document.getElementById('bookingScheduleDays');
  const slots = document.getElementById('bookingScheduleSlots');
  const todayButton = document.querySelector('.schedule-today');
  const timeColumn = document.querySelector('.schedule-time-column');
  if (!dayHeader || !slots) return;

  const weekStart = new Date(selectedBookingDate);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7) + bookingWeekOffset * 7);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d;
  });

  dayHeader.innerHTML = weekDates.map((date) =>
    `<span class="${date.toDateString() === selectedBookingDate.toDateString() ? 'selected' : ''}">${bookingDayNames[date.getDay()]}<b>${date.getDate()}</b></span>`).join('');
  if (timeColumn) timeColumn.innerHTML = `<span></span>${bookingTimes.map((t) => `<span>${t}</span>`).join('')}`;

  slots.innerHTML = weekDates.map((date) => `
    <div class="schedule-column ${date.toDateString() === selectedBookingDate.toDateString() ? 'selected' : ''}">
      ${bookingTimes.map((time) => {
        const unavailable = isDateBeforeMinimum(date);
        const active = date.toDateString() === selectedBookingDate.toDateString() && time === selectedBookingTime;
        return `<button type="button" class="time-btn schedule-block ${unavailable ? 'unavailable' : ''} ${active ? 'active' : ''}" data-time="${time}" data-date-iso="${localDateIso(date)}" ${unavailable ? 'disabled' : ''}>${unavailable ? '<i class="fa-solid fa-lock"></i>' : active ? '<i class="fa-solid fa-check"></i> ' + time : time}</button>`;
      }).join('')}
    </div>`).join('');

  if (todayButton) todayButton.textContent = `Hoy · ${formatBookingDate(new Date())}`;
}

function syncBookingDate(date) {
  selectedBookingDate = new Date(date);
  selectedBookingDate.setHours(0, 0, 0, 0);
  bookingWeekOffset = 0;
  bookingCalendarMonth = new Date(selectedBookingDate.getFullYear(), selectedBookingDate.getMonth(), 1);
  renderSmallBookingCalendar();
  renderBookingSchedule();
}

function setupBookingCalendar() {
  selectedBookingDate = getMinimumBookingDate();
  selectedBookingTime = null;
  bookingCalendarMonth = new Date(selectedBookingDate.getFullYear(), selectedBookingDate.getMonth(), 1);
  renderSmallBookingCalendar();
  renderBookingSchedule();
}

// ---------- Menú / notificaciones ----------
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

// ---------- Catálogo (paginación de tarjetas) ----------
function cambiarCatalogo(direction) {
  const cards = Array.from(document.querySelectorAll('.service-card'));
  if (!cards.length) return;
  const pageSize = 6;
  const total = cards.length;
  let startIndex = Number(document.body.dataset.catalogStart || 0);
  startIndex = (startIndex + (direction === 'next' ? pageSize : -pageSize) + total) % total;
  document.body.dataset.catalogStart = String(startIndex);
  const visible = new Set();
  for (let i = 0; i < Math.min(pageSize, total); i += 1) visible.add((startIndex + i) % total);
  cards.forEach((card, index) => card.classList.toggle('hidden-card', !visible.has(index)));
}

// ---------- Reseñas ----------
function renderResena(item) {
  let estrellas = '';
  for (let i = 1; i <= 5; i++) {
    estrellas += (i <= item.calificacion)
      ? '<i class="fa-solid fa-star" style="color:#f39c12"></i>'
      : '<i class="fa-regular fa-star" style="color:#ccc"></i>';
  }
  const inicial = item.nombreCliente ? item.nombreCliente.charAt(0).toUpperCase() : 'U';
  return `
    <div class="review-body" style="margin-bottom:10px;">
      <div class="review-avatar">${inicial}</div>
      <div class="review-content">
        <div class="review-meta"><strong>${item.nombreCliente || 'Cliente'}</strong> <span class="stars">${estrellas}</span></div>
        <div class="review-text">${(item.comentario || '').replace(/</g, '&lt;')}</div>
      </div>
    </div>`;
}

function cargarResenas(idServicio) {
  const container = document.getElementById('reviewsListContainer');
  const ratingEl = document.getElementById('modalRating');
  const ratingCountEl = document.getElementById('modalRatingCount');
  if (!container) return;
  container.innerHTML = '<div class="review-content"><div class="review-text muted">Cargando reseñas...</div></div>';
  fetch(`${window.contextPath || ''}/obtenerResenas?idServicio=${idServicio}`)
    .then(r => r.json())
    .then(data => {
      const list = data || [];
      if (!list.length) {
        container.innerHTML = '<div class="review-content"><div class="review-text muted">Aún no hay reseñas para este servicio.</div></div>';
        if (ratingEl) ratingEl.innerText = '0.0';
        if (ratingCountEl) ratingCountEl.innerText = '(0 opiniones)';
        return;
      }
      const prom = (list.reduce((s, r) => s + r.calificacion, 0) / list.length).toFixed(1);
      if (ratingEl) ratingEl.innerText = prom;
      if (ratingCountEl) ratingCountEl.innerText = `(${list.length} opiniones)`;
      container.innerHTML = list.slice(0, 3).map(renderResena).join('');
    })
    .catch(() => {
      container.innerHTML = '<div class="review-content"><div class="review-text muted">No se pudieron cargar las reseñas.</div></div>';
    });
}

// ---------- Modal de servicio ----------
function abrirModalServicio(card) {
  reservaActual.idServicio = parseInt(card.dataset.id || '1', 10);
  reservaActual.nombreServicio = card.dataset.title || '';
  reservaActual.precio = parseFloat(card.dataset.price || '0');
  reservaActual.duracion = card.dataset.duration || '01:00:00';

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
  set('modalTitle', reservaActual.nombreServicio);
  set('modalCategory', card.dataset.category || 'Servicio');
  set('modalDesc', card.dataset.desc || 'Tratamiento profesional adaptado a tus necesidades.');
  set('modalDuration', card.dataset.duration || '1 h');
  set('modalPrice', `$${reservaActual.precio} MXN`);
  const img = document.getElementById('modalImg');
  if (img) img.src = card.dataset.image || '';

  const grid = document.getElementById('modalIncludesGrid');
  if (grid) {
    const parts = String(card.dataset.includes || '').split(/[,;|•]/).map(s => s.trim()).filter(Boolean);
    grid.innerHTML = (parts.length ? parts : ['Servicio estándar']).map(p =>
      `<div class="include-item"><i class="fa-solid fa-circle-check"></i><div>${p}</div></div>`).join('');
  }

  cargarResenas(reservaActual.idServicio);
  document.getElementById('serviceModal')?.classList.add('active');
}
function cerrarModalServicio() { document.getElementById('serviceModal')?.classList.remove('active'); }

// ---------- Modal de agendado ----------
function abrirModalAgendamiento() {
  document.getElementById('bookingServiceName').innerText = reservaActual.nombreServicio;
  document.getElementById('bookingPrice').innerText = `$${reservaActual.precio} MXN`;

  const confirmationSuccess = document.getElementById('confirmationSuccess');
  if (confirmationSuccess) confirmationSuccess.hidden = true;

  setupBookingCalendar();
  cerrarModalServicio();
  document.getElementById('bookingModal')?.classList.add('active');
}
function volverAModalServicio() {
  document.getElementById('bookingModal')?.classList.remove('active');
  document.getElementById('serviceModal')?.classList.add('active');
}

// ---------- Confirmación / registro ----------
function prepararConfirmacion() {
  if (!selectedBookingTime) {
    alert('Selecciona una fecha y una hora antes de continuar.');
    return false;
  }
  const especialista = document.getElementById('bookingSpecialistSelect');
  reservaActual.idEmpleado = parseInt(especialista?.value || '1', 10) || 1;
  const especialistaTexto = especialista ? especialista.options[especialista.selectedIndex].text : 'Cualquiera. Mejor disponible';
  const dateText = selectedBookingDate.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
  set('confirmationService', reservaActual.nombreServicio || 'Servicio');
  set('confirmationSpecialist', especialistaTexto);
  set('confirmationDate', dateText);
  set('confirmationTime', selectedBookingTime);

  document.getElementById('bookingModal')?.classList.remove('active');
  document.getElementById('confirmationModal')?.classList.add('active');
  return true;
}

async function registrarCita() {
  const btn = document.querySelector('.confirmation-primary');
  if (btn) { btn.disabled = true; btn.innerText = 'Procesando...'; }

  const params = new URLSearchParams();
  params.append('idServicio', reservaActual.idServicio);
  params.append('idEmpleado', reservaActual.idEmpleado || 1);
  params.append('fecha', localDateIso(selectedBookingDate));
  params.append('hora', timeTo24h(selectedBookingTime));
  params.append('monto', reservaActual.precio);
  params.append('duracion', reservaActual.duracion || '01:00:00');
  params.append('metodoPago', reservaActual.metodoPago);

  try {
    const res = await fetch(`${window.contextPath || ''}/agendarCitaServlet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: params.toString()
    });
    const data = await res.json();
    if (res.ok && data.status === 'success') {
      document.getElementById('confirmationTitle').style.display = 'none';
      document.querySelector('.confirmation-details').style.display = 'none';
      document.querySelector('.confirmation-primary').style.display = 'none';
      document.querySelector('.confirmation-secondary').style.display = 'none';
      const success = document.getElementById('confirmationSuccess');
      if (success) success.hidden = false;
    } else {
      alert(`Error: ${data.message || 'No se pudo registrar la cita'}`);
    }
  } catch (e) {
    console.error('Error al agendar:', e);
    alert('Ocurrió un error de red al intentar agendar la cita.');
  } finally {
    if (btn) { btn.disabled = false; btn.innerText = 'Confirmar cita'; }
  }
}

function volverAlCatalogo() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  // Restaurar la vista de confirmación por si se reabre
  const restore = (sel) => { const el = document.querySelector(sel); if (el) el.style.display = ''; };
  restore('#confirmationTitle');
  restore('.confirmation-details');
  restore('.confirmation-primary');
  restore('.confirmation-secondary');
  const success = document.getElementById('confirmationSuccess');
  if (success) success.hidden = true;
}

// ---------- Init + delegación ----------
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.service-card');
  if (cards.length) {
    document.body.dataset.catalogStart = '0';
    cards.forEach((card, index) => card.classList.toggle('hidden-card', index >= 6));
  }
});

document.addEventListener('click', (e) => {
  const target = e.target;

  // Notificaciones
  if (target.closest('[data-notification-toggle]')) {
    document.getElementById('notificationPanel')?.classList.toggle('active');
    return;
  }

  // Perfil
  if (target.closest('.user-profile') || target.closest('.nav-profile-link') || target.closest('#sidebarUserAvatar')) {
    window.location.href = `${window.contextPath || ''}/PerfilServlet`;
    return;
  }

  if (target.closest('#menuOverlay')) { cerrarMenu(); return; }
  if (target.closest('.menu-btn')) { abrirMenu(); return; }
  if (target.closest('.sidebar-logout')) { window.location.href = (window.contextPath || '') + '/logout'; return; }

  if (target.closest('.catalog-nav-btn')) {
    cambiarCatalogo(target.closest('.catalog-nav-btn').dataset.direction || 'next');
    return;
  }

  // Tarjeta de servicio
  const card = target.closest('.service-card');
  if (card) { e.stopPropagation(); abrirModalServicio(card); return; }

  // Modal de servicio: cerrar
  const serviceModal = document.getElementById('serviceModal');
  if (target === serviceModal) { cerrarModalServicio(); return; }
  if (target.closest('.modal-close') && !target.closest('.modal-back')) { cerrarModalServicio(); return; }

  // Agendar
  if (target.closest('.btn-agendar')) { abrirModalAgendamiento(); return; }
  if (target.closest('.modal-back')) { volverAModalServicio(); return; }

  // Interacciones dentro del modal de agendado
  const bookingModal = document.getElementById('bookingModal');
  if (target === bookingModal) { bookingModal.classList.remove('active'); return; }
  if (bookingModal && bookingModal.contains(target)) {
    const dateBtn = target.closest('.calendar-date');
    if (dateBtn) {
      if (dateBtn.classList.contains('calendar-disabled')) return;
      syncBookingDate(new Date(`${dateBtn.dataset.isoDate}T00:00:00`));
      return;
    }
    const timeBtn = target.closest('.time-btn');
    if (timeBtn) {
      if (timeBtn.classList.contains('unavailable')) return;
      if (timeBtn.dataset.dateIso) {
        selectedBookingDate = new Date(`${timeBtn.dataset.dateIso}T00:00:00`);
        bookingCalendarMonth = new Date(selectedBookingDate.getFullYear(), selectedBookingDate.getMonth(), 1);
        renderSmallBookingCalendar();
      }
      selectedBookingTime = timeBtn.dataset.time;
      renderBookingSchedule();
      return;
    }
    if (target.closest('.schedule-arrow')) {
      const dir = target.closest('.schedule-arrow').getAttribute('aria-label') === 'Semana siguiente' ? 7 : -7;
      const next = new Date(selectedBookingDate);
      next.setDate(next.getDate() + dir);
      if (next < getMinimumBookingDate()) next.setTime(getMinimumBookingDate().getTime());
      syncBookingDate(next);
      return;
    }
    if (target.closest('.schedule-today')) { syncBookingDate(getMinimumBookingDate()); return; }
    if (target.closest('.calendar-today')) { syncBookingDate(getMinimumBookingDate()); return; }
    if (target.closest('.calendar-nav')) {
      const dir = target.closest('.calendar-nav').getAttribute('aria-label') === 'Mes siguiente' ? 1 : -1;
      const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const monthDate = new Date(bookingCalendarMonth);
      monthDate.setMonth(monthDate.getMonth() + dir);
      if (monthDate < currentMonth) return;
      bookingCalendarMonth = monthDate;
      renderSmallBookingCalendar();
      return;
    }
    if (target.closest('.promo-catalog-btn')) { bookingModal.classList.remove('active'); return; }
    if (target.closest('.btn-pay')) { prepararConfirmacion(); return; }
  }

  // Modal de confirmación
  const confirmationModal = document.getElementById('confirmationModal');
  if (target === confirmationModal) { confirmationModal.classList.remove('active'); return; }
  if (target.closest('.return-to-catalog')) { volverAlCatalogo(); return; }
  if (target.closest('.confirmation-secondary')) {
    confirmationModal.classList.remove('active');
    document.getElementById('bookingModal')?.classList.add('active');
    renderBookingSchedule();
    return;
  }
  if (target.closest('.confirmation-primary')) { registrarCita(); return; }
});
