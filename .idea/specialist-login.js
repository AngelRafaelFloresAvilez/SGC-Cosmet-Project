if (!window.location.pathname.includes('/.idea/')) {
  const base = document.createElement('base');
  base.href = './.idea/';
  document.head.appendChild(base);
}
