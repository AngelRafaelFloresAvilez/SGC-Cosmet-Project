function detailClientName(appointment) {
  const directName = appointment.createdBy?.name || appointment.client;
  if (directName) return directName;
  const email = appointment.createdBy?.email;
  const user = email && window.appointmentsSystem?.readUsers?.().find((item) => item.email?.toLowerCase() === email.toLowerCase());
  return user ? `${user.name || ''} ${user.lastName || ''}`.trim() : 'Cliente no identificado';
}

function detailStatus(status) {
  return { pending: 'Pendiente', confirmed: 'Confirmada', previous: 'Atendida', completed: 'Atendida', no_show: 'No asistió', cancelled: 'Cancelada' }[status] || 'Pendiente';
}

function renderAppointmentDetail() {
  const state = window.appointmentsSystem?.readState?.() || { appointments: [] };
  const appointmentId = window.location.hash.startsWith('#appointment-') ? window.location.hash.slice(13) : '';
  const appointment = state.appointments.find((item) => item.id === appointmentId) || state.appointments.find((item) => ['pending', 'confirmed'].includes(item.status));
  const clientCard = document.getElementById('clientCard');
  const serviceCard = document.getElementById('serviceCard');
  const historyList = document.getElementById('clientHistory');
  if (!appointment) {
    clientCard.innerHTML = '<p class="meta">No se encontró la cita.</p>';
    serviceCard.innerHTML = '<p class="meta">Regresa a Agenda para seleccionar una cita.</p>';
    historyList.innerHTML = '';
    return;
  }
  const clientName = detailClientName(appointment);
  const client = appointment.createdBy || {};
  const clientUser = client.email && window.appointmentsSystem?.readUsers?.().find((user) => user.email?.toLowerCase() === client.email.toLowerCase());
  const clientRecord = { ...clientUser, ...client };
  const related = state.appointments.filter((item) => {
    const selectedKey = client.email || client.name || appointment.client;
    const itemKey = item.createdBy?.email || item.createdBy?.name || item.client;
    return selectedKey && itemKey === selectedKey;
  });
  if (!related.length) related.push(appointment);
  clientCard.innerHTML = `<div class="client-avatar">${clientRecord.avatar ? `<img src="${clientRecord.avatar}" alt="${clientName}">` : '<i class="fa-regular fa-user"></i>'}</div><h2>${clientName}</h2><p>${clientRecord.phone || 'Teléfono no registrado'}</p><p class="client-frequency">Cliente frecuente</p>`;
  const paymentDetails = ['previous', 'completed'].includes(appointment.status) ? `<dt>Metodo de pago</dt><dd>${appointment.paymentMethod || 'No registrado'}</dd><dt>Subtotal</dt><dd>${appointment.subtotal != null ? `$${appointment.subtotal} MXN` : appointment.price || 'No registrado'}</dd><dt>Total pagado</dt><dd>${appointment.total != null ? `$${appointment.total} MXN` : appointment.price || 'No registrado'}</dd>` : '';
  serviceCard.innerHTML = `<dl><dt>Servicio</dt><dd>${appointment.serviceName || appointment.service || 'Servicio no registrado'}</dd><dt>Fecha</dt><dd>${appointment.date || 'Fecha no registrada'}</dd><dt>Hora</dt><dd>${appointment.time || 'Hora no registrada'}</dd><dt>Duración</dt><dd>${appointment.duration ? `${appointment.duration} minutos` : 'No registrada'}</dd><dt>Ubicación</dt><dd>${appointment.location || 'No registrada'}</dd><dt>Precio</dt><dd>${appointment.price || appointment.discountedPrice || 'No registrado'}</dd>${paymentDetails}<dt>Estado</dt><dd><span class="status-pill">${detailStatus(appointment.status)}</span></dd></dl>`;
  historyList.innerHTML = related.map((item) => `<div class="history-entry"><i class="history-icon fa-regular fa-calendar-check" aria-hidden="true"></i><div><strong>${item.serviceName || item.service || 'Servicio'}</strong><small>${item.date || 'Fecha no registrada'}</small></div><div class="history-rating"><span>${item.rating ? '★★★★★' : '—'}</span><b>${item.rating ? Number(item.rating).toFixed(1) : ''}</b></div></div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const users = window.appointmentsSystem?.readUsers?.() || [];
  const session = window.appointmentsSystem?.getSession?.();
  const specialist = session?.role === 'specialist'
    ? users.find((user) => user.email?.toLowerCase() === session.email?.toLowerCase())
    : users.find((user) => user.role === 'specialist');
  if (specialist) {
    const name = `${specialist.name || ''} ${specialist.lastName || ''}`.trim();
    document.getElementById('sidebarUserName').textContent = name;
    document.querySelector('.sidebar-user-role').textContent = 'Especialista';
    document.getElementById('specialistName').textContent = name;
  }
  const menuTrigger = document.querySelector('.menu-trigger');
  const sidebar = document.getElementById('sidebarMenu');
  const overlay = document.getElementById('menuOverlay');
  const closeMenu = () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); menuTrigger.classList.remove('active'); };
  menuTrigger?.addEventListener('click', () => { const open = sidebar.classList.toggle('active'); overlay.classList.toggle('active', open); menuTrigger.classList.toggle('active', open); });
  overlay?.addEventListener('click', closeMenu);
  document.getElementById('signOutBtn')?.addEventListener('click', () => window.appointmentsSystem?.signOut?.());
  renderAppointmentDetail();
  window.addEventListener('hashchange', renderAppointmentDetail);
});
