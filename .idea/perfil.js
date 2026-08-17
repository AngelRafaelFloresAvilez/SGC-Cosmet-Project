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
  const input = document.getElementById('profileAvatarInput');
  const img = document.getElementById('profileAvatarImg');
  const sidebarImg = document.getElementById('sidebarProfileAvatar');
  const menuBtn = document.querySelector('.menu-btn');
  const overlay = document.getElementById('menuOverlay');
  const notificationToggle = document.querySelector('[data-notification-toggle]');

  function updateImgs(url) {
    if (img) img.src = url;
    if (sidebarImg) sidebarImg.src = url;
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', cerrarMenu);
  }

  if (notificationToggle) {
    notificationToggle.addEventListener('click', mostrarNotificaciones);
  }

  if (input) {
    input.addEventListener('change', function () {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataUrl = e.target.result;
        updateImgs(dataUrl);
        if (window.appointmentsSystem && typeof window.appointmentsSystem.setProfileAvatar === 'function') {
          window.appointmentsSystem.setProfileAvatar(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  window.addEventListener('sgc-state-updated', function () {
    try {
      const state = window.appointmentsSystem && typeof window.appointmentsSystem.readState === 'function'
        ? window.appointmentsSystem.readState()
        : null;
      if (state && state.profile && state.profile.avatar) {
        updateImgs(state.profile.avatar);
      }
    } catch (e) { /* ignore */ }
  });

  const editBtn = document.getElementById('editProfileBtn');
  const saveBtn = document.getElementById('saveProfileBtn');
  const cancelBtn = document.getElementById('cancelProfileBtn');

  function enterEditMode() {
    const emailEl = document.querySelector('.profile-email');
    const phoneEl = document.querySelector('.profile-phone');
    const birthEl = document.querySelector('.profile-birth');
    if (!emailEl || !phoneEl || !birthEl) return;
    emailEl.dataset.value = emailEl.textContent;
    phoneEl.dataset.value = phoneEl.textContent;
    birthEl.dataset.value = birthEl.textContent;
    emailEl.innerHTML = `<input id="editEmailInput" type="email" value="${(emailEl.dataset.value||'').trim()}" />`;
    phoneEl.innerHTML = `<input id="editPhoneInput" type="tel" value="${(phoneEl.dataset.value||'').trim()}" />`;
    birthEl.innerHTML = `<input id="editBirthInput" type="date" value="${(birthEl.dataset.value||'').trim()}" />`;
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
  }

  function exitEditMode(discard) {
    const emailEl = document.querySelector('.profile-email');
    const phoneEl = document.querySelector('.profile-phone');
    const birthEl = document.querySelector('.profile-birth');
    if (!emailEl || !phoneEl || !birthEl) return;
    if (discard) {
      emailEl.textContent = emailEl.dataset.value || '';
      phoneEl.textContent = phoneEl.dataset.value || '';
      birthEl.textContent = birthEl.dataset.value || '';
    } else {
      const newEmail = document.getElementById('editEmailInput')?.value || emailEl.dataset.value || '';
      const newPhone = document.getElementById('editPhoneInput')?.value || phoneEl.dataset.value || '';
      const newBirth = document.getElementById('editBirthInput')?.value || birthEl.dataset.value || '';
      emailEl.textContent = newEmail;
      phoneEl.textContent = newPhone;
      birthEl.textContent = newBirth;
      if (window.appointmentsSystem && typeof window.appointmentsSystem.setProfile === 'function') {
        window.appointmentsSystem.setProfile({ email: newEmail, phone: newPhone, birthDate: newBirth });
      }
    }
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
  }

  if (editBtn) editBtn.addEventListener('click', enterEditMode);
  if (cancelBtn) cancelBtn.addEventListener('click', () => exitEditMode(true));
  if (saveBtn) saveBtn.addEventListener('click', () => exitEditMode(false));
});
