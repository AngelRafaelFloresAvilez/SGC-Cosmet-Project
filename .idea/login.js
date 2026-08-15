// Ensure a minimal global showSiteAlert exists for early-loaded pages
if (typeof showSiteAlert !== 'function') {
  window.showSiteAlert = function (message, type, timeout) {
    try {
      if (window.appointmentsSystem && typeof window.appointmentsSystem.showSiteAlert === 'function') {
        return window.appointmentsSystem.showSiteAlert(message, type, timeout);
      }
    } catch (e) { /* ignore */ }
    try { alert(message); } catch (e) { /* ignore */ }
    return null;
  };
}

if (!window.location.pathname.includes('/.idea/')) {
  const base = document.createElement('base');
  base.href = './.idea/';
  document.head.appendChild(base);
}
