document.addEventListener('DOMContentLoaded', function () {
  const session = (function () {
    try {
      if (window.appointmentsSystem && typeof window.appointmentsSystem.getSession === 'function') {
        const s = window.appointmentsSystem.getSession();
        if (s) return s;
      }
      if (window.sgcAuth && typeof window.sgcAuth.getSession === 'function') {
        const s2 = window.sgcAuth.getSession();
        if (s2) return s2;
      }
      // fallback to direct sessionStorage read
      const raw = sessionStorage.getItem('sgc_active_session_v1');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore and treat as no session
    }
    return null;
  })();

  if (!session || session.role !== 'admin') {
    if (window.appointmentsSystem && typeof window.appointmentsSystem.clearSession === 'function') {
      window.appointmentsSystem.clearSession();
    }
    window.location.href = 'Loggin.html';
    return;
  }

  let state = window.appointmentsSystem && typeof window.appointmentsSystem.readState === 'function'
    ? window.appointmentsSystem.readState()
    : { appointments: [], services: [], payments: [] };
  let users = window.appointmentsSystem && typeof window.appointmentsSystem.readUsers === 'function'
    ? window.appointmentsSystem.readUsers()
    : [];
  let specialistUsers = users.filter((user) => user.role === 'specialist');

  const adminName = document.getElementById('adminName');
  const statAppointmentsToday = document.getElementById('statAppointmentsToday');
  const statNewClients = document.getElementById('statNewClients');
  const statSpecialistsActive = document.getElementById('statSpecialistsActive');
  const statSalesMonth = document.getElementById('statSalesMonth');
  const pendingAppointmentsList = document.getElementById('pendingAppointmentsList');
  const topServicesList = document.getElementById('topServicesList');
  const activityFeed = document.getElementById('activityFeed');
  const remindersList = document.getElementById('remindersList');
  const specialistsList = document.getElementById('specialistsList');
  const signOutBtn = document.getElementById('signOutBtn');
  const viewAllBtn = document.getElementById('viewAllAppointments');

  function formatCurrency(value) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  function parseCurrency(value) {
    const sanitized = String(value || '').replace(/[^0-9,.]/g, '').replace(/,/g, '.');
    const numeric = Number(sanitized);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  function buildChart() {
    const chart = document.getElementById('appointmentsChart');
    if (!chart) return;
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const dailyCounts = days.map((day) => {
      return (state.appointments || []).filter((appt) => {
        const dateText = String(appt.date || '').toLowerCase();
        return dateText.includes(day.toLowerCase().slice(0, 3));
      }).length;
    });
    const maxCount = Math.max(...dailyCounts, 10);

    chart.innerHTML = `
      <div class="chart-grid">
        ${days.map((day, index) => `
          <div class="chart-column">
            <span class="chart-bar chart-bar-primary" style="height:${Math.max((dailyCounts[index] / maxCount) * 220, 24)}px"></span>
            <small>${day.slice(0, 3)}</small>
          </div>
        `).join('')}
      </div>
    `;
  }

  function buildPendingAppointments() {
    if (!pendingAppointmentsList) return;
    const appointments = (state.appointments || []).filter((appt) => appt.status === 'pending').slice(0, 3);
    pendingAppointmentsList.innerHTML = appointments.length
      ? appointments.map((appt) => `
          <div class="item">
            <div>
              <strong>${appt.client || appt.createdBy?.name || 'Cliente'}</strong>
              <small>${appt.serviceName || 'Servicio pendiente'}</small>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
              <div style="text-align:right"><small>${appt.date || ''}</small> · <strong>${appt.time || ''}</strong></div>
              <div style="display:flex;gap:8px;margin-top:6px">
                <button class="text-button" onclick="(function(id){ if(window.appointmentsSystem && typeof window.appointmentsSystem.adminConfirmAppointment==='function'){ window.appointmentsSystem.adminConfirmAppointment(id); } })('${appt.id}')">Confirmar</button>
                <button class="text-button" onclick="(function(id){ if(window.appointmentsSystem && typeof window.appointmentsSystem.removeAppointment==='function'){ window.appointmentsSystem.removeAppointment(id); window.dispatchEvent(new Event('sgc-state-updated')); } })('${appt.id}')">Eliminar</button>
                <button class="text-button" onclick="window.location.href='citas.html'">Ver</button>
              </div>
            </div>
          </div>
        `).join('')
      : '<div class="item"><strong>No hay citas pendientes</strong></div>';
  }

  function buildTopServices() {
    if (!topServicesList) return;
    const services = state.services || [];
    const counts = {};
    (state.appointments || []).forEach((appt) => {
      const serviceName = appt.serviceName || appt.service || 'Servicio';
      counts[serviceName] = (counts[serviceName] || 0) + 1;
    });
    const serviceCounts = services.map((service) => ({
      title: service.title || service.name || 'Servicio',
      description: service.description || '',
      count: counts[service.title] || 0
    })).sort((a, b) => b.count - a.count).slice(0, 4);
    topServicesList.innerHTML = serviceCounts.length
      ? serviceCounts.map((service) => `
          <div class="item">
            <div>
              <strong>${service.title}</strong>
              <small>${service.description || 'Servicio destacado'}</small>
            </div>
            <div>
              <strong>${service.count}</strong>
              <small>citas</small>
            </div>
          </div>
        `).join('')
      : '<div class="item"><strong>No hay servicios registrados</strong></div>';
  }

  function buildActivityFeed() {
    if (!activityFeed) return;
    const appointmentEvents = (state.appointments || []).slice(0, 3).map((appt) => ({
      title: `${appt.status === 'pending' ? 'Nueva cita pendiente' : appt.status === 'cancelled' ? 'Cita cancelada' : 'Cita registrada'}: ${appt.serviceName || 'Servicio'}`,
      time: appt.createdAt ? new Date(appt.createdAt).toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : 'Reciente'
    }));
    const paymentEvents = (state.payments || []).slice(0, 2).map((payment) => ({
      title: `Pago registrado de ${payment.amount || '$0'} para ${payment.description || 'servicio'}`,
      time: payment.date || 'Reciente'
    }));
    const events = [...appointmentEvents, ...paymentEvents].slice(0, 4);
    activityFeed.innerHTML = events.length
      ? events.map((event) => `
          <div class="activity-item">
            <strong>${event.title}</strong>
            <small>${event.time}</small>
          </div>
        `).join('')
      : '<div class="activity-item"><strong>No hay actividad reciente</strong></div>';
  }

  function buildReminders() {
    if (!remindersList) return;
    const pendingCount = (state.appointments || []).filter((appt) => appt.status === 'pending').length;
    const cancelledCount = (state.appointments || []).filter((appt) => appt.status === 'cancelled').length;
    const reminders = [
      { title: `${pendingCount} citas pendientes por confirmar`, subtitle: 'Atiende los pendientes para mantener la agenda al día.' },
      { title: `${cancelledCount} citas canceladas`, subtitle: 'Revisa las cancelaciones y verifica si hay reprogramaciones.' }
    ];
    remindersList.innerHTML = reminders.map((reminder) => `
      <div class="reminder-item">
        <strong>${reminder.title}</strong>
        <small>${reminder.subtitle}</small>
      </div>
    `).join('');
  }

  function buildSpecialistsList() {
    if (!specialistsList) return;
    specialistsList.innerHTML = specialistUsers.slice(0, 4).map((specialist) => {
      const avatar = specialist.avatar || '';
      const avatarHtml = avatar ? `<img src="${avatar}" alt="${specialist.name}" style="width:44px;height:44px;border-radius:50%;object-fit:cover">` : `<span class="specialist-avatar">${specialist.name?.charAt(0) || 'S'}</span>`;
      return `
      <div class="specialist-item">
        <div style="display:flex;gap:12px;align-items:center">
          ${avatarHtml}
          <div class="specialist-meta">
            <strong>${specialist.name}</strong>
            <small>${specialist.email}</small>
          </div>
        </div>
        <div>
          <small>${specialist.phone || 'Sin teléfono'}</small>
        </div>
      </div>
      `;
    }).join('');
  }

  // Promotions rendering
  const promotionsList = document.getElementById('promotionsList');
  const createPromotionBtn = document.getElementById('createPromotionBtn');

  function buildPromotions() {
    if (!promotionsList) return;
    const promos = (window.appointmentsSystem && typeof window.appointmentsSystem.getPromotions === 'function') ? window.appointmentsSystem.getPromotions() : (state.promotions || []);
    promotionsList.innerHTML = promos.length
      ? promos.map((p) => `
        <div class="promo-item">
          <div>
            <strong>${p.title}</strong>
            <small>${p.description || ''}</small>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <small>${p.validUntil || ''}</small>
            <button class="text-button" onclick="(function(id){ if(window.appointmentsSystem && typeof window.appointmentsSystem.updatePromotion==='function'){ const newTitle = prompt('Editar título', ''); if(newTitle!=null){ window.appointmentsSystem.updatePromotion(id,{ title:newTitle }); } } })('${p.id}')">Editar</button>
            <button class="text-button" onclick="(function(id){ if(window.appointmentsSystem && typeof window.appointmentsSystem.deletePromotion==='function'){ if(confirm('Eliminar promoción?')){ window.appointmentsSystem.deletePromotion(id); } } })('${p.id}')">Eliminar</button>
          </div>
        </div>
      `).join('')
      : '<div class="item"><strong>No hay promociones</strong></div>';
  }

  if (createPromotionBtn) {
    createPromotionBtn.addEventListener('click', () => {
      const title = prompt('Nombre de la promoción (ej. 20% en tu próxima cita)');
      if (!title) return;
      const description = prompt('Descripción (opcional)') || '';
      const validUntil = prompt('Válida hasta (dd/mm/aaaa)') || '';
      if (window.appointmentsSystem && typeof window.appointmentsSystem.createPromotion === 'function') {
        window.appointmentsSystem.createPromotion({ title, description, validUntil, tag: 'Admin' });
      }
    });
  }

  function updateStats() {
    if (statAppointmentsToday) {
      const today = new Date().toLocaleDateString('es-MX');
      const todayCount = (state.appointments || []).filter((appointment) => String(appointment.date || '').toLowerCase().includes('hoy') || String(appointment.date || '').includes(today)).length;
      statAppointmentsToday.textContent = `${todayCount}`;
    }
    if (statNewClients) statNewClients.textContent = `${users.filter((user) => user.role === 'client').length}`;
    if (statSpecialistsActive) statSpecialistsActive.textContent = `${specialistUsers.length}`;
    if (statSalesMonth) {
        const paymentsTotal = (state.payments || []).reduce((total, payment) => total + parseCurrency(payment.amount), 0);
      const appointmentTotal = (state.appointments || []).reduce((total, appt) => {
        const priceValue = parseCurrency(appt.price);
        return total + priceValue;
      }, 0);
      statSalesMonth.textContent = formatCurrency(paymentsTotal || appointmentTotal || 0);
    }
  }

  function init() {
    if (adminName) adminName.textContent = session.name || 'Administrador';
    buildChart();
    buildPendingAppointments();
    buildTopServices();
    buildActivityFeed();
    buildReminders();
    buildSpecialistsList();
    buildPromotions();
    updateStats();
  }

  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      window.location.href = 'citas.html';
    });
  }

  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      if (window.appointmentsSystem && typeof window.appointmentsSystem.clearSession === 'function') {
        window.appointmentsSystem.clearSession();
      }
      window.location.href = 'Loggin.html';
    });
  }

  init();
  // refresh when global state changes
  window.addEventListener('sgc-state-updated', function () {
    try {
      // re-read state and users
      const freshState = window.appointmentsSystem && typeof window.appointmentsSystem.readState === 'function' ? window.appointmentsSystem.readState() : state;
      const freshUsers = window.appointmentsSystem && typeof window.appointmentsSystem.readUsers === 'function' ? window.appointmentsSystem.readUsers() : users;
      if (freshState) {
        state = freshState;
        users = freshUsers || users;
        specialistUsers = users.filter((u) => u.role === 'specialist');
        // rebuild UI
        buildChart();
        buildPendingAppointments();
        buildTopServices();
        buildActivityFeed();
        buildReminders();
        buildSpecialistsList();
        buildPromotions();
        updateStats();
      }
    } catch (e) { /* ignore */ }
  });
});
