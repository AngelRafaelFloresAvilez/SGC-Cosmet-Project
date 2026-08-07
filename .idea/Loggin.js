if (!window.location.pathname.includes('/.idea/')) {
  const base = document.createElement('base');
  base.href = './.idea/';
  document.head.appendChild(base);
}

window.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('loginPassword');
  const showPasswordCheckbox = document.getElementById('showPassword');

  if (passwordInput && showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener('change', function () {
      passwordInput.type = this.checked ? 'text' : 'password';
    });
  }
});
