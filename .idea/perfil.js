window.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('profileAvatarInput');
  const img = document.getElementById('profileAvatarImg');
  const sidebarImg = document.getElementById('sidebarProfileAvatar');

  function updateImgs(url) {
    if (img) img.src = url;
    if (sidebarImg) sidebarImg.src = url;
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
});
