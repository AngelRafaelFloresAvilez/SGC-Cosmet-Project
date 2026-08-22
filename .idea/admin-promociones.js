/* Promociones: el estado no se guarda, se deduce de la vigencia. */
document.addEventListener('admin-shell-ready', function () {
  const data = window.sgcAdminData;
  const ui = window.sgcAdminShell;

  const TAG = { active: 'tag-ok', scheduled: 'tag-ok', expired: 'tag-neutral' };

  const searchInput = document.getElementById('search');
  const typeFilter = document.getElementById('typeFilter');
  const rowsBody = document.getElementById('rows');
  const pagerBox = document.getElementById('pager');
  const tabs = document.getElementById('tabs');
  let page = 1;
  let tab = 'all';

  function dateLabel(iso) {
    if (!iso) return '—';
    const date = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function filtered() {
    const term = searchInput.value.trim().toLowerCase();
    const type = typeFilter.value;
    return data.getPromotions().filter((promo) => {
      if (tab !== 'all' && data.promotionStatus(promo) !== tab) return false;
      if (type && promo.type !== type) return false;
      if (!term) return true;
      return `${promo.title} ${promo.description} ${promo.type}`.toLowerCase().includes(term);
    });
  }

  function renderCounts() {
    const promos = data.getPromotions();
    document.getElementById('countActive').textContent = promos.filter((promo) => data.promotionStatus(promo) === 'active').length;
    document.getElementById('countScheduled').textContent = promos.filter((promo) => data.promotionStatus(promo) === 'scheduled').length;
    document.getElementById('countExpired').textContent = promos.filter((promo) => data.promotionStatus(promo) === 'expired').length;
  }

  function renderRows() {
    const all = filtered();
    const pageInfo = ui.paginate(all, page, 5);
    page = pageInfo.page;

    if (!pageInfo.rows.length) {
      rowsBody.innerHTML = '<tr class="empty-row"><td colspan="6">No hay promociones en esta vista.</td></tr>';
      pagerBox.innerHTML = '';
      return;
    }

    rowsBody.innerHTML = pageInfo.rows.map((promo) => {
      const status = data.promotionStatus(promo);
      return `
        <tr data-id="${ui.escapeHtml(promo.id)}">
          <td>
            <div class="cell-person">
              ${promo.image
                ? `<img class="cell-thumb" src="${ui.escapeHtml(promo.image)}" alt="">`
                : '<span class="cell-thumb"></span>'}
              <span><b>${ui.escapeHtml(promo.title || 'Promocion')}</b><span>${ui.escapeHtml(promo.description || '')}</span></span>
            </div>
          </td>
          <td>${ui.escapeHtml(promo.type || '—')}</td>
          <td>${ui.escapeHtml(promo.discount || '—')}</td>
          <td>${dateLabel(promo.startDate)} - ${dateLabel(promo.endDate)}</td>
          <td><span class="tag ${TAG[status]}">${data.PROMO_STATUS_LABEL[status]}</span></td>
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

  function promoForm(promo) {
    const editing = !!promo;
    const current = promo || {};
    const services = data.getServices();
    return `
      <h2>${editing ? 'Editar promocion' : 'Nueva promocion'}</h2>
      <p class="modal-sub">${editing ? 'Modifica la promocion.' : 'Crea una promocion para tus clientes.'}</p>
      <div class="form-grid">
        <div class="field">
          <label for="fTitle">Nombre de la promocion</label>
          <input id="fTitle" type="text" placeholder="Ej. Masaje relajante 2×1" value="${ui.escapeHtml(current.title || '')}">
        </div>
        <div class="field">
          <label for="fType">Tipo</label>
          <select id="fType">
            ${['Porcentaje', '2×1', 'Paquete'].map((option) => `
              <option${(current.type || 'Porcentaje') === option ? ' selected' : ''}>${option}</option>
            `).join('')}
          </select>
        </div>
        <div class="field">
          <label for="fDiscount">Descuento</label>
          <input id="fDiscount" type="text" placeholder="Ej. 50% o 2×1" value="${ui.escapeHtml(current.discount || '')}">
        </div>
        <div class="field">
          <label for="fService">Servicio aplicable</label>
          <select id="fService">
            <option value="">Todos los servicios</option>
            ${services.map((service) => `
              <option value="${ui.escapeHtml(service.title)}"${current.serviceTitle === service.title ? ' selected' : ''}>${ui.escapeHtml(service.title)}</option>
            `).join('')}
          </select>
        </div>
        <div class="field">
          <label for="fStart">Inicio de vigencia</label>
          <input id="fStart" type="date" value="${ui.escapeHtml(current.startDate || '')}">
        </div>
        <div class="field">
          <label for="fEnd">Fin de vigencia</label>
          <input id="fEnd" type="date" value="${ui.escapeHtml(current.endDate || '')}">
        </div>
        <div class="field full">
          <label for="fDescription">Descripcion</label>
          <textarea id="fDescription" style="min-height:96px" placeholder="En masaje relajante de 60 min">${ui.escapeHtml(current.description || '')}</textarea>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-ghost" type="button" data-close>Cancelar</button>
        <button class="btn-primary" type="button" data-save>${editing ? 'Guardar Cambios' : 'Crear promocion'}</button>
      </div>
    `;
  }

  function openPromoModal(promo) {
    const modal = ui.openModal(promoForm(promo), { wide: true });
    const element = modal.element;

    element.querySelector('[data-save]').addEventListener('click', () => {
      element.querySelectorAll('.field-error').forEach((node) => node.remove());
      element.querySelectorAll('.invalid').forEach((node) => node.classList.remove('invalid'));

      function fail(id, message) {
        const input = element.querySelector(id);
        input.classList.add('invalid');
        input.closest('.field').insertAdjacentHTML('beforeend', `<p class="field-error">${message}</p>`);
      }

      const title = element.querySelector('#fTitle').value.trim();
      const discount = element.querySelector('#fDiscount').value.trim();
      const start = element.querySelector('#fStart').value;
      const end = element.querySelector('#fEnd').value;

      let valid = true;
      if (!title) { fail('#fTitle', 'El nombre es obligatorio.'); valid = false; }
      if (!discount) { fail('#fDiscount', 'Indica el descuento.'); valid = false; }
      if (!start) { fail('#fStart', 'Indica cuando inicia.'); valid = false; }
      if (!end) { fail('#fEnd', 'Indica cuando termina.'); valid = false; }
      if (start && end && start > end) { fail('#fEnd', 'El fin no puede ser antes del inicio.'); valid = false; }
      if (!valid) return;

      data.savePromotion({
        id: promo?.id,
        title,
        description: element.querySelector('#fDescription').value.trim(),
        type: element.querySelector('#fType').value,
        discount,
        serviceTitle: element.querySelector('#fService').value,
        startDate: start,
        endDate: end,
        validUntil: end.split('-').reverse().join('/'),
        tag: element.querySelector('#fType').value
      });

      modal.close();
      ui.flash(promo ? 'Promocion actualizada' : 'Promocion creada');
    });
  }

  rowsBody.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = button.closest('tr').dataset.id;
    const promo = data.getPromotions().find((item) => item.id === id);
    if (!promo) return;

    if (button.dataset.action === 'edit') {
      openPromoModal(promo);
      return;
    }
    ui.confirmAction(`¿Eliminar la promocion "${promo.title}"?`, () => {
      data.deletePromotion(id);
      ui.flash('Promocion eliminada');
    });
  });

  tabs.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-tab]');
    if (!button) return;
    tabs.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    tab = button.dataset.tab;
    page = 1;
    renderRows();
  });

  document.getElementById('newPromoBtn').addEventListener('click', () => openPromoModal(null));
  searchInput.addEventListener('input', () => { page = 1; renderRows(); });
  typeFilter.addEventListener('change', () => { page = 1; renderRows(); });

  function renderAll() { renderCounts(); renderRows(); }
  renderAll();
  window.addEventListener('sgc-state-updated', renderAll);
});
