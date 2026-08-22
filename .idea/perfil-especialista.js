function profileSpecialist() {
  const users = window.appointmentsSystem?.readUsers?.() || [];
  const session = window.appointmentsSystem?.getSession?.();
  return session?.role === 'specialist' ? users.find((user) => user.email?.toLowerCase() === session.email?.toLowerCase()) : users.find((user) => user.role === 'specialist');
}

function formatBirth(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value || '') ? value : ''; }

function specialistProfileAlert(message, type = 'warning') {
  if (typeof window.showSiteAlert === 'function') window.showSiteAlert(message, type);
  else window.alert(message);
}

function validateSpecialistProfile(values, currentEmail) {
  const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-]+$/;
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const phone = values.phone.replace(/\D/g, '');
  if (!values.name || !namePattern.test(values.name) || values.name.trim().split(/\s+/).length < 2) {
    return 'El nombre y apellido contienen caracteres inválidos.';
  }
  if (!emailPattern.test(values.email)) return 'Ingresa un correo electrónico válido.';
  const duplicate = (window.appointmentsSystem?.readUsers?.() || []).some((user) =>
    user.email?.toLowerCase() === values.email.toLowerCase() && user.email.toLowerCase() !== currentEmail.toLowerCase()
  );
  if (duplicate) return 'Ese correo ya está registrado.';
  if (!/^\d{8,14}$/.test(phone)) return 'El teléfono debe tener entre 8 y 14 dígitos.';
  const birthDate = new Date(values.birthDate);
  const today = new Date();
  if (!values.birthDate || Number.isNaN(birthDate.getTime())) return 'La fecha de nacimiento no es válida. Usa el selector de fecha.';
  if (birthDate > today) return 'La fecha de nacimiento no puede ser en el futuro.';
  const age = today.getFullYear() - birthDate.getFullYear() - ((today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) ? 1 : 0);
  if (age < 16 || age > 100) return 'Debes tener entre 16 y 100 años para registrarte.';
  return '';
}
function saveSpecialistAvatar(dataUrl) {
  const users = window.appointmentsSystem?.readUsers?.() || [];
  const specialist = profileSpecialist();
  if (specialist?.email) {
    const user = users.find((item) => item.email?.toLowerCase() === specialist.email.toLowerCase());
    if (user) user.avatar = dataUrl;
    localStorage.setItem('sgc_auth_users_v1', JSON.stringify(users));
  }
  const state = window.appointmentsSystem?.readState?.() || {};
  state.profile = { ...(state.profile || {}), avatar: dataUrl, email: specialist?.email || state.profile?.email };
  localStorage.setItem('sgc_appointments_state_v1', JSON.stringify(state));
  window.dispatchEvent(new Event('sgc-state-updated'));
}
function renderProfessionalProfile() {
  const specialist = profileSpecialist() || {};
  const name = `${specialist.name || ''} ${specialist.lastName || ''}`.trim() || 'Especialista';
  document.getElementById('specialistName').textContent = name;
  document.getElementById('sidebarUserName').textContent = name;
  document.querySelector('.sidebar-user-role').textContent = 'Especialista';
  document.getElementById('nameInput').value = name;
  document.getElementById('birthInput').value = formatBirth(specialist.birthDate);
  document.getElementById('emailInput').value = specialist.email || '';
  document.getElementById('phoneInput').value = specialist.phone || '';
  const avatar = specialist.avatar || '';
  document.getElementById('specialistAvatar').src = avatar || 'https://www.gravatar.com/avatar/?d=mp&s=150';
  document.getElementById('identityCard').innerHTML = `<div class="identity-avatar">${avatar ? `<img src="${avatar}" alt="${name}">` : '<i class="fa-regular fa-user"></i>'}</div><label class="change-photo" for="photoInput">Cambiar foto</label><input id="photoInput" class="photo-input" type="file" accept="image/*"><h2>${name}</h2><p class="identity-role">Especialista</p><div class="identity-contact"><div><i class="fa-solid fa-phone"></i>${specialist.phone || 'Teléfono no registrado'}</div><div><i class="fa-solid fa-envelope"></i>${specialist.email || 'Correo no registrado'}</div><div><i class="fa-regular fa-id-card"></i>ID de empleado no registrado</div></div>`;
  const services = window.appointmentsSystem?.getServices?.() || [];
  document.getElementById('servicesList').innerHTML = services.length ? services.map((service) => {
    const active = service.active !== false;
    return `<div class="service-profile-row${active ? '' : ' service-inactive'}"><i class="fa-regular ${active ? 'fa-circle-check' : 'fa-circle-xmark'}"></i><span>${service.title || service.name}<small>${active ? 'Activo' : 'Inactivo'}</small></span></div>`;
  }).join('') : '<p class="meta">No hay servicios registrados.</p>';
  document.getElementById('hoursList').innerHTML = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map((day, index) => `<div class="hour-row ${index > 4 ? 'off' : ''}"><strong>${day}</strong><span class="hour-line"></span><span class="hour-time">${index > 4 ? 'No trabaja' : '08:00 A.M - 06:00 P.M'}</span></div>`).join('');
  document.getElementById('photoInput')?.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { saveSpecialistAvatar(reader.result); renderProfessionalProfile(); };
    reader.readAsDataURL(file);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('sidebarMenu');
  const overlay = document.getElementById('menuOverlay');
  const trigger = document.getElementById('menuTrigger');
  const close = () => { menu.classList.remove('active'); overlay.classList.remove('active'); trigger.classList.remove('active'); };
  trigger?.addEventListener('click', () => { const open = menu.classList.toggle('active'); overlay.classList.toggle('active', open); trigger.classList.toggle('active', open); });
  overlay?.addEventListener('click', close);
  document.getElementById('signOutBtn')?.addEventListener('click', () => window.appointmentsSystem?.signOut?.());
  const editButton = document.getElementById('editProfile');
  const saveButton = document.getElementById('saveProfile');
  const cancelButton = document.getElementById('cancelProfile');
  const fields = ['nameInput', 'birthInput', 'emailInput', 'phoneInput'].map((id) => document.getElementById(id));
  let savedValues = {};
  const setEditing = (editing) => {
    fields.forEach((field) => { if (field) field.disabled = !editing; });
    if (editButton) editButton.hidden = editing;
    if (saveButton) saveButton.hidden = !editing;
    if (cancelButton) cancelButton.hidden = !editing;
  };
  editButton?.addEventListener('click', () => {
    savedValues = Object.fromEntries(fields.filter(Boolean).map((field) => [field.id, field.value]));
    setEditing(true);
    fields[0]?.focus();
  });
  cancelButton?.addEventListener('click', () => {
    fields.forEach((field) => { if (field && savedValues[field.id] !== undefined) field.value = savedValues[field.id]; });
    setEditing(false);
  });
  saveButton?.addEventListener('click', () => {
    const specialist = profileSpecialist() || {};
    const values = {
      name: document.getElementById('nameInput').value.trim(),
      email: document.getElementById('emailInput').value.trim().toLowerCase(),
      phone: document.getElementById('phoneInput').value.trim(),
      birthDate: document.getElementById('birthInput').value
    };
    const error = validateSpecialistProfile(values, specialist.email || '');
    if (error) { specialistProfileAlert(error); return; }
    const nameParts = values.name.split(/\s+/);
    window.appointmentsSystem?.setProfile?.({ ...values, name: nameParts.shift(), lastName: nameParts.join(' ') });
    setEditing(false);
    renderProfessionalProfile();
  });
  renderProfessionalProfile();
  setEditing(false);
});
