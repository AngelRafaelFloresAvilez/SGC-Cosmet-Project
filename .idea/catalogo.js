function abrirMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  document.getElementById('sidebarMenu').classList.add('active');
  document.getElementById('menuOverlay').classList.add('active');
  if (menuBtn) menuBtn.classList.add('active');
}

function cerrarMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  document.getElementById('sidebarMenu').classList.remove('active');
  document.getElementById('menuOverlay').classList.remove('active');
  if (menuBtn) menuBtn.classList.remove('active');
}

function mostrarNotificaciones() {
  const panel = document.getElementById('notificationPanel');
  if (panel) {
    panel.classList.toggle('active');
  }
}

const bookingTimes = Array.from({ length: 24 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 30;
  const hour = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${String(displayHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${suffix}`;
});
const bookingDayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
let selectedBookingDate = new Date(2026, 7, 12);
let bookingWeekOffset = 0;
let selectedBookingTime = '11:30 AM';
let selectedBookingDuration = 60;
let lastCreatedAppointmentId = null;
let pendingBookingDraft = null;
let modifyingAppointmentId = null;
let bookingCalendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

function getMinimumBookingDate() {
  const minimumDate = new Date();
  minimumDate.setHours(0, 0, 0, 0);
  minimumDate.setDate(minimumDate.getDate() + 1);
  return minimumDate;
}

selectedBookingDate = getMinimumBookingDate();

function formatBookingDate(date) {
  return `${bookingDayNames[date.getDay()]} ${date.getDate()}`;
}

function localDateIso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatMonthLabel(date) {
  return date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }).replace(/^./, (letter) => letter.toUpperCase());
}

function isDateBeforeMinimum(date) {
  const candidate = new Date(date);
  candidate.setHours(0, 0, 0, 0);
  return candidate < getMinimumBookingDate();
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
    return `<span class="${outsideMonth ? 'calendar-muted' : 'calendar-date'} ${beforeMinimum ? 'calendar-disabled' : ''} ${selected ? 'active' : ''}" data-date="${formatBookingDate(date)}" data-iso-date="${localDateIso(date)}" ${beforeMinimum ? 'aria-disabled="true"' : ''}>${date.getDate()}</span>`;
  }).join('');
  if (monthLabel) monthLabel.textContent = formatMonthLabel(bookingCalendarMonth);
}

function durationInMinutes(duration) {
  const normalized = String(duration || '').toLowerCase().replace(',', '.');
  if (/hora\s*y\s*media|hora\s+media/.test(normalized)) return 90;
  const hoursAndMinutes = normalized.match(/(\d+(?:\.\d+)?)\s*h(?:ora)?\s*(?:y|\+)??\s*(\d+(?:\.\d+)?)\s*min/);
  if (hoursAndMinutes) return Number(hoursAndMinutes[1]) * 60 + Number(hoursAndMinutes[2]);
  const minutes = normalized.match(/(\d+(?:\.\d+)?)\s*min/);
  if (minutes) return Number(minutes[1]);
  const hours = normalized.match(/(\d+(?:\.\d+)?)\s*h(?:ora)?/);
  if (hours) return Number(hours[1]) * 60;
  const match = normalized.match(/(\d+)/);
  return match ? Number(match[1]) : 60;
}

function timeInMinutes(time) {
  const match = String(time || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hour += 12;
  return hour * 60 + Number(match[2]);
}

function workTimeInMinutes(time) {
  const match = String(time || '').match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function specialistWorkingHours(date, specialist) {
  const users = window.appointmentsSystem?.readUsers?.() || [];
  const selected = String(specialist || '').toLowerCase();
  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayKey = dayKeys[date.getDay()];
  const candidates = users.filter((user) => {
    if (user.role !== 'specialist' || user.active === false) return false;
    if (!selected || selected === 'cualquiera. mejor disponible') return true;
    return String(user.email || '').toLowerCase() === selected
      || `${user.name || ''} ${user.lastName || ''}`.trim().toLowerCase() === selected;
  });
  const schedules = candidates
    .filter((user) => !(Array.isArray(user.daysOff) ? user.daysOff : []).includes(dayKey))
    .map((user) => ({
      start: workTimeInMinutes(user.workStart || ''),
      end: workTimeInMinutes(user.workEnd || '')
    }))
    .filter((schedule) => schedule.start !== null && schedule.end !== null && schedule.end > schedule.start);
  if (!schedules.length) return null;
  return { start: Math.min(...schedules.map((schedule) => schedule.start)), end: Math.max(...schedules.map((schedule) => schedule.end)) };
}

function isOutsideWorkingHours(date, time) {
  const specialist = document.getElementById('bookingSpecialistSelect')?.value || 'Cualquiera. Mejor disponible';
  const workingHours = specialistWorkingHours(date, specialist);
  if (!workingHours) return true;
  const start = timeInMinutes(time);
  return start === null || start < workingHours.start || start + selectedBookingDuration > workingHours.end;
}

function isInvalidStartTime(time) {
  const start = timeInMinutes(time);
  return start === null;
}

function hasBookingWindow(date, time) {
  const start = timeInMinutes(time);
  if (start === null) return false;
  for (let offset = 0; offset < selectedBookingDuration; offset += 30) {
    const slotTime = start + offset;
    const slotHour = Math.floor(slotTime / 60);
    const slotMinutes = slotTime % 60;
    const slotLabel = `${String(slotHour % 12 || 12).padStart(2, '0')}:${String(slotMinutes).padStart(2, '0')} ${slotHour >= 12 ? 'PM' : 'AM'}`;
    if (getOccupiedAppointment(date, slotLabel)) return false;
  }
  return true;
}

function activeAppointmentOccupies(appointment, date, time, specialist, requestedDuration = 30) {
  if (!appointment || appointment.status === 'cancelled' || appointment.status === 'previous' || appointment.status === 'completed') return false;
  if (appointment.iso) {
    const appointmentDate = new Date(appointment.iso);
    if (Number.isNaN(appointmentDate.getTime()) || appointmentDate.toDateString() !== date.toDateString()) return false;
  } else {
    const appointmentDay = Number(String(appointment.date || '').match(/\d{1,2}/)?.[0]);
    if (appointmentDay !== date.getDate()) return false;
  }
  const assignedSpecialist = appointment.specialist || appointment.createdBy?.specialist || '';
  const hasSpecificAssignment = assignedSpecialist && assignedSpecialist !== 'Cualquiera. Mejor disponible';
  if (specialist && specialist !== 'Cualquiera. Mejor disponible' && hasSpecificAssignment && assignedSpecialist !== specialist) return false;
  if (specialist && specialist !== 'Cualquiera. Mejor disponible' && !assignedSpecialist) return true;
  const appointmentStart = timeInMinutes(appointment.time);
  const slotStart = timeInMinutes(time);
  if (appointmentStart === null || slotStart === null) return false;
  const appointmentEnd = appointmentStart + durationInMinutes(appointment.duration);
  return slotStart < appointmentEnd && slotStart + requestedDuration > appointmentStart;
}

function getOccupiedAppointment(date, time, requestedDuration = selectedBookingDuration) {
  const state = window.appointmentsSystem && typeof window.appointmentsSystem.readState === 'function'
    ? window.appointmentsSystem.readState()
    : { appointments: [] };
  const specialist = document.getElementById('bookingSpecialistSelect')?.value || 'Cualquiera. Mejor disponible';
  return (state.appointments || []).find((appointment) => activeAppointmentOccupies(appointment, date, time, specialist, requestedDuration)) || null;
}

function renderBookingSchedule() {
  const dayHeader = document.getElementById('bookingScheduleDays');
  const slots = document.getElementById('bookingScheduleSlots');
  const todayButton = document.querySelector('.schedule-today');
  const timeColumn = document.querySelector('.schedule-time-column');
  if (!dayHeader || !slots) return;

  const weekStart = new Date(selectedBookingDate);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7) + bookingWeekOffset * 7);
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });

  dayHeader.innerHTML = weekDates.map((date) => `<span class="${date.toDateString() === selectedBookingDate.toDateString() ? 'selected' : ''}">${bookingDayNames[date.getDay()]}<b>${date.getDate()}</b></span>`).join('');
  if (timeColumn) timeColumn.innerHTML = `<span></span>${bookingTimes.map((time) => `<span>${time}</span>`).join('')}`;
  let availableSlotCount = 0;
  slots.innerHTML = weekDates.map((date, columnIndex) => `
    <div class="schedule-column ${date.toDateString() === selectedBookingDate.toDateString() ? 'selected' : ''}">
      ${bookingTimes.map((time, timeIndex) => {
        const occupiedAppointment = getOccupiedAppointment(date, time);
        const outsideWorkingHours = isOutsideWorkingHours(date, time);
        const invalidStartTime = isInvalidStartTime(time);
        const availableWindow = hasBookingWindow(date, time);
        const unavailable = Boolean(occupiedAppointment) || !availableWindow || isDateBeforeMinimum(date) || outsideWorkingHours || invalidStartTime;
        if (!unavailable) availableSlotCount += 1;
        const active = date.toDateString() === selectedBookingDate.toDateString() && time === selectedBookingTime;
        const occupiedLabel = occupiedAppointment ? 'Ocupado' : 'No disponible';
        return `<button type="button" class="time-btn schedule-block ${unavailable ? 'unavailable' : ''} ${occupiedAppointment ? 'occupied' : ''} ${active && !unavailable ? 'active' : ''}" data-time="${time}" data-date-iso="${localDateIso(date)}" ${unavailable ? 'disabled' : ''}>${unavailable ? '<i class="fa-solid fa-lock"></i>' : active ? '<i class="fa-solid fa-check"></i>' : ''}${unavailable ? ` ${occupiedLabel}` : time}</button>`;
      }).join('')}
    </div>`).join('');
  if (!availableSlotCount) {
    slots.innerHTML = '<div class="booking-empty-schedule">No hay horarios disponibles para el especialista y las fechas seleccionadas.</div>';
  }

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
  bookingCalendarMonth = new Date(selectedBookingDate.getFullYear(), selectedBookingDate.getMonth(), 1);
  renderSmallBookingCalendar();
  syncBookingDate(selectedBookingDate);
}

function abrirModal(titulo, categoria, desc, incluye, duracion, precio, img) {
  document.getElementById('modalTitle').innerText = titulo;
  document.getElementById('modalCategory').innerText = categoria;
  document.getElementById('modalDesc').innerText = desc;
  // Render includes as grid items (comma-separated or pipe-separated)
  const includesGrid = document.getElementById('modalIncludesGrid');
  if (includesGrid) {
    includesGrid.innerHTML = '';
    const raw = String(incluye || '').trim();
    const parts = raw ? raw.split(/[,;|•]/).map(s => s.trim()).filter(Boolean) : [];
    if (parts.length) {
      parts.forEach(p => {
        const item = document.createElement('div');
        item.className = 'include-item';
        item.innerHTML = `<i class="fa-solid fa-circle-check"></i><div>${p}</div>`;
        includesGrid.appendChild(item);
      });
    } else {
      // fallback: if single text, show as one item
      if (raw) {
        const item = document.createElement('div');
        item.className = 'include-item';
        item.innerHTML = `<i class="fa-solid fa-circle-check"></i><div>${raw}</div>`;
        includesGrid.appendChild(item);
      }
    }
  }

  document.getElementById('modalDuration').innerText = duracion || '';
  // price shown in side panel
  document.getElementById('modalPrice').innerText = precio || '';
  document.getElementById('modalImg').src = img || '';

  // availability and rating fallbacks
  const availabilityEl = document.getElementById('modalAvailability');
  if (availabilityEl) availabilityEl.innerText = (document.querySelector('[data-availability]')?.dataset?.availability) || 'Disponible';
  const ratingEl = document.getElementById('modalRating');
  if (ratingEl) ratingEl.innerText = (document.querySelector('[data-rating]')?.dataset?.rating) || '4.8';

  const selectedService = window.appointmentsSystem?.getServices?.().find((service) =>
    String(service.title || '').trim().toLowerCase() === String(titulo || '').trim().toLowerCase()
  );
  const bookingButton = document.querySelector('.btn-agendar');
  const inactive = selectedService?.active === false;
  if (availabilityEl) availabilityEl.innerText = inactive ? 'No disponible' : 'Disponible';
  const availabilityHint = availabilityEl?.closest('.meta-item')?.querySelector('.muted');
  if (availabilityHint) availabilityHint.innerText = inactive ? 'Servicio inhabilitado' : 'Disponible';
  if (bookingButton) {
    bookingButton.disabled = inactive;
    bookingButton.classList.toggle('service-disabled', inactive);
    bookingButton.innerHTML = inactive
      ? '<i class="fa-solid fa-ban"></i> Servicio inactivo'
      : 'Agendar cita';
  }

  document.getElementById('serviceModal').classList.add('active');
}

function cambiarCatalogo(direction) {
  const cards = Array.from(document.querySelectorAll('.service-card'));
  if (!cards.length) return;

  const pageSize = 6;
  const total = cards.length;
  let startIndex = Number(document.body.dataset.catalogStart || 0);

  startIndex = (startIndex + (direction === 'next' ? pageSize : -pageSize) + total) % total;
  document.body.dataset.catalogStart = String(startIndex);

  const visibleIndexes = new Set();
  for (let i = 0; i < Math.min(pageSize, total); i += 1) {
    visibleIndexes.add((startIndex + i) % total);
  }

  cards.forEach((card, index) => {
    card.classList.toggle('hidden-card', !visibleIndexes.has(index));
  });
}

function cerrarModal() {
  document.getElementById('serviceModal').classList.remove('active');
}

function cerrarModalFuera(event) {
  if (event.target.id === 'serviceModal') {
    cerrarModal();
  }
}

function abrirModalAgendamiento() {
  const titulo = document.getElementById('modalTitle').innerText;
  const precio = document.getElementById('modalPrice').innerText;
  document.getElementById('bookingServiceName').innerText = titulo;
  document.getElementById('bookingPrice').innerText = precio;
  const selectedService = window.appointmentsSystem && typeof window.appointmentsSystem.getServices === 'function'
    ? window.appointmentsSystem.getServices().find((service) => service.title?.toLowerCase() === titulo.toLowerCase())
    : null;
  selectedBookingDuration = durationInMinutes(selectedService?.duration);
  pendingBookingDraft = null;
  const confirmationSuccess = document.getElementById('confirmationSuccess');
  if (confirmationSuccess) confirmationSuccess.hidden = true;
  document.getElementById('confirmationTitle').style.display = '';
  document.querySelector('.confirmation-details').style.display = '';
  document.querySelector('.confirmation-primary').style.display = '';
  const confirmationBack = document.querySelector('.confirmation-secondary');
  confirmationBack.style.display = '';
  confirmationBack.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Volver atrás';
  confirmationBack.classList.remove('return-to-catalog');

  setupBookingCalendar();

  // El listado de especialistas sale de los empleados dados de alta por el admin.
  try {
    const specialistSelect = document.getElementById('bookingSpecialistSelect');
    if (specialistSelect && window.appointmentsSystem && typeof window.appointmentsSystem.readUsers === 'function') {
      const specialists = window.appointmentsSystem.readUsers()
        .filter((user) => user.role === 'specialist' && user.active !== false);
      specialistSelect.innerHTML = '<option value="">Cualquiera. Mejor disponible</option>' +
        specialists.map((user) => {
          const name = `${user.name || ''} ${user.lastName || ''}`.trim();
          return `<option value="${user.email}">${name}${user.specialty ? ` — ${user.specialty}` : ''}</option>`;
        }).join('');
    }
  } catch (e) {
    /* si falla se conserva la opcion por defecto del HTML */
  }

  try {
    const select = document.getElementById('bookingPromotionSelect');
    if (select && window.appointmentsSystem && typeof window.appointmentsSystem.readState === 'function') {
      const state = window.appointmentsSystem.readState();
      select.innerHTML = '<option value="">-- Selecciona una promoción (opcional) --</option>' +
        (state.promotions || []).map((p) => `<option value="${p.id}">${p.title}</option>`).join('');
      select.onchange = function () {
        const val = select.value;
        if (window.appointmentsSystem && typeof window.appointmentsSystem.applyPromotion === 'function') {
          window.appointmentsSystem.applyPromotion(val || null);
        }
        try {
          const selPromo = (state.promotions || []).find((pp) => pp.id === val);
          if (selPromo && /(%)/.test(selPromo.title)) {
            const match = String(selPromo.title).match(/(\d+)%/);
            if (match) {
              const pct = Number(match[1]);
              const num = Number(String(precio).replace(/[^0-9.,]/g, '').replace(/,/g, '.')) || 0;
              const computed = Math.round((num * (1 - pct / 100)) * 100) / 100;
              document.getElementById('bookingPrice').innerText = `$${computed} MXN`;
              return;
            }
          }
          document.getElementById('bookingPrice').innerText = precio;
        } catch (e) {
          document.getElementById('bookingPrice').innerText = precio;
        }
      };
    }
  } catch (e) {
    /* ignore */
  }

  document.getElementById('serviceModal').classList.remove('active');
  document.getElementById('bookingModal').classList.add('active');
  const specialistSelect = document.getElementById('bookingSpecialistSelect');
  if (specialistSelect) specialistSelect.onchange = renderBookingSchedule;
  renderBookingSchedule();
}

function volverAModalServicio() {
  document.getElementById('bookingModal').classList.remove('active');
  document.getElementById('serviceModal').classList.add('active');
}

function cerrarBookingFuera(event) {
  if (event.target.id === 'bookingModal') {
    document.getElementById('bookingModal').classList.remove('active');
  }
}

function seleccionarBoton(elemento, clase) {
  const botones = document.getElementsByClassName(clase);
  for (let i = 0; i < botones.length; i += 1) {
    botones[i].classList.remove('active');
  }
  elemento.classList.add('active');
}

function confirmarCita() {
  document.getElementById('bookingModal').classList.remove('active');
  document.getElementById('confirmationModal').classList.add('active');
}

function cerrarConfirmationFuera(event) {
  if (event.target.id === 'confirmationModal') {
    document.getElementById('confirmationModal').classList.remove('active');
  }
}

function volverAlCatalogo() {
  document.getElementById('confirmationModal').classList.remove('active');
  window.location.href = 'catalogo.html';
}

function renderConfirmationDetails(appointment) {
  if (!appointment) return;
  const appointmentDate = appointment.iso ? new Date(appointment.iso) : selectedBookingDate;
  const dateText = appointmentDate.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value || '--';
  };
  setText('confirmationService', appointment.serviceName);
  setText('confirmationSpecialist', appointment.specialist || 'Cualquiera. Mejor disponible');
  setText('confirmationDate', dateText);
  setText('confirmationTime', appointment.time);
}

window.addEventListener('DOMContentLoaded', () => {
  if (window.appointmentsSystem && typeof window.appointmentsSystem.init === 'function') {
    window.appointmentsSystem.init();
  }

  const catalogGrid = document.querySelector('.services-grid');
  if (catalogGrid) {
    catalogGrid.style.gridTemplateColumns = 'repeat(3, minmax(210px, 1fr))';
  }

  const cards = document.querySelectorAll('.service-card');
  if (cards.length) {
    document.body.dataset.catalogStart = '0';
    const pageSize = 6;
    const total = cards.length;
    const visibleIndexes = new Set();
    for (let i = 0; i < Math.min(pageSize, total); i += 1) {
      visibleIndexes.add(i);
    }
    cards.forEach((card, index) => {
      card.classList.toggle('hidden-card', !visibleIndexes.has(index));
    });
  }

  const modificationId = sessionStorage.getItem('sgc_modify_appointment_id');
  if (modificationId && window.appointmentsSystem?.readState) {
    setTimeout(() => {
      const appointment = window.appointmentsSystem.readState().appointments.find((item) => item.id === modificationId && item.status === 'pending');
      const serviceFromState = appointment && window.appointmentsSystem.getServices?.().find((item) => item.title?.toLowerCase() === appointment.serviceName?.toLowerCase());
      const card = appointment && [...document.querySelectorAll('.service-card')].find((item) => (item.dataset.title || item.querySelector('.service-title')?.innerText || '').trim().toLowerCase() === appointment.serviceName.toLowerCase());
      const metaValue = (label) => {
        const row = [...(card?.querySelectorAll('.service-meta-row') || [])].find((item) => item.querySelector('.service-meta-label')?.innerText.trim() === label);
        return row?.querySelector('.service-meta-value')?.innerText.trim() || '';
      };
      const service = serviceFromState || (card && {
        title: appointment.serviceName,
        category: card.dataset.category || '',
        description: card.dataset.desc || '',
        includes: card.dataset.includes || '',
        duration: card.dataset.duration || metaValue('Duración') || `${appointment.duration || 60} minutos`,
        price: card.dataset.price || metaValue('Precio') || appointment.price,
        image: card.dataset.image || card.querySelector('.service-img')?.src || ''
      });
      if (!appointment || !service) return;
      modifyingAppointmentId = modificationId;
      abrirModal(service.title, service.category || '', service.description || '', service.includes || '', service.duration, service.price, service.image);
      abrirModalAgendamiento();
      selectedBookingDuration = durationInMinutes(appointment.duration) || selectedBookingDuration;
      selectedBookingTime = appointment.time;
      if (appointment.iso) {
        selectedBookingDate = new Date(appointment.iso);
        bookingCalendarMonth = new Date(selectedBookingDate.getFullYear(), selectedBookingDate.getMonth(), 1);
      }
      renderSmallBookingCalendar();
      renderBookingSchedule();
    }, 0);
  }
});

window.addEventListener('storage', (event) => {
  if (event.key === 'sgc_appointments_state_v1' && document.getElementById('bookingModal')?.classList.contains('active')) {
    renderBookingSchedule();
  }
});

window.addEventListener('sgc-state-updated', () => {
  if (document.getElementById('bookingModal')?.classList.contains('active')) {
    renderBookingSchedule();
  }
});

// Delegated event handlers to replace inline `onclick` attributes
document.addEventListener('click', (e) => {
  const target = e.target;

  // Sidebar overlay and close
  if (target.closest('#menuOverlay') || target.closest('.close-btn')) {
    cerrarMenu();
    return;
  }

  // Open menu
  if (target.closest('.menu-btn')) {
    abrirMenu();
    return;
  }

  if (target.closest('.catalog-nav-btn')) {
    const btn = target.closest('.catalog-nav-btn');
    cambiarCatalogo(btn.dataset.direction || 'next');
    return;
  }

  // User profile click
  if (target.closest('.user-profile')) {
    window.location.href = 'perfil.html';
    return;
  }

  // Logout button
  if (target.closest('.btn-logout-green')) {
    if (window.appointmentsSystem && typeof window.appointmentsSystem.signOut === 'function') {
      window.appointmentsSystem.signOut();
    } else {
      window.location.href = 'index.html';
    }
    return;
  }

  // Service card / Ver Detalles button (delegation)
  const card = target.closest('.service-card');
  if (card && (target.closest('.btn-book') || target === card || target.closest('.service-card'))) {
    e.stopPropagation();
    const title = card.dataset.title || card.querySelector('.service-title')?.innerText || '';
    const category = card.dataset.category || card.querySelector('.service-category')?.innerText || card.querySelector('.service-label')?.innerText || '';
    const service = window.appointmentsSystem && typeof window.appointmentsSystem.getServices === 'function'
      ? window.appointmentsSystem.getServices().find((item) => item.title?.toLowerCase() === title.trim().toLowerCase())
      : null;
    const metaValue = (label) => {
      const row = [...card.querySelectorAll('.service-meta-row')].find((item) => item.querySelector('.service-meta-label')?.innerText.trim() === label);
      return row?.querySelector('.service-meta-value')?.innerText.trim() || '';
    };
    const desc = card.dataset.desc || service?.description || `Tratamiento profesional de ${title.toLowerCase()} adaptado a tus necesidades.`;
    const includes = card.dataset.includes || service?.includes || 'Evaluación personalizada, aplicación del tratamiento y cuidados recomendados.';
    const duration = card.dataset.duration || service?.duration || metaValue('Duración');
    const price = card.dataset.price || service?.price || metaValue('Precio');
    const img = card.dataset.image || card.querySelector('.service-img')?.src || '';
    abrirModal(title, category, desc, includes, duration, price, img);
    return;
  }

  // Service modal backdrop and close
  if (target.closest('#serviceModal')) {
    const modal = document.getElementById('serviceModal');
    if (e.target === modal) cerrarModal();
  }
  if (target.closest('.modal-close') && !target.closest('.modal-back')) {
    cerrarModal();
    return;
  }

  // Agendar button on service modal
  if (target.closest('.btn-agendar')) {
    if (target.closest('.btn-agendar').disabled) return;
    abrirModalAgendamiento();
    return;
  }

  // Booking modal backdrop
  if (target.closest('#bookingModal')) {
    const booking = document.getElementById('bookingModal');
    if (e.target === booking) {
      document.getElementById('bookingModal').classList.remove('active');
    }
  }

  // Modal back (return to service modal)
  if (target.closest('.modal-back')) {
    volverAModalServicio();
    return;
  }

  // Date / Time selection within booking modal
  const bookingModal = document.getElementById('bookingModal');
  if (bookingModal && bookingModal.contains(target)) {
    const dateBtn = target.closest('.date-btn, .calendar-date');
    if (dateBtn) {
      if (dateBtn.classList.contains('calendar-disabled')) return;
      const selectedDate = dateBtn.dataset.isoDate ? new Date(`${dateBtn.dataset.isoDate}T00:00:00`) : selectedBookingDate;
      syncBookingDate(selectedDate);
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
      selectedBookingTime = timeBtn.dataset.time || timeBtn.textContent.trim();
      renderBookingSchedule();
      return;
    }

    if (target.closest('.schedule-arrow')) {
      const dayDirection = target.closest('.schedule-arrow').getAttribute('aria-label') === 'Semana siguiente' ? 1 : -1;
      const nextDate = new Date(selectedBookingDate);
      nextDate.setDate(nextDate.getDate() + dayDirection);
      if (nextDate < getMinimumBookingDate()) nextDate.setTime(getMinimumBookingDate().getTime());
      syncBookingDate(nextDate);
      return;
    }

    if (target.closest('.schedule-today')) {
      syncBookingDate(getMinimumBookingDate());
      return;
    }

    if (target.closest('.calendar-nav')) {
      const direction = target.closest('.calendar-nav').getAttribute('aria-label') === 'Mes siguiente' ? 1 : -1;
      const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const monthDate = new Date(bookingCalendarMonth);
      monthDate.setMonth(monthDate.getMonth() + direction);
      if (monthDate < currentMonth) return;
      bookingCalendarMonth = monthDate;
      renderSmallBookingCalendar();
      return;
    }

    if (target.closest('.promo-catalog-btn')) {
      document.getElementById('bookingModal').classList.remove('active');
      document.getElementById('serviceModal').classList.remove('active');
      return;
    }

    const payBtn = target.closest('.btn-pay');
    if (payBtn) {
      const serviceName = document.getElementById('bookingServiceName')?.innerText || 'Servicio';
      const price = document.getElementById('bookingPrice')?.innerText || '';
      const selectedDateBtn = bookingModal.querySelector('.date-btn.active, .calendar-date.active');
      const selectedTimeBtn = bookingModal.querySelector('.time-btn.active');

      const date = selectedBookingDate ? formatBookingDate(selectedBookingDate) : (selectedDateBtn?.dataset.date || (selectedDateBtn
        ? `${selectedDateBtn.querySelector('.day')?.innerText || ''} ${selectedDateBtn.querySelector('.num')?.innerText || ''}`.trim()
        : ''));
      const time = selectedTimeBtn?.dataset.time || (selectedTimeBtn ? selectedTimeBtn.textContent.trim() : '');
      const specialist = document.getElementById('bookingSpecialistSelect')?.value || 'Cualquiera. Mejor disponible';

      let result;
      if (modifyingAppointmentId) {
        const existingAppointment = window.appointmentsSystem?.readState?.().appointments?.find((appointment) => appointment.id === modifyingAppointmentId);
        result = existingAppointment
          ? { allowed: true, appointment: { ...existingAppointment, date, time, duration: selectedBookingDuration, specialist } }
          : { allowed: false, reason: 'missing_datetime' };
      } else {
        result = window.appointmentsSystem && typeof window.appointmentsSystem.createAppointment === 'function'
          ? window.appointmentsSystem.createAppointment(serviceName, price, date, time, '', { duration: selectedBookingDuration, specialist, dateISO: localDateIso(selectedBookingDate), draft: true })
          : { allowed: false, reason: 'missing_system' };
      }

      if (!result.allowed) {
        if (result.reason === 'slot_taken') {
          showSiteAlert('Este horario ya está reservado. Por favor elige otra fecha u hora.', 'warning');
        } else if (result.reason === 'missing_datetime') {
          showSiteAlert('Selecciona una fecha y una hora antes de confirmar la cita.', 'info');
        } else if (result.reason === 'too_soon') {
          showSiteAlert('La cita debe agendarse con al menos 1 día de anticipación.', 'info');
        } else if (result.reason === 'outside_working_hours') {
          showSiteAlert('La especialista no trabaja en este día u horario. Elige otro momento.', 'info');
        } else if (result.reason === 'invalid_start_time') {
          showSiteAlert('Este servicio debe iniciar en una hora completa. Elige otro horario.', 'info');
        } else if (result.reason === 'limit_reached') {
          showSiteAlert('Actualmente te encuentras vetado y no puedes agendar nuevas citas.', 'warning');
        } else {
          showSiteAlert('No se pudo registrar la cita. Intenta de nuevo.', 'error');
        }
        return;
      }

      pendingBookingDraft = { serviceName, price, date, time, specialist, duration: selectedBookingDuration, modifyingAppointmentId };
      renderConfirmationDetails(result.appointment);
      document.getElementById('bookingModal').classList.remove('active');
      document.getElementById('confirmationModal').classList.add('active');
      return;
    }
  }

  // Modal back (return to service modal)
  if (target.closest('.modal-back')) {
    volverAModalServicio();
    return;
  }

  // Confirmation modal actions
  if (target.closest('#confirmationModal') && target.closest('.confirmation-secondary')) {
    if (!pendingBookingDraft) {
      volverAlCatalogo();
      return;
    }
    document.getElementById('confirmationModal').classList.remove('active');
    document.getElementById('bookingModal').classList.add('active');
    renderBookingSchedule();
    return;
  }

  if (target.closest('#confirmationModal') && target.closest('.confirmation-primary')) {
    if (!pendingBookingDraft) {
      volverAlCatalogo();
      return;
    }
    const draft = pendingBookingDraft;
    const result = modifyingAppointmentId && window.appointmentsSystem && typeof window.appointmentsSystem.updateAppointment === 'function'
      ? window.appointmentsSystem.updateAppointment(modifyingAppointmentId, draft.date, draft.time, { duration: draft.duration, specialist: draft.specialist, dateISO: localDateIso(selectedBookingDate) })
      : window.appointmentsSystem && typeof window.appointmentsSystem.createAppointment === 'function'
        ? window.appointmentsSystem.createAppointment(draft.serviceName, draft.price, draft.date, draft.time, '', { duration: draft.duration, specialist: draft.specialist, dateISO: localDateIso(selectedBookingDate) })
      : { allowed: false, reason: 'missing_system' };
    if (!result.allowed) {
      document.getElementById('confirmationModal').classList.remove('active');
      document.getElementById('bookingModal').classList.add('active');
      pendingBookingDraft = null;
      renderBookingSchedule();
      showSiteAlert('Este horario ya no está disponible. Elige otro.', 'warning');
      return;
    }
    pendingBookingDraft = null;
    sessionStorage.removeItem('sgc_modify_appointment_id');
    lastCreatedAppointmentId = result.appointment.id;
    document.getElementById('confirmationTitle').style.display = 'none';
    document.querySelector('.confirmation-details').style.display = 'none';
    document.querySelector('.confirmation-primary').style.display = 'none';
    document.querySelector('.confirmation-secondary').style.display = 'none';
    document.getElementById('confirmationSuccess').hidden = false;
    document.getElementById('confirmationSuccessTitle').textContent = modifyingAppointmentId ? 'Cita modificada' : 'Cita confirmada';
    document.getElementById('confirmationSuccessMessage').innerHTML = modifyingAppointmentId
      ? 'Tu cita se modificó con éxito.<br>Te esperamos en la nueva fecha y hora seleccionadas'
      : 'Se agendó tu cita con éxito.<br>Te esperamos en la fecha y hora seleccionados';
    modifyingAppointmentId = null;
    return;
  }

  if (target.closest('#confirmationModal') && target.closest('.return-to-catalog')) {
    volverAlCatalogo();
  }
});

