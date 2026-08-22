const specialistState = {
  appointments: [
      { id: 'apt-1', client: 'Ana López', service: 'Limpieza facial profunda', date: 'Hoy', time: '09:30', duration: '45 min', phone: '+52 55 1234 5678', history: ['Tratamiento previo', 'Seguimiento mensual'], status: 'pending' },
      { id: 'apt-2', client: 'Mónica Ruiz', service: 'Microdermoabrasión', date: 'Hoy', time: '12:00', duration: '30 min', phone: '+52 55 4444 2222', history: ['Cita confirmada'], status: 'previous' },
      { id: 'apt-3', client: 'Valeria Soto', service: 'Masaje relajante', date: 'Mañana', time: '16:00', duration: '60 min', phone: '+52 55 6666 7777', history: ['Cliente recurrente'], status: 'pending' }
      ]
    };

    let selectedAppointmentId = null;
    // Rango activo de los botones Día / Semana / Mes de la agenda.
    let agendaRange = 'day';
  let agendaPage = 1;
  let upcomingPage = 1;

const AGENDA_TITLES = { day: 'Agenda hoy', week: 'Agenda de la semana', month: 'Agenda del mes' };

function appointmentDate(appointment) {
  const system = window.appointmentsSystem;
  return system && typeof system.resolveAppointmentDate === 'function'
    ? system.resolveAppointmentDate(appointment)
    : null;
}

// Limites [inicio, fin] del rango elegido, contados desde hoy hacia adelante.
function agendaBounds(range) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  if (range === 'week') end.setDate(end.getDate() + 6);
  else if (range === 'month') { end.setMonth(end.getMonth() + 1); end.setDate(0); }
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function isWithinRange(appointment, range) {
  const date = appointmentDate(appointment);
  if (!date || Number.isNaN(date.getTime())) return false;
  const { start, end } = agendaBounds(range);
  return date >= start && date <= end;
}

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
    // Solo las citas de este especialista (mas las que aun no tienen asignacion),
    // no las de todo el negocio.
    const session = typeof system.getSession === 'function' ? system.getSession() : null;
    const email = String(session?.email || '').toLowerCase();
    return state.appointments.filter((item) => {
      if (item.status === 'cancelled') return false;
      if (!email) return true;
      const assigned = String(item.specialistEmail || '').toLowerCase();
      return !assigned || assigned === email;
    });
  }
  return null;
}

function getClientName(appointment) {
  const directName = appointment.createdBy?.name || appointment.client;
  if (directName) return directName;
  const email = appointment.createdBy?.email;
  const user = email && window.appointmentsSystem?.readUsers?.().find((item) => item.email?.toLowerCase() === email.toLowerCase());
  return user ? `${user.name || ''} ${user.lastName || ''}`.trim() : 'Cliente no identificado';
}

function getAppointmentStatusLabel(status) {
  return { pending: 'Pendiente', confirmed: 'Confirmada', previous: 'Completada', completed: 'Completada', no_show: 'No asistió', cancelled: 'Cancelada' }[status] || 'Pendiente';
}

function renderDashboardPager(container, page, totalPages, onChange) {
  if (!container) return;
  container.innerHTML = `<button type="button" data-page="prev"${page === 1 ? ' disabled' : ''} aria-label="Página anterior">‹</button>${Array.from({ length: totalPages }, (_, index) => `<button type="button" data-page="${index + 1}"${index + 1 === page ? ' class="active"' : ''}>${index + 1}</button>`).join('')}<button type="button" data-page="next"${page === totalPages ? ' disabled' : ''} aria-label="Página siguiente">›</button>`;
  container.querySelectorAll('button:not([disabled])').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.page;
      onChange(value === 'prev' ? page - 1 : value === 'next' ? page + 1 : Number(value));
    });
  });
}

