/* ---------------------------------------------------------------------------
 * admin-data.js
 * Capa de datos del rol administrador.
 *
 * No inventa datos: todo sale de las mismas fuentes que usan cliente y
 * especialista (sgc_appointments_state_v1 y sgc_auth_users_v1). Aquí solo se
 * añaden los campos que las vistas de admin necesitan y que el modelo original
 * no guardaba (especialista asignado, faltas, horarios, promociones v2).
 * ------------------------------------------------------------------------- */
(function () {
  const STATE_KEY = 'sgc_appointments_state_v1';
  const USERS_KEY = 'sgc_auth_users_v1';

  const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const DAY_LABELS = {
    monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miercoles', thursday: 'Jueves',
    friday: 'Viernes', saturday: 'Sabado', sunday: 'Domingo'
  };
  const DAY_SHORT = { monday: 'Lun', tuesday: 'Mar', wednesday: 'Mier', thursday: 'Jue', friday: 'Vie', saturday: 'Sab', sunday: 'Dom' };

  const DEFAULT_BUSINESS_HOURS = {
    monday: { open: '09:00', close: '18:00', active: true },
    tuesday: { open: '10:00', close: '18:00', active: true },
    wednesday: { open: '08:00', close: '18:00', active: true },
    thursday: { open: '08:00', close: '18:00', active: true },
    friday: { open: '10:00', close: '18:00', active: true },
    saturday: { open: '11:00', close: '18:00', active: true },
    sunday: { open: '', close: '', active: false }
  };

  /* ------------------------------ persistencia ---------------------------- */

  function readState() {
    if (window.appointmentsSystem && typeof window.appointmentsSystem.readState === 'function') {
      return window.appointmentsSystem.readState();
    }
    try { return JSON.parse(localStorage.getItem(STATE_KEY) || '{}'); } catch (e) { return {}; }
  }

  function writeState(state) {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('sgc-state-updated'));
  }

  function readUsers() {
    if (window.sgcAuth && typeof window.sgcAuth.readUsers === 'function') {
      return window.sgcAuth.readUsers() || [];
    }
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch (e) { return []; }
  }

  function writeUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event('sgc-state-updated'));
  }

  /* ------------------------- normalizacion del modelo --------------------- */

  // Rellena los campos que el admin necesita sin pisar lo que ya exista.
  // Se ejecuta una vez al cargar cualquier pagina de admin.
  function ensureSchema() {
    const users = readUsers();
    let usersDirty = false;

    users.forEach((user) => {
      if (user.role === 'specialist') {
        if (user.specialty === undefined) { user.specialty = 'Especialista'; usersDirty = true; }
        if (user.workStart === undefined) { user.workStart = '09:00'; usersDirty = true; }
        if (user.workEnd === undefined) { user.workEnd = '18:00'; usersDirty = true; }
        if (user.daysOff === undefined) { user.daysOff = ['saturday', 'sunday']; usersDirty = true; }
      }
      if (user.active === undefined) { user.active = true; usersDirty = true; }
      if (user.role === 'client' && user.status === undefined) { user.status = 'active'; usersDirty = true; }
    });
    if (usersDirty) writeUsers(users);

    const state = readState();
    let stateDirty = false;

    if (!state.businessHours) { state.businessHours = { ...DEFAULT_BUSINESS_HOURS }; stateDirty = true; }

    (state.services || []).forEach((service) => {
      if (service.active === undefined) { service.active = true; stateDirty = true; }
    });

    (state.promotions || []).forEach((promo) => {
      if (promo.type === undefined) { promo.type = 'Porcentaje'; stateDirty = true; }
      if (promo.discount === undefined) { promo.discount = ''; stateDirty = true; }
      if (promo.startDate === undefined) { promo.startDate = ''; stateDirty = true; }
      if (promo.endDate === undefined) {
        // Las promos viejas solo tenian validUntil en formato dd/mm/aaaa.
        promo.endDate = toIsoDate(promo.validUntil) || '';
        stateDirty = true;
      }
    });

    (state.appointments || []).forEach((appointment) => {
      if (appointment.specialistEmail === undefined) { appointment.specialistEmail = ''; stateDirty = true; }
    });

    if (stateDirty) writeState(state);
  }

  /* -------------------------------- helpers ------------------------------- */

  function toIsoDate(value) {
    if (!value) return '';
    const ddmmyyyy = String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    return '';
  }

  function parseMoney(value) {
    const numeric = Number(String(value == null ? '' : value).replace(/[^0-9.]/g, ''));
    return Number.isFinite(numeric) ? numeric : 0;
  }

  function formatMoney(value) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value || 0);
  }

  function fullName(user) {
    if (!user) return '';
    return `${user.name || ''} ${user.lastName || ''}`.trim();
  }

  // La resolucion de fechas vive en appointments-system.js para que admin,
  // cliente y especialista interpreten "Lun 12" exactamente igual.
  function appointmentDate(appointment) {
    return window.appointmentsSystem && typeof window.appointmentsSystem.resolveAppointmentDate === 'function'
      ? window.appointmentsSystem.resolveAppointmentDate(appointment)
      : null;
  }

  function isSameDay(a, b) {
    return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function dayKeyOf(date) {
    return DAYS[(date.getDay() + 6) % 7]; // getDay(): 0=domingo -> nuestro array empieza en lunes
  }

  function clientEmailOf(appointment) {
    return String(appointment.createdBy?.email || '').toLowerCase();
  }

  function clientNameOf(appointment, users) {
    const email = clientEmailOf(appointment);
    const user = users.find((item) => String(item.email || '').toLowerCase() === email);
    return fullName(user) || appointment.createdBy?.name || appointment.client || 'Cliente';
  }

  /* ------------------------------- selectores ----------------------------- */

  function getClients() { return readUsers().filter((user) => user.role === 'client'); }
  function getSpecialists() { return readUsers().filter((user) => user.role === 'specialist'); }
  function getAppointments() { return readState().appointments || []; }
  function getServices() { return readState().services || []; }
  function getPromotions() { return readState().promotions || []; }
  function getBusinessHours() { return readState().businessHours || DEFAULT_BUSINESS_HOURS; }

  function findUser(email) {
    const target = String(email || '').toLowerCase();
    return readUsers().find((user) => String(user.email || '').toLowerCase() === target) || null;
  }

  // Faltas = citas marcadas como no_show por el especialista.
  function noShowCountByClient() {
    const counts = {};
    getAppointments().forEach((appointment) => {
      if (appointment.status !== 'no_show') return;
      const email = clientEmailOf(appointment);
      if (!email) return;
      counts[email] = (counts[email] || 0) + 1;
    });
    return counts;
  }

  function clientsWithNoShows(limit) {
    const counts = noShowCountByClient();
    const users = readUsers();
    const rows = Object.keys(counts).map((email) => {
      const user = users.find((item) => String(item.email || '').toLowerCase() === email);
      return { email, name: fullName(user) || email, count: counts[email] };
    }).sort((a, b) => b.count - a.count);
    return limit ? rows.slice(0, limit) : rows;
  }

  function topServices(limit) {
    const counts = {};
    const revenue = {};
    getAppointments().forEach((appointment) => {
      if (appointment.status === 'cancelled') return;
      const name = appointment.serviceName || appointment.service || 'Servicio';
      counts[name] = (counts[name] || 0) + 1;
      revenue[name] = (revenue[name] || 0) + parseMoney(appointment.total ?? appointment.price);
    });
    const services = getServices();
    const rows = Object.keys(counts).map((name) => {
      const service = services.find((item) => item.title === name);
      return { name, count: counts[name], revenue: revenue[name], image: service?.image || '' };
    }).sort((a, b) => b.count - a.count);
    return limit ? rows.slice(0, limit) : rows;
  }

  // Conteo de citas por dia de la semana, para la grafica "Citas semanales".
  // Las canceladas no cuentan como carga de trabajo.
  function weeklySeries() {
    const counts = DAYS.map(() => 0);
    getAppointments().forEach((appointment) => {
      if (appointment.status === 'cancelled') return;
      const date = appointmentDate(appointment);
      if (!date || Number.isNaN(date.getTime())) return;
      counts[DAYS.indexOf(dayKeyOf(date))] += 1;
    });
    return DAYS.map((key, index) => ({ key, label: DAY_LABELS[key], short: DAY_SHORT[key], value: counts[index] }));
  }

  // Serie de ingresos de los ultimos N dias.
  function revenueSeries(days) {
    const total = days || 7;
    const today = new Date();
    const points = [];
    for (let offset = total - 1; offset >= 0; offset -= 1) {
      const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
      const amount = getAppointments().reduce((sum, appointment) => {
        if (!['previous', 'completed'].includes(appointment.status)) return sum;
        const date = appointmentDate(appointment);
        return isSameDay(date, day) ? sum + parseMoney(appointment.total ?? appointment.price) : sum;
      }, 0);
      points.push({ date: day, label: day.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }), value: amount });
    }
    return points;
  }

  function stats() {
    const appointments = getAppointments();
    const users = readUsers();
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const metricDate = (appointment) => appointment.attendedAt
      ? new Date(appointment.attendedAt)
      : appointmentDate(appointment);

    const doneToday = appointments.filter((appointment) => {
      const date = metricDate(appointment);
      return isSameDay(date, today) && ['previous', 'completed'].includes(appointment.status);
    }).length;

    // Solo cuenta altas con fecha real: sin createdAt no se puede afirmar que
    // el cliente sea nuevo de este mes.
    const newClientsThisMonth = users.filter((user) =>
      user.role === 'client' && user.createdAt && new Date(user.createdAt) >= monthStart
    ).length;

    // Solo cuenta lo ya ocurrido: las citas futuras del mes aun no son ingreso.
    const monthEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    const inMonthToDate = (date) => date && date >= monthStart && date <= monthEnd;

    const revenueThisMonth = appointments.reduce((sum, appointment) => {
      if (!['previous', 'completed'].includes(appointment.status)) return sum;
      const date = metricDate(appointment);
      return inMonthToDate(date) ? sum + parseMoney(appointment.total ?? appointment.price) : sum;
    }, 0);

    const cancelledToday = appointments.filter((appointment) => {
      const date = appointmentDate(appointment);
      return appointment.status === 'cancelled' && isSameDay(date, today);
    }).length;

    const cancelledThisMonth = appointments.filter((appointment) => {
      const date = appointmentDate(appointment);
      return appointment.status === 'cancelled' && inMonthToDate(date);
    }).length;

    return {
      appointmentsToday: doneToday,
      appointmentsTotal: appointments.length,
      clientsRegistered: users.filter((user) => user.role === 'client').length,
      clientsNewThisMonth: newClientsThisMonth,
      specialistsActive: users.filter((user) => user.role === 'specialist' && user.active !== false).length,
      specialistsTotal: users.filter((user) => user.role === 'specialist').length,
      revenueThisMonth,
      pending: appointments.filter((appointment) => appointment.status === 'pending').length,
      confirmed: appointments.filter((appointment) => appointment.status === 'confirmed').length,
      attended: appointments.filter((appointment) => ['previous', 'completed'].includes(appointment.status)).length,
      cancelledToday,
      cancelledThisMonth,
      noShows: appointments.filter((appointment) => appointment.status === 'no_show').length
    };
  }

  // Estado de una promocion a partir de su vigencia real.
  function promotionStatus(promo) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const start = promo.startDate ? new Date(promo.startDate + 'T00:00:00') : null;
    const end = promo.endDate ? new Date(promo.endDate + 'T00:00:00') : null;
    if (end && end < today) return 'expired';
    if (start && start > today) return 'scheduled';
    if (start || end) return 'active';
    return 'active';
  }

  const PROMO_STATUS_LABEL = { active: 'Activa', scheduled: 'Programada', expired: 'Expirada' };

  /* ------------------------------- mutaciones ----------------------------- */

  function saveService(service) {
    const state = readState();
    state.services = state.services || [];
    if (service.id) {
      const index = state.services.findIndex((item) => item.id === service.id);
      if (index >= 0) {
        const previous = state.services[index];
        const previousTitle = String(previous.title || '').trim().toLowerCase();
        const previousDuration = previous.duration || '';
        if (previousDuration && previousDuration !== service.duration) {
          state.appointments = (state.appointments || []).map((appointment) => {
            const appointmentTitle = String(appointment.serviceName || appointment.service || '').trim().toLowerCase();
            if (appointmentTitle !== previousTitle || appointment.duration) return appointment;
            return { ...appointment, duration: Number(String(previousDuration).replace(/[^0-9.]/g, '')) || 60 };
          });
        }
        state.services[index] = { ...previous, ...service };
      }
    } else {
      state.services.push({ ...service, id: `svc-${Date.now()}` });
    }
    writeState(state);
  }

  function deleteService(id) {
    const state = readState();
    state.services = (state.services || []).filter((item) => item.id !== id);
    writeState(state);
  }

  // Reapunta las citas que referencian a un especialista cuando cambia o se va.
  function remapAppointmentSpecialist(fromEmail, toEmail) {
    const from = String(fromEmail || '').toLowerCase();
    if (!from) return;
    const state = readState();
    let dirty = false;
    (state.appointments || []).forEach((appointment) => {
      if (String(appointment.specialistEmail || '').toLowerCase() !== from) return;
      appointment.specialistEmail = toEmail || '';
      dirty = true;
    });
    if (dirty) writeState(state);
  }

  function saveEmployee(employee) {
    const users = readUsers();
    const target = String(employee.email || '').toLowerCase();
    const original = employee.originalEmail || target;
    const index = users.findIndex((user) => String(user.email || '').toLowerCase() === original);
    const payload = {
      name: employee.name,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      specialty: employee.specialty,
      workStart: employee.workStart,
      workEnd: employee.workEnd,
      daysOff: employee.daysOff,
      active: employee.active !== false,
      role: 'specialist'
    };

    // El correo es la llave del usuario: no puede chocar con otra cuenta.
    const collision = users.some((user, position) =>
      position !== index && String(user.email || '').toLowerCase() === target
    );
    if (collision) return { ok: false, error: 'Ya existe un usuario con ese correo.' };

    if (index >= 0) {
      users[index] = { ...users[index], ...payload };
      writeUsers(users);
      if (original !== target) remapAppointmentSpecialist(original, employee.email);
    } else {
      users.push({ ...payload, password: employee.password || 'sgc2026', birthDate: '', createdAt: new Date().toISOString() });
      writeUsers(users);
    }
    return { ok: true };
  }

  function deleteEmployee(email) {
    const target = String(email || '').toLowerCase();
    writeUsers(readUsers().filter((user) => String(user.email || '').toLowerCase() !== target));
    // Sus citas quedan "Sin asignar" en vez de apuntar a un usuario inexistente.
    remapAppointmentSpecialist(target, '');
  }

  function setClientStatus(email, status) {
    const users = readUsers();
    const target = String(email || '').toLowerCase();
    const user = users.find((item) => String(item.email || '').toLowerCase() === target);
    if (!user) return;
    user.status = status;
    writeUsers(users);
  }

  function savePromotion(promo) {
    const state = readState();
    state.promotions = state.promotions || [];
    if (promo.id) {
      const index = state.promotions.findIndex((item) => item.id === promo.id);
      if (index >= 0) state.promotions[index] = { ...state.promotions[index], ...promo };
    } else {
      state.promotions.push({ ...promo, id: `promo-${Date.now()}` });
    }
    writeState(state);
  }

  function deletePromotion(id) {
    const state = readState();
    state.promotions = (state.promotions || []).filter((item) => item.id !== id);
    if (state.activePromotionId === id) state.activePromotionId = null;
    writeState(state);
  }

  function setAppointmentSpecialist(id, specialistEmail) {
    const state = readState();
    const appointment = (state.appointments || []).find((item) => item.id === id);
    if (!appointment) return;
    appointment.specialistEmail = specialistEmail;
    writeState(state);
  }

  function setAppointmentStatus(id, status, reason) {
    const state = readState();
    const appointment = (state.appointments || []).find((item) => item.id === id);
    if (!appointment) return;
    appointment.status = status;
    if (reason) appointment.cancelReason = reason;
    writeState(state);
  }

  function markAppointmentAttended(id, payment) {
    const state = readState();
    const appointment = (state.appointments || []).find((item) => item.id === id);
    if (!appointment) return null;
    Object.assign(appointment, {
      status: 'previous',
      attendedAt: new Date().toISOString(),
      paymentMethod: payment.method,
      amountPaid: payment.amount,
      subtotal: payment.subtotal,
      total: payment.total
    });
    state.payments = Array.isArray(state.payments) ? state.payments : [];
    state.payments = state.payments.filter((item) => item.appointmentId !== id);
    state.payments.unshift({
      id: `payment-${id}`,
      appointmentId: id,
      clientEmail: appointment.createdBy?.email || '',
      description: appointment.serviceName || 'Servicio',
      date: appointment.date || new Date().toLocaleDateString('es-MX'),
      amount: payment.total,
      method: payment.method,
      status: 'Pagado'
    });
    writeState(state);
    return appointment;
  }

  function saveBusinessHours(hours) {
    const state = readState();
    state.businessHours = hours;
    writeState(state);
  }

  /* --------------------------------- export ------------------------------- */

  window.sgcAdminData = {
    DAYS, DAY_LABELS, DAY_SHORT, PROMO_STATUS_LABEL,
    ensureSchema,
    readState, readUsers,
    getClients, getSpecialists, getAppointments, getServices, getPromotions, getBusinessHours,
    findUser, fullName, parseMoney, formatMoney, toIsoDate,
    appointmentDate, clientEmailOf, clientNameOf, dayKeyOf,
    stats, weeklySeries, revenueSeries, topServices, clientsWithNoShows, noShowCountByClient,
    promotionStatus,
    saveService, deleteService,
    saveEmployee, deleteEmployee,
    setClientStatus,
    savePromotion, deletePromotion,
    setAppointmentSpecialist, setAppointmentStatus, markAppointmentAttended,
    saveBusinessHours
  };
})();
