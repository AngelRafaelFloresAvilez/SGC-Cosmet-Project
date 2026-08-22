/* Horarios: horario general del negocio y disponibilidad real por dia. */
document.addEventListener('admin-shell-ready', function () {
  const data = window.sgcAdminData;
  const ui = window.sgcAdminShell;

  const generalList = document.getElementById('generalList');
  const employeeList = document.getElementById('employeeList');
  const weekGrid = document.getElementById('weekGrid');
  const weekLabel = document.getElementById('weekLabel');
  let weekOffset = 0;

  function formatTime(value) {
    if (!value) return '';
    const [hour, minute] = value.split(':').map(Number);
    const suffix = hour >= 12 ? 'P.M' : 'A.M';
    const display = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(display).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${suffix}`;
  }

  function renderGeneral() {
    const hours = data.getBusinessHours();
    generalList.innerHTML = data.DAYS.map((day) => {
      const entry = hours[day] || { active: false };
      return `
        <div class="schedule-row" data-day="${day}">
          <b>${data.DAY_LABELS[day]}</b>
          <span class="hours">${entry.active ? `${formatTime(entry.open)} - ${formatTime(entry.close)}` : 'Cerrado'}</span>
          <span style="display:flex;align-items:center;gap:10px">
            <span class="tag ${entry.active ? 'tag-ok' : 'tag-danger'}">${entry.active ? 'Activo' : 'Inactivo'}</span>
            <button class="icon-btn" type="button" data-action="edit-day" aria-label="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
          </span>
        </div>
      `;
    }).join('');
  }

  function renderEmployees() {
    const specialists = data.getSpecialists();
    if (!specialists.length) {
      employeeList.innerHTML = '<p class="muted" style="padding:20px 0">No hay especialistas registrados.</p>';
      return;
    }
    employeeList.innerHTML = specialists.map((specialist) => {
      const active = specialist.active !== false;
      const working = data.DAYS.filter((day) => !(specialist.daysOff || []).includes(day));
      return `
        <div class="schedule-row">
          <span>
            <b>${ui.escapeHtml(data.fullName(specialist))}</b>
            <small style="display:block;color:var(--cream)">${ui.escapeHtml(specialist.specialty || 'Especialista')} · ${working.map((day) => data.DAY_SHORT[day]).join(', ') || 'Sin dias'}</small>
          </span>
          <span class="hours">${formatTime(specialist.workStart)} - ${formatTime(specialist.workEnd)}</span>
          <span class="tag ${active ? 'tag-ok' : 'tag-danger'}">${active ? 'Activo' : 'Inactivo'}</span>
        </div>
      `;
    }).join('');
  }

  function weekDates() {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7);
    monday.setHours(0, 0, 0, 0);
    return data.DAYS.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return { day, date };
    });
  }

  function renderWeek() {
    const hours = data.getBusinessHours();
    const dates = weekDates();
    const first = dates[0].date;
    const last = dates[dates.length - 1].date;
    weekLabel.textContent = `${first.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })} - ${last.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}`;

    // La escala vertical va de la apertura mas temprana al cierre mas tardio.
    const openDays = data.DAYS.filter((day) => hours[day]?.active);
    const toMinutes = (value) => {
      const [hour, minute] = String(value || '0:0').split(':').map(Number);
      return hour * 60 + minute;
    };
    const scaleStart = openDays.length ? Math.min(...openDays.map((day) => toMinutes(hours[day].open))) : 8 * 60;
    const scaleEnd = openDays.length ? Math.max(...openDays.map((day) => toMinutes(hours[day].close))) : 18 * 60;
    const span = Math.max(scaleEnd - scaleStart, 60);
    const CHART_HEIGHT = 330;

    const ticks = [];
    for (let minutes = scaleStart; minutes <= scaleEnd; minutes += 60) {
      ticks.push(formatTime(`${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`));
    }

    weekGrid.innerHTML = `
      <div class="week-hours" style="height:${CHART_HEIGHT + 26}px">
        ${ticks.map((tick) => `<span>${tick}</span>`).join('')}
      </div>
      ${dates.map(({ day, date }) => {
        const entry = hours[day] || { active: false };
        const open = entry.active;
        const top = open ? ((toMinutes(entry.open) - scaleStart) / span) * CHART_HEIGHT : 0;
        const height = open ? ((toMinutes(entry.close) - toMinutes(entry.open)) / span) * CHART_HEIGHT : CHART_HEIGHT;
        return `
          <div class="week-col">
            <span class="day">${data.DAY_SHORT[day]} ${String(date.getDate()).padStart(2, '0')}</span>
            <span style="height:${CHART_HEIGHT}px;width:100%;display:block;position:relative">
              <span class="bar${open ? '' : ' off'}" style="position:absolute;left:0;right:0;top:${top}px;height:${Math.max(height, 6)}px"></span>
            </span>
          </div>
        `;
      }).join('')}
    `;
  }

  function openDayModal(day) {
    const hours = data.getBusinessHours();
    const entry = hours[day] || { open: '09:00', close: '18:00', active: true };
    const modal = ui.openModal(`
      <h2>${data.DAY_LABELS[day]}</h2>
      <p class="modal-sub">Define el horario de atencion del negocio para este dia.</p>
      <div class="form-grid">
        <div class="field">
          <label for="fOpen">Apertura</label>
          <input id="fOpen" type="time" value="${ui.escapeHtml(entry.open || '09:00')}">
        </div>
        <div class="field">
          <label for="fClose">Cierre</label>
          <input id="fClose" type="time" value="${ui.escapeHtml(entry.close || '18:00')}">
        </div>
        <div class="field full">
          <label for="fActive">Estado</label>
          <select id="fActive">
            <option value="active"${entry.active ? ' selected' : ''}>Activo</option>
            <option value="inactive"${!entry.active ? ' selected' : ''}>Cerrado</option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-ghost" type="button" data-close>Cancelar</button>
        <button class="btn-primary" type="button" data-save>Guardar Cambios</button>
      </div>
    `);

    modal.element.querySelector('[data-save]').addEventListener('click', () => {
      const open = modal.element.querySelector('#fOpen').value;
      const close = modal.element.querySelector('#fClose').value;
      const active = modal.element.querySelector('#fActive').value === 'active';

      modal.element.querySelectorAll('.field-error').forEach((node) => node.remove());
      if (active && open >= close) {
        modal.element.querySelector('#fClose').closest('.field')
          .insertAdjacentHTML('beforeend', '<p class="field-error">El cierre debe ser posterior a la apertura.</p>');
        return;
      }

      const next = { ...data.getBusinessHours() };
      next[day] = { open, close, active };
      data.saveBusinessHours(next);
      modal.close();
      ui.flash('Horario actualizado');
    });
  }

  generalList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="edit-day"]');
    if (!button) return;
    openDayModal(button.closest('.schedule-row').dataset.day);
  });

  document.querySelector('.tabs').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-tab]');
    if (!button) return;
    document.querySelectorAll('.tabs button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const general = button.dataset.tab === 'general';
    document.getElementById('generalPane').hidden = !general;
    document.getElementById('employeePane').hidden = general;
  });

  document.getElementById('prevWeek').addEventListener('click', () => { weekOffset -= 1; renderWeek(); });
  document.getElementById('nextWeek').addEventListener('click', () => { weekOffset += 1; renderWeek(); });

  function renderAll() { renderGeneral(); renderEmployees(); renderWeek(); }
  renderAll();
  window.addEventListener('sgc-state-updated', renderAll);
});