function renderSpecialistDashboard() {
  const appointments = getSharedAppointments();
  const services = getSharedServices();
  const activeAppointments = Array.isArray(appointments) ? appointments : specialistState.appointments;
  const currentAppointments = activeAppointments.filter((item) => ['pending', 'confirmed'].includes(item.status));
  const visibleAppointments = activeAppointments.filter((item) => ['pending', 'confirmed', 'previous', 'completed'].includes(item.status));
  if (selectedAppointmentId && !activeAppointments.some((item) => item.id === selectedAppointmentId)) selectedAppointmentId = null;
  const hashAppointmentId = window.location.hash.startsWith('#appointment-') ? window.location.hash.slice(13) : '';
  if (hashAppointmentId && activeAppointments.some((item) => item.id === hashAppointmentId)) selectedAppointmentId = hashAppointmentId;

  // "Citas hoy" son las de hoy; "Pendiente" son las que faltan por confirmar.
  // Antes ambas mostraban el mismo total de citas activas.
  document.getElementById('todayCount').textContent =
    visibleAppointments.filter((item) => isWithinRange(item, 'day')).length;
  document.getElementById('upcomingCount').textContent =
    currentAppointments.filter((item) => item.status === 'pending').length;
  const completedAppointments = activeAppointments.filter((item) => ['previous', 'completed'].includes(item.status));
  const ratings = activeAppointments.map((item) => Number(item.rating)).filter((rating) => rating > 0);
  const completedCount = document.getElementById('completedCount');
  const averageRating = document.getElementById('averageRating');
  if (completedCount) completedCount.textContent = completedAppointments.length;
  if (averageRating) averageRating.textContent = ratings.length ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1) : '0';
  document.getElementById('servicesCount').textContent = services.length;
  const welcomeName = document.getElementById('welcomeName');
  const specialistName = document.getElementById('specialistName');
  if (welcomeName && specialistName) welcomeName.textContent = specialistName.textContent;

  const todayLabel = document.getElementById('todayLabel');
  if (todayLabel) {
    const today = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    todayLabel.textContent = `Hoy: ${today}, aquí tienes un resumen de tu jornada de hoy`;
  }

  const list = document.getElementById('appointmentList');
  // determine session role to render inline action buttons per item
  const system = window.appointmentsSystem;
  const session = system && typeof system.getSession === 'function' ? system.getSession() : null;
  const isSpecialist = session && session.role === 'specialist';

  // La agenda muestra el rango seleccionado, no todas las citas activas.
  const agendaTitle = document.querySelector('.agenda-panel .section-title');
  if (agendaTitle) agendaTitle.textContent = AGENDA_TITLES[agendaRange] || AGENDA_TITLES.day;

  const agendaAppointments = currentAppointments
    .concat(activeAppointments.filter((appointment) => ['previous', 'completed'].includes(appointment.status)))
    .filter((appointment) => isWithinRange(appointment, agendaRange))
    .sort((a, b) => (appointmentDate(a) || 0) - (appointmentDate(b) || 0));
  const pageSize = 3;
  const agendaPages = Math.max(1, Math.ceil(agendaAppointments.length / pageSize));
  agendaPage = Math.min(agendaPage, agendaPages);
  const visibleAgendaAppointments = agendaAppointments.slice((agendaPage - 1) * pageSize, agendaPage * pageSize);

  list.innerHTML = agendaAppointments.length ? visibleAgendaAppointments.map((appointment) => `
        <div class="appointment-item ${appointment.id === selectedAppointmentId ? 'active' : ''}" data-id="${appointment.id}">
          <i class="appointment-avatar fa-regular fa-user" aria-hidden="true"></i>
          <div style="flex:1;text-align:left">
            <strong class="appointment-client-name">${getClientName(appointment)}</strong>
            <strong class="appointment-service-title">${appointment.serviceName || appointment.service}</strong>
            <div class="meta appointment-date-line"><time>${appointment.time || '--:--'}</time></div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            ${isSpecialist && ['pending', 'confirmed'].includes(appointment.status) ? `<button class="btn btn-appoint-confirm primary" data-confirm-id="${appointment.id}" title="Confirmar">Confirmar</button><button class="btn btn-appoint-noshow secondary" data-noshow-id="${appointment.id}" title="No asistió">No asistió</button>` : ''}
            <span class="pill">${getAppointmentStatusLabel(appointment.status)}</span>
          </div>
        </div>
      `).join('') : `<p class="empty-agenda">No hay citas ${agendaRange === 'day' ? 'para hoy' : agendaRange === 'week' ? 'esta semana' : 'este mes'}.</p>`;
  renderDashboardPager(document.getElementById('agendaPager'), agendaPage, agendaPages, (page) => { agendaPage = page; renderSpecialistDashboard(); });

  const upcomingList = document.getElementById('upcomingAppointmentsList');
  if (upcomingList) {
    // Solo lo que aun no ocurre, lo mas cercano primero.
    const now = new Date();
    const upcoming = currentAppointments
      .filter((appointment) => {
        const date = appointmentDate(appointment);
        return date && !Number.isNaN(date.getTime()) && date >= now;
      })
      .sort((a, b) => (appointmentDate(a) || 0) - (appointmentDate(b) || 0));
    const upcomingPages = Math.max(1, Math.ceil(upcoming.length / pageSize));
    upcomingPage = Math.min(upcomingPage, upcomingPages);
    const visibleUpcoming = upcoming.slice((upcomingPage - 1) * pageSize, upcomingPage * pageSize);
    upcomingList.innerHTML = upcoming.length
      ? visibleUpcoming.map((appointment) => {
        const client = getClientName(appointment);
        return `<div class="upcoming-item"><i class="upcoming-avatar fa-regular fa-user" aria-hidden="true"></i><div><strong class="upcoming-service-title">${appointment.serviceName || appointment.service}</strong><small>${appointment.date} · ${appointment.time}</small><small>${client}</small></div></div>`;
      }).join('')
      : '<div class="meta">No hay próximas citas.</div>';
    renderDashboardPager(document.getElementById('upcomingPager'), upcomingPage, upcomingPages, (page) => { upcomingPage = page; renderSpecialistDashboard(); });
  }

  const remindersList = document.getElementById('remindersList');
  if (remindersList) {
    const pending = activeAppointments.filter((item) => item.status === 'pending').length;
    const newClients = new Set(activeAppointments.map((item) => item.createdBy?.email || item.client).filter(Boolean)).size;
    const reviewCount = activeAppointments.filter((item) => Number(item.rating) > 0).length;
    remindersList.innerHTML = `
      <div class="reminder-item"><i class="fa-regular fa-calendar"></i><span>Tienes ${pending} citas pendientes por confirmar</span></div>
      <div class="reminder-item"><i class="fa-regular fa-user"></i><span>${newClients} clientes activos esta semana</span></div>
      <div class="reminder-item"><i class="fa-regular fa-star"></i><span>Tienes ${reviewCount} nuevas reseñas</span></div>
    `;
  }

  // clicking whole item selects it; delegated handlers manage confirm/noshow buttons
  list.querySelectorAll('.appointment-item').forEach((el) => {
    el.addEventListener('click', (event) => {
      if (event?.target?.closest?.('button')) return;
      window.location.href = `detalle-cita.html#appointment-${el.dataset.id}`;
    });
  });

  

  const detail = document.getElementById('appointmentDetail');
  const selected = activeAppointments.find((item) => item.id === selectedAppointmentId) || null;
  if (selected) {
    const cb = selected.createdBy || {};
    const clientAppointments = activeAppointments.filter((appointment) => {
      const selectedClient = cb.email || cb.name || selected.client;
      const appointmentClient = appointment.createdBy?.email || appointment.createdBy?.name || appointment.client;
      return selectedClient && appointmentClient === selectedClient;
    }).slice(0, 3);
    if (!clientAppointments.length) clientAppointments.push(selected);
    const clientName = getClientName(selected);
      detail.hidden = false;
    // reuse previously-determined `isSpecialist` from top of renderSpecialistDashboard
    detail.innerHTML = `
        <button class="detail-close" type="button" aria-label="Cerrar detalle">&times;</button>
        <h3>Detalle de cita</h3>
          <h4>${selected.serviceName || selected.service}</h4>
          <p class="meta">${selected.date} · ${selected.time}</p>
          <div style="display:flex;gap:12px;align-items:center;margin-top:10px">
            <img src="${cb.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=150'}" alt="${cb.name || 'Cliente'}" class="avatar">
            <div>
              <div><strong>${clientName}</strong></div>
              <div class="meta">${cb.email || ''} ${cb.phone ? '· ' + cb.phone : ''}</div>
            </div>
          </div>
          <section class="client-detail-summary">
            <div class="client-detail-profile">
              <img src="${cb.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=150'}" alt="${clientName}">
              <div><strong>${clientName}</strong><small>${cb.phone || 'Cliente frecuente'}</small></div>
            </div>
            <div class="client-history"><h4>Historial del cliente</h4>${clientAppointments.length ? clientAppointments.map((appointment) => `<div class="client-history-row"><span>${appointment.serviceName || appointment.service}</span><small>${appointment.date}</small><b>${appointment.rating ? Number(appointment.rating).toFixed(1) : '-'}</b></div>`).join('') : '<p class="meta">Sin historial disponible.</p>'}</div>
          </section>
          <div class="detail-grid">
            <div><span>Precio</span><strong>${selected.price || selected.duration}</strong></div>
            <div><span>Servicio</span><strong>${selected.serviceName || selected.service}</strong></div>
            <div><span>Horario</span><strong>${selected.time}</strong></div>
            <div><span>Estado</span><strong>${selected.summary}</strong></div>
            ${selected.status === 'previous' || selected.status === 'completed' ? `<div><span>Metodo de pago</span><strong>${selected.paymentMethod || '--'}</strong></div><div><span>Total pagado</span><strong>${selected.total != null ? `$${selected.total} MXN` : selected.price || '--'}</strong></div>` : ''}
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

    detail.querySelector('.detail-close')?.addEventListener('click', () => {
      detail.hidden = true;
      history.replaceState(null, '', window.location.pathname);
    });

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
  } else {
    detail.hidden = true;
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
      if (roleEl) roleEl.textContent = 'Especialista';
      const contactEl = document.getElementById('specialistContact');
      if (contactEl) contactEl.textContent = `${specialistUser.email} · ${specialistUser.phone || ''}`.trim();
      const welcomeName = document.getElementById('welcomeName');
      if (welcomeName && nameEl) welcomeName.textContent = nameEl.textContent;
      const sidebarName = document.getElementById('sidebarUserName');
      if (sidebarName && nameEl) sidebarName.textContent = nameEl.textContent;
      const sidebarRole = document.getElementById('sidebarUserRole');
      if (sidebarRole) sidebarRole.textContent = 'Especialista';
      const sidebarAvatar = document.getElementById('sidebarUserAvatar');
      if (sidebarAvatar) {
        sidebarAvatar.innerHTML = `<img src="${specialistUser.avatar || 'https://www.gravatar.com/avatar/?d=mp&s=150'}" alt="${nameEl ? nameEl.textContent : 'Especialista'}">`;
      }
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
  const menuButton = document.querySelector('.menu-trigger');
  const sidebarMenu = document.getElementById('sidebarMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const closeSidebar = () => {
    sidebarMenu?.classList.remove('active');
    menuOverlay?.classList.remove('active');
    menuButton?.classList.remove('active');
  };
  menuButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = sidebarMenu?.classList.toggle('active');
    menuOverlay?.classList.toggle('active', Boolean(isOpen));
    menuButton.classList.toggle('active', Boolean(isOpen));
  });
  menuOverlay?.addEventListener('click', closeSidebar);

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
    const users = window.appointmentsSystem && typeof window.appointmentsSystem.readUsers === 'function' ? window.appointmentsSystem.readUsers() : [];
    const session = window.appointmentsSystem && typeof window.appointmentsSystem.getSession === 'function' ? window.appointmentsSystem.getSession() : null;
    const specialist = session?.role === 'specialist'
      ? users.find((user) => user.email?.toLowerCase() === session.email?.toLowerCase())
      : users.find((user) => user.role === 'specialist');
    const profile = specialist || state.profile || {};
    profileNameInput.value = profile.name ? `${profile.name} ${profile.lastName || ''}`.trim() : '';
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
  if (editBtn) editBtn.addEventListener('click', (e) => { e.preventDefault && e.preventDefault(); e.stopPropagation && e.stopPropagation(); window.location.href = 'perfil-especialista.html'; });
  document.querySelector('.nav-profile-link')?.addEventListener('click', (event) => {
    event.preventDefault();
    closeSidebar();
    window.location.href = 'perfil-especialista.html';
  });
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
      // Cambia el rango de la agenda y la repinta. Antes solo reescribia el
      // subtitulo de bienvenida con la palabra "Semana" y no filtraba nada.
      agendaRange = button.dataset.range || 'day';
      agendaPage = 1;
      renderSpecialistDashboard();
    });
  });

  window.addEventListener('sgc-state-updated', renderSpecialistDashboard);
  window.addEventListener('storage', (event) => {
    if (event.key === 'sgc_appointments_state_v1' || event.key === 'sgc_auth_users_v1') renderSpecialistDashboard();
  });
  renderSpecialistDashboard();
}

window.addEventListener('DOMContentLoaded', initSpecialistDashboard);
