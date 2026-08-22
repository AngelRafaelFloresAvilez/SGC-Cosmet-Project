/* Control de citas: todas las citas del sistema, de todos los clientes. */
document.addEventListener('admin-shell-ready', function () {
  const data = window.sgcAdminData;
  const ui = window.sgcAdminShell;

  const STATUS = {
    pending: { label: 'Pendiente', tag: 'tag-warn' },
    confirmed: { label: 'Confirmada', tag: 'tag-ok' },
    previous: { label: 'Atendida', tag: 'tag-ok' },
    completed: { label: 'Completada', tag: 'tag-ok' },
    no_show: { label: 'No asistió', tag: 'tag-danger' },
    cancelled: { label: 'Cancelada', tag: 'tag-danger' }
  };

  const searchInput = document.getElementById('search');
  const statusFilter = document.getElementById('statusFilter');
  const rowsBody = document.getElementById('rows');
  const pagerBox = document.getElementById('pager');
  let page = 1;

  // Permite entrar directo desde el dashboard o la campana de notificaciones.
  const params = new URLSearchParams(window.location.search);
  if (params.get('estado')) statusFilter.value = params.get('estado');
  const highlightId = params.get('cita');

  function specialistLabel(appointment, specialists) {
    const email = String(appointment.specialistEmail || '').toLowerCase();
    if (!email) return '<span class="muted">Sin asignar</span>';
    const specialist = specialists.find((item) => String(item.email || '').toLowerCase() === email);
    return ui.escapeHtml(specialist ? data.fullName(specialist) : email);
  }

  function dateLabel(appointment) {
    const date = data.appointmentDate(appointment);
    if (!date || Number.isNaN(date.getTime())) return ui.escapeHtml(appointment.date || '—');
    return `${date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}<br><small>${date.toLocaleDateString('es-MX', { weekday: 'long' })}</small>`;
  }

  function filtered() {
    const term = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    const users = data.readUsers();
    const specialists = data.getSpecialists();

    return data.getAppointments().filter((appointment) => {
      if (status && appointment.status !== status) return false;
      if (!term) return true;
      const haystack = [
        data.clientNameOf(appointment, users),
        appointment.createdBy?.email,
        appointment.serviceName,
        specialistLabel(appointment, specialists).replace(/<[^>]*>/g, '')
      ].join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }

  function renderStats() {
    const summary = data.stats();
    document.getElementById('statTotal').textContent = summary.appointmentsTotal;
    document.getElementById('statPending').textContent = summary.pending;
    document.getElementById('statCancelled').textContent = summary.cancelledThisMonth;
    document.getElementById('statUnassigned').textContent = data.getAppointments().filter((appointment) =>
      !appointment.specialistEmail && appointment.status !== 'cancelled' && appointment.status !== 'previous'
    ).length;
  }

  function renderRows() {
    const users = data.readUsers();
    const specialists = data.getSpecialists();
    const all = filtered();
    const pageInfo = ui.paginate(all, page, 5);
    page = pageInfo.page;

    if (!pageInfo.rows.length) {
      rowsBody.innerHTML = '<tr class="empty-row"><td colspan="7">No hay citas que coincidan con la busqueda.</td></tr>';
      pagerBox.innerHTML = '';
      return;
    }

    rowsBody.innerHTML = pageInfo.rows.map((appointment) => {
      const email = appointment.createdBy?.email || '';
      const client = users.find((item) => String(item.email || '').toLowerCase() === String(email).toLowerCase());
      const status = STATUS[appointment.status] || { label: appointment.status || '—', tag: 'tag-neutral' };
      const highlighted = appointment.id === highlightId ? ' style="background:#eef5e8"' : '';
      return `
        <tr data-id="${ui.escapeHtml(appointment.id)}"${highlighted}>
          <td>
            <div class="cell-person">
              <span class="avatar round">${client?.avatar
                ? `<img src="${ui.escapeHtml(client.avatar)}" alt="">`
                : '<i class="fa-regular fa-user"></i>'}</span>
              <span>
                <b>${ui.escapeHtml(data.clientNameOf(appointment, users))}</b>
                <span>${ui.escapeHtml(email || 'Sin correo')}</span>
                <span>${ui.escapeHtml(client?.phone || '')}</span>
              </span>
            </div>
          </td>
          <td>${ui.escapeHtml(appointment.serviceName || '—')}</td>
          <td>${specialistLabel(appointment, specialists)}</td>
          <td>${dateLabel(appointment)}</td>
          <td>${ui.escapeHtml(appointment.time || '—')}</td>
          <td><span class="tag ${status.tag}">${ui.escapeHtml(status.label)}</span></td>
          <td>
            <div class="kebab-wrap">
              <button class="icon-btn" type="button" aria-label="Acciones"><i class="fa-solid fa-ellipsis-vertical"></i></button>
              <div class="kebab-menu">
                <button type="button" data-action="assign"><i class="fa-solid fa-user-plus"></i> Asignar especialista</button>
                ${appointment.status === 'pending' ? '<button type="button" data-action="confirm"><i class="fa-regular fa-circle-check"></i> Marcar confirmada</button>' : ''}
                ${appointment.status === 'confirmed' ? '<button type="button" data-action="attend"><i class="fa-solid fa-hand-holding-heart"></i> Marcar como atendida</button>' : ''}
                <button type="button" data-action="cancel" class="danger"><i class="fa-solid fa-xmark"></i> Cancelar cita</button>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    ui.bindKebabs(rowsBody);
    ui.renderPager(pagerBox, pageInfo, (next) => { page = next; renderRows(); });
  }

  function openAssignModal(appointment) {
    const specialists = data.getSpecialists();
    if (!specialists.length) {
      window.alert('No hay especialistas registrados. Agrega uno desde Gestion de empleados.');
      return;
    }
    const modal = ui.openModal(`
      <h2>Asignar especialista</h2>
      <p class="modal-sub">${ui.escapeHtml(appointment.serviceName || 'Cita')} — ${ui.escapeHtml(appointment.date || '')} ${ui.escapeHtml(appointment.time || '')}</p>
      <div class="form-grid">
        <div class="field full">
          <label for="specialistSelect">Especialista</label>
          <select id="specialistSelect">
            <option value="">Sin asignar</option>
            ${specialists.map((specialist) => `
              <option value="${ui.escapeHtml(specialist.email)}"${String(appointment.specialistEmail || '').toLowerCase() === String(specialist.email).toLowerCase() ? ' selected' : ''}>
                ${ui.escapeHtml(data.fullName(specialist))} — ${ui.escapeHtml(specialist.specialty || 'Especialista')}
              </option>
            `).join('')}
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-ghost" type="button" data-close>Cancelar</button>
        <button class="btn-primary" type="button" data-save>Guardar</button>
      </div>
    `);
    modal.element.querySelector('[data-save]').addEventListener('click', () => {
      data.setAppointmentSpecialist(appointment.id, modal.element.querySelector('#specialistSelect').value);
      modal.close();
      ui.flash('Especialista asignado');
    });
  }

  function openCancelModal(appointment) {
    const modal = ui.openModal(`
      <h2>Cancelar cita</h2>
      <p class="modal-sub">Se registrara el motivo para el reporte de cancelaciones.</p>
      <div class="form-grid">
        <div class="field full">
          <label for="reasonSelect">Motivo</label>
          <select id="reasonSelect">
            <option>Imprevisto</option>
            <option>Problemas de salud</option>
            <option>Reagendada por el cliente</option>
            <option>Sin disponibilidad del especialista</option>
            <option>Otro</option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-ghost" type="button" data-close>Volver</button>
        <button class="btn-primary" type="button" data-save>Cancelar cita</button>
      </div>
    `);
    modal.element.querySelector('[data-save]').addEventListener('click', () => {
      data.setAppointmentStatus(appointment.id, 'cancelled', modal.element.querySelector('#reasonSelect').value);
      modal.close();
      ui.flash('Cita cancelada');
    });
  }

  function openAttendModal(appointment) {
    const subtotal = data.parseMoney(appointment.price);
    const modal = ui.openModal(`
      <div class="attend-modal">
        <div class="attend-modal-heading"><span class="attend-icon"><i class="fa-solid fa-hand-holding-heart"></i></span><div><h2>Marcar cita como atendida</h2><p class="modal-sub">Registra el pago de la cita de ${ui.escapeHtml(appointment.serviceName || 'Servicio')}.</p></div></div>
        <div class="attend-layout">
          <section class="attend-summary"><h3>Resumen del servicio</h3><dl><div><dt>Servicio</dt><dd>${ui.escapeHtml(appointment.serviceName || '—')}</dd></div><div><dt>Cliente</dt><dd>${ui.escapeHtml(data.clientNameOf(appointment, data.readUsers()))}</dd></div><div><dt>Fecha y hora</dt><dd>${ui.escapeHtml(appointment.date || '—')} · ${ui.escapeHtml(appointment.time || '—')}</dd></div></dl><div class="attend-total"><span>Subtotal</span><strong>${data.formatMoney(subtotal)}</strong><span>Total</span><strong id="attendTotal">${data.formatMoney(subtotal)}</strong></div></section>
          <section class="attend-payment"><h3>Selecciona el metodo de pago</h3><div class="payment-options"><label><input type="radio" name="paymentMethod" value="Efectivo" checked><span><i class="fa-solid fa-money-bill-wave"></i><b>Efectivo</b><small>Paga desde tienda</small></span></label><label><input type="radio" name="paymentMethod" value="Tarjeta de credito"><span><i class="fa-regular fa-credit-card"></i><b>Tarjeta de credito</b><small>Visa, American Express, MasterCard</small></span></label><label><input type="radio" name="paymentMethod" value="Tarjeta de debito"><span><i class="fa-solid fa-credit-card"></i><b>Tarjeta de debito</b><small>Paga desde tu banca en linea</small></span></label><label><input type="radio" name="paymentMethod" value="Cortesia"><span><i class="fa-solid fa-ticket"></i><b>Cortesia</b><small>Introduce tu cupon de cortesia</small></span></label></div><label class="amount-paid">Monto recibido<input id="amountPaid" type="number" min="0" step="0.01" value="${subtotal}" required></label></section>
        </div>
        <div class="modal-actions"><button class="btn-ghost" type="button" data-close>Volver atras</button><button class="btn-primary" type="button" data-save>Confirmar</button></div>
      </div>
    `, { wide: true });
    const amountInput = modal.element.querySelector('#amountPaid');
    const totalElement = modal.element.querySelector('#attendTotal');
    amountInput.addEventListener('input', () => {
      const amount = Number(amountInput.value);
      totalElement.textContent = data.formatMoney(Number.isFinite(amount) && amount >= 0 ? amount : 0);
    });
    modal.element.querySelector('[data-save]').addEventListener('click', () => {
      const amount = Number(modal.element.querySelector('#amountPaid').value);
      if (!Number.isFinite(amount) || amount < 0) { modal.element.querySelector('#amountPaid').classList.add('invalid'); return; }
      const method = modal.element.querySelector('input[name="paymentMethod"]:checked').value;
      const updated = data.markAppointmentAttended(appointment.id, { method, amount, subtotal, total: amount });
      modal.close();
      openAttendSuccessModal(updated || { ...appointment, paymentMethod: method, amountPaid: amount, subtotal, total: amount });
    });
  }

  function openAttendSuccessModal(appointment) {
    const modal = ui.openModal(`<div class="attend-success-modal"><span class="success-icon"><i class="fa-solid fa-check"></i></span><h2>Cita atendida</h2><p class="modal-sub">El pago se registro correctamente.</p><div class="success-receipt"><div><span>Metodo de pago</span><strong>${ui.escapeHtml(appointment.paymentMethod)}</strong></div><div><span>Subtotal</span><strong>${data.formatMoney(appointment.subtotal)}</strong></div><div><span>Total</span><strong>${data.formatMoney(appointment.total)}</strong></div></div><div class="modal-actions"><button class="btn-primary" type="button" data-close>Volver al control de citas</button></div></div>`, { wide: true });
    modal.element.querySelector('[data-close]').addEventListener('click', () => { window.location.href = 'admin-citas.html'; });
  }

  rowsBody.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = button.closest('tr').dataset.id;
    const appointment = data.getAppointments().find((item) => item.id === id);
    if (!appointment) return;

    if (button.dataset.action === 'assign') openAssignModal(appointment);
    if (button.dataset.action === 'cancel') openCancelModal(appointment);
    if (button.dataset.action === 'attend') openAttendModal(appointment);
    if (button.dataset.action === 'confirm') {
      data.setAppointmentStatus(appointment.id, 'confirmed');
      ui.flash('Cita confirmada');
    }
  });

  searchInput.addEventListener('input', () => { page = 1; renderRows(); });
  statusFilter.addEventListener('change', () => { page = 1; renderRows(); });

  function renderAll() { renderStats(); renderRows(); }
  renderAll();
  window.addEventListener('sgc-state-updated', renderAll);
});
