// Chrome del panel admin: cajón lateral + panel de notificaciones (diseño de copia)
(function () {
  const drawer = document.getElementById('adminDrawer');
  const overlay = document.getElementById('adminOverlay');
  const topbar = document.getElementById('adminTopbar');
  const launcher = document.querySelector('.admin-menu-launcher');
  if (!drawer || !overlay) return;

  const trigger = topbar ? topbar.querySelector('.menu-trigger') : null;

  function toggleDrawer(open) {
    drawer.classList.toggle('active', open);
    overlay.classList.toggle('active', open);
    if (topbar) {
      topbar.classList.toggle('is-hidden', !open);
      topbar.classList.toggle('is-visible', open);
    }
    if (launcher) launcher.classList.toggle('is-open', open);
  }

  launcher?.addEventListener('click', () => toggleDrawer(true));
  trigger?.addEventListener('click', () => toggleDrawer(!drawer.classList.contains('active')));
  overlay.addEventListener('click', () => toggleDrawer(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleDrawer(false); });

  // Panel de notificaciones
  const bell = topbar ? topbar.querySelector('.notification-trigger') : null;
  const panel = topbar ? topbar.querySelector('[data-notification-panel]') : null;
  if (bell && panel) {
    bell.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !panel.classList.contains('is-open');
      panel.classList.toggle('is-open', willOpen);
      bell.setAttribute('aria-expanded', String(willOpen));
    });
    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('is-open')) return;
      if (panel.contains(e.target) || bell.contains(e.target)) return;
      panel.classList.remove('is-open');
      bell.setAttribute('aria-expanded', 'false');
    });
  }

  // Menús kebab (tablas de clientes/otros)
  document.querySelectorAll('.kebab-wrap').forEach((wrap) => {
    const t = wrap.querySelector('.icon-btn');
    const menu = wrap.querySelector('.kebab-menu');
    if (!t || !menu) return;
    t.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = menu.classList.contains('open');
      document.querySelectorAll('.kebab-menu.open').forEach((m) => m.classList.remove('open'));
      menu.classList.toggle('open', !wasOpen);
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.kebab-menu.open').forEach((m) => m.classList.remove('open'));
  });
})();
