function abrirMenu() {
  document.getElementById('sidebarMenu').classList.add('active');
  document.getElementById('menuOverlay').classList.add('active');
}

function cerrarMenu() {
  document.getElementById('sidebarMenu').classList.remove('active');
  document.getElementById('menuOverlay').classList.remove('active');
}

window.addEventListener('DOMContentLoaded', () => {
  if (window.appointmentsSystem && typeof window.appointmentsSystem.init === 'function') {
    window.appointmentsSystem.init();
  }
});
