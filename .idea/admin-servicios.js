/* Gestion de servicios: el catalogo que ven clientes y especialistas. */
document.addEventListener('admin-shell-ready', function () {
  const data = window.sgcAdminData;
  const ui = window.sgcAdminShell;

  const searchInput = document.getElementById('search');
  const rowsBody = document.getElementById('rows');
  const pagerBox = document.getElementById('pager');
  let page = 1;

  function durationMinutes(service) {
    const numeric = Number(String(service.duration || '').replace(/[^0-9]/g, ''));
    return Number.isFinite(numeric) ? numeric : 0;
  }

  function filtered() {
    const term = searchInput.value.trim().toLowerCase();
    if (!term) return data.getServices();
    return data.getServices().filter((service) =>
      `${service.title} ${service.description} ${service.category}`.toLowerCase().includes(term)
    );
  }

  function renderStats() {
    const services = data.getServices();
    document.getElementById('statCount').textContent = services.length;

    const durations = services.map(durationMinutes).filter(Boolean);
    const avgDuration = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
    document.getElementById('statDuration').textContent = `${avgDuration} min`;

    const prices = services.map((service) => data.parseMoney(service.price)).filter(Boolean);
    const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    document.getElementById('statPrice').textContent = data.formatMoney(avgPrice);
  }

  function renderRows() {
    const all = filtered();
    const pageInfo = ui.paginate(all, page, 5);
    page = pageInfo.page;

    if (!pageInfo.rows.length) {
      rowsBody.innerHTML = '<tr class="empty-row"><td colspan="6">No hay servicios que coincidan con la busqueda.</td></tr>';
      pagerBox.innerHTML = '';
      return;
    }

    rowsBody.innerHTML = pageInfo.rows.map((service) => {
      const active = service.active !== false;
      return `
        <tr data-id="${ui.escapeHtml(service.id)}">
          <td>
            <div class="cell-person">
              ${service.image
                ? `<img class="cell-thumb" src="${ui.escapeHtml(service.image)}" alt="">`
                : '<span class="cell-thumb"></span>'}
              <span><b>${ui.escapeHtml(service.title || 'Servicio')}</b><span>${ui.escapeHtml(service.category || '')}</span></span>
            </div>
          </td>
          <td style="max-width:280px">${ui.escapeHtml(service.description || '')}</td>
          <td>${ui.escapeHtml(service.duration || '—')}</td>
          <td>${data.formatMoney(data.parseMoney(service.price))}</td>
          <td><span class="tag ${active ? 'tag-ok' : 'tag-danger'}">${active ? 'Activo' : 'Inactivo'}</span></td>
          <td>
            <div class="row-actions">
              <button class="icon-btn" type="button" data-action="edit" aria-label="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    ui.renderPager(pagerBox, pageInfo, (next) => { page = next; renderRows(); });
  }

  function serviceForm(service) {
    const editing = !!service;
    const current = service || {};
    return `
      <h2>${editing ? 'Editar servicio' : 'Nuevo servicio'}</h2>
      <p class="modal-sub">${editing ? 'Modifica la informacion del servicio.' : 'Agrega un servicio nuevo.'}</p>
      <div class="form-grid">
        <div class="field">
          <label for="fName">Nombre del servicio</label>
          <input id="fName" type="text" placeholder="Ej. Masaje" value="${ui.escapeHtml(current.title || '')}">
        </div>
        <div class="field">
          <label for="fPrice">Precio del servicio (MXN)</label>
          <div class="with-icon"><i class="fa-solid fa-dollar-sign"></i><input id="fPrice" type="number" min="0" step="1" placeholder="Ingresa el costo" value="${data.parseMoney(current.price) || ''}"></div>
        </div>
        <div class="field">
          <label for="fDuration">Duracion aproximada</label>
          <div class="with-icon"><i class="fa-regular fa-clock"></i><input id="fDuration" type="number" min="1" step="5" placeholder="60" value="${String(current.duration || '').replace(/[^0-9]/g, '')}"></div>
        </div>
        <div class="field">
          <label for="fStatus">Estado</label>
          <select id="fStatus">
            <option value="active"${current.active !== false ? ' selected' : ''}>Activo</option>
            <option value="inactive"${current.active === false ? ' selected' : ''}>Inactivo</option>
          </select>
        </div>
        <div class="field photo-field">
          <label>Foto del servicio</label>
          <div class="preview" id="fPreview" style="${current.image ? `background-image:url('${ui.escapeHtml(current.image)}')` : ''}"></div>
          <button class="upload" type="button" id="fUpload"><i class="fa-solid fa-upload"></i> ${editing ? 'Cambiar foto' : 'Subir foto'}</button>
          <input type="file" id="fFile" accept="image/png,image/jpeg" hidden>
          <p class="hint">Solo formato JPG, PNG. Max 5MB.</p>
        </div>
        <div class="field">
          <label for="fDescription">Descripcion del servicio</label>
          <textarea id="fDescription" placeholder="Ingresa una breve descripcion del servicio.">${ui.escapeHtml(current.description || '')}</textarea>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-ghost" type="button" data-close>Cancelar</button>
        <button class="btn-primary" type="button" data-save>${editing ? 'Guardar Cambios' : 'Crear servicio'}</button>
      </div>
    `;
  }

  function openServiceModal(service) {
    const modal = ui.openModal(serviceForm(service), { wide: true });
    const element = modal.element;
    let image = service?.image || '';

    element.querySelector('#fUpload').addEventListener('click', () => element.querySelector('#fFile').click());
    element.querySelector('#fFile').addEventListener('change', (event) => {
      ui.readFileAsDataUrl(event.target.files[0], (dataUrl) => {
        image = dataUrl;
        element.querySelector('#fPreview').style.backgroundImage = `url('${dataUrl}')`;
      });
    });

    element.querySelector('[data-save]').addEventListener('click', () => {
      const title = element.querySelector('#fName').value.trim();
      const price = element.querySelector('#fPrice').value;
      const duration = element.querySelector('#fDuration').value;
      const description = element.querySelector('#fDescription').value.trim();

      element.querySelectorAll('.field-error').forEach((node) => node.remove());
      element.querySelectorAll('.invalid').forEach((node) => node.classList.remove('invalid'));

      function fail(id, message) {
        const input = element.querySelector(id);
        input.classList.add('invalid');
        input.closest('.field').insertAdjacentHTML('beforeend', `<p class="field-error">${message}</p>`);
      }

      let valid = true;
      if (!title) { fail('#fName', 'El nombre es obligatorio.'); valid = false; }
      if (!price || Number(price) <= 0) { fail('#fPrice', 'Ingresa un precio mayor a cero.'); valid = false; }
      if (!duration || Number(duration) <= 0) { fail('#fDuration', 'Ingresa una duracion valida.'); valid = false; }
      if (!description) { fail('#fDescription', 'Agrega una descripcion.'); valid = false; }
      if (!valid) return;

      data.saveService({
        id: service?.id,
        title,
        category: service?.category || 'General',
        description,
        includes: service?.includes || '',
        duration: `${duration} minutos`,
        price: `$${Number(price)} MXN`,
        image,
        active: element.querySelector('#fStatus').value === 'active'
      });

      modal.close();
      ui.flash(service ? 'Servicio editado correctamente' : 'Servicio creado');
    });
  }

  rowsBody.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = button.closest('tr').dataset.id;
    const service = data.getServices().find((item) => item.id === id);
    if (!service) return;

    if (button.dataset.action === 'edit') {
      openServiceModal(service);
      return;
    }
  });

  document.getElementById('newServiceBtn').addEventListener('click', () => openServiceModal(null));
  searchInput.addEventListener('input', () => { page = 1; renderRows(); });

  function renderAll() { renderStats(); renderRows(); }
  renderAll();
  window.addEventListener('sgc-state-updated', renderAll);
});
