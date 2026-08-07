(function () {
  const STORAGE_KEY = 'sgc_appointments_state_v1';
  const defaults = {
    appointments: [],
    notifications: [],
    profile: {
      name: 'Ana López',
      email: 'ana.lopez@sgc.com',
      phone: '+52 55 1234 5678',
      birthDate: '14/08/1997',
      avatar: 'https://i.pravatar.cc/150?img=47',
      role: 'Cliente VIP',
      memberSince: '2024',
      status: 'Normal',
      statusMessage: 'Tienes acceso completo a tratamientos y promociones exclusivas.',
      notes: 'Disfruta de citas semanales y descuentos especiales para clientes recurrentes.'
    },
    payments: [
      { id: 'pay-1', amount: '$450 MXN', date: '12 Jun 2025', description: 'Limpieza facial profunda', status: 'Pagado' },
      { id: 'pay-2', amount: '$600 MXN', date: '20 Jun 2025', description: 'Masaje relajante', status: 'Pagado' }
    ],
    promotions: [
      { id: 'promo-1', title: '20% en tu próxima cita', description: 'Válido en tratamientos faciales y corporales.', validUntil: '31/08/2025', tag: 'Nueva' },
      { id: 'promo-2', title: 'Paquete de relajación', description: 'Incluye masaje + limpieza facial con un precio especial.', validUntil: '15/09/2025', tag: 'Popular' }
    ],
    services: [
      { id: 'svc-1', title: 'Limpieza Facial Profunda', category: 'Rostro', description: 'Elimina impurezas, células muertas y puntos negros devolviendo la frescura y oxigenación a tu piel.', includes: 'Vaporización con ozono, extracción manual y mascarilla calmante de caléndula.', duration: '60 minutos', price: '$450 MXN', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=500' },
      { id: 'svc-2', title: 'Masaje Relajante', category: 'Cuerpo', description: 'Terapia manual diseñada para aliviar tensiones musculares profundas y reducir el estrés.', includes: 'Aceites esenciales orgánicos aromaterapéuticos, música ambiental y técnica relajante de cuerpo completo.', duration: '60 minutos', price: '$600 MXN', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=500' },
      { id: 'svc-3', title: 'Lifting de Pestañas', category: 'Mirada', description: 'Alarga y eleva tus pestañas naturales desde la raíz con efecto de mayor amplitud.', includes: 'Tinte de pestañas de larga duración, baño de keratina nutritiva y diseño de curvatura natural.', duration: '45 minutos', price: '$350 MXN', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=500' },
      { id: 'svc-4', title: 'Microdermoabrasión', category: 'Tratamiento Clínico', description: 'Renovación celular profunda que minimiza poros dilatados y líneas finas.', includes: 'Exfoliación con punta de diamante, loción equilibrante sin alcohol y aplicación de pantalla solar con FPS 50+.', duration: '50 minutos', price: '$800 MXN', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=500' },
      { id: 'svc-5', title: 'Depilación Láser Diodo', category: 'Depilación', description: 'Eliminación progresiva del vello corporal con tecnología avanzada y segura.', includes: 'Aplicación en zona pequeña seleccionada, gel criogénico conductor y emulsión hidratante post-tratamiento.', duration: '30 minutos', price: '$500 MXN', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=500' },
      { id: 'svc-6', title: 'Hidratación Profunda con Ácido Hialurónico', category: 'Rostro', description: 'Tratamiento intensivo para pieles deshidratadas que devuelve elasticidad y brillo.', includes: 'Ampolleta de ácido hialurónico puro de alta penetración, masaje facial linfático y mascarilla hidroplástica.', duration: '60 minutos', price: '$550 MXN', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=500' }
    ],
    activePromotionId: null
  };

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (window && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new Event('sgc-state-updated'));
    }
  }

  function buildSeedState() {
    const seed = {
      appointments: [
        {
          id: 'seed-previous',
          serviceName: 'Limpieza facial profunda',
          price: '$450 MXN',
          date: 'Lun 12',
          time: '11:30 AM',
          notes: 'Cita atendida correctamente.',
          status: 'previous',
          createdAt: '2025-06-10T10:00:00.000Z',
          summary: 'Cita ya atendida.'
        },
        {
          id: 'seed-cancelled',
          serviceName: 'Hidratación con ácido hialurónico',
          price: '$550 MXN',
          date: 'Mar 13',
          time: '01:00 PM',
          notes: 'Cancelación registrada.',
          status: 'cancelled',
          createdAt: '2025-06-11T10:00:00.000Z',
          summary: 'Cita cancelada por el usuario.'
        },
        {
          id: 'seed-pending',
          serviceName: 'Microdermoabrasión',
          price: '$680 MXN',
          date: 'Jue 15',
          time: '04:00 PM',
          notes: 'Pendiente de confirmación.',
          status: 'pending',
          createdAt: '2025-06-15T10:00:00.000Z',
          summary: 'Tu cita está pendiente de confirmación.'
        }
      ],
      notifications: [
        {
          id: 'seed-notif',
          title: 'Tienes una cita pendiente',
          message: 'Revisa tu próxima cita en gestión de citas.',
          unread: true,
          createdAt: new Date().toISOString(),
          type: 'appointment'
        }
      ],
      profile: defaults.profile,
      payments: defaults.payments,
      promotions: defaults.promotions,
      services: defaults.services,
      activePromotionId: null
    };
    saveState(seed);
    return seed;
  }

  function getSession() {
    return window.sgcAuth && typeof window.sgcAuth.getSession === 'function'
      ? window.sgcAuth.getSession()
      : null;
  }

  function readUsers() {
    return window.sgcAuth && typeof window.sgcAuth.readUsers === 'function'
      ? window.sgcAuth.readUsers()
      : [];
  }

  function getSessionUser(state = readState()) {
    const session = getSession() || {};
    if (!session.email) return null;
    const users = readUsers();
    return users.find((item) => item.email && item.email.toLowerCase() === session.email.toLowerCase()) || null;
  }

  function getCurrentUserAppointments(state = readState()) {
    const session = getSession() || {};
    if (!session.email) return [];
    if (session.role === 'admin' || session.role === 'specialist') {
      return Array.isArray(state.appointments) ? state.appointments : [];
    }
    const userAppointments = (state.appointments || []).filter((appointment) =>
      appointment.createdBy && appointment.createdBy.email && appointment.createdBy.email.toLowerCase() === session.email.toLowerCase()
    );
    if (userAppointments.length) {
      return userAppointments;
    }
    return (state.appointments || []).filter((appointment) => !appointment.createdBy || !appointment.createdBy.email);
  }

  function createProfileFromUser(user, stateProfile = {}) {
    const profile = {
      ...defaults.profile,
      ...(user && stateProfile.email && stateProfile.email.toLowerCase() === user.email.toLowerCase() ? stateProfile : {}),
    };
    if (!user) return profile;

    return {
      ...profile,
      name: `${user.name} ${user.lastName || ''}`.trim(),
      email: user.email,
      phone: user.phone || defaults.profile.phone,
      birthDate: user.birthDate || defaults.profile.birthDate,
      avatar: user.avatar || defaults.profile.avatar,
      role: user.role === 'client'
        ? 'Cliente VIP'
        : user.role === 'specialist'
          ? 'Especialista'
          : user.role === 'admin'
            ? 'Administrador'
            : user.role,
      memberSince: user.memberSince || defaults.profile.memberSince || String(new Date().getFullYear()),
      status: stateProfile && stateProfile.email && user.email && stateProfile.email.toLowerCase() === user.email.toLowerCase() ? stateProfile.status : defaults.profile.status,
      statusMessage: stateProfile && stateProfile.email && user.email && stateProfile.email.toLowerCase() === user.email.toLowerCase() ? stateProfile.statusMessage : defaults.profile.statusMessage,
      notes: stateProfile && stateProfile.email && user.email && stateProfile.email.toLowerCase() === user.email.toLowerCase() ? stateProfile.notes : defaults.profile.notes
    };
  }

  function getProfileForCurrentSession(state = readState()) {
    const sessionUser = getSessionUser(state);
    return createProfileFromUser(sessionUser, state.profile || {});
  }

  function setProfileForCurrentSession(profileValues) {
    try {
      const state = readState();
      state.profile = createProfileFromUser(getSessionUser(state), { ...(state.profile || {}), ...profileValues });
      saveState(state);
    } catch (e) {
      // ignore
    }
  }

  function readState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return buildSeedState();
      const parsed = JSON.parse(saved);
      return {
        ...defaults,
        ...parsed,
        appointments: Array.isArray(parsed?.appointments) ? parsed.appointments : [],
        notifications: Array.isArray(parsed?.notifications) ? parsed.notifications : [],
        profile: { ...defaults.profile, ...(parsed?.profile || {}) },
        payments: Array.isArray(parsed?.payments) ? parsed.payments : defaults.payments,
        promotions: Array.isArray(parsed?.promotions) ? parsed.promotions : defaults.promotions,
        services: mergeServices(Array.isArray(parsed?.services) ? parsed.services : defaults.services),
        activePromotionId: parsed?.activePromotionId || null
      };
    } catch (error) {
      console.warn('No se pudo leer el estado de citas', error);
      return buildSeedState();
    }
  }

  function mergeServices(storedServices) {
    const safeServices = Array.isArray(storedServices) ? [...storedServices] : [];
    const knownIds = new Set(safeServices.map((service) => service.id));
    defaults.services.forEach((defaultService) => {
      if (!knownIds.has(defaultService.id)) {
        safeServices.push(defaultService);
      }
    });
    return safeServices;
  }

  function normalizeDateTime(date, time) {
    return `${date || ''}`.trim() + ' ' + `${time || ''}`.trim();
  }

  function isTimeSlotTaken(date, time, state = readState()) {
    if (!date || !time) return false;
    return state.appointments.some((appointment) => appointment.status !== 'cancelled' && appointment.date === date && appointment.time === time);
  }

  function getUnreadCount(state = readState()) {
    return state.notifications.filter((item) => item.unread).length;
  }

  function getCancelledCount(state = readState()) {
    return getCurrentUserAppointments(state).filter((item) => item.status === 'cancelled').length;
  }

  function canBookNewAppointment(state = readState()) {
    return getCancelledCount(state) < 3;
  }

  function addNotification(title, message, type = 'appointment') {
    const state = readState();
    state.notifications.unshift({
      id: `notif-${Date.now()}`,
      title,
      message,
      unread: true,
      createdAt: new Date().toISOString(),
      type
    });
    saveState(state);
    renderNotifications();
    return state.notifications[0];
  }

  function createAppointment(serviceName, price, date, time, notes = '') {
    const state = readState();
    if (!canBookNewAppointment(state)) {
      return { allowed: false, reason: 'limit_reached' };
    }

    const invalidDateTime = !date || !time || date === 'Sin definir' || time === 'Sin definir';
    if (invalidDateTime) {
      return { allowed: false, reason: 'missing_datetime' };
    }

    if (isTimeSlotTaken(date, time, state)) {
      return { allowed: false, reason: 'slot_taken' };
    }

    const session = getSession() || {};
    const users = readUsers();
    const userRecord = users.find((u) => u.email && session.email && u.email.toLowerCase() === session.email.toLowerCase());
    // apply promotion if available
    let promotionApplied = null;
    let originalPrice = price;
    let discountedPrice = null;
    try {
      const promoId = state.activePromotionId;
      if (promoId) {
        const promo = (state.promotions || []).find(p => p.id === promoId);
        if (promo) {
          promotionApplied = promo.id;
          // detect percentage in title like '20%'
          const match = String(promo.title).match(/(\d+)%/);
          if (match) {
            const pct = Number(match[1]);
            const num = Number(String(price).replace(/[^0-9.,]/g, '').replace(/,/g, '.')) || 0;
            const computed = Math.round((num * (1 - pct / 100)) * 100) / 100;
            discountedPrice = computed ? `$${computed} MXN` : null;
          }
        }
      }
    } catch (e) { /* ignore promotion parsing errors */ }

    const appointment = {
      id: `apt-${Date.now()}`,
      serviceName,
      price: discountedPrice || price,
      date,
      time,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      summary: 'Tu cita está pendiente de confirmación.',
      promotionApplied,
      originalPrice,
      discountedPrice,
      createdBy: {
        email: session.email || null,
        role: session.role || 'client',
        name: session.name || null,
        phone: userRecord ? userRecord.phone : (state.profile ? state.profile.phone : null),
        avatar: (userRecord && userRecord.avatar) || (state.profile && state.profile.email === (session.email || '') ? state.profile.avatar : null)
      }
    };

    state.appointments.unshift(appointment);
    saveState(state);
    addNotification('Nueva cita registrada', `Tienes una nueva cita para ${serviceName} el ${date} a las ${time}.`, 'appointment');
    syncProfileUI();
    return { allowed: true, appointment };
  }

  function cancelAppointment(id) {
    const state = readState();
    const target = state.appointments.find((item) => item.id === id);
    if (!target) return { allowed: false };

    target.status = 'cancelled';
    target.summary = 'Cita cancelada por el usuario.';
    saveState(state);
    addNotification('Cita cancelada', `Se canceló la cita de ${target.serviceName}.`, 'cancelled');
    syncProfileUI();
    return { allowed: true, state };
  }

  function removeAppointment(id) {
    const state = readState();
    const session = getSession() || {};
    // Only specialists may permanently remove appointments
    if (session.role !== 'specialist') {
      alert('Solo un especialista puede eliminar una cita permanentemente.');
      return state;
    }
    const before = state.appointments.length;
    state.appointments = state.appointments.filter((item) => item.id !== id);
    saveState(state);
    const after = state.appointments.length;
    renderNotifications();
    if (document.getElementById('appointmentsList')) renderAppointmentsPage();
    if (document.getElementById('historyList')) renderProfilePage();
    updateBookingBlocker();
    syncProfileUI();
    if (before !== after && getCancelledCount(state) < 3) {
      addNotification('Acceso re-evaluado', 'Se removió una cancelación; tu acceso podría quedar habilitado.', 'appointment');
    }
    return state;
  }

  function adminConfirmAppointment(id) {
    const state = readState();
    const session = getSession() || {};
    if (!session || (session.role !== 'admin' && session.role !== 'specialist')) {
      alert('No tienes permiso para confirmar citas.');
      return { allowed: false };
    }
    const target = state.appointments.find(a => a.id === id);
    if (!target) return { allowed: false };
    target.status = 'previous';
    target.summary = 'Cita confirmada y atendida.';
    saveState(state);
    addNotification('Cita confirmada', `La cita de ${target.serviceName} fue marcada como atendida.`, 'appointment');
    if (document.getElementById('appointmentsList')) renderAppointmentsPage();
    if (document.getElementById('pendingAppointmentsList')) {
      try { window.dispatchEvent(new Event('sgc-state-updated')); } catch(e) {}
    }
    syncProfileUI();
    return { allowed: true, appointment: target };
  }

  function restoreAccess() {
    const state = readState();
    const restored = state.appointments.filter((item) => item.status !== 'cancelled');
    state.appointments = restored;
    saveState(state);
    syncProfileUI();
    if (document.getElementById('appointmentsList')) {
      renderAppointmentsPage();
    }
    if (document.getElementById('historyList')) {
      renderProfilePage();
    }
    updateBookingBlocker();
    addNotification('Acceso reactivado', 'Se removieron las cancelaciones registradas y puedes volver a reservar.', 'appointment');
    return state;
  }

  function getServices(state = readState()) {
    return Array.isArray(state.services) && state.services.length ? state.services : defaults.services;
  }

  function createService(service) {
    const state = readState();
    const entry = {
      id: service.id || `svc-${Date.now()}`,
      title: service.title,
      category: service.category || 'General',
      description: service.description || '',
      includes: service.includes || '',
      duration: service.duration || '45 minutos',
      price: service.price || '$0 MXN',
      image: service.image || 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=500'
    };
    state.services = [...(state.services || []), entry];
    saveState(state);
    renderCatalogServices();
    // notify other pages/components that state changed
    window.dispatchEvent(new Event('sgc-state-updated'));
    return entry;
  }

  function removeService(id) {
    const state = readState();
    state.services = (state.services || []).filter((service) => service.id !== id);
    saveState(state);
    renderCatalogServices();
    window.dispatchEvent(new Event('sgc-state-updated'));
    return state.services;
  }

  // Promotions CRUD
  function getPromotions(state = readState()) {
    return Array.isArray(state.promotions) ? state.promotions : [];
  }

  function createPromotion(promo) {
    const state = readState();
    const entry = {
      id: promo.id || `promo-${Date.now()}`,
      title: promo.title || 'Promoción',
      description: promo.description || '',
      validUntil: promo.validUntil || null,
      tag: promo.tag || '',
      active: typeof promo.active === 'boolean' ? promo.active : true
    };
    state.promotions = [...(state.promotions || []), entry];
    saveState(state);
    window.dispatchEvent(new Event('sgc-state-updated'));
    return entry;
  }

  function updatePromotion(id, fields) {
    const state = readState();
    state.promotions = (state.promotions || []).map((p) => p.id === id ? { ...p, ...fields } : p);
    saveState(state);
    window.dispatchEvent(new Event('sgc-state-updated'));
    return state.promotions.find((p) => p.id === id);
  }

  function deletePromotion(id) {
    const state = readState();
    state.promotions = (state.promotions || []).filter((p) => p.id !== id);
    // if active promotion was deleted, clear activePromotionId
    if (state.activePromotionId === id) state.activePromotionId = null;
    saveState(state);
    window.dispatchEvent(new Event('sgc-state-updated'));
    return state.promotions;
  }

  function renderCatalogServices() {
    const grid = document.querySelector('.services-grid');
    if (!grid) return;

    const services = getServices(readState());
    grid.innerHTML = services.map((service) => `
      <article class="service-card" data-title="${String(service.title).replace(/"/g,'&quot;')}" data-category="${String(service.category).replace(/"/g,'&quot;')}" data-desc="${String(service.description).replace(/"/g,'&quot;')}" data-includes="${String(service.includes).replace(/"/g,'&quot;')}" data-duration="${String(service.duration).replace(/"/g,'&quot;')}" data-price="${String(service.price).replace(/"/g,'&quot;')}" data-image="${String(service.image).replace(/"/g,'&quot;')}">
        <div class="service-img-container">
          <img src="${service.image}" alt="${service.title}" class="service-img">
        </div>
        <div class="service-info">
          <span class="service-category">${service.category}</span>
          <h3 class="service-title">${service.title}</h3>
          <p class="service-desc">${service.description}</p>
          <div class="service-footer">
            <span class="service-price">${service.price}</span>
            <button class="btn-book">Ver Detalles</button>
          </div>
        </div>
      </article>
    `).join('');
  }

  function markNotificationsRead() {
    const state = readState();
    state.notifications = state.notifications.map((item) => ({ ...item, unread: false }));
    saveState(state);
    renderNotifications();
  }

  function getAppointmentById(id) {
    return readState().appointments.find((item) => item.id === id);
  }

  function openSidebar() {
    const menu = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('menuOverlay');
    if (menu && overlay) {
      menu.classList.add('active');
      overlay.classList.add('active');
    }
  }

  function closeSidebar() {
    const menu = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('menuOverlay');
    if (menu && overlay) {
      menu.classList.remove('active');
      overlay.classList.remove('active');
    }
  }

  // Global delegated handlers for common UI actions (navigation, menu, logout)
  document.addEventListener('click', (e) => {
    const target = e.target;

    // data-href navigation
    const nav = target.closest('[data-href]');
    if (nav) {
      const href = nav.dataset.href;
      if (href) window.location.href = href;
      return;
    }

    // Open menu
    if (target.closest('.menu-btn')) {
      openSidebar();
      return;
    }

    // Close menu via close button or overlay
    if (target.closest('.close-btn') || target.closest('#menuOverlay')) {
      closeSidebar();
      return;
    }

    // User profile click
    if (target.closest('.user-profile')) {
      window.location.href = 'perfil.html';
      return;
    }

    // Logout
    if (target.closest('.btn-logout-green') || target.closest('.btn.secondary') || target.closest('.btn.btn-logout-green')) {
      if (window.appointmentsSystem && typeof window.appointmentsSystem.signOut === 'function') {
        window.appointmentsSystem.signOut();
      } else if (window.appointmentsSystem && typeof window.appointmentsSystem.clearSession === 'function') {
        window.appointmentsSystem.clearSession();
        window.location.href = 'Loggin.html';
      } else {
        window.location.href = 'Loggin.html';
      }
      return;
    }
  });

  function updateBookingBlocker() {
    const blocker = document.getElementById('bookingBlocker');
    if (!blocker) return;
    const state = readState();
    const remaining = 3 - getCancelledCount(state);
    blocker.hidden = canBookNewAppointment(state);
    const label = blocker.querySelector('strong');
    if (label) {
      label.textContent = `${remaining} disponible${remaining === 1 ? '' : 's'}`;
    }
  }

  function renderNotifications() {
    const panel = document.getElementById('notificationList');
    const badge = document.querySelector('.notification-badge');
    const state = readState();
    const unreadCount = getUnreadCount(state);

    if (badge) {
      badge.hidden = unreadCount === 0;
      badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
    }

    if (!panel) return;

    if (!state.notifications.length) {
      panel.innerHTML = '<div class="empty-state">No tienes notificaciones por revisar.</div>';
      return;
    }

    const notifications = state.notifications.slice(0, 4);
    panel.innerHTML = notifications
      .map((item) => `
        <div class="notification-item ${item.unread ? 'unread' : ''}">
          <div class="notification-title">${item.title}</div>
          <div class="notification-message">${item.message}</div>
          <div class="notification-meta">${new Date(item.createdAt).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}</div>
        </div>
      `)
      .join('');
  }

  function syncProfileUI() {
    const state = readState();
    const profile = getProfileForCurrentSession(state);
    const firstName = profile.name.split(' ')[0] || 'Ana';

    document.querySelectorAll('.user-name').forEach((element) => {
      element.textContent = profile.name;
    });

    document.querySelectorAll('.user-role').forEach((element) => {
      element.textContent = profile.role;
    });

    document.querySelectorAll('.profile-name').forEach((element) => {
      element.textContent = profile.name;
    });

    document.querySelectorAll('.profile-role').forEach((element) => {
      element.textContent = profile.role;
    });

    document.querySelectorAll('.profile-email').forEach((element) => {
      element.textContent = profile.email;
    });

    document.querySelectorAll('.profile-phone').forEach((element) => {
      element.textContent = profile.phone;
    });

    document.querySelectorAll('.profile-birth').forEach((element) => {
      element.textContent = profile.birthDate;
    });

    document.querySelectorAll('.profile-member').forEach((element) => {
      element.textContent = `Miembro desde ${profile.memberSince}`;
    });

    document.querySelectorAll('.profile-avatar').forEach((element) => {
      if (element.tagName === 'IMG') {
        element.src = profile.avatar;
        element.alt = profile.name;
      }
    });

    // also sync sidebar profile images
    document.querySelectorAll('.sidebar-profile img, #sidebarProfileAvatar, #profileAvatarImg').forEach((el) => {
      try {
        if (el && el.tagName === 'IMG') {
          el.src = profile.avatar;
          el.alt = profile.name;
        }
      } catch (e) { /* ignore */ }
    });

    document.querySelectorAll('.sidebar-profile h4').forEach((element) => {
      element.textContent = profile.name;
    });

    document.querySelectorAll('.sidebar-profile p').forEach((element) => {
      element.innerHTML = `${profile.role}<br>Activo desde ${profile.memberSince}`;
    });

    // update admin/specialist avatar placeholders
    document.querySelectorAll('.admin-user-avatar, .specialist-avatar').forEach((el) => {
      try {
        if (!el) return;
        // if element is an IMG-like container, replace with IMG
        const img = document.createElement('img');
        img.src = profile.avatar;
        img.alt = profile.name;
        img.style.width = el.style.width || '40px';
        img.style.height = el.style.height || '40px';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        // replace text content
        el.innerHTML = '';
        el.appendChild(img);
      } catch (e) { /* ignore */ }
    });

    document.querySelectorAll('.text-hello').forEach((element) => {
      element.textContent = `Bienvenida de nuevo, ${firstName}`;
    });

    const cancelledCount = getCancelledCount(state);
    const status = cancelledCount >= 3 ? 'Vetado temporal' : 'Normal';
    const statusMessage = cancelledCount >= 3
      ? 'Tienes varias cancelaciones registradas y se requiere revisión para volver a reservar.'
      : 'Tu acceso sigue activo y puedes seguir disfrutando de tratamientos y promociones.';

    document.querySelectorAll('.profile-status').forEach((element) => {
      element.textContent = status;
    });

    document.querySelectorAll('.profile-status-pill').forEach((element) => {
      element.classList.toggle('alert', cancelledCount >= 3);
    });

    document.querySelectorAll('.profile-status-message').forEach((element) => {
      element.textContent = statusMessage;
    });

    document.querySelectorAll('.profile-cancel-count').forEach((element) => {
      element.textContent = cancelledCount;
    });

    const cancelledCard = document.getElementById('cancelledSummaryCard');
    if (cancelledCard) {
      cancelledCard.classList.toggle('alert', cancelledCount > 0);
      cancelledCard.classList.toggle('danger', cancelledCount >= 3);
    }
  }

  function renderProfilePage() {
    const state = readState();
    const profile = getProfileForCurrentSession(state);
    const cancelledCount = getCancelledCount(state);
    const status = cancelledCount >= 3 ? 'Vetado temporal' : 'Normal';
    const activePromotion = state.promotions.find((promo) => promo.id === state.activePromotionId) || state.promotions[0];

    const profileStatusEl = document.getElementById('profileStatus');
    const profileStatusMessageEl = document.getElementById('profileStatusMessage');
    const profileCancelledEl = document.getElementById('profileCancelledCount');
    const profileNextAppointmentEl = document.getElementById('profileNextAppointment');
    const profileNextAppointmentCompactEl = document.getElementById('profileNextAppointmentCompact');
    const historyListEl = document.getElementById('historyList');
    const paymentsListEl = document.getElementById('paymentsList');
    const promotionsListEl = document.getElementById('promotionsList');
    const activePromotionEl = document.getElementById('activePromotionBox');

    if (profileStatusEl) profileStatusEl.textContent = status;
    if (profileStatusMessageEl) profileStatusMessageEl.textContent = cancelledCount >= 3 ? 'Tienes varias cancelaciones registradas y se requiere revisión para volver a reservar.' : 'Tu acceso sigue activo y puedes seguir disfrutando de tratamientos y promociones.';
    const recoveryButton = document.getElementById('restoreAccessBtn');
    if (recoveryButton) {
      recoveryButton.hidden = cancelledCount < 3;
      recoveryButton.onclick = function () {
        if (window.appointmentsSystem && typeof window.appointmentsSystem.restoreAccess === 'function') {
          window.appointmentsSystem.restoreAccess();
        }
      };
    }
    if (profileCancelledEl) profileCancelledEl.textContent = cancelledCount;
    if (profileNextAppointmentEl || profileNextAppointmentCompactEl) {
      const nextAppointment = getCurrentUserAppointments(state).find((item) => item.status === 'pending');
      const nextText = nextAppointment ? `${nextAppointment.date} · ${nextAppointment.time}` : 'Sin citas próximas';
      if (profileNextAppointmentEl) profileNextAppointmentEl.textContent = nextText;
      if (profileNextAppointmentCompactEl) profileNextAppointmentCompactEl.textContent = nextText;
    }

    if (historyListEl) {
      const appointments = getCurrentUserAppointments(state);
      const historyMarkup = appointments.length
        ? appointments.map((appointment) => `
            <div class="history-item">
              <div>
                <strong>${appointment.serviceName}</strong>
                <p>${appointment.date} · ${appointment.time}</p>
              </div>
              <span class="history-badge">${appointment.status === 'pending' ? 'Pendiente' : appointment.status === 'cancelled' ? 'Cancelada' : 'Completada'}</span>
            </div>
          `).join('')
        : '<div class="empty-state">Aún no tienes historial de citas.</div>';
      historyListEl.innerHTML = historyMarkup;
    }

    if (paymentsListEl) {
      paymentsListEl.innerHTML = state.payments.map((payment) => `
        <div class="payment-item">
          <div>
            <strong>${payment.description}</strong>
            <p>${payment.date}</p>
          </div>
          <span class="payment-status">${payment.status}</span>
        </div>
      `).join('');
    }

    if (promotionsListEl) {
      promotionsListEl.innerHTML = state.promotions.map((promo) => `
        <div class="promo-item">
          <div>
            <strong>${promo.title}</strong>
            <p>${promo.description}</p>
            <small>Válido hasta ${promo.validUntil}</small>
          </div>
          <button class="promo-btn" data-promo-id="${promo.id}">${state.activePromotionId === promo.id ? 'Activa' : 'Usar'}</button>
        </div>
      `).join('');

      promotionsListEl.querySelectorAll('.promo-btn').forEach((button) => {
        button.addEventListener('click', () => {
          const promoId = button.dataset.promoId;
          const stateNow = readState();
          stateNow.activePromotionId = promoId;
          saveState(stateNow);
          addNotification('Promoción activada', 'Tu próxima cita ya podrá aprovechar la promoción seleccionada.', 'promotion');
          renderProfilePage();
        });
      });
    }

    if (activePromotionEl) {
      activePromotionEl.innerHTML = activePromotion
        ? `
          <div class="active-promo-card">
            <strong>${activePromotion.title}</strong>
            <p>${activePromotion.description}</p>
            <small>Válida hasta ${activePromotion.validUntil}</small>
          </div>
        `
        : '<div class="empty-state">Todavía no tienes una promoción activa.</div>';
    }
  }

  function renderAppointmentsPage() {
    const state = readState();
    const list = document.getElementById('appointmentsList');
    const detail = document.getElementById('appointmentDetail');
    const cancelledCount = document.getElementById('cancelledCount');
    const summaryCards = {
      pending: document.getElementById('pendingCount'),
      previous: document.getElementById('previousCount'),
      cancelled: document.getElementById('cancelledSummaryCount')
    };
    const userAppointments = getCurrentUserAppointments(state);

    if (cancelledCount) cancelledCount.textContent = userAppointments.filter((item) => item.status === 'cancelled').length;

    const cancelledCard = document.getElementById('cancelledSummaryCard');
    if (cancelledCard) {
      const cancelledValue = getCancelledCount(state);
      cancelledCard.classList.toggle('alert', cancelledValue > 0);
      cancelledCard.classList.toggle('danger', cancelledValue >= 3);
    }

    Object.entries(summaryCards).forEach(([status, el]) => {
      if (el) {
        el.textContent = userAppointments.filter((item) => item.status === status).length;
      }
    });

    if (!list || !detail) return;

    const tabs = document.querySelectorAll('.tab-btn');
    const activeStatus = localStorage.getItem('sgc_active_tab') || 'pending';
    const filtered = userAppointments.filter((item) => item.status === activeStatus).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (tabs && tabs.length) {
      tabs.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.statusTab === activeStatus);
        btn.onclick = () => {
          localStorage.setItem('sgc_active_tab', btn.dataset.statusTab);
          renderAppointmentsPage();
        };
      });
    }

    if (!filtered.length) {
      list.innerHTML = '<div class="empty-state">No hay citas en esta sección.</div>';
      detail.innerHTML = '<div class="empty-state">Selecciona una cita para ver su información.</div>';
      return;
    }

    list.innerHTML = filtered.map((appointment) => `
      <button class="appointment-item" data-appointment-id="${appointment.id}">
        <div class="appointment-item-head">
          <strong>${appointment.serviceName}</strong>
          <span class="appointment-badge">${appointment.status === 'pending' ? 'Pendiente' : appointment.status === 'cancelled' ? 'Cancelada' : 'Completada'}</span>
        </div>
        <div class="appointment-item-meta">${appointment.date} · ${appointment.time}</div>
        <div class="appointment-item-price">${appointment.price}</div>
      </button>
    `).join('');

    list.querySelectorAll('.appointment-item').forEach((button) => {
      button.addEventListener('click', () => {
        const current = getAppointmentById(button.dataset.appointmentId);
        if (!current) return;
        detail.innerHTML = `
          <div class="detail-card">
            <div class="detail-card-head">
              <h3>${current.serviceName}</h3>
              <span class="appointment-badge">${current.status === 'pending' ? 'Pendiente' : current.status === 'cancelled' ? 'Cancelada' : 'Completada'}</span>
            </div>
            <div class="client-info" style="display:flex;gap:12px;align-items:center;margin-top:10px">
              <img src="${(current.createdBy && current.createdBy.avatar) || 'https://i.pravatar.cc/80?img=47'}" alt="${(current.createdBy && current.createdBy.name) || 'Cliente'}" style="width:56px;height:56px;border-radius:50%;object-fit:cover">
              <div>
                <div><strong>${(current.createdBy && current.createdBy.name) || 'Cliente SGC'}</strong></div>
                <div class="meta">${(current.createdBy && current.createdBy.email) || ''} ${current.createdBy && current.createdBy.phone ? '· ' + current.createdBy.phone : ''}</div>
              </div>
            </div>
            <div class="detail-grid">
              <div><span>Fecha</span><strong>${current.date}</strong></div>
              <div><span>Hora</span><strong>${current.time}</strong></div>
              <div><span>Precio</span><strong>${current.price}</strong></div>
              <div><span>Estado</span><strong>${current.summary}</strong></div>
            </div>
            ${current.status === 'pending' ? `<button class="btn-cancel" data-cancel-id="${current.id}">Cancelar cita</button>` : (getSession() && getSession().role === 'specialist' ? `<button class="btn-delete" data-delete-id="${current.id}">Eliminar cita</button>` : '')}
          </div>
        `;
            const cancelButton = detail.querySelector('.btn-cancel');
        if (cancelButton) {
          cancelButton.addEventListener('click', () => {
            openCancelModal(cancelButton.dataset.cancelId);
          });
        }
        const deleteButton = detail.querySelector('.btn-delete');
        if (deleteButton) {
          deleteButton.addEventListener('click', () => {
                const session = getSession() || {};
                if (session.role !== 'specialist') {
                  alert('Solo un especialista puede eliminar citas. Si necesitas cancelar, usa la opción de cancelar.');
                  return;
                }
                if (confirm('¿Seguro que deseas eliminar esta cita? Esta acción no se puede deshacer.')) {
                  removeAppointment(deleteButton.dataset.deleteId);
                  renderNotifications();
                  renderAppointmentsPage();
                }
          });
        }
      });
    });

    const firstCard = list.querySelector('.appointment-item');
    if (firstCard) firstCard.click();
  }

  function openCancelModal(id) {
    const modal = document.getElementById('cancelAppointmentModal');
    if (!modal) return;
    modal.dataset.appointmentId = id;
    modal.classList.add('active');
  }

  function closeCancelModal() {
    const modal = document.getElementById('cancelAppointmentModal');
    if (modal) {
      modal.classList.remove('active');
      modal.removeAttribute('data-appointment-id');
    }
  }

  let appInitialized = false;

  function initialize() {
    if (appInitialized) return;
    appInitialized = true;
    const menuButton = document.getElementById('menuBtn') || document.querySelector('.menu-btn');
    const closeButton = document.getElementById('closeMenuBtn') || document.querySelector('.close-btn');
    const overlay = document.getElementById('menuOverlay') || document.querySelector('.menu-overlay');
    const menu = document.getElementById('sidebarMenu') || document.querySelector('.sidebar-menu');

    if (menuButton) menuButton.addEventListener('click', openSidebar);
    if (closeButton) closeButton.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
    if (menu) {
      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeSidebar);
      });
    }

    document.querySelectorAll('.user-profile').forEach((profileButton) => {
      profileButton.addEventListener('click', () => {
        if (window.location.pathname.includes('perfil.html')) return;
        const basePath = window.location.pathname.replace(/[^/]*$/, '');
        window.location.href = window.location.pathname.includes('/.idea/') ? 'perfil.html' : basePath + '.idea/perfil.html';
      });
    });

    const notificationButton = document.querySelector('[data-notification-toggle]') || document.querySelector('.btn-notification');
    const notificationPanel = document.getElementById('notificationPanel');
    if (notificationButton && notificationPanel) {
      notificationButton.addEventListener('click', (event) => {
        event.stopPropagation();
        renderNotifications();
        notificationPanel.classList.toggle('active');
        if (notificationPanel.classList.contains('active')) {
          markNotificationsRead();
        }
      });
      document.addEventListener('click', (event) => {
        if (!notificationPanel.contains(event.target) && !notificationButton.contains(event.target)) {
          notificationPanel.classList.remove('active');
        }
      });
    }

    const cancelModal = document.getElementById('cancelAppointmentModal');
    if (cancelModal) {
      cancelModal.querySelector('.cancel-confirm-btn')?.addEventListener('click', () => {
        const id = cancelModal.dataset.appointmentId;
        if (id) {
          cancelAppointment(id);
          renderNotifications();
          renderAppointmentsPage();
          closeCancelModal();
        }
      });
      cancelModal.querySelector('.cancel-cancel-btn')?.addEventListener('click', closeCancelModal);
      cancelModal.addEventListener('click', (event) => {
        if (event.target.id === 'cancelAppointmentModal') {
          closeCancelModal();
        }
      });
    }

    function handleGlobalStateUpdate() {
      syncProfileUI();
      renderNotifications();
      updateBookingBlocker();
      renderCatalogServices();
      if (document.getElementById('appointmentsList')) {
        renderAppointmentsPage();
      }
      if (document.getElementById('historyList')) {
        renderProfilePage();
      }
    }

    window.addEventListener('sgc-state-updated', handleGlobalStateUpdate);

    syncProfileUI();
    renderNotifications();
    renderCatalogServices();
    if (document.getElementById('appointmentsList')) {
      renderAppointmentsPage();
    }
    if (document.getElementById('historyList')) {
      renderProfilePage();
    }

    updateBookingBlocker();
  }

  window.appointmentsSystem = {
    createAppointment,
    cancelAppointment: function (id) {
      const result = cancelAppointment(id);
      renderNotifications();
      if (document.getElementById('appointmentsList')) {
        renderAppointmentsPage();
      }
      if (document.getElementById('historyList')) {
        renderProfilePage();
      }
      updateBookingBlocker();
      syncProfileUI();
      return result;
    },
    removeAppointment,
    readState,
    canBookNewAppointment,
    restoreAccess,
    getServices,
    createService,
    removeService,
    renderCatalogServices,
    init: initialize,
    markNotificationsRead,
    getUnreadCount,
    getCancelledCount,
    confirmCancelAppointment: openCancelModal,
    closeCancelModal,
    syncProfileUI,
    renderProfilePage,
    getSession,
    readUsers,
    clearSession: function () {
      if (window.sgcAuth && typeof window.sgcAuth.clearSession === 'function') {
        window.sgcAuth.clearSession();
      } else if (typeof sessionStorage !== 'undefined' && sessionStorage.removeItem) {
        sessionStorage.removeItem('sgc_active_session_v1');
      }
    },
    setSession: function (session) {
      if (window.sgcAuth && typeof window.sgcAuth.setSession === 'function') {
        window.sgcAuth.setSession(session);
      } else if (typeof sessionStorage !== 'undefined' && sessionStorage.setItem) {
        try { sessionStorage.setItem('sgc_active_session_v1', JSON.stringify(session)); } catch (e) { }
      }
    },
    createUser: function (user) {
      return window.sgcAuth && typeof window.sgcAuth.createUser === 'function'
        ? window.sgcAuth.createUser(user)
        : { ok: false, error: 'auth_not_ready' };
    },
    loginUser: function (email, password) {
      return window.sgcAuth && typeof window.sgcAuth.loginUser === 'function'
        ? window.sgcAuth.loginUser(email, password)
        : { ok: false, error: 'auth_not_ready' };
    },
    signOut: function () {
      if (window.sgcAuth && typeof window.sgcAuth.signOut === 'function') {
        window.sgcAuth.signOut();
        return;
      }
      if (typeof sessionStorage !== 'undefined' && sessionStorage.removeItem) {
        sessionStorage.removeItem('sgc_active_session_v1');
      }
      const basePath = window.location.pathname.replace(/[^/]*$/, '');
      window.location.href = window.location.pathname.includes('/.idea/') ? 'Loggin.html' : basePath + '.idea/Loggin.html';
    },
    applyPromotion: function (promoId) {
      const state = readState();
      state.activePromotionId = promoId;
      saveState(state);
      if (promoId) {
        addNotification('Promoción activada', 'Tu próxima cita ya podrá aprovechar la promoción seleccionada.', 'promotion');
      }
      renderProfilePage();
      syncProfileUI();
      return state.activePromotionId;
    }
  };

  // expose promotions API
  if (window.appointmentsSystem) {
    window.appointmentsSystem.getPromotions = getPromotions;
    window.appointmentsSystem.createPromotion = createPromotion;
    window.appointmentsSystem.updatePromotion = updatePromotion;
    window.appointmentsSystem.deletePromotion = deletePromotion;
  }

  // expose admin confirm
  if (window.appointmentsSystem) {
    window.appointmentsSystem.adminConfirmAppointment = adminConfirmAppointment;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();

(function () {
  const AUTH_STORAGE_KEY = 'sgc_auth_users_v1';
  const SESSION_STORAGE_KEY = 'sgc_active_session_v1';

  function resolveRelative(fileName) {
    try {
      // If a base tag was injected pointing to .idea, return the file name only
      const base = document.head.querySelector('base');
      if (base && String(base.href).includes('.idea')) return fileName;
      // If current URL already points into a .idea folder keep relative links
      if (window.location.pathname.includes('/.idea/') || window.location.href.includes('/.idea/')) {
        return fileName;
      }
      // otherwise assume files live under .idea
      return '.idea/' + fileName;
    } catch (e) {
      return fileName;
    }
  }

  function readUsers() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      const defaultUsers = [
        {
          name: 'Ana',
          lastName: 'López',
          email: 'ana@sgc.com',
          phone: '+52 55 1234 5678',
          birthDate: '1997-08-14',
          password: 'sgc2026',
          role: 'client'
        },
        {
          name: 'Sofía',
          lastName: 'Vega',
          email: 'sofia@sgc.com',
          phone: '+52 55 1111 2222',
          birthDate: '1994-06-15',
          password: 'sgc2026',
          role: 'specialist'
        },
        {
          name: 'Administrador',
          lastName: 'SGC',
          email: 'admin@sgc.com',
          phone: '+52 55 0000 0000',
          birthDate: '1988-01-01',
          password: 'admin2026',
          role: 'admin'
        }
      ];

      if (!stored) {
        saveUsers(defaultUsers);
        return defaultUsers;
      }

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        saveUsers(defaultUsers);
        return defaultUsers;
      }

      const merged = [...parsed];
      defaultUsers.forEach((defaultUser) => {
        const exists = merged.some((user) => user.email?.toLowerCase() === defaultUser.email.toLowerCase());
        if (!exists) {
          merged.push(defaultUser);
        }
      });

      if (merged.length !== parsed.length) {
        saveUsers(merged);
      }

      return merged;
    } catch (error) {
      saveUsers(defaultUsers);
      return defaultUsers;
    }
  }

  function saveUsers(users) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
  }

  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
    } catch (error) {
      return null;
    }
  }

  function setSession(session) {
    if (!session || typeof session !== 'object') return;
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }

  function createUser(user) {
    const users = readUsers();
    const existing = users.find((item) => item.email.toLowerCase() === user.email.toLowerCase());
    if (existing) return { ok: false, error: 'email_exists' };
    const newUser = {
      avatar: 'https://i.pravatar.cc/150?img=47',
      memberSince: String(new Date().getFullYear()),
      ...user
    };
    users.push(newUser);
    saveUsers(users);
    return { ok: true, user: newUser };
  }

  function setProfileAvatar(dataUrl) {
    try {
      const state = readState();
      state.profile = { ...(state.profile || {}), avatar: dataUrl };
      saveState(state);
      // also update auth users if session available
      try {
        const session = getSession() || {};
        if (session && session.email) {
          const users = readUsers();
          const idx = users.findIndex(u => u.email && u.email.toLowerCase() === session.email.toLowerCase());
          if (idx >= 0) {
            users[idx].avatar = dataUrl;
            saveUsers(users);
          }
        }
      } catch (e) {
        // ignore
      }
      // update UI
      renderProfilePage();
      syncProfileUI();
      return dataUrl;
    } catch (e) {
      return null;
    }
  }

  function loginUser(email, password) {
    const users = readUsers();
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (!user) return { ok: false, error: 'invalid_credentials' };
    setSession({ role: user.role, email: user.email, name: `${user.name} ${user.lastName || ''}`.trim() });
    if (window.appointmentsSystem && typeof window.appointmentsSystem.syncProfileUI === 'function') {
      window.appointmentsSystem.syncProfileUI();
    }
    return { ok: true, user };
  }

  function navigateByRole(role) {
    if (role === 'specialist') {
      window.location.href = resolveRelative('specialist-dashboard.html');
      return;
    }
    if (role === 'admin') {
      window.location.href = resolveRelative('admin-dashboard.html');
      return;
    }
    window.location.href = resolveRelative('catalogo.html');
  }

  function bindAuthForms() {
    function isLoginPage() {
      const page = window.location.pathname.split('/').pop();
      return ['Loggin.html', 'specialist-login.html'].includes(page);
    }

    if (isLoginPage()) {
      clearSession();
    }

    const goToSpecialist = document.getElementById('goToSpecialist');
    if (goToSpecialist) {
      goToSpecialist.addEventListener('click', () => {
        window.location.href = 'specialist-login.html';
      });
    }
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const passwordValue = document.getElementById('password')?.value || '';
        const confirmPasswordValue = document.getElementById('confirmPassword')?.value || '';
        const birthDateValue = document.getElementById('fecha')?.value || '';
        const payload = {
          name: document.getElementById('nombre')?.value?.trim() || '',
          lastName: document.getElementById('apellido')?.value?.trim() || '',
          email: document.getElementById('email')?.value?.trim() || '',
          phone: document.getElementById('telefono')?.value?.trim() || '',
          birthDate: birthDateValue,
          password: passwordValue,
          role: 'client'
        };

        if (!payload.name || !payload.lastName || !payload.email || !payload.phone || !birthDateValue || !passwordValue || !confirmPasswordValue) {
          alert('Completa todos los campos requeridos para crear tu cuenta.');
          return;
        }

        const namePattern = /^[A-Za-z]+$/;
        if (!namePattern.test(payload.name) || !namePattern.test(payload.lastName)) {
          alert('El nombre y apellido solo pueden contener letras sin espacios ni símbolos.');
          return;
        }

        const emailPattern = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.com$/;
        if (!emailPattern.test(payload.email)) {
          alert('El correo debe contener @ y finalizar en .com, usando solo letras y números.');
          return;
        }

        const phonePattern = /^\d{8,14}$/;
        if (!phonePattern.test(payload.phone)) {
          alert('El teléfono debe tener entre 8 y 14 dígitos y no puede contener espacios ni símbolos.');
          return;
        }

        const passwordPattern = /^[A-Za-z0-9]{4,16}$/;
        if (!passwordPattern.test(passwordValue)) {
          alert('La contraseña debe tener entre 4 y 16 caracteres y solo puede contener letras y números.');
          return;
        }

        if (passwordValue !== confirmPasswordValue) {
          alert('Las contraseñas no coinciden.');
          return;
        }

        const birthDate = new Date(birthDateValue);
        const today = new Date();
        if (Number.isNaN(birthDate.getTime())) {
          alert('La fecha de nacimiento no es válida. Usa el selector de fecha.');
          return;
        }

        if (birthDate > today) {
          alert('La fecha de nacimiento no puede ser en el futuro.');
          return;
        }

        const age = today.getFullYear() - birthDate.getFullYear() -
          ((today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) ? 1 : 0);
        if (age < 16 || age > 100) {
          alert('Debes tener entre 16 y 100 años para registrarte.');
          return;
        }

        const result = createUser(payload);
        if (!result.ok) {
          alert('Ese correo ya está registrado.');
          return;
        }

        alert('Cuenta creada correctamente.');
        window.location.href = resolveRelative('Loggin.html');
      });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      const handleLoginSubmit = (event) => {
        if (event) event.preventDefault();
        const email = document.getElementById('loginEmail')?.value?.trim() || '';
        const password = document.getElementById('loginPassword')?.value || '';
        if (!email || !password) {
          alert('Ingresa tu correo y contraseña para iniciar sesión.');
          return;
        }
        const result = loginUser(email, password);
        if (!result.ok) {
          alert('Credenciales inválidas.');
          return;
        }
        navigateByRole(result.user.role);
      };

      loginForm.addEventListener('submit', handleLoginSubmit);
      const loginButton = document.getElementById('loginSubmitButton');
      if (loginButton) {
        loginButton.addEventListener('click', handleLoginSubmit);
      }
    }

    const specialistLoginForm = document.getElementById('specialistLoginForm');
    if (specialistLoginForm) {
      const handleSpecialistSubmit = (event) => {
        if (event) event.preventDefault();
        const email = document.getElementById('specialistEmail')?.value?.trim() || '';
        const password = document.getElementById('specialistPassword')?.value || '';
        if (!email || !password) {
          alert('Ingresa tu correo y contraseña para iniciar sesión como especialista.');
          return;
        }
        const result = loginUser(email, password);
        if (!result.ok || result.user.role !== 'specialist') {
          alert('No se encontró un especialista con esas credenciales.');
          return;
        }
        navigateByRole(result.user.role);
      };

      specialistLoginForm.addEventListener('submit', handleSpecialistSubmit);
      const specialistButton = document.getElementById('specialistSubmitButton');
      if (specialistButton) {
        specialistButton.addEventListener('click', handleSpecialistSubmit);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAuthForms);
  } else {
    bindAuthForms();
  }

  window.sgcAuth = {
      createUser,
      loginUser,
      getSession,
      setSession,
      clearSession,
      signOut: function () { clearSession(); window.location.href = resolveRelative('Loggin.html'); },
      readUsers
    };

    if (window.appointmentsSystem) {
      window.appointmentsSystem.readUsers = readUsers;
      window.appointmentsSystem.getSession = getSession;
      window.appointmentsSystem.clearSession = clearSession;
      window.appointmentsSystem.setSession = setSession;
      window.appointmentsSystem.createUser = createUser;
      window.appointmentsSystem.loginUser = loginUser;
      window.appointmentsSystem.signOut = function () { clearSession(); window.location.href = resolveRelative('Loggin.html'); };
      window.appointmentsSystem.setProfileAvatar = setProfileAvatar;
    }
  })();
