/* Reportes: todo se recalcula desde las citas reales segun el rango elegido. */
document.addEventListener('admin-shell-ready', function () {
  const data = window.sgcAdminData;
  const charts = window.sgcAdminCharts;
  const ui = window.sgcAdminShell;

  const RANGE = {
    day: { days: 1, label: 'hoy' },
    week: { days: 7, label: 'esta semana' },
    month: { days: 30, label: 'este mes' }
  };

  let range = 'month';
  let noShowPage = 1;
  let servicePage = 1;

  // El rango siempre termina al final de hoy: una cita agendada para la proxima
  // semana no es una "cita realizada".
  function rangeBounds() {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (RANGE[range].days - 1));
    return { start, end };
  }

  function appointmentsInRange() {
    const { start, end } = rangeBounds();
    return data.getAppointments().filter((appointment) => {
      const date = data.appointmentDate(appointment);
      return date && !Number.isNaN(date.getTime()) && date >= start && date <= end;
    });
  }

  function renderStats() {
    const inRange = appointmentsInRange();
    const summary = data.stats();
    const label = RANGE[range].label;

    document.getElementById('statAppointments').textContent =
      inRange.filter((appointment) => ['previous', 'completed'].includes(appointment.status)).length;
    document.getElementById('statAppointmentsLabel').textContent = `Citas realizadas ${label}`;

    document.getElementById('statClients').textContent = summary.clientsNewThisMonth;
    document.getElementById('statSpecialists').textContent = summary.specialistsActive;

    const revenue = inRange.reduce((sum, appointment) => (
      !['previous', 'completed'].includes(appointment.status)
        ? sum
        : sum + data.parseMoney(appointment.total ?? appointment.price)
    ), 0);
    document.getElementById('statRevenue').textContent = data.formatMoney(revenue);
    document.getElementById('statRevenueLabel').textContent = `Ventas ${label}`;
  }

  function renderCharts() {
    charts.lineChart(
      document.getElementById('revenueChart'),
      data.revenueSeries(RANGE[range].days === 1 ? 7 : RANGE[range].days).map((point) => ({ label: point.label, value: point.value })),
      { money: true }
    );
    charts.barChart(
      document.getElementById('weekdayChart'),
      data.weeklySeries().map((point) => ({ label: point.short, value: point.value }))
    );
  }

  function renderNoShows() {
    const container = document.getElementById('noShowList');
    const rows = data.clientsWithNoShows();
    if (!rows.length) {
      container.innerHTML = '<p class="muted">Ningun cliente registra inasistencias.</p>';
      document.getElementById('noShowPager').innerHTML = '';
      return;
    }
    const pageInfo = ui.paginate(rows, noShowPage, 5);
    noShowPage = pageInfo.page;
    container.innerHTML = pageInfo.rows.map((row) => `
      <div class="rank-item alert">
        <span class="n"><i class="fa-regular fa-user"></i></span>
        <span class="label">${ui.escapeHtml(row.name)}</span>
        <span class="value">${row.count} ${row.count === 1 ? 'Inasistencia' : 'Inasistencias'}</span>
      </div>
    `).join('');
    ui.renderPager(document.getElementById('noShowPager'), pageInfo, (next) => { noShowPage = next; renderNoShows(); });
  }

  function renderServices() {
    const rows = data.topServices();
    const body = document.getElementById('serviceRows');
    const summary = document.getElementById('serviceSummary');
    if (!rows.length) {
      body.innerHTML = '<tr class="empty-row"><td colspan="3">Aun no hay citas registradas.</td></tr>';
      summary.textContent = '';
      document.getElementById('servicePager').innerHTML = '';
      return;
    }
    const pageInfo = ui.paginate(rows, servicePage, 3);
    servicePage = pageInfo.page;
    body.innerHTML = pageInfo.rows.map((row) => `
      <tr>
        <td>
          <div class="cell-person">
            ${row.image ? `<img class="swatch" style="width:42px;height:42px;border-radius:10px;object-fit:cover" src="${ui.escapeHtml(row.image)}" alt="">` : '<span class="swatch" style="width:42px;height:42px;border-radius:10px;background:var(--green-300)"></span>'}
            <span><b>${ui.escapeHtml(row.name)}</b></span>
          </div>
        </td>
        <td>${row.count}</td>
        <td>${data.formatMoney(row.revenue)}</td>
      </tr>
    `).join('');
    const from = (pageInfo.page - 1) * 3 + 1;
    const to = Math.min(pageInfo.page * 3, rows.length);
    summary.textContent = `Mostrando ${from} a ${to} de ${rows.length} servicios`;
    ui.renderPager(document.getElementById('servicePager'), pageInfo, (next) => { servicePage = next; renderServices(); });
  }

  function renderCancellations() {
    const body = document.getElementById('cancelRows');
    const users = data.readUsers();
    const cancelled = data.getAppointments()
      .filter((appointment) => appointment.status === 'cancelled')
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 6);

    if (!cancelled.length) {
      body.innerHTML = '<tr class="empty-row"><td colspan="5">No hay cancelaciones registradas.</td></tr>';
      return;
    }

    body.innerHTML = cancelled.map((appointment) => {
      const date = data.appointmentDate(appointment);
      return `
        <tr>
          <td>${ui.escapeHtml(data.clientNameOf(appointment, users))}</td>
          <td>${ui.escapeHtml(appointment.serviceName || '—')}</td>
          <td>${date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : ui.escapeHtml(appointment.date || '—')}</td>
          <td>${ui.escapeHtml(appointment.time || '—')}</td>
          <td>${ui.escapeHtml(appointment.cancelReason || 'Sin motivo')}</td>
        </tr>
      `;
    }).join('');
  }

  document.getElementById('rangeSwitch').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-range]');
    if (!button) return;
    document.querySelectorAll('#rangeSwitch button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    range = button.dataset.range;
    renderStats();
    renderCharts();
  });

  function renderAll() {
    renderStats();
    renderCharts();
    renderNoShows();
    renderServices();
    renderCancellations();
  }

  renderAll();
  window.addEventListener('sgc-state-updated', renderAll);
});
