// Ensure a minimal global showSiteAlert exists for early-loaded pages
if (typeof window.showSiteAlert !== 'function') {
  window.showSiteAlert = function (message, type = 'info', timeout = 4200) {
    try {
      if (window.appointmentsSystem && typeof window.appointmentsSystem.showSiteAlert === 'function') {
        return window.appointmentsSystem.showSiteAlert(message, type, timeout);
      }
    } catch (e) { /* ignore */ }

    try {
      let container = document.getElementById('sgc-alert-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'sgc-alert-container';
        container.className = 'sgc-alert-container';
        document.body.appendChild(container);
      }
      const el = document.createElement('div');
      el.className = 'sgc-alert ' + (type || 'info');
      el.textContent = message || '';
      container.appendChild(el);
      setTimeout(() => {
        el.style.transition = 'all 260ms ease';
        el.style.opacity = '0';
        setTimeout(() => { try { el.remove(); } catch (e) {} }, 300);
      }, timeout);
      return el;
    } catch (e) { /* ignore */ }
    return null;
  };
}

if (!window.location.pathname.includes('/.idea/')) {
  const base = document.createElement('base');
  base.href = './.idea/';
  document.head.appendChild(base);
}
