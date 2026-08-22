/* ---------------------------------------------------------------------------
 * admin-shell.js
 * Cascaron comun de todas las vistas de administrador: guardia de rol, topbar,
 * menu lateral y utilidades de UI (modales, avisos, paginacion, tablas).
 *
 * Cada pagina declara su seccion con <body data-admin-page="dashboard">.
 * ------------------------------------------------------------------------- */
(function () {
  const NAV = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-house', href: 'admin-dashboard.html' },
    { id: 'citas', label: 'Gestión de citas', icon: 'fa-solid fa-book', href: 'admin-citas.html' },
    { id: 'servicios', label: 'Servicios', icon: 'fa-regular fa-calendar', href: 'admin-servicios.html' },
    { id: 'empleados', label: 'Empleados', icon: 'fa-solid fa-users', href: 'admin-empleados.html' },
    { id: 'clientes', label: 'Clientes', icon: 'fa-regular fa-user', href: 'admin-clientes.html' },
    { id: 'promociones', label: 'Promociones', icon: 'fa-solid fa-tag', href: 'admin-promociones.html' },
    { id: 'reportes', label: 'Reportes', icon: 'fa-regular fa-clipboard', href: 'admin-reportes.html' },
    { id: 'horarios', label: 'Horarios', icon: 'fa-regular fa-clock', href: 'admin-horarios.html' }
  ];

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function getSession() {
    try {
      if (window.sgcAuth && typeof window.sgcAuth.getSession === 'function') {
        const session = window.sgcAuth.getSession();
        if (session) return session;
      }
      const raw = sessionStorage.getItem('sgc_active_session_v1');
      if (raw) return JSON.parse(raw);
    } catch (e) { /* sesion ilegible: se trata como no autenticado */ }
    return null;
  }

  function signOut() {
    if (window.sgcAuth && typeof window.sgcAuth.signOut === 'function') {
      window.sgcAuth.signOut();
      return;
    }
    try { sessionStorage.removeItem('sgc_active_session_v1'); } catch (e) { /* ignore */ }
    window.location.href = 'Loggin.html';
  }

  /* --------------------------------- render -------------------------------- */

  function renderShell(session) {
    const page = document.body.dataset.adminPage || '';
    const displayName = `${session.name || 'Administrador'} ${session.lastName || ''}`.trim();
    const initial = (session.name || 'A').charAt(0).toUpperCase();

    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';

    const drawer = document.createElement('aside');
    drawer.className = 'sidebar-menu';
    drawer.innerHTML = `
      <div class="sidebar-user-box">
        <div class="sidebar-user-avatar">${escapeHtml(initial)}</div>
        <div class="sidebar-user-meta">
          <span class="sidebar-user-name">${escapeHtml(displayName)}</span>
          <span class="sidebar-user-role">Administrador</span>
        </div>
      </div>
      <hr class="sidebar-divider">
      <div class="sidebar-section-label">General</div>
      <nav class="sidebar-nav">
        ${NAV.map((item) => `
          <a href="${item.href}"${item.id === page ? ' class="active"' : ''}><i class="${item.icon}"></i> ${escapeHtml(item.label)}</a>
        `).join('')}
        <hr class="sidebar-divider">
        <a href="admin-configuracion.html"${page === 'configuracion' ? ' class="active"' : ''}><i class="fa-solid fa-gear"></i> Configuracion</a>
      </nav>
      <button class="sidebar-logout" type="button"><i class="fa-solid fa-right-from-bracket"></i> Cerrar sesion</button>
      <hr class="sidebar-divider">
      <div class="sidebar-brand">SGC COSMETIC</div>
    `;

    const topbar = document.createElement('header');
    topbar.className = 'topbar';
    topbar.innerHTML = `
      <button class="menu-trigger" type="button" aria-label="Abrir menú"><i class="fa-solid fa-bars"></i></button>
      <div class="topbar-actions">
        <div class="notification-wrap">
          <button class="notification-trigger" type="button" aria-label="Notificaciones" aria-expanded="false">
            <i class="fa-regular fa-bell"></i>
            <span class="notification-dot" data-notification-count></span>
          </button>
          <div class="notification-panel" data-notification-panel>
            <div class="notification-head">Notificaciones</div>
            <div data-notification-list></div>
          </div>
        </div>
        <div class="admin-chip">
          <span class="chip-avatar"><i class="fa-regular fa-circle-user"></i></span>
          <span><strong>${escapeHtml(displayName)}</strong><small>Administrador</small></span>
        </div>
      </div>
    `;

    document.body.prepend(overlay, drawer);
    const wrapper = document.querySelector('.main-wrapper');
    if (wrapper) wrapper.prepend(topbar);

    const menuLauncher = document.createElement('button');
    menuLauncher.className = 'admin-menu-launcher';
    menuLauncher.type = 'button';
    menuLauncher.setAttribute('aria-label', 'Abrir menú lateral');
    menuLauncher.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.appendChild(menuLauncher);
    topbar.classList.add('is-hidden');

    function toggleDrawer(open) {
      drawer.classList.toggle('active', open);
      overlay.classList.toggle('active', open);
      topbar.classList.toggle('is-hidden', !open);
      topbar.classList.toggle('is-visible', open);
      menuLauncher.classList.toggle('is-open', open);
    }
    menuLauncher.addEventListener('click', () => toggleDrawer(true));
    topbar.querySelector('.menu-trigger').addEventListener('click', () => toggleDrawer(!drawer.classList.contains('active')));
    overlay.addEventListener('click', () => toggleDrawer(false));
    drawer.querySelector('.sidebar-logout').addEventListener('click', signOut);
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') toggleDrawer(false); });

    const bell = topbar.querySelector('.notification-trigger');
    const panel = topbar.querySelector('[data-notification-panel]');

    bell.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = !panel.classList.contains('is-open');
      if (willOpen) renderNotifications();
      panel.classList.toggle('is-open', willOpen);
      bell.setAttribute('aria-expanded', String(willOpen));
    });
    // Un clic fuera del panel lo cierra, igual que en las vistas de cliente.
    document.addEventListener('click', (event) => {
      if (!panel.classList.contains('is-open')) return;
      if (panel.contains(event.target) || bell.contains(event.target)) return;
      panel.classList.remove('is-open');
      bell.setAttribute('aria-expanded', 'false');
    });

    panel.addEventListener('click', (event) => {
      const item = event.target.closest('[data-href]');
      if (item) window.location.href = item.dataset.href;
    });

    refreshNotifications();
    window.addEventListener('sgc-state-updated', refreshNotifications);
  }

  /**
   * Avisos del administrador. No son mensajes guardados: se derivan del estado
   * real del negocio, asi que se mantienen solos al cambiar los datos.
   */
  function buildNotifications() {
    const data = window.sgcAdminData;
    if (!data) return [];

    const summary = data.stats();
    const items = [];

    if (summary.pending) {
      items.push({
        icon: 'fa-regular fa-calendar-check', tone: 'warn',
        title: `${summary.pending} ${summary.pending === 1 ? 'cita pendiente' : 'citas pendientes'} por confirmar`,
        message: 'Confirmalas para evitar cancelaciones.',
        href: 'admin-citas.html?estado=pending'
      });
    }

    const unassigned = data.getAppointments().filter((appointment) =>
      !appointment.specialistEmail && appointment.status !== 'cancelled' && appointment.status !== 'previous'
    ).length;
    if (unassigned) {
      items.push({
        icon: 'fa-solid fa-user-plus', tone: 'warn',
        title: `${unassigned} ${unassigned === 1 ? 'cita sin especialista' : 'citas sin especialista'}`,
        message: 'Asigna un especialista antes de la fecha.',
        href: 'admin-citas.html'
      });
    }

    const atRisk = data.clientsWithNoShows().filter((row) => row.count >= 2);
    if (atRisk.length) {
      items.push({
        icon: 'fa-regular fa-circle-xmark', tone: 'danger',
        title: `${atRisk.length} ${atRisk.length === 1 ? 'cliente acumula' : 'clientes acumulan'} 2 o mas faltas`,
        message: atRisk.slice(0, 3).map((row) => row.name).join(', '),
        href: 'admin-clientes.html'
      });
    }

    if (summary.cancelledThisMonth) {
      items.push({
        icon: 'fa-regular fa-calendar-xmark', tone: 'danger',
        title: `${summary.cancelledThisMonth} ${summary.cancelledThisMonth === 1 ? 'cancelacion' : 'cancelaciones'} este mes`,
        message: 'Revisa los motivos en reportes.',
        href: 'admin-reportes.html'
      });
    }

    const expiring = data.getPromotions().filter((promo) => data.promotionStatus(promo) === 'active');
    if (expiring.length) {
      items.push({
        icon: 'fa-solid fa-tag', tone: 'ok',
        title: `${expiring.length} ${expiring.length === 1 ? 'promocion activa' : 'promociones activas'}`,
        message: expiring.slice(0, 2).map((promo) => promo.title).join(', '),
        href: 'admin-promociones.html'
      });
    }

    return items;
  }

  function renderNotifications() {
    const list = document.querySelector('[data-notification-list]');
    if (!list) return;
    const items = buildNotifications();

    list.innerHTML = items.length
      ? items.map((item) => `
          <button class="notification-item tone-${item.tone}" type="button" data-href="${item.href}">
            <i class="${item.icon}"></i>
            <span>
              <b>${escapeHtml(item.title)}</b>
              <small>${escapeHtml(item.message)}</small>
            </span>
          </button>
        `).join('')
      : '<p class="notification-empty">No hay nada que requiera tu atencion.</p>';
  }

  function refreshNotifications() {
    const badge = document.querySelector('[data-notification-count]');
    if (!badge) return;
    const count = buildNotifications().length;
    badge.textContent = count > 9 ? '9+' : String(count);
    badge.classList.toggle('visible', count > 0);

    // Si el panel esta abierto, se repinta para no mostrar datos viejos.
    const panel = document.querySelector('[data-notification-panel]');
    if (panel && panel.classList.contains('is-open')) renderNotifications();
  }

  /* ------------------------------- utilidades ------------------------------ */

  // Modal generico. Se crea un backdrop nuevo por apertura y se destruye al
  // cerrar: reutilizarlo acumulaba un listener de click por cada modal abierto.
  function openModal(html, options) {
    const config = options || {};
    document.querySelectorAll('.modal-backdrop').forEach((node) => node.remove());

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `<div class="modal${config.wide ? ' wide' : ''}">${html}</div>`;
    document.body.appendChild(backdrop);
    backdrop.classList.add('open');

    const close = () => {
      backdrop.remove();
      document.removeEventListener('keydown', onKey);
    };
    function onKey(event) { if (event.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    backdrop.addEventListener('click', (event) => { if (event.target === backdrop) close(); });
    backdrop.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', close));

    const firstInput = backdrop.querySelector('input, select, textarea');
    if (firstInput) firstInput.focus();

    return { element: backdrop.querySelector('.modal'), close };
  }

  // Aviso de exito que replica el "Servicio creado" del diseño.
  let flashTimer = null;
  function flash(message, onDone) {
    let backdrop = document.querySelector('.flash-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'flash-backdrop';
      document.body.appendChild(backdrop);
    }
    // Si ya habia un aviso en pantalla, su temporizador no debe cerrar este.
    if (flashTimer) clearTimeout(flashTimer);
    backdrop.innerHTML = `<div class="flash-card"><p>${escapeHtml(message)}</p><i class="fa-regular fa-circle-check"></i></div>`;
    backdrop.classList.add('open');
    flashTimer = setTimeout(() => {
      flashTimer = null;
      backdrop.classList.remove('open');
      backdrop.innerHTML = '';
      if (typeof onDone === 'function') onDone();
    }, 1400);
  }

  function confirmAction(message, onConfirm) {
    const modal = openModal(`
      <h2>Confirmar</h2>
      <p class="modal-sub">${escapeHtml(message)}</p>
      <div class="modal-actions">
        <button class="btn-ghost" type="button" data-close>Cancelar</button>
        <button class="btn-primary" type="button" data-confirm>Confirmar</button>
      </div>
    `);
    modal.element.querySelector('[data-confirm]').addEventListener('click', () => {
      modal.close();
      onConfirm();
    });
  }

  /* Paginacion reutilizable: recibe el total y devuelve el slice pedido. */
  function paginate(items, page, perPage) {
    const size = perPage || 5;
    const pages = Math.max(1, Math.ceil(items.length / size));
    const current = Math.min(Math.max(1, page), pages);
    return { rows: items.slice((current - 1) * size, current * size), page: current, pages };
  }

  const PAGER_WINDOW = 5;

  // Devuelve los numeros a mostrar: primera, ultima, un entorno de la actual y
  // separadores. Con 20 paginas no tiene sentido pintar 20 botones.
  function pageNumbers(current, total) {
    if (total <= PAGER_WINDOW + 2) {
      return Array.from({ length: total }, (item, index) => index + 1);
    }
    const half = Math.floor(PAGER_WINDOW / 2);
    let start = Math.max(2, current - half);
    let end = Math.min(total - 1, current + half);
    if (current <= half + 1) end = PAGER_WINDOW;
    if (current >= total - half) start = total - PAGER_WINDOW + 1;

    const numbers = [1];
    if (start > 2) numbers.push('…');
    for (let index = start; index <= end; index += 1) numbers.push(index);
    if (end < total - 1) numbers.push('…');
    numbers.push(total);
    return numbers;
  }

  function renderPager(container, pageInfo, onChange) {
    if (!container) return;
    if (pageInfo.pages <= 1) { container.innerHTML = ''; return; }
    const buttons = [];
    buttons.push(`<button type="button" data-page="${pageInfo.page - 1}"${pageInfo.page === 1 ? ' disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`);
    pageNumbers(pageInfo.page, pageInfo.pages).forEach((entry) => {
      if (entry === '…') {
        buttons.push('<span class="pager-gap">…</span>');
        return;
      }
      buttons.push(`<button type="button" data-page="${entry}"${entry === pageInfo.page ? ' class="active"' : ''}>${entry}</button>`);
    });
    buttons.push(`<button type="button" data-page="${pageInfo.page + 1}"${pageInfo.page === pageInfo.pages ? ' disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`);
    container.innerHTML = buttons.join('');
    container.querySelectorAll('button[data-page]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.disabled) return;
        onChange(Number(button.dataset.page));
      });
    });
  }

  // Menu de tres puntos por fila (Gestion de clientes).
  function bindKebabs(root) {
    root.querySelectorAll('.kebab-wrap').forEach((wrap) => {
      const trigger = wrap.querySelector('.icon-btn');
      const menu = wrap.querySelector('.kebab-menu');
      if (!trigger || !menu) return;
      trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        const wasOpen = menu.classList.contains('open');
        document.querySelectorAll('.kebab-menu.open').forEach((item) => item.classList.remove('open'));
        menu.classList.toggle('open', !wasOpen);
      });
    });
  }
  document.addEventListener('click', () => {
    document.querySelectorAll('.kebab-menu.open').forEach((menu) => menu.classList.remove('open'));
  });

  function readFileAsDataUrl(file, onLoad) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      window.alert('La imagen supera el limite de 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onLoad(reader.result);
    reader.readAsDataURL(file);
  }

  /* --------------------------------- arranque ------------------------------ */

  function boot() {
    const session = getSession();
    if (!session || session.role !== 'admin') {
      window.location.href = 'Loggin.html';
      return;
    }
    if (window.sgcAdminData) window.sgcAdminData.ensureSchema();
    renderShell(session);
    window.addEventListener('storage', (event) => {
      if (event.key === 'sgc_appointments_state_v1' || event.key === 'sgc_auth_users_v1') {
        window.dispatchEvent(new Event('sgc-state-updated'));
      }
    });
    document.dispatchEvent(new CustomEvent('admin-shell-ready', { detail: { session } }));
  }

  window.sgcAdminShell = {
    escapeHtml, getSession, signOut,
    openModal, flash, confirmAction,
    paginate, renderPager, bindKebabs, readFileAsDataUrl
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
