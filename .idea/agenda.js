let agendaRange = 'day';
let agendaOffset = 0;

function agendaAppointments() {
  const system = window.appointmentsSystem;
  const state = system?.readState?.() || { appointments: [] };
  return state.appointments || [];
}

function formatTime(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function agendaClientName(appointment) {
  const directName = appointment.createdBy?.name || appointment.client;
  if (directName) return directName;
  const email = appointment.createdBy?.email;
  const user = email && window.appointmentsSystem?.readUsers?.().find((item) => item.email?.toLowerCase() === email.toLowerCase());
  return user ? `${user.name || ''} ${user.lastName || ''}`.trim() : 'Cliente no identificado';
}

function agendaStatus(status) {
  return { pending: 'Pendiente', confirmed: 'Confirmada', previous: 'Atendida', completed: 'Atendida', no_show: 'No asistió', cancelled: 'Cancelada' }[status] || 'Pendiente';
}

function renderAgenda() {
  const appointments = agendaAppointments();
  const timeColumn = document.getElementById('timeColumn');
  const scheduleGrid = document.getElementById('scheduleGrid');
  const periodLabel = document.getElementById('periodLabel');
  const nextAppointment = document.getElementById('nextAppointment');
  const daySummary = document.getElementById('daySummary');
  const times = ['08:00 A.M', '10:00 A.M', '12:00 P.M', '02:00 P.M', '04:00 P.M', '06:00 P.M'];
  const scheduledAppointments = appointments.filter((appointment) => ['pending', 'confirmed', 'previous', 'completed'].includes(appointment.status));
  timeColumn.innerHTML = times.map((time) => `<span>${time}</span>`).join('');
  const filtered = agendaRange === 'day' ? scheduledAppointments.slice(0, 6) : scheduledAppointments;
  periodLabel.textContent = agendaRange === 'day' ? '29 Jun - 06 Jul 2026' : agendaRange === 'week' ? '29 Jun - 06 Jul 2026' : 'Junio 2026';
  scheduleGrid.innerHTML = filtered.length ? filtered.map((appointment, index) => `
    <button class="schedule-item" type="button" data-id="${appointment.id}" style="top:${Math.min(index, 5) * 108}px">
      <strong>${agendaClientName(appointment)}</strong>
      <small>${appointment.serviceName || appointment.service}</small>
      <span class="schedule-time">${formatTime(appointment.time)}</span>
      <span class="status">${agendaStatus(appointment.status)}</span>
    </button>
  `).join('') : '<p class="meta">No hay citas para este periodo.</p>';
  const next = scheduledAppointments.find((appointment) => ['pending', 'confirmed'].includes(appointment.status));
  nextAppointment.innerHTML = next ? `<div class="next-appointment"><div><strong>${agendaClientName(next)}</strong><strong>${next.serviceName || next.service}</strong><small>${next.date} · ${next.time}</small></div></div>` : '<p class="meta">No hay próximas citas.</p>';
  const counts = { programmed: scheduledAppointments.length, confirmed: scheduledAppointments.filter((item) => item.status === 'confirmed').length, pending: scheduledAppointments.filter((item) => item.status === 'pending').length, attended: scheduledAppointments.filter((item) => ['previous', 'completed'].includes(item.status)).length, cancelled: appointments.filter((item) => item.status === 'cancelled').length };
  daySummary.innerHTML = [['fa-calendar', 'Citas programadas', counts.programmed], ['fa-circle-check', 'Citas confirmadas', counts.confirmed], ['fa-clock', 'Citas pendientes', counts.pending], ['fa-hand-holding-heart', 'Citas atendidas', counts.attended], ['fa-ban', 'Citas canceladas', counts.cancelled]].map(([icon, label, count]) => `<div class="summary-row"><i class="fa-regular ${icon}"></i><strong>${label}</strong><b>${count}</b></div>`).join('');
  const sidebarRole = document.getElementById('sidebarUserRole');
  if (sidebarRole) sidebarRole.textContent = 'Especialista';
  scheduleGrid.querySelectorAll('[data-id]').forEach((item) => item.addEventListener('click', () => { window.location.href = `detalle-cita.html#appointment-${item.dataset.id}`; }));
}

document.addEventListener('DOMContentLoaded', () => {
  const users = window.appointmentsSystem?.readUsers?.() || [];
  const session = window.appointmentsSystem?.getSession?.();
  const specialist = session?.role === 'specialist'
    ? users.find((user) => user.email?.toLowerCase() === session.email?.toLowerCase())
    : users.find((user) => user.role === 'specialist');
  if (specialist) {
    const name = `${specialist.name || ''} ${specialist.lastName || ''}`.trim();
    document.getElementById('specialistName').textContent = name;
    document.getElementById('sidebarUserName').textContent = name;
  }
  const menuTrigger = document.getElementById('menuTrigger');
  const sidebar = document.getElementById('sidebarMenu');
  const overlay = document.getElementById('menuOverlay');
  const closeMenu = () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); };
  menuTrigger?.addEventListener('click', () => { sidebar.classList.toggle('active'); overlay.classList.toggle('active'); });
  overlay?.addEventListener('click', closeMenu);
  document.querySelectorAll('.range-selector button').forEach((button) => button.addEventListener('click', () => { agendaRange = button.dataset.range; document.querySelectorAll('.range-selector button').forEach((item) => item.classList.toggle('active', item === button)); renderAgenda(); }));
  document.getElementById('previousPeriod')?.addEventListener('click', () => { agendaOffset -= 1; renderAgenda(); });
  document.getElementById('nextPeriod')?.addEventListener('click', () => { agendaOffset += 1; renderAgenda(); });
  document.getElementById('todayButton')?.addEventListener('click', () => { agendaOffset = 0; renderAgenda(); });
  document.getElementById('signOutBtn')?.addEventListener('click', () => window.appointmentsSystem?.signOut?.());
  window.addEventListener('sgc-state-updated', renderAgenda);
  window.addEventListener('storage', (event) => {
    if (event.key === 'sgc_appointments_state_v1' || event.key === 'sgc_auth_users_v1') renderAgenda();
  });
  renderAgenda();
});
