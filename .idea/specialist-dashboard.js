const specialistState = {
  appointments: [
    { id: 'apt-1', client: 'Ana López', service: 'Limpieza facial profunda', date: 'Hoy', time: '09:30', duration: '45 min', phone: '+52 55 1234 5678', history: ['Tratamiento previo', 'Seguimiento mensual'] },
    { id: 'apt-2', client: 'Mónica Ruiz', service: 'Microdermoabrasión', date: 'Hoy', time: '12:00', duration: '30 min', phone: '+52 55 4444 2222', history: ['Cita confirmada'] },
    { id: 'apt-3', client: 'Valeria Soto', service: 'Masaje relajante', date: 'Mañana', time: '16:00', duration: '60 min', phone: '+52 55 6666 7777', history: ['Cliente recurrente'] }
  ]
};

let selectedAppointmentId = null;

function getSharedServices() {
  const system = window.appointmentsSystem;
  if (system && typeof system.getServices === 'function') {
    return system.getServices(system.readState());
  }
  return [];
}

function getSharedAppointments() {
  const system = window.appointmentsSystem;
  const state = system && typeof system.readState === 'function' ? system.readState() : null;
  if (state && Array.isArray(state.appointments)) {
    return state.appointments.filter((item) => item.status !== 'cancelled');
  }
  return specialistState.appointments;
}

function renderSpecialistDashboard() {
  const appointments = getSharedAppointments();
  const services = getSharedServices();
  const activeAppointments = appointments.length ? appointments : specialistState.appointments;
  if (!selectedAppointmentId || !activeAppointments.some((item) => item.id === selectedAppointmentId)) {
    selectedAppointmentId = activeAppointments[0]?.id || null;
  }

  document.getElementById('todayCount').textContent = activeAppointments.filter((item) => item.status === 'pending').length;
  document.getElementById('upcomingCount').textContent = activeAppointments.filter((item) => item.status === 'pending').length;
  document.getElementById('servicesCount').textContent = services.length;

  const list = document.getElementById('appointmentList');
  list.innerHTML = activeAppointments.map((appointment) => `
        <button class="appointment-item ${appointment.id === selectedAppointmentId ? 'active' : ''}" data-id="${appointment.id}">
          <div>
            <strong>${appointment.serviceName || appointment.service}</strong>
            <div class="meta">${appointment.date} · ${appointment.time}</div>
          </div>
          <span class="pill">${appointment.price || appointment.duration}</span>
        </button>
      `).join('');

  list.querySelectorAll('.appointment-item').forEach((button) => {
    button.addEventListener('click', () => {
      selectedAppointmentId = button.dataset.id;
      renderSpecialistDashboard();
    });
  });

  const detail = document.getElementById('appointmentDetail');
  const selected = activeAppointments.find((item) => item.id === selectedAppointmentId) || activeAppointments[0];
  if (selected) {
    const cb = selected.createdBy || {};
    detail.innerHTML = `
          <h4>${selected.serviceName || selected.service}</h4>
          <p class="meta">${selected.date} · ${selected.time}</p>
          <div style="display:flex;gap:12px;align-items:center;margin-top:10px">
            <img src="${cb.avatar || 'https://i.pravatar.cc/150?img=47'}" alt="${cb.name || 'Cliente'}" class="avatar">
            <div>
              <div><strong>${cb.name || selected.client || 'Cliente SGC'}</strong></div>
              <div class="meta">${cb.email || ''} ${cb.phone ? '· ' + cb.phone : ''}</div>
            </div>
          </div>
          <div class="detail-grid">
            <div><span>Precio</span><strong>${selected.price || selected.duration}</strong></div>
            <div><span>Servicio</span><strong>${selected.serviceName || selected.service}</strong></div>
            <div><span>Horario</span><strong>${selected.time}</strong></div>
            <div><span>Estado</span><strong>${selected.summary}</strong></div>
          </div>
          <div style="margin-top:12px"><strong>Resumen</strong><p class="meta" style="margin-top:6px;">${selected.summary || 'Cita pendiente de atención.'}</p></div>
        `;
  }

  try {
    const system = window.appointmentsSystem;
    const session = system && typeof system.getSession === 'function' ? system.getSession() : null;
    const users = system && typeof system.readUsers === 'function' ? system.readUsers() : [];
    let specialistUser = null;
    if (session && session.email) {
      specialistUser = users.find((u) => u.email && u.email.toLowerCase() === session.email.toLowerCase());
    }
    if (!specialistUser) {
      specialistUser = users.find((u) => u.role === 'specialist') || null;
    }
    if (specialistUser) {
      const avatarEl = document.querySelector('.profile-card .avatar');
      if (avatarEl) avatarEl.src = specialistUser.avatar || avatarEl.src;
      const nameEl = document.getElementById('specialistName');
      if (nameEl) nameEl.textContent = `${specialistUser.name} ${specialistUser.lastName || ''}`.trim();
      const roleEl = document.getElementById('specialistRole');
      if (roleEl) roleEl.textContent = specialistUser.roleDescription || 'Especialista en estética facial';
      const contactEl = document.getElementById('specialistContact');
      if (contactEl) contactEl.textContent = `${specialistUser.email} · ${specialistUser.phone || ''}`.trim();
    }
  } catch (e) { /* ignore */ }

  const servicesList = document.getElementById('servicesList');
  servicesList.innerHTML = services.map((service) => `
        <div class="service-item">
          <div>
            <strong>${service.title || service.name}</strong>
            <div class="meta">Duración: ${service.duration} · ${service.price}</div>
          </div>
          <button class="danger" data-service-id="${service.id}">Eliminar</button>
        </div>
      `).join('');

  // Delegated handler for remove buttons
  servicesList.addEventListener('click', (e) => {
    const btn = e.target.closest('.danger');
    if (!btn) return;
    const id = btn.dataset.serviceId;
    if (id) removeService(id);
  });
}

function removeService(id) {
  const system = window.appointmentsSystem;
  if (system && typeof system.removeService === 'function') {
    system.removeService(id);
  } else {
    const services = getSharedServices().filter((service) => service.id !== id);
    if (window.appointmentsSystem && typeof window.appointmentsSystem.createService === 'function') {
      const state = window.appointmentsSystem.readState();
      state.services = services;
      localStorage.setItem('sgc_appointments_state_v1', JSON.stringify(state));
      window.dispatchEvent(new Event('sgc-state-updated'));
    }
  }
  renderSpecialistDashboard();
}

function initSpecialistDashboard() {
  const addServiceBtn = document.getElementById('addServiceBtn');
  if (addServiceBtn) {
    addServiceBtn.addEventListener('click', () => {
      const modal = document.getElementById('addServiceModal');
      if (modal) modal.classList.add('active');
    });
  }

  const signOutBtn = document.getElementById('specialistSignOut');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      if (window.appointmentsSystem && typeof window.appointmentsSystem.signOut === 'function') {
        window.appointmentsSystem.signOut();
      } else {
        window.location.href = 'Loggin.html';
      }
    });
  }

  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const todayLabel = document.getElementById('todayLabel');
      if (todayLabel) {
        todayLabel.textContent = button.dataset.range === 'day' ? 'Hoy' : button.dataset.range === 'week' ? 'Semana' : 'Mes';
      }
    });
  });

  window.addEventListener('sgc-state-updated', renderSpecialistDashboard);
  renderSpecialistDashboard();
}

window.addEventListener('DOMContentLoaded', initSpecialistDashboard);
