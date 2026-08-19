function abrirMenu() {
  const menu = document.getElementById('sidebarMenu');
  const overlay = document.getElementById('menuOverlay');
  const menuBtn = document.querySelector('.menu-btn');
  if (menu) menu.classList.add('active');
  if (overlay) overlay.classList.add('active');
  if (menuBtn) menuBtn.classList.add('active');
}

function cerrarMenu() {
  const menu = document.getElementById('sidebarMenu');
  const overlay = document.getElementById('menuOverlay');
  const menuBtn = document.querySelector('.menu-btn');
  if (menu) menu.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  if (menuBtn) menuBtn.classList.remove('active');
}

function toggleMenu() {
  const menu = document.getElementById('sidebarMenu');
  if (menu && menu.classList.contains('active')) {
    cerrarMenu();
  } else {
    abrirMenu();
  }
}

function mostrarNotificaciones() {
  const panel = document.getElementById('notificationPanel');
  if (panel) panel.classList.toggle('active');
}

window.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const overlay = document.getElementById('menuOverlay');
  const notificationToggle = document.querySelector('[data-notification-toggle]');

  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', cerrarMenu);
  }

  if (notificationToggle) {
    notificationToggle.addEventListener('click', mostrarNotificaciones);
  }

  if (window.appointmentsSystem && typeof window.appointmentsSystem.init === 'function') {
    window.appointmentsSystem.init();
  }

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.tab-btn, #appointmentPagination button')) return;
    const detailPanel = document.getElementById('appointmentDetailPanel');
    const detail = document.getElementById('appointmentDetail');
    detailPanel?.classList.remove('is-open');
    detailPanel?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('detail-open');
    if (detail) detail.innerHTML = '<div class="empty-state">Selecciona una cita para ver su información.</div>';
  }, true);
});
