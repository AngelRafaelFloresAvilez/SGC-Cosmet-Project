function abrirMenu() {
  document.getElementById('sidebarMenu').classList.add('active');
  document.getElementById('menuOverlay').classList.add('active');
}

function cerrarMenu() {
  document.getElementById('sidebarMenu').classList.remove('active');
  document.getElementById('menuOverlay').classList.remove('active');
}

document.addEventListener('click', (event) => {
  const target = event.target;

  if (target.closest('.menu-btn')) {
    const sidebar = document.getElementById('sidebarMenu');
    if (sidebar.classList.contains('active')) {
      cerrarMenu();
    } else {
      abrirMenu();
    }
    return;
  }

  if (target.closest('.sidebar-nav a')) {
    cerrarMenu();
    return;
  }

  if (target.closest('.menu-overlay')) {
    cerrarMenu();
    return;
  }

  const hrefButton = target.closest('[data-href]');
  if (hrefButton) {
    const href = hrefButton.dataset.href;
    if (href) {
      window.location.href = href;
    }
  }
});
