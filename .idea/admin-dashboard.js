/* Dashboard del administrador: resumen del negocio calculado en vivo. */
document.addEventListener('admin-shell-ready', function (event) {
  const data = window.sgcAdminData;
  const charts = window.sgcAdminCharts;
  const ui = window.sgcAdminShell;
  const session = event.detail.session;

  function relativeTime(isoDate) {
    if (!isoDate) return '';
    const diff = Date.now() - new Date(isoDate).getTime();
    if (Number.isNaN(diff)) return '';
    if (diff < 0) return 'Ahora'; // una marca futura no deberia pasar, pero no rompe la vista
    const minutes = Math.round(diff / 60000);
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `Hace ${hours} hrs`;
    const days = Math.round(hours / 24);
    return days === 1 ? 'Ayer' : `Hace ${days} días`;
  }

  function appointmentDateLabel(appointment) {
    const date = data.appointmentDate(appointment);
    if (!date || Number.isNaN(date.getTime())) return appointment.date || '';
    return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  function renderHeader() {
    document.getElementById('welcomeName').textContent = session.name || 'administrador';
    const today = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('todayLabel').textContent = `Hoy: ${today}, aqui tienes un resumen del rendimiento del negocio`;
  }

  function renderStats() {
    const summary = data.stats();
    document.getElementById('statToday').textContent = summary.appointmentsToday;
    document.getElementById('statNewClients').textContent = summary.clientsNewThisMonth;
    document.getElementById('statSpecialists').textContent = summary.specialistsActive;
    document.getElementById('statRevenue').textContent = data.formatMoney(summary.revenueThisMonth);
  }

  function renderWeeklyChart() {
    charts.lineChart(
      document.getElementById('weeklyChart'),
      data.weeklySeries().map((point) => ({ label: point.label, value: point.value })),
      { legend: String(new Date().getFullYear()) }
    );
  }

  function renderPending() {
    const container = document.getElementById('pendingList');
    const users = data.readUsers();
    const pending = data.getAppointments()
      .filter((appointment) => appointment.status === 'pending')
      .slice(0, 4);

    if (!pending.length) {
      container.innerHTML = '<p class="muted">No hay citas pendientes por confirmar.</p>';
      return;
    }

    container.innerHTML = pending.map((appointment) => `
      <a class="pending-item" href="admin-citas.html?cita=${encodeURIComponent(appointment.id)}" style="text-decoration:none;color:inherit">
        <span class="avatar"><i class="fa-regular fa-user"></i></span>
        <span class="who">
          <b>${ui.escapeHtml(data.clientNameOf(appointment, users))}</b>
          <small>${ui.escapeHtml(appointment.serviceName || 'Servicio')}</small>
        </span>
        <span class="when">
          <b>${ui.escapeHtml(appointmentDateLabel(appointment))}</b>
          ${ui.escapeHtml(appointment.time || '')}
        </span>
      </a>
    `).join('');
  }

  function renderTopServices() {
    const container = document.getElementById('topServicesList');
    const rows = data.topServices(4);
    if (!rows.length) {
      container.innerHTML = '<p class="muted">Aun no hay citas registradas.</p>';
      return;
    }
    container.innerHTML = rows.map((row) => `
      <div class="top-service">
        ${row.image
          ? `<img class="swatch" src="${ui.escapeHtml(row.image)}" alt="">`
          : '<span class="swatch"></span>'}
        <b>${ui.escapeHtml(row.name)}</b>
        <span class="count">${row.count}<small>citas</small></span>
      </div>
    `).join('');
  }

  function renderActivity() {
    const container = document.getElementById('activityList');
    const users = data.readUsers();

    const events = data.getAppointments()
      .filter((appointment) => appointment.createdAt)
      .map((appointment) => {
        const who = data.clientNameOf(appointment, users);
        if (appointment.status === 'cancelled') {
          return { icon: 'fa-regular fa-clock', tone: 'red', text: `${who} cancelo una cita`, at: appointment.createdAt };
        }
        if (appointment.status === 'no_show') {
          return { icon: 'fa-regular fa-circle-xmark', tone: 'red', text: `${who} no asistio a su cita`, at: appointment.createdAt };
        }
        if (appointment.status === 'previous' || appointment.status === 'completed') {
          return { icon: 'fa-regular fa-circle-check', tone: '', text: `Cita atendida de ${who}`, at: appointment.createdAt };
        }
        return { icon: 'fa-regular fa-calendar', tone: '', text: `Nueva cita realizada por ${who}`, at: appointment.createdAt };
      });

    const clientEvents = users
      .filter((user) => user.role === 'client' && user.createdAt)
      .map((user) => ({
        icon: 'fa-regular fa-user', tone: 'grey',
        text: `Nuevo cliente registrado: ${data.fullName(user)}`, at: user.createdAt
      }));

    const feed = [...events, ...clientEvents]
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 5);

    if (!feed.length) {
      container.innerHTML = '<p class="muted">Sin actividad registrada todavia.</p>';
      return;
    }

    container.innerHTML = feed.map((item) => `
      <div class="activity-item">
        <i class="${item.icon} ${item.tone}"></i>
        <span class="txt">${ui.escapeHtml(item.text)}</span>
        <span class="ago">${ui.escapeHtml(relativeTime(item.at))}</span>
      </div>
    `).join('');
  }

  function renderReminders() {
    const container = document.getElementById('remindersList');
    const summary = data.stats();
    const atRisk = data.clientsWithNoShows().filter((row) => row.count >= 2).length;
    const unassigned = data.getAppointments().filter((appointment) =>
      !appointment.specialistEmail && appointment.status !== 'cancelled' && appointment.status !== 'previous'
    ).length;

    const reminders = [];
    if (summary.pending) {
      reminders.push({
        accent: true, icon: 'fa-regular fa-calendar',
        title: `Tienes ${summary.pending} ${summary.pending === 1 ? 'cita pendiente' : 'citas pendientes'} por confirmar`,
        subtitle: 'Revisa para evitar cancelaciones'
      });
    }
    if (atRisk) {
      reminders.push({
        icon: 'fa-regular fa-clock',
        title: `${atRisk} ${atRisk === 1 ? 'cliente tiene' : 'clientes tienen'} 2 o mas faltas`,
        subtitle: 'Podrian ser vetados si reciben otra falta'
      });
    }
    if (unassigned) {
      reminders.push({
        icon: 'fa-solid fa-user-plus',
        title: `${unassigned} ${unassigned === 1 ? 'cita sin especialista' : 'citas sin especialista'} asignado`,
        subtitle: 'Asignalas desde Gestion de citas'
      });
    }
    if (!reminders.length) {
      reminders.push({ accent: true, icon: 'fa-regular fa-circle-check', title: 'Todo en orden', subtitle: 'No hay pendientes que requieran tu atencion' });
    }

    container.innerHTML = reminders.map((reminder) => `
      <div class="reminder${reminder.accent ? ' accent' : ''}">
        <i class="${reminder.icon}"></i>
        <div><b>${ui.escapeHtml(reminder.title)}</b><small>${ui.escapeHtml(reminder.subtitle)}</small></div>
      </div>
    `).join('');
  }

  function renderSpecialists() {
    const container = document.getElementById('specialistsList');
    const specialists = data.getSpecialists().slice(0, 4);
    if (!specialists.length) {
      container.innerHTML = '<p class="muted">No hay especialistas registrados.</p>';
      return;
    }

    // "En cita" = tiene una cita confirmada hoy; si no, esta disponible.
    const today = new Date();
    const appointments = data.getAppointments();

    container.innerHTML = specialists.map((specialist) => {
      const email = String(specialist.email || '').toLowerCase();
      const busy = appointments.some((appointment) => {
        if (String(appointment.specialistEmail || '').toLowerCase() !== email) return false;
        if (appointment.status !== 'confirmed' && appointment.status !== 'pending') return false;
        const date = data.appointmentDate(appointment);
        return date && date.toDateString() === today.toDateString();
      });
      const inactive = specialist.active === false;
      return `
        <div class="person-row">
          <span class="avatar">${specialist.avatar
            ? `<img src="${ui.escapeHtml(specialist.avatar)}" alt="">`
            : '<i class="fa-regular fa-user"></i>'}</span>
          <span class="meta">
            <b>${ui.escapeHtml(data.fullName(specialist))}</b>
            <small>${ui.escapeHtml(specialist.specialty || 'Especialista')}</small>
          </span>
          <span class="tag ${inactive ? 'tag-neutral' : busy ? 'tag-warn' : 'tag-ok'}">${inactive ? 'Inactivo' : busy ? 'En cita' : 'Disponible'}</span>
        </div>
      `;
    }).join('');
  }

  function renderAll() {
    renderStats();
    renderWeeklyChart();
    renderPending();
    renderTopServices();
    renderActivity();
    renderReminders();
    renderSpecialists();
  }

  renderHeader();
  renderAll();
  window.addEventListener('sgc-state-updated', renderAll);
});
