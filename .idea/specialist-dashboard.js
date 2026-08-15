const specialistState = {
  appointments: [
      { id: 'apt-1', client: 'Ana López', service: 'Limpieza facial profunda', date: 'Hoy', time: '09:30', duration: '45 min', phone: '+52 55 1234 5678', history: ['Tratamiento previo', 'Seguimiento mensual'], status: 'pending' },
      { id: 'apt-2', client: 'Mónica Ruiz', service: 'Microdermoabrasión', date: 'Hoy', time: '12:00', duration: '30 min', phone: '+52 55 4444 2222', history: ['Cita confirmada'], status: 'previous' },
      { id: 'apt-3', client: 'Valeria Soto', service: 'Masaje relajante', date: 'Mañana', time: '16:00', duration: '60 min', phone: '+52 55 6666 7777', history: ['Cliente recurrente'], status: 'pending' }
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
  // determine session role to render inline action buttons per item
  const system = window.appointmentsSystem;
  const session = system && typeof system.getSession === 'function' ? system.getSession() : null;
  const isSpecialist = session && session.role === 'specialist';

  list.innerHTML = activeAppointments.map((appointment) => `
        <div class="appointment-item ${appointment.id === selectedAppointmentId ? 'active' : ''}" data-id="${appointment.id}">
          <div style="flex:1;text-align:left">
            <strong>${appointment.serviceName || appointment.service}</strong>
            <div class="meta">${appointment.date} · ${appointment.time}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            ${isSpecialist && appointment.status !== 'previous' && appointment.status !== 'cancelled' ? `<button class="btn btn-appoint-confirm primary" data-confirm-id="${appointment.id}" title="Confirmar">Confirmar</button><button class="btn btn-appoint-noshow secondary" data-noshow-id="${appointment.id}" title="No asistió">No asistió</button>` : ''}
            <span class="pill">${appointment.price || appointment.duration}</span>
          </div>
        </div>
      `).join('');

  // clicking whole item selects it; delegated handlers manage confirm/noshow buttons
  list.querySelectorAll('.appointment-item').forEach((el) => {
    el.addEventListener('click', () => {
      selectedAppointmentId = el.dataset.id;
      renderSpecialistDashboard();
    });
  });

  

  const detail = document.getElementById('appointmentDetail');
  const selected = activeAppointments.find((item) => item.id === selectedAppointmentId) || activeAppointments[0];
  if (selected) {
    const cb = selected.createdBy || {};
    // reuse previously-determined `isSpecialist` from top of renderSpecialistDashboard
    detail.innerHTML = `
          <h4>${selected.serviceName || selected.service}</h4>
          <p class="meta">${selected.date} · ${selected.time}</p>
          <div style="display:flex;gap:12px;align-items:center;margin-top:10px">
            <img src="${cb.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=150'}" alt="${cb.name || 'Cliente'}" class="avatar">
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
        ${(() => {
          // show specialist actions when session is specialist and appointment is not completed/cancelled
          if (isSpecialist && selected.status !== 'previous' && selected.status !== 'cancelled') {
            return `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
                <button class="btn primary" id="confirmAppointmentBtn" data-appointment-id="${selected.id}" style="flex:1;">Confirmar</button>
                <button class="btn primary" id="completeAppointmentBtn" data-appointment-id="${selected.id}" style="flex:1;">Marcar como terminada</button>
                <button class="btn secondary" id="noshowAppointmentBtn" data-appointment-id="${selected.id}" style="flex:1;border:1px solid var(--danger);color:var(--danger);">No asistió</button>
              </div>`;
          }
          // for non-specialists or already finished appointments, show a compact completed button if applicable
          if (selected.status !== 'previous' && selected.status !== 'cancelled') {
            return `<button class="btn primary" id="completeAppointmentBtn" data-appointment-id="${selected.id}" style="margin-top:18px;width:100%;max-width:280px;">Marcar como terminada</button>`;
          }
          return '';
        })()}
        `;

    const completeBtn = detail.querySelector('#completeAppointmentBtn');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        if (window.appointmentsSystem && typeof window.appointmentsSystem.specialistConfirmAppointment === 'function') {
          const result = window.appointmentsSystem.specialistConfirmAppointment(completeBtn.dataset.appointmentId);
          if (result.allowed) {
            renderSpecialistDashboard();
          }
        }
      });
    }
    const confirmBtn = detail.querySelector('#confirmAppointmentBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (window.appointmentsSystem && typeof window.appointmentsSystem.specialistMarkConfirmed === 'function') {
          const res = window.appointmentsSystem.specialistMarkConfirmed(confirmBtn.dataset.appointmentId);
          if (res.allowed) renderSpecialistDashboard();
        }
      });
    }
    const noshowBtn = detail.querySelector('#noshowAppointmentBtn');
    if (noshowBtn) {
      noshowBtn.addEventListener('click', () => {
        if (window.appointmentsSystem && typeof window.appointmentsSystem.specialistMarkNoShow === 'function') {
          const res = window.appointmentsSystem.specialistMarkNoShow(noshowBtn.dataset.appointmentId);
          if (res.allowed) renderSpecialistDashboard();
        }
      });
    }
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
  servicesList.innerHTML = services.map((service) => {
    const hasImg = service.image && service.image.length;
    const thumb = hasImg
      ? `<img src="${service.image}" alt="${service.title || service.name}" style="width:64px;height:48px;object-fit:cover;border-radius:8px;margin-right:10px">`
      : `<div class="service-thumb placeholder" style="width:64px;height:48px;border-radius:8px;margin-right:10px;display:flex;align-items:center;justify-content:center;background:rgba(178,210,150,0.12);color:var(--primary-green);font-weight:700;font-size:0.8rem">No imagen</div>`;
    return `
      <div class="service-item">
        <div style="display:flex;align-items:center">
          ${thumb}
          <div>
            <strong>${service.title || service.name}</strong>
            <div class="meta">Duración: ${service.duration || '-'} · ${service.price || '-'}</div>
          </div>
        </div>
        <button class="danger" data-service-id="${service.id}">Eliminar</button>
      </div>
    `;
  }).join('');

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
      if (modal) modal.style.display = 'flex';
    });
  }

  // delegated click handlers for inline appointment actions (single attachment)
  const appointmentListEl = document.getElementById('appointmentList');
  if (appointmentListEl) {
    appointmentListEl.addEventListener('click', (e) => {
      const confirmBtn = e.target.closest('.btn-appoint-confirm');
      if (confirmBtn) {
        e.stopPropagation();
        const id = confirmBtn.dataset.confirmId;
        if (window.appointmentsSystem && typeof window.appointmentsSystem.specialistMarkConfirmed === 'function') {
          const res = window.appointmentsSystem.specialistMarkConfirmed(id);
          if (res.allowed) renderSpecialistDashboard();
        }
        return;
      }
      const noshowBtn = e.target.closest('.btn-appoint-noshow');
      if (noshowBtn) {
        e.stopPropagation();
        const id = noshowBtn.dataset.noshowId;
        if (window.appointmentsSystem && typeof window.appointmentsSystem.specialistMarkNoShow === 'function') {
          const res = window.appointmentsSystem.specialistMarkNoShow(id);
          if (res.allowed) renderSpecialistDashboard();
        }
        return;
      }
    });
  }

  // Add service modal actions
  const cancelAdd = document.getElementById('cancelAddService');
  const saveAdd = document.getElementById('saveAddService');
  const serviceTitleInput = document.getElementById('serviceTitleInput');
  const serviceDurationInput = document.getElementById('serviceDurationInput');
  const servicePriceInput = document.getElementById('servicePriceInput');
  const serviceDescInput = document.getElementById('serviceDescInput');
  const addServiceModalEl = document.getElementById('addServiceModal');
  if (cancelAdd) cancelAdd.addEventListener('click', (e) => { e && e.preventDefault && e.preventDefault(); if (addServiceModalEl) addServiceModalEl.style.display = 'none'; });
  if (saveAdd) saveAdd.addEventListener('click', (e) => {
    e && e.preventDefault && e.preventDefault();
    const payload = {
      title: (serviceTitleInput && serviceTitleInput.value) || 'Servicio',
      duration: (serviceDurationInput && serviceDurationInput.value) || '45 minutos',
      price: (servicePriceInput && servicePriceInput.value) || '$0 MXN',
      description: (serviceDescInput && serviceDescInput.value) || ''
    };
    if (window.appointmentsSystem && typeof window.appointmentsSystem.createService === 'function') {
      window.appointmentsSystem.createService(payload);
      window.showSiteAlert('Servicio agregado', 'success');
    }
    if (addServiceModalEl) addServiceModalEl.style.display = 'none';
    renderSpecialistDashboard();
  });

  const signOutBtn = document.getElementById('specialistSignOut');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      if (window.appointmentsSystem && typeof window.appointmentsSystem.signOut === 'function') {
        window.appointmentsSystem.signOut();
      } else {
        window.location.href = 'index.html';
      }
    });
  }

  // Edit profile modal handling
  const editBtn = document.getElementById('editProfileBtn');
  const editModal = document.getElementById('editProfileModal');
  const profileNameInput = document.getElementById('profileNameInput');
  const profileEmailInput = document.getElementById('profileEmailInput');
  const profilePhoneInput = document.getElementById('profilePhoneInput');
  const profileAvatarInput = document.getElementById('profileAvatarInput');
  const avatarFileName = document.getElementById('avatarFileName');
  let avatarDataUrl = null;

  function openEditProfile() {
    if (!editModal) return;
    const state = window.appointmentsSystem && typeof window.appointmentsSystem.readState === 'function' ? window.appointmentsSystem.readState() : {};
    const profile = state.profile || {};
    profileNameInput.value = profile.name || '';
    profileEmailInput.value = profile.email || '';
    profilePhoneInput.value = profile.phone || '';
    avatarFileName.textContent = 'Ningún archivo seleccionado';
    avatarDataUrl = null;
    editModal.style.display = 'flex';
  }

  function closeEditProfile() {
    if (!editModal) return;
    editModal.style.display = 'none';
  }
  if (editBtn) editBtn.addEventListener('click', (e) => { e.preventDefault && e.preventDefault(); e.stopPropagation && e.stopPropagation(); openEditProfile(); });
  const cancelEdit = document.getElementById('cancelEditProfile');
  const saveEdit = document.getElementById('saveEditProfile');
  if (cancelEdit) cancelEdit.addEventListener('click', (e) => { e && e.preventDefault && e.preventDefault(); closeEditProfile(); });

  if (profileAvatarInput) {
    profileAvatarInput.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      avatarFileName.textContent = f.name || 'Archivo seleccionado';
      const reader = new FileReader();
      reader.onload = function (evt) {
        avatarDataUrl = evt.target.result;
      };
      reader.readAsDataURL(f);
    });
  }

  if (saveEdit) {
    saveEdit.addEventListener('click', (e) => {
      e && e.preventDefault && e.preventDefault();
      const values = {
        name: profileNameInput.value || undefined,
        email: profileEmailInput.value || undefined,
        phone: profilePhoneInput.value || undefined
      };
      if (window.appointmentsSystem && typeof window.appointmentsSystem.setProfile === 'function') {
        window.appointmentsSystem.setProfile(values);
      } else {
        try {
          const state = window.appointmentsSystem.readState();
          state.profile = { ...(state.profile || {}), ...values };
          localStorage.setItem('sgc_appointments_state_v1', JSON.stringify(state));
        } catch (e) { /* ignore */ }
      }
      if (avatarDataUrl && window.appointmentsSystem && typeof window.appointmentsSystem.setProfileAvatar === 'function') {
        window.appointmentsSystem.setProfileAvatar(avatarDataUrl);
      }
      window.dispatchEvent(new Event('sgc-state-updated'));
      closeEditProfile();
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
