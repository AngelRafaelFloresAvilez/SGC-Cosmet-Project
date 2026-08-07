function abrirMenu() {
  document.getElementById('sidebarMenu').classList.add('active');
  document.getElementById('menuOverlay').classList.add('active');
}

function cerrarMenu() {
  document.getElementById('sidebarMenu').classList.remove('active');
  document.getElementById('menuOverlay').classList.remove('active');
}

function mostrarNotificaciones() {
  const panel = document.getElementById('notificationPanel');
  if (panel) {
    panel.classList.toggle('active');
  }
}

function abrirModal(titulo, categoria, desc, incluye, duracion, precio, img) {
  document.getElementById('modalTitle').innerText = titulo;
  document.getElementById('modalCategory').innerText = categoria;
  document.getElementById('modalDesc').innerText = desc;
  document.getElementById('modalIncludes').innerText = incluye;
  document.getElementById('modalDuration').innerText = duracion;
  document.getElementById('modalPrice').innerText = precio;
  document.getElementById('modalImg').src = img;

  document.getElementById('serviceModal').classList.add('active');
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

window.addEventListener('DOMContentLoaded', () => {
  if (window.appointmentsSystem && typeof window.appointmentsSystem.init === 'function') {
    window.appointmentsSystem.init();
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
      window.location.href = 'Loggin.html';
    }
    return;
  }

  // Service card / Ver Detalles button (delegation)
  const card = target.closest('.service-card');
  if (card && (target.closest('.btn-book') || target === card || target.closest('.service-card'))) {
    e.stopPropagation();
    const title = card.dataset.title || card.querySelector('.service-title')?.innerText || '';
    const category = card.dataset.category || card.querySelector('.service-category')?.innerText || '';
    const desc = card.dataset.desc || card.querySelector('.service-desc')?.innerText || '';
    const includes = card.dataset.includes || '';
    const duration = card.dataset.duration || '';
    const price = card.dataset.price || card.querySelector('.service-price')?.innerText || '';
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
    const dateBtn = target.closest('.date-btn');
    if (dateBtn) {
      seleccionarBoton(dateBtn, 'date-btn');
      return;
    }
    const timeBtn = target.closest('.time-btn');
    if (timeBtn) {
      seleccionarBoton(timeBtn, 'time-btn');
      return;
    }

    const payBtn = target.closest('.btn-pay');
    if (payBtn) {
      const serviceName = document.getElementById('bookingServiceName')?.innerText || 'Servicio';
      const price = document.getElementById('bookingPrice')?.innerText || '';
      const selectedDateBtn = bookingModal.querySelector('.date-btn.active');
      const selectedTimeBtn = bookingModal.querySelector('.time-btn.active');

      const date = selectedDateBtn
        ? `${selectedDateBtn.querySelector('.day')?.innerText || ''} ${selectedDateBtn.querySelector('.num')?.innerText || ''}`.trim()
        : '';
      const time = selectedTimeBtn ? selectedTimeBtn.textContent.trim() : '';

      const result = window.appointmentsSystem && typeof window.appointmentsSystem.createAppointment === 'function'
        ? window.appointmentsSystem.createAppointment(serviceName, price, date, time)
        : { allowed: false, reason: 'missing_system' };

      if (!result.allowed) {
        if (result.reason === 'slot_taken') {
          alert('Este horario ya está reservado. Por favor elige otra fecha u hora.');
        } else if (result.reason === 'missing_datetime') {
          alert('Selecciona una fecha y una hora antes de confirmar la cita.');
        } else if (result.reason === 'limit_reached') {
          alert('Has alcanzado el límite de citas permitidas. Intenta de nuevo más tarde.');
        } else {
          alert('No se pudo registrar la cita. Intenta de nuevo.');
        }
        return;
      }

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
  if (target.closest('#confirmationModal') && target.closest('.btn-confirm')) {
    volverAlCatalogo();
    return;
  }
});

