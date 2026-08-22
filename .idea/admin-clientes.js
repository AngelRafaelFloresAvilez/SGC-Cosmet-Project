/* Gestion de clientes: las faltas salen de las citas marcadas "no asistió". */
document.addEventListener('admin-shell-ready', function () {
  const data = window.sgcAdminData;
  const ui = window.sgcAdminShell;

  const STATUS_LABEL = {
    pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada',
    previous: 'Atendida', completed: 'Completada', no_show: 'No asistió'
  };

  const searchInput = document.getElementById('search');
  const statusFilter = document.getElementById('statusFilter');
  const rowsBody = document.getElementById('rows');
  const pagerBox = document.getElementById('pager');
  let page = 1;

  function isBanned(client) { return client.status === 'banned' || client.status === 'vetado'; }

  function filtered() {
    const term = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    return data.getClients().filter((client) => {
      if (status === 'banned' && !isBanned(client)) return false;
      if (status === 'active' && isBanned(client)) return false;
      if (!term) return true;
      return `${data.fullName(client)} ${client.email} ${client.phone}`.toLowerCase().includes(term);
    });
  }

  function renderStats() {
    const clients = data.getClients();
    const counts = data.noShowCountByClient();
    document.getElementById('statTotal').textContent = clients.length;
    document.getElementById('statActive').textContent = clients.filter((client) => !isBanned(client)).length;
    document.getElementById('statBanned').textContent = clients.filter(isBanned).length;
    document.getElementById('statNoShows').textContent = Object.values(counts).reduce((a, b) => a + b, 0);
  }

  function renderRows() {
    const counts = data.noShowCountByClient();
    const all = filtered();
    const pageInfo = ui.paginate(all, page, 5);
    page = pageInfo.page;

    if (!pageInfo.rows.length) {
      rowsBody.innerHTML = '<tr class="empty-row"><td colspan="6">No hay clientes que coincidan con la busqueda.</td></tr>';
      pagerBox.innerHTML = '';
      return;
    }

    rowsBody.innerHTML = pageInfo.rows.map((client) => {
      const banned = isBanned(client);
      const faltas = counts[String(client.email || '').toLowerCase()] || 0;
      return `
        <tr data-email="${ui.escapeHtml(client.email)}">
          <td>
            <div class="cell-person">
              <span class="avatar round">${client.avatar
                ? `<img src="${ui.escapeHtml(client.avatar)}" alt="">`
                : '<i class="fa-regular fa-user"></i>'}</span>
              <span><b>${ui.escapeHtml(data.fullName(client))}</b></span>
            </div>
          </td>
          <td>${ui.escapeHtml(client.phone || '—')}</td>
          <td>${ui.escapeHtml(client.email)}</td>
          <td>${faltas}</td>
          <td><span class="tag ${banned ? 'tag-danger' : 'tag-ok'}">${banned ? 'Vetado' : 'Activo'}</span></td>
          <td>
            <div class="kebab-wrap">
              <button class="icon-btn" type="button" aria-label="Acciones"><i class="fa-solid fa-ellipsis-vertical"></i></button>
              <div class="kebab-menu">
                <button type="button" data-action="history"><i class="fa-regular fa-rectangle-list"></i> Ver historial de citas</button>
                ${banned
                  ? '<button type="button" data-action="unban"><i class="fa-solid fa-user-check"></i> Reactivar cliente</button>'
                  : '<button type="button" data-action="ban" class="danger"><i class="fa-solid fa-user-slash"></i> Vetar cliente</button>'}
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    ui.bindKebabs(rowsBody);
    ui.renderPager(pagerBox, pageInfo, (next) => { page = next; renderRows(); });
  }

  function openHistory(client) {
    const email = String(client.email || '').toLowerCase();
    const history = data.getAppointments()
      .filter((appointment) => data.clientEmailOf(appointment) === email)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    ui.openModal(`
      <button class="modal-close" type="button" data-close aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>
      <h2>Historial de ${ui.escapeHtml(data.fullName(client))}</h2>
      <p class="modal-sub">${history.length} ${history.length === 1 ? 'cita registrada' : 'citas registradas'} en el sistema</p>
      ${history.length ? `
        <table class="data" style="margin-top:12px">
          <thead><tr><th>Servicio</th><th>Fecha</th><th>Hora</th><th>Estado</th></tr></thead>
          <tbody>
            ${history.map((appointment) => {
              const date = data.appointmentDate(appointment);
              return `
                <tr>
                  <td>${ui.escapeHtml(appointment.serviceName || '—')}</td>
                  <td>${date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : ui.escapeHtml(appointment.date || '—')}</td>
                  <td>${ui.escapeHtml(appointment.time || '—')}</td>
                  <td>${ui.escapeHtml(STATUS_LABEL[appointment.status] || appointment.status || '—')}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      ` : '<p class="muted" style="padding:24px 0">Este cliente aun no ha agendado citas.</p>'}
    `, { wide: true });
  }

  rowsBody.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const email = button.closest('tr').dataset.email;
    const client = data.getClients().find((item) => item.email === email);
    if (!client) return;

    const action = button.dataset.action;
    if (action === 'history') { openHistory(client); return; }
    if (action === 'unban') {
      data.setClientStatus(email, 'active');
      ui.flash('Cliente reactivado');
      return;
    }
    ui.confirmAction(`¿Vetar a ${data.fullName(client)}? No podra agendar nuevas citas.`, () => {
      data.setClientStatus(email, 'banned');
      ui.flash('Cliente vetado');
    });
  });

  searchInput.addEventListener('input', () => { page = 1; renderRows(); });
  statusFilter.addEventListener('change', () => { page = 1; renderRows(); });

  function renderAll() { renderStats(); renderRows(); }
  renderAll();
  window.addEventListener('sgc-state-updated', renderAll);
});
