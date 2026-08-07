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
    abrirMenu();
    return;
  }

  if (target.closest('.close-btn')) {
    cerrarMenu();
    return;
  }

  if (target.closest('.sidebar-nav a')) {
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

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-href]');
  if (!button) return;
  const href = button.dataset.href;
  if (href) {
    window.location.href = href;
  }
});
