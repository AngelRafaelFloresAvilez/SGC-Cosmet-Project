(function () {
  const STORAGE_KEY = 'sgc_appointments_state_v1';
  const AUTH_STORAGE_KEY = 'sgc_auth_users_v1';
  const defaults = {
    appointments: [],
    notifications: [],
    profile: {
      name: 'Ana López',
      email: 'ana.lopez@sgc.com',
      phone: '+52 55 1234 5678',
      birthDate: '14/08/1997',
      avatar: 'https://www.gravatar.com/avatar/?d=mp&s=150',
      role: 'Cliente',
      memberSince: '2024',
      status: 'Normal',
      statusMessage: 'Tienes acceso completo a tratamientos y promociones exclusivas.',
      notes: 'Disfruta de citas semanales y descuentos especiales para clientes recurrentes.'
    },
    payments: [],
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
          type: 'appointment',
          audienceEmail: 'ana@sgc.com'
        }
      ],
      profile: defaults.profile,
      payments: [],
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

  function sessionEmail() {
    return String(getSession()?.email || '').trim().toLowerCase();
  }

  function isOwnedByCurrentClient(appointment) {
    const session = getSession() || {};
    if (session.role !== 'client') return true;
    return String(appointment?.createdBy?.email || '').toLowerCase() === sessionEmail();
  }

  function activePromotionId(state = readState()) {
    const email = sessionEmail();
    const session = getSession() || {};
    return email
      ? (state.activePromotionByUser?.[email] || (session.role === 'client' ? null : state.activePromotionId) || null)
      : (state.activePromotionId || null);
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
    if (!session.email) {
      return (state.appointments || []).filter((appointment) => !appointment.createdBy || !appointment.createdBy.email);
    }
    // El administrador supervisa todo el sistema.
    if (session.role === 'admin') {
      return Array.isArray(state.appointments) ? state.appointments : [];
    }
    // El especialista solo ve lo suyo, mas lo que aun no tiene dueño.
    if (session.role === 'specialist') {
      const email = session.email.toLowerCase();
      return (state.appointments || []).filter((appointment) => {
        const assigned = String(appointment.specialistEmail || '').toLowerCase();
        return !assigned || assigned === email;
      });
    }
    const userAppointments = (state.appointments || []).filter((appointment) =>
      appointment.createdBy && appointment.createdBy.email && appointment.createdBy.email.toLowerCase() === session.email.toLowerCase()
    );
    return userAppointments;
  }

  function createProfileFromUser(user, stateProfile = {}) {
    const stateBelongsToUser = !user || (stateProfile.email && stateProfile.email.toLowerCase() === user.email.toLowerCase());
    const profile = {
      ...defaults.profile,
      ...(stateBelongsToUser ? stateProfile : {}),
    };
    if (!user) return profile;

    return {
      ...profile,
      name: `${user.name} ${user.lastName || ''}`.trim(),
      email: user.email,
      phone: user.phone || defaults.profile.phone,
      birthDate: user.birthDate || defaults.profile.birthDate,
      avatar: stateBelongsToUser && stateProfile.avatar ? stateProfile.avatar : (user.avatar || defaults.profile.avatar),
      role: user.role === 'client'
        ? 'Cliente'
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
      const session = getSession() || {};
      const previousEmail = session.email || '';
      const nextEmail = String(profileValues.email || previousEmail || state.profile?.email || '').trim();
      const users = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || '[]');
      const user = users.find((item) => item.email && item.email.toLowerCase() === previousEmail.toLowerCase());
      if (user) {
        user.email = nextEmail;
        if (profileValues.name !== undefined) user.name = String(profileValues.name).trim();
        if (profileValues.lastName !== undefined) user.lastName = String(profileValues.lastName).trim();
        if (profileValues.phone !== undefined) user.phone = profileValues.phone;
        if (profileValues.birthDate !== undefined) user.birthDate = profileValues.birthDate;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
      }
      if (previousEmail && nextEmail && previousEmail.toLowerCase() !== nextEmail.toLowerCase()) {
        state.appointments = state.appointments.map((appointment) => {
          const createdByMatches = appointment.createdBy?.email?.toLowerCase() === previousEmail.toLowerCase();
          const specialistMatches = appointment.specialistEmail?.toLowerCase() === previousEmail.toLowerCase();
          if (!createdByMatches && !specialistMatches) return appointment;
          return {
            ...appointment,
            ...(createdByMatches ? { createdBy: { ...appointment.createdBy, email: nextEmail } } : {}),
            ...(specialistMatches ? { specialistEmail: nextEmail } : {})
          };
        });
        if (window.sgcAuth && typeof window.sgcAuth.setSession === 'function') {
          window.sgcAuth.setSession({ ...session, email: nextEmail });
        }
      }
      state.profile = { ...(state.profile || {}), ...profileValues, email: nextEmail };
      saveState(state);
      window.dispatchEvent(new Event('sgc-state-updated'));
    } catch (e) {
      // ignore
    }
  }

  function readState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return buildSeedState();
      const parsed = JSON.parse(saved);
      const seedClient = { email: 'ana@sgc.com', role: 'client', name: 'Ana López', phone: '+52 55 1234 5678' };
      const appointments = Array.isArray(parsed?.appointments) ? parsed.appointments.map((appointment) =>
        appointment.id?.startsWith('seed-') && !appointment.createdBy
          ? { ...appointment, createdBy: seedClient }
          : appointment
      ) : [];
      return {
        ...defaults,
        ...parsed,
        appointments,
        notifications: Array.isArray(parsed?.notifications) ? parsed.notifications : [],
        profile: { ...defaults.profile, ...(parsed?.profile || {}) },
        payments: Array.isArray(parsed?.payments)
          ? parsed.payments.filter((payment) => !['pay-1', 'pay-2'].includes(payment.id))
          : [],
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

  function parseDisplayedDateTime(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null;
    const exactDate = /^\d{4}-\d{2}-\d{2}$/.test(String(dateStr))
      ? new Date(`${dateStr}T00:00:00`)
      : null;
    // dateStr expected like 'Lun 12' or '12'
    const num = (String(dateStr).match(/(\d{1,2})/) || [])[1];
    const timeMatches = String(timeStr).match(/(\d{1,2}:\d{2}\s*(AM|PM)?)/i);
    if (!num || !timeMatches) return null;
    const day = Number(num);
    const now = new Date();
    // Try current month/year first
    let candidate = exactDate && !Number.isNaN(exactDate.getTime())
      ? new Date(exactDate)
      : new Date(now.getFullYear(), now.getMonth(), day);
    // If candidate is before today, assume next month
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (!exactDate && candidate < today) {
      // move to next month
      candidate = new Date(now.getFullYear(), now.getMonth() + 1, day);
    }
    // parse time (e.g. 11:30 AM)
    const timeText = timeMatches[1];
    const parsed = new Date(candidate.getFullYear(), candidate.getMonth(), candidate.getDate());
    const t = timeText.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!t) return null;
    let hh = Number(t[1]);
    const mm = Number(t[2]);
    const ampm = (t[3] || '').toUpperCase();
    if (ampm === 'PM' && hh < 12) hh += 12;
    if (ampm === 'AM' && hh === 12) hh = 0;
    parsed.setHours(hh, mm, 0, 0);
    return parsed;
  }

  /**
   * Fecha real de una cita. Es la unica fuente de verdad para esto: las citas
   * guardan `iso` cuando se crean, pero las antiguas solo tienen el texto
   * visible ("Lun 12", que es el dia del mes), asi que hay que reconstruirlas
   * tomando como referencia su fecha de alta.
   */
  function resolveAppointmentDate(appointment) {
    if (!appointment) return null;
    if (appointment.iso) {
      const exact = new Date(appointment.iso);
      if (!Number.isNaN(exact.getTime())) return exact;
    }

    const raw = appointment.dateISO || appointment.isoDate || appointment.date;
    if (raw && /^\d{4}-\d{2}-\d{2}/.test(raw)) {
      const iso = new Date(raw);
      if (!Number.isNaN(iso.getTime())) return iso;
    }

    const base = appointment.createdAt ? new Date(appointment.createdAt) : new Date();
    if (Number.isNaN(base.getTime())) return null;

    const day = Number((String(raw || '').match(/(\d{1,2})/) || [])[1]);
    if (!day) return base;

    let candidate = new Date(base.getFullYear(), base.getMonth(), day);
    const baseDay = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    if (candidate < baseDay) candidate = new Date(base.getFullYear(), base.getMonth() + 1, day);
    return candidate;
  }

  function isTimeSlotTaken(date, time, state = readState(), requestedDuration = 30, specialist = '', dateISO = '') {
    if (!date || !time) return false;
    const attempted = parseDisplayedDateTime(dateISO || date, time);
    const attemptedDay = attempted ? attempted.getDate() : Number(String(date).match(/\d{1,2}/)?.[0]);
    const attemptedStart = attempted ? attempted.getTime() : null;
    return state.appointments.some((appointment) => {
      if (appointment.status === 'cancelled' || appointment.status === 'previous' || appointment.status === 'completed') return false;
      const assignedSpecialist = appointment.specialist || appointment.createdBy?.specialist || '';
      const hasSpecificAssignment = assignedSpecialist && assignedSpecialist !== 'Cualquiera. Mejor disponible';
      if (specialist && specialist !== 'Cualquiera. Mejor disponible' && hasSpecificAssignment && assignedSpecialist !== specialist) return false;
      const appointmentDay = Number(String(appointment.date || '').match(/\d{1,2}/)?.[0]);
      const sameDay = appointmentDay === attemptedDay || (appointment.iso && attempted && new Date(appointment.iso).toDateString() === attempted.toDateString());
      if (!sameDay) return false;
      if (specialist && specialist !== 'Cualquiera. Mejor disponible' && !assignedSpecialist) return true;
      const appointmentStartDate = appointment.iso
        ? new Date(appointment.iso)
        : parseDisplayedDateTime(appointment.date, appointment.time);
      const appointmentStart = appointmentStartDate ? appointmentStartDate.getTime() : null;
      if (attemptedStart === null || appointmentStart === null) return appointment.date === date && appointment.time === time;
      const appointmentEnd = appointmentStart + (Number(appointment.duration) || 60) * 60 * 1000;
      const attemptedEnd = attemptedStart + (requestedDuration + 30) * 60 * 1000;
      return attemptedStart < appointmentEnd && attemptedEnd > appointmentStart;
    });
  }

  function isWithinSpecialistSchedule(date, duration, specialist = '') {
    const requested = date.getHours() * 60 + date.getMinutes();
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayKey = dayKeys[date.getDay()];
    const users = readUsers();
    const candidates = users.filter((user) => {
      if (user.role !== 'specialist' || user.active === false) return false;
      if (!specialist || specialist === 'Cualquiera. Mejor disponible') return true;
      const email = String(user.email || '').toLowerCase();
      const name = `${user.name || ''} ${user.lastName || ''}`.trim().toLowerCase();
      const selected = String(specialist).toLowerCase();
      return email === selected || name === selected;
    });
    return candidates.some((user) => {
      const daysOff = Array.isArray(user.daysOff) ? user.daysOff : [];
      if (daysOff.includes(dayKey)) return false;
      const startParts = String(user.workStart || '').split(':').map(Number);
      const endParts = String(user.workEnd || '').split(':').map(Number);
      if (startParts.length !== 2 || endParts.length !== 2 || startParts.some(Number.isNaN) || endParts.some(Number.isNaN)) return false;
      const start = startParts[0] * 60 + startParts[1];
      const end = endParts[0] * 60 + endParts[1];
      return requested >= start && requested + duration <= end;
    });
  }

  // Simple site alert/toast helper — appended to body and auto-dismissed
  function showSiteAlert(message, type = 'info', timeout = 4200) {
    try {
      const containerId = 'sgc-alert-container';
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = containerId;
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
        setTimeout(() => { try { el.remove(); } catch (e) { } }, 300);
      }, timeout);
      return el;
    } catch (e) { /* ignore */ }
    return null;
  }

  if (typeof window !== 'undefined') {
    window.showSiteAlert = window.showSiteAlert || showSiteAlert;
  }

  function getUnreadCount(state = readState()) {
    return visibleNotifications(state).filter((item) => item.unread).length;
  }

  function visibleNotifications(state = readState()) {
    const email = sessionEmail();
    if (!email) return state.notifications || [];
    return (state.notifications || []).filter((item) => String(item.audienceEmail || '').toLowerCase() === email);
  }

  function getCancelledCount(state = readState()) {
    return getCurrentUserAppointments(state).filter((item) => item.status === 'cancelled').length;
  }

  function canBookNewAppointment(state = readState()) {
    // Un cliente vetado por el administrador no puede agendar.
    const sessionUser = getSessionUser(state);
    if (sessionUser && sessionUser.status === 'banned') return false;
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
      type,
      audienceEmail: sessionEmail() || null
    });
    saveState(state);
    renderNotifications();
    return state.notifications[0];
  }

  function removeNotification(id) {
    if (!id) return null;
    const state = readState();
    const before = state.notifications.length;
    state.notifications = state.notifications.filter((n) => n.id !== id || !visibleNotifications(state).some((item) => item.id === id));
    saveState(state);
    renderNotifications();
    syncProfileUI();
    return { removed: before - state.notifications.length };
  }

  function createAppointment(serviceName, price, date, time, notes = '', options = {}) {
    const state = readState();
    if (!canBookNewAppointment(state)) {
      return { allowed: false, reason: 'limit_reached' };
    }

    const selectedService = getServices(state).find((service) =>
      String(service.title || '').trim().toLowerCase() === String(serviceName || '').trim().toLowerCase()
    );
    if (selectedService && selectedService.active === false) {
      return { allowed: false, reason: 'service_inactive' };
    }

    const invalidDateTime = !date || !time || date === 'Sin definir' || time === 'Sin definir';
    if (invalidDateTime) {
      return { allowed: false, reason: 'missing_datetime' };
    }

    // enforce real date/time constraints (no past, min 1 day ahead)
    const appointmentDateObj = options.dateISO
      ? parseDisplayedDateTime(options.dateISO, time)
      : parseDisplayedDateTime(date, time);
    if (!appointmentDateObj) {
      return { allowed: false, reason: 'missing_datetime' };
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const minAllowed = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000); // tomorrow
    if (appointmentDateObj < minAllowed) {
      return { allowed: false, reason: 'too_soon' };
    }

    if (!isWithinSpecialistSchedule(appointmentDateObj, Number(options.duration) || 60, options.specialist || '')) {
      return { allowed: false, reason: 'outside_working_hours' };
    }

    if (isTimeSlotTaken(date, time, state, Number(options.duration) || 60, options.specialist || '', options.dateISO || '')) {
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
      const promoId = activePromotionId(state);
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
      iso: appointmentDateObj ? appointmentDateObj.toISOString() : null,
      notes,
      duration: options.duration || 60,
      specialist: options.specialist || 'Cualquiera. Mejor disponible',
      // El selector envia el correo del especialista; sirve para que el panel de
      // administrador sepa a quien quedo asignada la cita.
      specialistEmail: (function () {
        const chosen = String(options.specialist || '').trim();
        if (!chosen) return '';
        const match = users.find((user) =>
          user.role === 'specialist' && (
            String(user.email || '').toLowerCase() === chosen.toLowerCase() ||
            `${user.name || ''} ${user.lastName || ''}`.trim().toLowerCase() === chosen.toLowerCase()
          )
        );
        return match ? match.email : '';
      })(),
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

    if (options.draft) {
      return { allowed: true, appointment };
    }
    state.appointments.unshift(appointment);
    saveState(state);
    addNotification('Nueva cita registrada', `Tienes una nueva cita para ${serviceName} el ${date} a las ${time}.`, 'appointment');
    syncProfileUI();
    return { allowed: true, appointment };
  }

  function cancelAppointment(id, reason = '') {
    const state = readState();
    const target = state.appointments.find((item) => item.id === id);
    if (!target || !isOwnedByCurrentClient(target)) return { allowed: false, reason: 'not_allowed' };

    target.status = 'cancelled';
    target.summary = 'Cita cancelada por el usuario.';
    target.cancellationReason = reason || 'Otro';
    saveState(state);
    addNotification('Cita cancelada', `Se canceló la cita de ${target.serviceName}.`, 'cancelled');
    syncProfileUI();
    return { allowed: true, state };
  }

  function updateAppointment(id, date, time, options = {}) {
    const state = readState();
    const target = state.appointments.find((appointment) => appointment.id === id);
    if (!target || !isOwnedByCurrentClient(target) || target.status !== 'pending') return { allowed: false, reason: 'not_editable' };
    const appointmentDate = options.dateISO
      ? parseDisplayedDateTime(options.dateISO, time)
      : parseDisplayedDateTime(date, time);
    const duration = Number(options.duration) || Number(target.duration) || 60;
    if (!appointmentDate) return { allowed: false, reason: 'missing_datetime' };
    const now = new Date();
    const minimumDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    if (appointmentDate < minimumDate) return { allowed: false, reason: 'too_soon' };
    if (!isWithinSpecialistSchedule(appointmentDate, duration, options.specialist || target.specialist || '')) {
      return { allowed: false, reason: 'outside_working_hours' };
    }
    const stateWithoutTarget = { ...state, appointments: state.appointments.filter((appointment) => appointment.id !== id) };
    if (isTimeSlotTaken(date, time, stateWithoutTarget, duration, options.specialist || target.specialist || '', options.dateISO || '')) {
      return { allowed: false, reason: 'slot_taken' };
    }
    target.date = date;
    target.time = time;
    target.iso = appointmentDate.toISOString();
    target.duration = duration;
    target.specialist = options.specialist || target.specialist || 'Cualquiera. Mejor disponible';
    target.summary = 'Tu cita fue modificada y está pendiente de confirmación.';
    saveState(state);
    addNotification('Cita modificada', `Tu cita de ${target.serviceName} fue modificada para el ${date} a las ${time}.`, 'appointment');
    syncProfileUI();
    return { allowed: true, appointment: target };
  }

  function rateAppointment(id, rating, comment = '') {
    const state = readState();
    const target = state.appointments.find((appointment) => appointment.id === id);
    if (!target || !isOwnedByCurrentClient(target) || !['previous', 'completed'].includes(target.status)) return { allowed: false };
    target.rating = Number(rating);
    target.ratingComment = comment;
    saveState(state);
    addNotification('Gracias por tu calificación', `Tu experiencia con ${target.serviceName} fue registrada.`, 'appointment');
    return { allowed: true, appointment: target };
  }

  function removeAppointment(id) {
    const state = readState();
    const session = getSession() || {};
    // Only specialists may permanently remove appointments
    if (session.role !== 'specialist') {
      showSiteAlert('Solo un especialista puede eliminar una cita permanentemente.', 'warning');
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

  function discardAppointment(id) {
    if (!id) return { allowed: false };
    const state = readState();
    const before = state.appointments.length;
    state.appointments = state.appointments.filter((item) => item.id !== id);
    if (state.appointments.length === before) return { allowed: false };
    saveState(state);
    renderNotifications();
    syncProfileUI();
    return { allowed: true, state };
  }

  function specialistConfirmAppointment(id) {
    const state = readState();
    const session = getSession() || {};
    if (!session || session.role !== 'specialist') {
      showSiteAlert('Solo un especialista puede confirmar y completar citas.', 'warning');
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

  // allow marking appointment as confirmed (distinct from completed)
  function specialistMarkConfirmed(id) {
    const state = readState();
    const session = getSession() || {};
    if (!session || session.role !== 'specialist') {
      showSiteAlert('Solo un especialista puede confirmar y completar citas.', 'warning');
      return { allowed: false };
    }
    const target = state.appointments.find(a => a.id === id);
    if (!target) return { allowed: false };
    target.status = 'confirmed';
    target.summary = 'Cita confirmada por el especialista.';
    saveState(state);
    addNotification('Cita confirmada', `La cita de ${target.serviceName} fue confirmada.`, 'appointment');
    if (document.getElementById('appointmentsList')) renderAppointmentsPage();
    try { window.dispatchEvent(new Event('sgc-state-updated')); } catch (e) {}
    syncProfileUI();
    return { allowed: true };
  }

  // mark as no-show
  function specialistMarkNoShow(id) {
    const state = readState();
    const session = getSession() || {};
    if (!session || session.role !== 'specialist') {
      showSiteAlert('Solo un especialista puede cambiar el estado de la cita.', 'warning');
      return { allowed: false };
    }
    const target = state.appointments.find(a => a.id === id);
    if (!target) return { allowed: false };
    target.status = 'no_show';
    target.summary = 'El cliente no asistió a la cita.';
    saveState(state);
    addNotification('Cita marcada como no asistida', `La cita de ${target.serviceName} fue marcada como no asistida.`, 'appointment');
    if (document.getElementById('appointmentsList')) renderAppointmentsPage();
    try { window.dispatchEvent(new Event('sgc-state-updated')); } catch (e) {}
    syncProfileUI();
    return { allowed: true };
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
    if (state.activePromotionByUser) {
      Object.keys(state.activePromotionByUser).forEach((email) => {
        if (state.activePromotionByUser[email] === id) delete state.activePromotionByUser[email];
      });
    }
    saveState(state);
    window.dispatchEvent(new Event('sgc-state-updated'));
    return state.promotions;
  }

  // El catalogo trae tarjetas escritas a mano en el HTML. Esto lo reconcilia con
  // los servicios que administra el panel de admin: agrega los que faltan y
  // saca de circulacion los marcados como inactivos.
  function syncCatalogWithState(grid) {
    const services = getServices(readState());
    if (!Array.isArray(services) || !services.length) return;

    const cardTitle = (card) =>
      (card.dataset.title || card.querySelector('.service-title')?.textContent || '').trim().toLowerCase();

    const serviceTitles = new Set(services.map((service) => String(service.title || '').trim().toLowerCase()));
    Array.from(grid.querySelectorAll('.service-card')).forEach((card) => {
      if (!serviceTitles.has(cardTitle(card))) card.remove();
    });

    services.forEach((service) => {
      const title = String(service.title || '').trim();
      if (!title) return;
      const existing = Array.from(grid.querySelectorAll('.service-card'))
        .find((card) => cardTitle(card) === title.toLowerCase());

      if (existing) {
        existing.classList.toggle('service-inactive', service.active === false);
        existing.dataset.active = service.active === false ? 'false' : 'true';
        existing.dataset.title = title;
        existing.dataset.category = service.category || '';
        existing.dataset.desc = service.description || '';
        existing.dataset.includes = service.includes || '';
        existing.dataset.duration = service.duration || '';
        existing.dataset.price = service.price || '';
        existing.dataset.image = service.image || '';
        const titleElement = existing.querySelector('.service-title');
        if (titleElement) titleElement.textContent = title;
        const imageElement = existing.querySelector('.service-img');
        if (imageElement) {
          imageElement.src = service.image || '';
          imageElement.alt = title;
        }
        const metaValue = (label) => {
          const row = [...existing.querySelectorAll('.service-meta-row')]
            .find((item) => item.querySelector('.service-meta-label')?.textContent.trim() === label);
          return row?.querySelector('.service-meta-value');
        };
        const availability = metaValue('Disponibilidad');
        const price = metaValue('Precio');
        const duration = metaValue('Duración');
        if (availability) availability.textContent = service.active === false ? 'No disponible' : 'Disponible';
        if (price) price.textContent = service.price || '';
        if (duration) duration.textContent = service.duration || '';
        return;
      }

      const attr = (value) => String(value == null ? '' : value).replace(/"/g, '&quot;');
      const card = document.createElement('article');
      card.className = `service-card${service.active === false ? ' service-inactive' : ''}`;
      card.dataset.active = service.active === false ? 'false' : 'true';
      card.dataset.title = title;
      card.dataset.category = service.category || '';
      card.dataset.desc = service.description || '';
      card.dataset.includes = service.includes || '';
      card.dataset.duration = service.duration || '';
      card.dataset.price = service.price || '';
      card.dataset.image = service.image || '';
      card.innerHTML = `
        <div class="service-img-container">
          <img src="${attr(service.image)}" alt="${attr(title)}" class="service-img">
        </div>
        <div class="service-info">
          <h3 class="service-title">${attr(title)}</h3>
          <div class="service-meta">
            <div class="service-meta-row">
              <span class="service-meta-label">Disponibilidad</span>
              <span class="service-meta-value">${service.active === false ? 'No disponible' : 'Disponible'}</span>
            </div>
            <div class="service-meta-row">
              <span class="service-meta-label">Precio</span>
              <span class="service-meta-value">${attr(service.price)}</span>
            </div>
            <div class="service-meta-row">
              <span class="service-meta-label">Duración</span>
              <span class="service-meta-value">${attr(service.duration)}</span>
            </div>
            <div class="service-meta-row">
              <span class="service-meta-label">Calificación</span>
              <span class="service-meta-value rating">Nuevo</span>
            </div>
          </div>
          <button class="cta-arrow" aria-label="Ver detalles"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderCatalogServices() {
    const grid = document.querySelector('.services-grid');
    if (!grid) return;

    if (document.body.classList.contains('catalog-page')) {
      syncCatalogWithState(grid);
      const existingCards = Array.from(grid.querySelectorAll('.service-card'));
      if (existingCards.length) {
        const pageSize = 6;
        const total = existingCards.length;
        let startIndex = Number(document.body.dataset.catalogStart || 0);
        if (startIndex < 0 || Number.isNaN(startIndex)) startIndex = 0;

        const visibleIndexes = new Set();
        for (let i = 0; i < Math.min(pageSize, total); i += 1) {
          visibleIndexes.add((startIndex + i) % total);
        }

        existingCards.forEach((card, index) => {
          card.classList.toggle('hidden-card', !visibleIndexes.has(index));
        });
      }
      return;
    }

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
    const visibleIds = new Set(visibleNotifications(state).map((item) => item.id));
    state.notifications = state.notifications.map((item) => visibleIds.has(item.id) ? { ...item, unread: false } : item);
    saveState(state);
    renderNotifications();
  }

  function getAppointmentById(id) {
    return readState().appointments.find((item) => item.id === id);
  }

  function openSidebar() {
    const menu = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('menuOverlay');
    const menuButton = document.querySelector('.menu-btn');
    if (menu && overlay) {
      menu.classList.add('active');
      overlay.classList.add('active');
    }
    if (menuButton) {
      menuButton.classList.add('active');
    }
  }

  function closeSidebar() {
    const menu = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('menuOverlay');
    const menuButton = document.querySelector('.menu-btn');
    if (menu && overlay) {
      menu.classList.remove('active');
      overlay.classList.remove('active');
    }
    if (menuButton) {
      menuButton.classList.remove('active');
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

    // Open/close menu
    if (target.closest('.menu-btn')) {
      const menu = document.getElementById('sidebarMenu');
      if (menu && menu.classList.contains('active')) {
        closeSidebar();
      } else {
        openSidebar();
      }
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

    const notifications = visibleNotifications(state);
    if (!notifications.length) {
      panel.innerHTML = '<div class="empty-state">No tienes notificaciones por revisar.</div>';
      return;
    }

    panel.innerHTML = notifications.slice(0, 4)
      .map((item) => `
        <div class="notification-item ${item.unread ? 'unread' : ''}" data-notif-id="${item.id}">
          <div class="notification-title">${item.title}</div>
          <div class="notification-message">${item.message}</div>
          <div class="notification-meta">${new Date(item.createdAt).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}</div>
          <button class="notif-delete" data-notif-id="${item.id}" aria-label="Eliminar notificación">&times;</button>
        </div>
      `)
      .join('');
  }

  // allow deleting notifications via delegated button (single global listener)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.notif-delete');
    if (btn) {
      const id = btn.dataset && btn.dataset.notifId;
      if (id && typeof removeNotification === 'function') {
        removeNotification(id);
      }
    }
  });

  function syncProfileUI() {
    const state = readState();
    const profile = getProfileForCurrentSession(state);
    const firstName = profile.name.split(' ')[0] || 'Ana';
    const formattedBirthDate = /^\d{4}-\d{2}-\d{2}$/.test(profile.birthDate || '')
      ? `${profile.birthDate.slice(8, 10)}/${profile.birthDate.slice(5, 7)}/${profile.birthDate.slice(0, 4)}`
      : profile.birthDate;

    document.querySelectorAll('.user-name, .sidebar-user-name').forEach((element) => {
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
      element.textContent = formattedBirthDate;
    });

    document.querySelectorAll('.profile-member').forEach((element) => {
      element.textContent = `Miembro desde ${profile.memberSince}`;
    });

    document.querySelectorAll('.profile-avatar').forEach((element) => {
      if (element.tagName === 'IMG') {
        element.src = profile.avatar;
        element.alt = profile.name;
        element.classList.add('profile-avatar');
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

    // update header user-profile avatar (replace icon with image when available)
    document.querySelectorAll('.user-profile').forEach((container) => {
      try {
        const imgHtml = `<img src="${profile.avatar}" alt="${profile.name}" style="width:36px;height:36px;border-radius:50%;object-fit:cover">`;
        const avatarEl = container.querySelector('.user-avatar');
        if (avatarEl) {
          const existingImg = avatarEl.querySelector('img');
          if (existingImg) {
            existingImg.src = profile.avatar;
            existingImg.alt = profile.name;
          } else {
            avatarEl.innerHTML = imgHtml;
          }
        }

        const metaEl = container.querySelector('.user-meta');
        if (metaEl) {
          metaEl.innerHTML = `<span class="user-name">${profile.name}</span><span class="user-role">${profile.role}</span>`;
        }

        const userText = container.querySelector('.user-text');
        if (userText) userText.innerHTML = `<span class="user-role">${profile.role}</span><span class="user-name">${profile.name}</span>`;
      } catch (e) { /* ignore */ }
    });

    const sidebarAvatar = document.getElementById('sidebarUserAvatar');
    if (sidebarAvatar) {
      const sidebarImg = sidebarAvatar.querySelector('img');
      if (sidebarImg) {
        sidebarImg.src = profile.avatar;
        sidebarImg.alt = profile.name;
      } else {
        sidebarAvatar.innerHTML = `<img src="${profile.avatar}" alt="${profile.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
      }
    }

    const sidebarName = document.querySelector('.sidebar-user-name');
    const sidebarRole = document.querySelector('.sidebar-user-role');
    if (sidebarName) sidebarName.textContent = profile.name;
    if (sidebarRole) sidebarRole.textContent = profile.role;

    const cancelledCount = getCancelledCount(state);
    const status = cancelledCount >= 3 ? 'Vetado temporal' : 'Normal';
    const statusMessage = cancelledCount >= 3
      ? 'Tu cuenta está vetada temporalmente. Debes esperar a que el administrador revise tu caso.'
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

    document.querySelectorAll('.absence-bar span').forEach((element) => {
      element.style.width = `${Math.min(cancelledCount, 3) / 3 * 100}%`;
      element.style.background = cancelledCount >= 3 ? '#c95c5c' : '#93b575';
    });

    document.querySelectorAll('.profile-absence-progress').forEach((element) => {
      element.style.width = `${Math.min(cancelledCount, 3) / 3 * 100}%`;
      element.style.background = cancelledCount >= 3 ? '#c95c5c' : '#93b575';
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
    const activePromotion = state.promotions.find((promo) => promo.id === activePromotionId(state)) || state.promotions[0];

    const profileStatusEl = document.getElementById('profileStatus');
    const profileStatusMessageEl = document.getElementById('profileStatusMessage');
    const profileCancelledEl = document.getElementById('profileCancelledCount');
    const profileNextAppointmentEl = document.getElementById('profileNextAppointment');
    const profileNextAppointmentCompactEl = document.getElementById('profileNextAppointmentCompact');
    const historyListEl = document.getElementById('historyList');
    const paymentsListEl = document.getElementById('paymentsList');
    const promotionsListEl = document.getElementById('promotionsList');
    const activePromotionEl = document.getElementById('activePromotionBox');
    const historyPaginationEl = document.getElementById('profileHistoryPagination');

    if (profileStatusEl) profileStatusEl.textContent = status;
    if (profileStatusMessageEl) profileStatusMessageEl.textContent = cancelledCount >= 3 ? 'Tu cuenta está vetada temporalmente. Debes esperar a que el administrador revise tu caso.' : 'Tu acceso sigue activo y puedes seguir disfrutando de tratamientos y promociones.';
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
      const appointments = getCurrentUserAppointments(state).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const pageSize = 4;
      const pageCount = Math.max(1, Math.ceil(appointments.length / pageSize));
      const currentPage = Math.min(Math.max(Number(localStorage.getItem('sgc_profile_history_page') || 1), 1), pageCount);
      const visibleAppointments = appointments.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      const historyMarkup = appointments.length
        ? visibleAppointments.map((appointment) => `
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
        if (historyPaginationEl) {
          historyPaginationEl.innerHTML = [
            `<button type="button" data-page="${Math.max(1, currentPage - 1)}">‹</button>`,
            ...Array.from({ length: pageCount }, (_, index) => `<button type="button" data-page="${index + 1}" class="${index + 1 === currentPage ? 'active' : ''}">${index + 1}</button>`),
            `<button type="button" data-page="${Math.min(pageCount, currentPage + 1)}">›</button>`
          ].join('');
          historyPaginationEl.querySelectorAll('button').forEach((button) => {
            button.onclick = () => {
              localStorage.setItem('sgc_profile_history_page', button.dataset.page);
              renderProfilePage();
            };
          });
        }
    }

    if (paymentsListEl) {
      const session = getSession() || {};
      const customerPayments = state.payments.filter((payment) =>
        String(payment.clientEmail || '').toLowerCase() === String(session.email || '').toLowerCase()
      );
      const paymentPageSize = 3;
      const paymentPageCount = Math.max(1, Math.ceil(customerPayments.length / paymentPageSize));
      const currentPaymentPage = Math.min(Math.max(Number(localStorage.getItem('sgc_profile_payments_page') || 1), 1), paymentPageCount);
      const visiblePayments = customerPayments.slice((currentPaymentPage - 1) * paymentPageSize, currentPaymentPage * paymentPageSize);
      paymentsListEl.innerHTML = visiblePayments.length ? visiblePayments.map((payment) => `
        <div class="payment-item">
          <div>
            <strong>${payment.description}</strong>
            <p>${payment.date}</p>
          </div>
          <span class="payment-status">${payment.status}</span>
        </div>
      `).join('') : '<div class="empty-state">No tienes pagos registrados.</div>';
      const paymentPaginationEl = document.getElementById('profilePaymentsPagination');
      if (paymentPaginationEl) {
        paymentPaginationEl.innerHTML = [
          `<button type="button" data-payment-page="${Math.max(1, currentPaymentPage - 1)}">‹</button>`,
          `<button type="button" data-payment-page="${Math.min(paymentPageCount, currentPaymentPage + 1)}">›</button>`
        ].join('');
        paymentPaginationEl.querySelectorAll('button').forEach((button) => {
          button.onclick = () => {
            localStorage.setItem('sgc_profile_payments_page', button.dataset.paymentPage);
            renderProfilePage();
          };
        });
      }
    }

    if (promotionsListEl) {
      promotionsListEl.innerHTML = state.promotions.map((promo) => `
        <div class="promo-item">
          <div>
            <strong>${promo.title}</strong>
            <p>${promo.description}</p>
            <small>Válido hasta ${promo.validUntil}</small>
          </div>
          <button class="promo-btn" data-promo-id="${promo.id}">${activePromotionId(state) === promo.id ? 'Activa' : 'Usar'}</button>
        </div>
      `).join('');

      promotionsListEl.querySelectorAll('.promo-btn').forEach((button) => {
        button.addEventListener('click', () => {
          const promoId = button.dataset.promoId;
          const stateNow = readState();
          const email = sessionEmail();
          stateNow.activePromotionByUser = { ...(stateNow.activePromotionByUser || {}) };
          if (email) stateNow.activePromotionByUser[email] = promoId;
          else stateNow.activePromotionId = promoId;
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
    const detailPanel = document.getElementById('appointmentDetailPanel');
    detailPanel?.classList.remove('is-open');
    detailPanel?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('detail-open');
    if (detail) detail.innerHTML = '<div class="empty-state">Selecciona una cita para ver su información.</div>';
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
        const counted = status === 'pending' ? ['pending', 'confirmed'] : [status];
        el.textContent = userAppointments.filter((item) => counted.includes(item.status)).length;
      }
    });

    if (!list || !detail) return;

    const tabs = document.querySelectorAll('.tab-btn');
    const pagination = document.getElementById('appointmentPagination');
    const storedStatus = localStorage.getItem('sgc_active_tab');
    const activeStatus = ['pending', 'previous', 'cancelled'].includes(storedStatus) ? storedStatus : 'pending';
    // La pestaña "Próximas" agrupa lo que aun no ocurre: una cita confirmada por
    // el especialista sigue siendo proxima para el cliente, no debe desaparecer.
    const statusesFor = (tab) => (tab === 'pending' ? ['pending', 'confirmed'] : [tab]);
    const filtered = userAppointments
      .filter((item) => statusesFor(activeStatus).includes(item.status))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const pageSize = 3;
    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const storedPage = Number(localStorage.getItem(`sgc_appointments_page_${activeStatus}`) || 1);
    const activePage = Math.min(Math.max(storedPage, 1), pageCount);
    const pageItems = filtered.slice((activePage - 1) * pageSize, activePage * pageSize);

    if (tabs && tabs.length) {
      tabs.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.statusTab === activeStatus);
        btn.onclick = () => {
          detail.innerHTML = '<div class="empty-state">Selecciona una cita para ver su información.</div>';
          detailPanel?.classList.remove('is-open');
          detailPanel?.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('detail-open');
          localStorage.setItem('sgc_active_tab', btn.dataset.statusTab);
          localStorage.setItem(`sgc_appointments_page_${btn.dataset.statusTab}`, '1');
          renderAppointmentsPage();
        };
      });
    }

    if (!filtered.length) {
      list.innerHTML = '<div class="empty-state">No hay citas en esta sección.</div>';
      detail.innerHTML = '<div class="empty-state">Selecciona una cita para ver su información.</div>';
      if (pagination) pagination.innerHTML = '';
      return;
    }

    if (pagination) {
      pagination.innerHTML = [
        `<button type="button" data-page="${activePage - 1}" ${activePage === 1 ? 'disabled' : ''}>‹</button>`,
        ...Array.from({ length: pageCount }, (_, index) => `<button type="button" class="${index + 1 === activePage ? 'active' : ''}" data-page="${index + 1}">${index + 1}</button>`),
        `<button type="button" data-page="${activePage + 1}" ${activePage === pageCount ? 'disabled' : ''}>›</button>`
      ].join('');
      pagination.querySelectorAll('button:not(:disabled)').forEach((button) => {
        button.onclick = () => {
          detail.innerHTML = '<div class="empty-state">Selecciona una cita para ver su información.</div>';
          detailPanel?.classList.remove('is-open');
          detailPanel?.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('detail-open');
          localStorage.setItem(`sgc_appointments_page_${activeStatus}`, button.dataset.page);
          renderAppointmentsPage();
        };
      });
    }

    const serviceImages = (window.appointmentsSystem.getServices?.() || []).reduce((images, service) => {
      images[service.title?.toLowerCase()] = service.image;
      return images;
    }, {});
    list.innerHTML = pageItems.map((appointment) => `
      <button class="appointment-item" data-appointment-id="${appointment.id}">
        <img class="appointment-item-image" src="${serviceImages[appointment.serviceName?.toLowerCase()] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=160'}" alt="">
        <div class="appointment-item-body">
          <div class="appointment-item-head">
            <div><strong>${appointment.serviceName}</strong><small>Relajante y liberador.</small></div>
            <span class="appointment-badge appointment-status-${appointment.status}">${appointment.status === 'pending' ? 'Pendiente' : appointment.status === 'confirmed' ? 'Confirmada' : appointment.status === 'cancelled' ? 'Cancelada' : 'Completado'}</span>
          </div>
          <div class="appointment-item-meta"><span><i class="fa-regular fa-calendar"></i> Fecha<br>${appointment.date}</span><span><i class="fa-regular fa-clock"></i> Hora<br>${appointment.time}</span><span><i class="fa-regular fa-user"></i> Profesional<br>${appointment.specialist || 'Disponible'}</span></div>
        </div>
        <span class="appointment-item-actions appointment-actions-${appointment.status}"><i class="fa-regular fa-eye"></i>${appointment.status === 'pending' ? '<span class="appointment-cancel-trigger" role="button" tabindex="0" data-cancel-id="' + appointment.id + '" aria-label="Cancelar cita"><i class="fa-solid fa-xmark"></i></span>' : appointment.status === 'previous' || appointment.status === 'completed' ? '<span class="appointment-favorite-trigger" role="button" tabindex="0" aria-label="Favorito"><i class="fa-solid fa-star"></i></span>' : ''}</span>
      </button>
    `).join('');

    list.querySelectorAll('.appointment-item').forEach((button) => {
      button.querySelector('.appointment-cancel-trigger')?.addEventListener('click', (event) => {
        event.stopPropagation();
        openCancelModal(event.currentTarget.dataset.cancelId);
      });
      button.querySelector('.appointment-favorite-trigger')?.addEventListener('click', (event) => {
        event.stopPropagation();
        openRatingModal(button.dataset.appointmentId);
      });
      button.querySelector('.appointment-cancel-trigger')?.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        event.stopPropagation();
        openCancelModal(event.currentTarget.dataset.cancelId);
      });
      button.addEventListener('click', () => {
        const current = getAppointmentById(button.dataset.appointmentId);
        if (!current) return;
        detailPanel?.classList.add('is-open');
        detailPanel?.setAttribute('aria-hidden', 'false');
        document.body.classList.add('detail-open');
        const service = (window.appointmentsSystem.getServices?.() || []).find((item) => item.title?.toLowerCase() === current.serviceName?.toLowerCase());
        const currentStatusLabel = current.status === 'pending' ? 'Pendiente' : current.status === 'confirmed' ? 'Confirmada' : current.status === 'cancelled' ? 'Cancelada' : 'Completada';
        const currentStatusClass = current.status === 'cancelled' ? 'appointment-status-cancelled' : 'appointment-status-confirmed';
        const detailImage = service?.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=260';
        const detailDuration = current.duration ? `${current.duration} min` : (service?.duration || '60 minutos');
        detail.innerHTML = `
          <div class="detail-card">
            <div class="detail-card-head">
              <h3>Resumen de la cita</h3>
              <button type="button" class="detail-close" aria-label="Cerrar información"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="appointment-summary-service">
              <img src="${detailImage}" alt="${current.serviceName}" class="appointment-summary-image">
              <div class="appointment-summary-copy"><h4>${current.serviceName}</h4><p>${service?.category || 'Relajante y liberador'}</p><span class="appointment-badge ${currentStatusClass}">${currentStatusLabel}</span></div>
            </div>
            <div class="appointment-summary-meta">
              <div><i class="fa-regular fa-calendar"></i><span>Fecha<strong>${current.date}</strong></span></div>
              <div><i class="fa-regular fa-clock"></i><span>Hora<strong>${current.time}</strong></span></div>
              <div><i class="fa-regular fa-user"></i><span>Profesional<strong>${current.specialist || 'Disponible'}</strong></span></div>
            </div>
            <div class="appointment-summary-info">
              <h4>Información de la cita</h4>
              <div><span>Estado</span><strong class="appointment-badge ${currentStatusClass}">${currentStatusLabel}</strong></div>
              <div><span>Duración</span><strong>${detailDuration}</strong></div>
              <div><span>Precio</span><strong>${current.price || '--'}</strong></div>
              ${current.status === 'previous' || current.status === 'completed' ? `<div><span>Metodo de pago</span><strong>${current.paymentMethod || '--'}</strong></div><div><span>Subtotal</span><strong>${current.subtotal != null ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(current.subtotal) : current.price || '--'}</strong></div><div><span>Total pagado</span><strong>${current.total != null ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(current.total) : current.price || '--'}</strong></div>` : ''}
            </div>
            ${current.status === 'pending' ? `<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn-modify" data-modify-id="${current.id}">Modificar cita</button>` + (getSession() && getSession().role === 'specialist' ? `<button class="btn-confirm" data-confirm-id="${current.id}">Confirmar</button>` : '') + `</div>` : (getSession() && getSession().role === 'specialist' ? `<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn-complete" data-complete-id="${current.id}">Marcar como atendida</button><button class="btn-delete" data-delete-id="${current.id}">Eliminar cita</button></div>` : '')}
          </div>
        `;
        const detailClose = detail.querySelector('.detail-close');
        if (detailClose) {
          detailClose.addEventListener('click', (event) => {
            event.stopPropagation();
            detail.innerHTML = '<div class="empty-state">Selecciona una cita para ver su información.</div>';
            detailPanel?.classList.remove('is-open');
            detailPanel?.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('detail-open');
          });
        }
            const cancelButton = detail.querySelector('.btn-cancel');
            const modifyButton = detail.querySelector('.btn-modify');
            if (modifyButton) {
              modifyButton.addEventListener('click', () => {
                sessionStorage.setItem('sgc_modify_appointment_id', modifyButton.dataset.modifyId);
                window.location.href = 'catalogo.html';
              });
            }
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
                  showSiteAlert('Solo un especialista puede eliminar citas. Si necesitas cancelar, usa la opción de cancelar.', 'warning');
                  return;
                }
                if (confirm('¿Seguro que deseas eliminar esta cita? Esta acción no se puede deshacer.')) {
                  removeAppointment(deleteButton.dataset.deleteId);
                  renderNotifications();
                  renderAppointmentsPage();
                }
          });
        }
          const confirmButton = detail.querySelector('.btn-confirm');
          if (confirmButton) {
            confirmButton.addEventListener('click', () => {
              const session = getSession() || {};
              if (session.role !== 'specialist') {
                showSiteAlert('Solo un especialista puede confirmar citas.', 'warning');
                return;
              }
              specialistMarkConfirmed(confirmButton.dataset.confirmId);
            });
          }
          const completeButton = detail.querySelector('.btn-complete');
          if (completeButton) {
            completeButton.addEventListener('click', () => {
              const session = getSession() || {};
              if (session.role !== 'specialist') {
                showSiteAlert('Solo un especialista puede marcar una cita como atendida.', 'warning');
                return;
              }
              specialistConfirmAppointment(completeButton.dataset.completeId);
            });
          }
      });
    });

  }

  function openCancelModal(id) {
    const modal = document.getElementById('cancelAppointmentModal');
    if (!modal) return;
    modal.dataset.appointmentId = id;
    const reasonSelect = document.getElementById('cancelReason');
    if (reasonSelect) reasonSelect.value = '';
    modal.classList.add('active');
  }

  function openRatingModal(id) {
    const modal = document.getElementById('ratingModal');
    if (!modal) return;
    modal.dataset.appointmentId = id;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
    modal.querySelectorAll('[data-rating]').forEach((button) => button.classList.remove('selected'));
    const comment = document.getElementById('ratingComment');
    if (comment) comment.value = '';
  }

  function closeRatingModal() {
    const modal = document.getElementById('ratingModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('data-appointment-id');
  }

  function closeCancelModal() {
    const modal = document.getElementById('cancelAppointmentModal');
    if (modal) {
      modal.classList.remove('active');
      modal.removeAttribute('data-appointment-id');
      const reasonSelect = document.getElementById('cancelReason');
      if (reasonSelect) reasonSelect.value = '';
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

    if (menuButton && !document.querySelector('.profile-dashboard')) menuButton.addEventListener('click', openSidebar);
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
          const reason = document.getElementById('cancelReason')?.value || '';
          if (!reason) {
            showSiteAlert('Selecciona un motivo para cancelar la cita.', 'warning');
            return;
          }
          cancelAppointment(id, reason);
          renderNotifications();
          renderAppointmentsPage();
          closeCancelModal();
        }
      });
      cancelModal.querySelector('.cancel-cancel-btn')?.addEventListener('click', closeCancelModal);
      cancelModal.querySelector('.cancel-modal-close')?.addEventListener('click', closeCancelModal);
      cancelModal.addEventListener('click', (event) => {
        if (event.target.id === 'cancelAppointmentModal') {
          closeCancelModal();
        }
      });
    }

    const ratingModal = document.getElementById('ratingModal');
    if (ratingModal) {
      ratingModal.querySelectorAll('[data-rating]').forEach((button) => {
        button.addEventListener('click', () => {
          const value = Number(button.dataset.rating);
          ratingModal.dataset.rating = String(value);
          ratingModal.querySelectorAll('[data-rating]').forEach((star) => star.classList.toggle('selected', Number(star.dataset.rating) <= value));
        });
      });
      ratingModal.querySelector('.rating-submit-btn')?.addEventListener('click', () => {
        const id = ratingModal.dataset.appointmentId;
        const rating = Number(ratingModal.dataset.rating || 0);
        if (!rating) {
          showSiteAlert('Selecciona una calificación antes de enviar.', 'info');
          return;
        }
        const result = rateAppointment(id, rating, document.getElementById('ratingComment')?.value || '');
        if (!result.allowed) return;
        closeRatingModal();
        renderAppointmentsPage();
        const thankYou = document.createElement('div');
        thankYou.className = 'rating-thank-you';
        thankYou.textContent = 'Gracias por tus comentarios';
        document.body.appendChild(thankYou);
        setTimeout(() => thankYou.remove(), 3200);
      });
      ratingModal.querySelector('.rating-cancel-btn')?.addEventListener('click', closeRatingModal);
      ratingModal.querySelector('.rating-close')?.addEventListener('click', closeRatingModal);
      ratingModal.addEventListener('click', (event) => {
        if (event.target === ratingModal) closeRatingModal();
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
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY || event.key === AUTH_STORAGE_KEY) {
        handleGlobalStateUpdate();
      }
    });

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
    updateAppointment,
    rateAppointment,
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
      discardAppointment,
    readState,
    resolveAppointmentDate,
    getProfileForCurrentSession,
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
    showSiteAlert,
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
      window.location.href = resolveRelative('index.html');
    },
    applyPromotion: function (promoId) {
      const state = readState();
      const email = sessionEmail();
      state.activePromotionByUser = { ...(state.activePromotionByUser || {}) };
      if (email) state.activePromotionByUser[email] = promoId;
      else state.activePromotionId = promoId;
      saveState(state);
      if (promoId) {
        addNotification('Promoción activada', 'Tu próxima cita ya podrá aprovechar la promoción seleccionada.', 'promotion');
      }
      renderProfilePage();
      syncProfileUI();
      return activePromotionId(state);
    }
  };

  // expose notification removal
  if (window.appointmentsSystem) {
    window.appointmentsSystem.removeNotification = removeNotification;
  }

  // expose promotions API
  if (window.appointmentsSystem) {
    window.appointmentsSystem.getPromotions = getPromotions;
    window.appointmentsSystem.createPromotion = createPromotion;
    window.appointmentsSystem.updatePromotion = updatePromotion;
    window.appointmentsSystem.deletePromotion = deletePromotion;
  }

  // expose admin confirm
  if (window.appointmentsSystem) {
    window.appointmentsSystem.specialistConfirmAppointment = specialistConfirmAppointment;
    window.appointmentsSystem.adminConfirmAppointment = specialistConfirmAppointment;
  }

  // expose profile setter so UI scripts can update current session profile
  if (window.appointmentsSystem) {
    window.appointmentsSystem.setProfile = setProfileForCurrentSession;
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
          role: 'specialist',
          workStart: '10:00',
          workEnd: '19:00',
          daysOff: ['saturday', 'sunday']
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
      avatar: 'https://www.gravatar.com/avatar/?d=mp&s=150',
      memberSince: String(new Date().getFullYear()),
      ...user
    };
    users.push(newUser);
    saveUsers(users);
    return { ok: true, user: newUser };
  }

  function setProfileAvatar(dataUrl) {
    try {
      const state = JSON.parse(localStorage.getItem('sgc_appointments_state_v1') || '{}');
      const session = JSON.parse(sessionStorage.getItem('sgc_active_session_v1') || 'null') || {};
      state.profile = { ...(state.profile || {}), avatar: dataUrl };
      if (session.email) state.profile.email = session.email;
      localStorage.setItem('sgc_appointments_state_v1', JSON.stringify(state));
      if (session.email) {
        const users = JSON.parse(localStorage.getItem('sgc_auth_users_v1') || '[]');
        const user = users.find((item) => item.email && item.email.toLowerCase() === session.email.toLowerCase());
        if (user) {
          user.avatar = dataUrl;
          localStorage.setItem('sgc_auth_users_v1', JSON.stringify(users));
        }
      }
      try {
        window.dispatchEvent(new Event('sgc-state-updated'));
      } catch (e) {
        // The avatar is already persisted if a view cannot be refreshed.
      }
      return dataUrl;
    } catch (e) {
      return null;
    }
  }

  function loginUser(email, password) {
    const users = readUsers();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email || ''))) {
      return { ok: false, error: 'invalid_email' };
    }
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
    window.location.href = resolveRelative('dashboard.html');
  }

  function bindAuthForms() {
    // helper: clear previous inline field errors in a form
    function clearFieldErrors(form) {
      try {
        if (!form) return;
        form.querySelectorAll('.sgc-inline-error').forEach((el) => el.remove());
        form.querySelectorAll('.sgc-field-invalid').forEach((el) => el.classList.remove('sgc-field-invalid'));
      } catch (e) { /* ignore */ }
    }

    // helper: show inline error for a given input element or selector
    function showFieldError(elOrSelector, message) {
      try {
        const el = typeof elOrSelector === 'string' ? document.getElementById(elOrSelector) : elOrSelector;
        if (!el) return;
        el.classList.add('sgc-field-invalid');
        // remove existing inline error for this field
        const next = el.nextElementSibling;
        if (next && next.classList && next.classList.contains('sgc-inline-error')) next.remove();
        const msg = document.createElement('div');
        msg.className = 'sgc-inline-error';
        msg.textContent = message || '';
        el.parentNode && el.parentNode.insertBefore(msg, el.nextSibling);
      } catch (e) { /* ignore */ }
    }
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
      const handleRegisterSubmit = (event) => {
        console.log('[sgc] handleRegisterSubmit fired', !!event, event && event.type);
        try { /* debug toast removed to avoid noisy message during registration */ } catch(e) {}
        if (event && event.preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }
        const passwordValue = document.getElementById('password')?.value || '';
        const confirmPasswordValue = document.getElementById('confirmPassword')?.value || '';
        const birthDateValue = document.getElementById('fecha')?.value || '';
        const rawPhoneValue = (document.getElementById('telefono')?.value || '').trim();
        const payload = {
          name: document.getElementById('nombre')?.value?.trim() || '',
          lastName: document.getElementById('apellido')?.value?.trim() || '',
          email: (document.getElementById('email')?.value || '').trim().toLowerCase(),
          phone: rawPhoneValue,
          birthDate: birthDateValue,
          password: passwordValue,
          role: 'client'
        };

        console.log('[sgc] register payload', payload, { confirmPasswordValue });
        clearFieldErrors(registerForm);
        // identify missing individual fields to help debugging/UX and show inline errors
        const missing = [];
        if (!payload.name) { missing.push('Nombre'); showFieldError('nombre', 'Ingresa tu nombre'); }
        if (!payload.lastName) { missing.push('Apellido'); showFieldError('apellido', 'Ingresa tu apellido'); }
        if (!payload.email) { missing.push('Correo'); showFieldError('email', 'Ingresa tu correo electrónico'); }
        if (!payload.phone) { missing.push('Teléfono'); showFieldError('telefono', 'Ingresa tu teléfono'); }
        if (!birthDateValue) { missing.push('Fecha de nacimiento'); showFieldError('fecha', 'Selecciona tu fecha de nacimiento'); }
        if (!passwordValue) { missing.push('Contraseña'); showFieldError('password', 'Crea una contraseña'); }
        if (!confirmPasswordValue) { missing.push('Confirmar contraseña'); showFieldError('confirmPassword', 'Confirma tu contraseña'); }
        if (missing.length) {
          window.showSiteAlert('Completa los campos: ' + missing.join(', '), 'info');
          return;
        }

        const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-]+$/;
        if (!namePattern.test(payload.name) || !namePattern.test(payload.lastName)) {
          showFieldError('nombre', 'Nombre inválido');
          showFieldError('apellido', 'Apellido inválido');
          window.showSiteAlert('El nombre y apellido contienen caracteres inválidos.', 'warning');
          return;
        }

        const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailPattern.test(payload.email)) {
          showFieldError('email', 'Correo inválido');
          window.showSiteAlert('Ingresa un correo electrónico válido.', 'error');
          return;
        }

        payload.phone = (payload.phone || '').replace(/\D/g, '');
        const phonePattern = /^\d{8,14}$/;
        if (!phonePattern.test(payload.phone)) {
          showFieldError('telefono', 'Teléfono inválido');
          window.showSiteAlert('El teléfono debe tener entre 8 y 14 dígitos.', 'warning');
          return;
        }

        const passwordPattern = /^[A-Za-z0-9]{4,16}$/;
        if (!passwordPattern.test(passwordValue)) {
          showFieldError('password', 'Contraseña inválida');
          window.showSiteAlert('La contraseña debe tener entre 4 y 16 caracteres y solo puede contener letras y números.', 'warning');
          return;
        }

        if (passwordValue !== confirmPasswordValue) {
          showFieldError('confirmPassword', 'Las contraseñas no coinciden');
          window.showSiteAlert('Las contraseñas no coinciden.', 'error');
          return;
        }

        const birthDate = new Date(birthDateValue);
        const today = new Date();
        if (Number.isNaN(birthDate.getTime())) {
          showFieldError('fecha', 'Fecha inválida');
          window.showSiteAlert('La fecha de nacimiento no es válida. Usa el selector de fecha.', 'error');
          return;
        }

        if (birthDate > today) {
          showFieldError('fecha', 'Fecha en el futuro');
          window.showSiteAlert('La fecha de nacimiento no puede ser en el futuro.', 'error');
          return;
        }

        const age = today.getFullYear() - birthDate.getFullYear() -
          ((today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) ? 1 : 0);
        if (age < 16 || age > 100) {
          showFieldError('fecha', 'Edad fuera de rango');
          window.showSiteAlert('Debes tener entre 16 y 100 años para registrarte.', 'warning');
          return;
        }

        const result = createUser(payload);
        if (!result.ok) {
          if (result.error === 'email_exists') {
            window.showSiteAlert('Ese correo ya está registrado.', 'warning');
          } else {
            window.showSiteAlert('No se pudo crear la cuenta. Intenta de nuevo.', 'error');
          }
          return;
        }

        const created = result.user;
        setSession({ role: created.role, email: created.email, name: `${created.name} ${created.lastName || ''}`.trim() });
        if (window.appointmentsSystem && typeof window.appointmentsSystem.syncProfileUI === 'function') {
          window.appointmentsSystem.syncProfileUI();
        }
        window.showSiteAlert('Cuenta creada e iniciada correctamente.', 'info');
        navigateByRole(created.role);
      };

      registerForm.addEventListener('submit', handleRegisterSubmit);
      const phoneInput = document.getElementById('telefono');
      if (phoneInput) {
        phoneInput.addEventListener('input', () => {
          const nextValue = phoneInput.value.replace(/\D/g, '').slice(0, 14);
          if (phoneInput.value !== nextValue) {
            phoneInput.value = nextValue;
          }
        });
      }

      const registerBtn = document.getElementById('registerSubmitButton');
      if (registerBtn) {
        registerBtn.addEventListener('click', (event) => {
          if (event) {
            event.preventDefault();
            event.stopPropagation();
          }
          handleRegisterSubmit(event);
        }, true);
      }
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
          showSiteAlert('Ingresa tu correo y contraseña para iniciar sesión como especialista.', 'info');
          return;
        }
        const result = loginUser(email, password);
        if (!result.ok || result.user.role !== 'specialist') {
          showSiteAlert('No se encontró un especialista con esas credenciales.', 'error');
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

  // expose toast helper globally for pages that don't load full system
  try { if (typeof window !== 'undefined') window.showSiteAlert = showSiteAlert; } catch (e) { /* ignore */ }

    if (window.appointmentsSystem) {
      window.appointmentsSystem.readUsers = readUsers;
      window.appointmentsSystem.getSession = getSession;
      window.appointmentsSystem.clearSession = clearSession;
      window.appointmentsSystem.setSession = setSession;
      window.appointmentsSystem.createUser = createUser;
      window.appointmentsSystem.loginUser = loginUser;
      window.appointmentsSystem.showSiteAlert = showSiteAlert;
      window.appointmentsSystem.signOut = function () { clearSession(); window.location.href = resolveRelative('Loggin.html'); };
      window.appointmentsSystem.setProfileAvatar = setProfileAvatar;
      window.appointmentsSystem.navigateByRole = navigateByRole;
      if (typeof specialistMarkConfirmed === 'function') {
        window.appointmentsSystem.specialistMarkConfirmed = specialistMarkConfirmed;
      }
      if (typeof specialistMarkNoShow === 'function') {
        window.appointmentsSystem.specialistMarkNoShow = specialistMarkNoShow;
      }
    }
  })();
