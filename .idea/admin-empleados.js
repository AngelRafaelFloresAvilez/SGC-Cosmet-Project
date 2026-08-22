/* Gestion de empleados: los especialistas que atienden las citas. */
document.addEventListener('admin-shell-ready', function () {
  const data = window.sgcAdminData;
  const ui = window.sgcAdminShell;

  const searchInput = document.getElementById('search');
  const rowsBody = document.getElementById('rows');
  const pagerBox = document.getElementById('pager');
  let page = 1;

  function hoursPerDay(specialist) {
    const [startHour, startMinute] = String(specialist.workStart || '').split(':').map(Number);
    const [endHour, endMinute] = String(specialist.workEnd || '').split(':').map(Number);
    if ([startHour, startMinute, endHour, endMinute].some((value) => !Number.isFinite(value))) return 0;
    return ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;
  }

  function daysOffLabel(specialist) {
    const days = specialist.daysOff || [];
    if (!days.length) return '<span class="muted">Ninguno</span>';
    return ui.escapeHtml(days.map((day) => data.DAY_LABELS[day] || day).join(', '));
  }

  function workDaysLabel(specialist) {
    const working = data.DAYS.filter((day) => !(specialist.daysOff || []).includes(day));
    if (!working.length) return 'Sin dias';
    return `${data.DAY_SHORT[working[0]]} - ${data.DAY_SHORT[working[working.length - 1]]}`;
  }

  function filtered() {
    const term = searchInput.value.trim().toLowerCase();
    const specialists = data.getSpecialists();
    if (!term) return specialists;
    return specialists.filter((specialist) =>
      `${data.fullName(specialist)} ${specialist.email} ${specialist.specialty}`.toLowerCase().includes(term)
    );
  }

  function renderStats() {
    const specialists = data.getSpecialists();
    document.getElementById('statTotal').textContent = specialists.length;
    document.getElementById('statActive').textContent = specialists.filter((item) => item.active !== false).length;

    // Dias que ningun especialista trabaja: el negocio no puede operar esos dias.
    const closedDays = data.DAYS.filter((day) =>
      specialists.length > 0 && specialists.every((specialist) => (specialist.daysOff || []).includes(day))
    );
    document.getElementById('statDaysOff').textContent = closedDays.length;

    const hours = specialists.map(hoursPerDay).filter(Boolean);
    const average = hours.length ? Math.round(hours.reduce((a, b) => a + b, 0) / hours.length) : 0;
    document.getElementById('statHours').textContent = `${average} hrs`;
  }

  function renderRows() {
    const all = filtered();
    const pageInfo = ui.paginate(all, page, 5);
    page = pageInfo.page;

    if (!pageInfo.rows.length) {
      rowsBody.innerHTML = '<tr class="empty-row"><td colspan="6">No hay empleados que coincidan con la busqueda.</td></tr>';
      pagerBox.innerHTML = '';
      return;
    }

    rowsBody.innerHTML = pageInfo.rows.map((specialist) => {
      const active = specialist.active !== false;
      return `
        <tr data-email="${ui.escapeHtml(specialist.email)}">
          <td>
            <div class="cell-person">
              <span class="avatar round">${specialist.avatar
                ? `<img src="${ui.escapeHtml(specialist.avatar)}" alt="">`
                : '<i class="fa-regular fa-user"></i>'}</span>
              <span>
                <b>${ui.escapeHtml(data.fullName(specialist))}</b>
                <span>${ui.escapeHtml(specialist.email)}</span>
                <span>${ui.escapeHtml(specialist.phone || '')}</span>
              </span>
            </div>
          </td>
          <td>${ui.escapeHtml(specialist.specialty || 'Especialista')}</td>
          <td>${ui.escapeHtml(specialist.workStart || '—')} - ${ui.escapeHtml(specialist.workEnd || '—')}<br><small>${ui.escapeHtml(workDaysLabel(specialist))}</small></td>
          <td>${daysOffLabel(specialist)}</td>
          <td><span class="tag ${active ? 'tag-ok' : 'tag-neutral'}">${active ? 'Activo' : 'Inactivo'}</span></td>
          <td>
            <div class="row-actions">
              <button class="icon-btn" type="button" data-action="edit" aria-label="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
              <button class="icon-btn danger" type="button" data-action="delete" aria-label="Eliminar"><i class="fa-regular fa-trash-can"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    ui.renderPager(pagerBox, pageInfo, (next) => { page = next; renderRows(); });
  }

  function employeeForm(specialist) {
    const editing = !!specialist;
    const current = specialist || {};
    const daysOff = current.daysOff || ['saturday', 'sunday'];
    return `
      <h2>${editing ? 'Editar empleado' : 'Nuevo empleado'}</h2>
      <p class="modal-sub">${editing ? 'Modifica los datos del especialista.' : 'Registra un especialista nuevo.'}</p>
      <div class="form-grid">
        <div class="field">
          <label for="fName">Nombre</label>
          <input id="fName" type="text" placeholder="Ej. Leonardo" value="${ui.escapeHtml(current.name || '')}">
        </div>
        <div class="field">
          <label for="fLastName">Apellidos</label>
          <input id="fLastName" type="text" placeholder="Ej. Rodriguez" value="${ui.escapeHtml(current.lastName || '')}">
        </div>
        <div class="field">
          <label for="fEmail">Correo</label>
          <input id="fEmail" type="email" placeholder="correo@ejemplo.com" value="${ui.escapeHtml(current.email || '')}">
        </div>
        <div class="field">
          <label for="fPhone">Telefono</label>
          <input id="fPhone" type="tel" placeholder="+52 55 0000 0000" value="${ui.escapeHtml(current.phone || '')}">
        </div>
        <div class="field">
          <label for="fSpecialty">Especialidad</label>
          <select id="fSpecialty">
            ${['Facialista', 'Masajista', 'Manicurista', 'Cosmetologo', 'Depilacion'].map((option) => `
              <option${(current.specialty || 'Facialista') === option ? ' selected' : ''}>${option}</option>
            `).join('')}
          </select>
        </div>
        <div class="field">
          <label for="fActive">Estado</label>
          <select id="fActive">
            <option value="active"${current.active !== false ? ' selected' : ''}>Activo</option>
            <option value="inactive"${current.active === false ? ' selected' : ''}>Inactivo</option>
          </select>
        </div>
        <div class="field">
          <label for="fStart">Entrada</label>
          <input id="fStart" type="time" value="${ui.escapeHtml(current.workStart || '09:00')}">
        </div>
        <div class="field">
          <label for="fEnd">Salida</label>
          <input id="fEnd" type="time" value="${ui.escapeHtml(current.workEnd || '18:00')}">
        </div>
        <div class="field full">
          <label>Días no laborales</label>
          <div class="day-picker">
            ${data.DAYS.map((day) => `
              <label><input type="checkbox" value="${day}"${daysOff.includes(day) ? ' checked' : ''}> ${data.DAY_LABELS[day]}</label>
            `).join('')}
          </div>
        </div>
        ${editing ? '' : `
        <div class="field full">
          <label for="fPassword">Contraseña inicial</label>
          <input id="fPassword" type="text" value="sgc2026">
        </div>`}
      </div>
      <div class="modal-actions">
        <button class="btn-ghost" type="button" data-close>Cancelar</button>
        <button class="btn-primary" type="button" data-save>${editing ? 'Guardar Cambios' : 'Crear empleado'}</button>
      </div>
    `;
  }

  function openEmployeeModal(specialist) {
    const modal = ui.openModal(employeeForm(specialist), { wide: true });
    const element = modal.element;

    element.querySelector('[data-save]').addEventListener('click', () => {
      element.querySelectorAll('.field-error').forEach((node) => node.remove());
      element.querySelectorAll('.invalid').forEach((node) => node.classList.remove('invalid'));

      function fail(id, message) {
        const input = element.querySelector(id);
        input.classList.add('invalid');
        input.closest('.field').insertAdjacentHTML('beforeend', `<p class="field-error">${message}</p>`);
      }

      const name = element.querySelector('#fName').value.trim();
      const lastName = element.querySelector('#fLastName').value.trim();
      const email = element.querySelector('#fEmail').value.trim();
      const start = element.querySelector('#fStart').value;
      const end = element.querySelector('#fEnd').value;

      let valid = true;
      if (!name) { fail('#fName', 'El nombre es obligatorio.'); valid = false; }
      if (!lastName) { fail('#fLastName', 'Los apellidos son obligatorios.'); valid = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fail('#fEmail', 'Ingresa un correo valido.'); valid = false; }
      if (start >= end) { fail('#fEnd', 'La salida debe ser posterior a la entrada.'); valid = false; }
      if (!valid) return;

      const result = data.saveEmployee({
        originalEmail: specialist ? String(specialist.email).toLowerCase() : undefined,
        name, lastName, email,
        phone: element.querySelector('#fPhone').value.trim(),
        specialty: element.querySelector('#fSpecialty').value,
        workStart: start,
        workEnd: end,
        daysOff: [...element.querySelectorAll('.day-picker input:checked')].map((input) => input.value),
        active: element.querySelector('#fActive').value === 'active',
        password: element.querySelector('#fPassword')?.value
      });

      if (!result.ok) { fail('#fEmail', result.error); return; }
      modal.close();
      ui.flash(specialist ? 'Empleado actualizado' : 'Empleado creado');
    });
  }

  rowsBody.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const email = button.closest('tr').dataset.email;
    const specialist = data.getSpecialists().find((item) => item.email === email);
    if (!specialist) return;

    if (button.dataset.action === 'edit') {
      openEmployeeModal(specialist);
      return;
    }

    const assigned = data.getAppointments().filter((appointment) =>
      String(appointment.specialistEmail || '').toLowerCase() === String(email).toLowerCase()
    ).length;
    const warning = assigned
      ? ` Tiene ${assigned} ${assigned === 1 ? 'cita asignada que quedara' : 'citas asignadas que quedaran'} sin especialista.`
      : '';
    ui.confirmAction(`¿Eliminar a ${data.fullName(specialist)}?${warning}`, () => {
      data.deleteEmployee(email);
      ui.flash('Empleado eliminado');
    });
  });

  document.getElementById('newEmployeeBtn').addEventListener('click', () => openEmployeeModal(null));
  searchInput.addEventListener('input', () => { page = 1; renderRows(); });

  function renderAll() { renderStats(); renderRows(); }
  renderAll();
  window.addEventListener('sgc-state-updated', renderAll);
});
