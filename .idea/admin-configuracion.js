/* Configuracion: no venia en los diseños; se construye con el mismo lenguaje
 * visual y solo expone ajustes que el resto del sistema si usa. */
document.addEventListener('admin-shell-ready', function (event) {
  const data = window.sgcAdminData;
  const ui = window.sgcAdminShell;
  const session = event.detail.session;

  const RULE_KEY = 'sgc_admin_noshow_limit';

  function noShowLimit() {
    const stored = Number(localStorage.getItem(RULE_KEY));
    return Number.isFinite(stored) && stored > 0 ? stored : 3;
  }

  function renderAccount() {
    const user = data.findUser(session.email) || {};
    document.getElementById('accName').textContent = data.fullName(user) || session.name || 'Administrador';
    document.getElementById('accEmail').textContent = user.email || session.email || '—';
    document.getElementById('accPhone').textContent = user.phone || '—';
  }

  function renderRules() {
    const limit = noShowLimit();
    const counts = data.noShowCountByClient();
    const clients = data.getClients();

    document.getElementById('ruleLimit').textContent = limit;
    document.getElementById('ruleAtRisk').textContent = clients.filter((client) => {
      const faltas = counts[String(client.email || '').toLowerCase()] || 0;
      return faltas === limit - 1 && client.status !== 'banned';
    }).length;
    document.getElementById('ruleBanned').textContent = clients.filter((client) => client.status === 'banned').length;
  }

  function renderSummary() {
    document.getElementById('sumClients').textContent = data.getClients().length;
    document.getElementById('sumSpecialists').textContent = data.getSpecialists().length;
    document.getElementById('sumServices').textContent = data.getServices().length;
    document.getElementById('sumPromos').textContent = data.getPromotions().length;
    document.getElementById('sumAppointments').textContent = data.getAppointments().length;
  }

  document.getElementById('editAccountBtn').addEventListener('click', () => {
    const user = data.findUser(session.email) || {};
    const modal = ui.openModal(`
      <h2>Editar mi cuenta</h2>
      <p class="modal-sub">Estos datos identifican al administrador en el sistema.</p>
      <div class="form-grid">
        <div class="field"><label for="fName">Nombre</label><input id="fName" type="text" value="${ui.escapeHtml(user.name || '')}"></div>
        <div class="field"><label for="fLastName">Apellidos</label><input id="fLastName" type="text" value="${ui.escapeHtml(user.lastName || '')}"></div>
        <div class="field full"><label for="fPhone">Telefono</label><input id="fPhone" type="tel" value="${ui.escapeHtml(user.phone || '')}"></div>
      </div>
      <div class="modal-actions">
        <button class="btn-ghost" type="button" data-close>Cancelar</button>
        <button class="btn-primary" type="button" data-save>Guardar Cambios</button>
      </div>
    `);

    modal.element.querySelector('[data-save]').addEventListener('click', () => {
      const name = modal.element.querySelector('#fName').value.trim();
      modal.element.querySelectorAll('.field-error').forEach((node) => node.remove());
      if (!name) {
        modal.element.querySelector('#fName').closest('.field')
          .insertAdjacentHTML('beforeend', '<p class="field-error">El nombre es obligatorio.</p>');
        return;
      }

      const users = data.readUsers();
      const target = users.find((item) => String(item.email || '').toLowerCase() === String(session.email).toLowerCase());
      if (target) {
        target.name = name;
        target.lastName = modal.element.querySelector('#fLastName').value.trim();
        target.phone = modal.element.querySelector('#fPhone').value.trim();
        localStorage.setItem('sgc_auth_users_v1', JSON.stringify(users));
        if (window.sgcAuth?.setSession) window.sgcAuth.setSession({ ...session, name: target.name, lastName: target.lastName });
      }
      modal.close();
      ui.flash('Cuenta actualizada', () => window.location.reload());
    });
  });

  document.getElementById('editRulesBtn').addEventListener('click', () => {
    const modal = ui.openModal(`
      <h2>Regla de inasistencias</h2>
      <p class="modal-sub">Numero de faltas a partir del cual un cliente queda vetado.</p>
      <div class="form-grid">
        <div class="field full">
          <label for="fLimit">Faltas permitidas</label>
          <input id="fLimit" type="number" min="1" max="10" value="${noShowLimit()}">
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-ghost" type="button" data-close>Cancelar</button>
        <button class="btn-primary" type="button" data-save>Guardar</button>
      </div>
    `);
    modal.element.querySelector('[data-save]').addEventListener('click', () => {
      const value = Number(modal.element.querySelector('#fLimit').value);
      if (!Number.isFinite(value) || value < 1) return;
      localStorage.setItem(RULE_KEY, String(value));
      modal.close();
      renderRules();
      ui.flash('Regla actualizada');
    });
  });

  // Aplica la regla a los clientes que ya superaron el limite.
  document.getElementById('applyRuleBtn').addEventListener('click', () => {
    const limit = noShowLimit();
    const counts = data.noShowCountByClient();
    const toBan = data.getClients().filter((client) =>
      (counts[String(client.email || '').toLowerCase()] || 0) >= limit && client.status !== 'banned'
    );

    if (!toBan.length) {
      ui.flash('Ningun cliente supera el limite');
      return;
    }
    ui.confirmAction(`Se vetaran ${toBan.length} ${toBan.length === 1 ? 'cliente' : 'clientes'} con ${limit} o mas faltas. ¿Continuar?`, () => {
      toBan.forEach((client) => data.setClientStatus(client.email, 'banned'));
      ui.flash(`${toBan.length} ${toBan.length === 1 ? 'cliente vetado' : 'clientes vetados'}`);
    });
  });

  // Reemplaza todos los datos por el juego de demostracion. Como borra la
  // informacion actual, se confirma antes y se recarga para reflejarlo.
  document.getElementById('seedDemoBtn').addEventListener('click', () => {
    if (!window.sgcDemoData) return;
    ui.confirmAction(
      'Esto reemplaza los usuarios, citas, servicios y promociones actuales por datos de prueba. La informacion existente se pierde. ¿Continuar?',
      () => {
        const result = window.sgcDemoData.reset();
        ui.flash(`${result.appointments} citas y ${result.users} usuarios cargados`, () => window.location.reload());
      }
    );
  });

  function renderAll() { renderAccount(); renderRules(); renderSummary(); }
  renderAll();
  window.addEventListener('sgc-state-updated', renderAll);
});
