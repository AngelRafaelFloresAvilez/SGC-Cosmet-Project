/* ---------------------------------------------------------------------------
 * admin-demo-data.js
 * Genera un conjunto de datos de demostracion coherente entre los tres roles.
 *
 * No se ejecuta solo: se dispara desde Configuracion → "Restablecer datos de
 * demostracion". Reemplaza usuarios y estado, por eso siempre pide confirmacion.
 * ------------------------------------------------------------------------- */
(function () {
  const STATE_KEY = 'sgc_appointments_state_v1';
  const USERS_KEY = 'sgc_auth_users_v1';

  const SPECIALISTS = [
    { name: 'Alexis', lastName: 'Arriola Martinez', email: 'alexis@sgc.com', phone: '+52 55 4764 3579', specialty: 'Facialista', workStart: '09:00', workEnd: '18:00' },
    { name: 'Leonardo', lastName: 'Rodriguez', email: 'leonardo@sgc.com', phone: '+52 777 4504 5453', specialty: 'Masajista', workStart: '09:00', workEnd: '18:00' },
    { name: 'David', lastName: 'Linares', email: 'david@sgc.com', phone: '+52 55 9087 5643', specialty: 'Manicurista', workStart: '09:00', workEnd: '18:00' },
    { name: 'Alan', lastName: 'Esteban', email: 'alan@sgc.com', phone: '+52 55 7656 4334', specialty: 'Facialista', workStart: '11:00', workEnd: '20:00' },
    { name: 'Lian', lastName: 'Joel', email: 'lianjoel@sgc.com', phone: '+52 55 8976 4509', specialty: 'Manicurista', workStart: '09:00', workEnd: '18:00' },
    { name: 'Sofía', lastName: 'Vega', email: 'sofia@sgc.com', phone: '+52 55 1111 2222', specialty: 'Cosmetologo', workStart: '10:00', workEnd: '19:00' }
  ];

  const CLIENTS = [
    { name: 'Ana', lastName: 'López', email: 'ana@sgc.com', phone: '+52 55 1234 5678', monthsAgo: 8 },
    { name: 'Miguel', lastName: 'Morales', email: 'miguel123@email.com', phone: '+52 777 676 7676', monthsAgo: 5 },
    { name: 'Pedro', lastName: 'Parques', email: 'pedro123@email.com', phone: '+52 777 676 7677', monthsAgo: 4 },
    { name: 'Antonio', lastName: 'Estrella', email: 'antonio123@email.com', phone: '+52 777 676 7678', monthsAgo: 3 },
    { name: 'Esteban', lastName: 'Rojas', email: 'esteban123@email.com', phone: '+52 777 676 7679', monthsAgo: 2 },
    { name: 'Natalia', lastName: 'Rios', email: 'natalia123@email.com', phone: '+52 777 676 7680', monthsAgo: 2 },
    { name: 'Juan', lastName: 'Calvo Velez', email: 'juancalvo@email.com', phone: '+52 777 676 7681', monthsAgo: 0 },
    { name: 'Emanuel', lastName: 'Mendez', email: 'emanuel@email.com', phone: '+52 777 676 7682', monthsAgo: 0 },
    { name: 'Maria', lastName: 'Perez', email: 'mariaperez@email.com', phone: '+52 777 676 7683', monthsAgo: 0 }
  ];

  const SERVICES = [
    { id: 'svc-1', title: 'Limpieza Facial Profunda', category: 'Rostro', price: 450, duration: 60, description: 'Elimina impurezas, células muertas y puntos negros devolviendo la frescura y oxigenación a tu piel.', includes: 'Vaporización con ozono, extracción manual y mascarilla calmante de caléndula.', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=500' },
    { id: 'svc-2', title: 'Masaje Relajante', category: 'Cuerpo', price: 600, duration: 60, description: 'Terapia manual diseñada para aliviar tensiones musculares profundas y reducir el estrés.', includes: 'Aceites esenciales orgánicos, música ambiental y técnica de cuerpo completo.', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=500' },
    { id: 'svc-3', title: 'Lifting de Pestañas', category: 'Mirada', price: 350, duration: 45, description: 'Alarga y eleva tus pestañas naturales desde la raíz con efecto de mayor amplitud.', includes: 'Tinte de larga duración, baño de keratina y diseño de curvatura natural.', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=500' },
    { id: 'svc-4', title: 'Microdermoabrasión', category: 'Tratamiento Clínico', price: 800, duration: 50, description: 'Renovación celular profunda que minimiza poros dilatados y líneas finas.', includes: 'Exfoliación con punta de diamante, loción equilibrante y pantalla solar FPS 50+.', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=500' },
    { id: 'svc-5', title: 'Depilación Láser Diodo', category: 'Depilación', price: 500, duration: 30, description: 'Eliminación progresiva del vello corporal con tecnología avanzada y segura.', includes: 'Aplicación en zona pequeña, gel criogénico y emulsión post-tratamiento.', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=500' },
    { id: 'svc-6', title: 'Hidratación Profunda con Ácido Hialurónico', category: 'Rostro', price: 550, duration: 60, description: 'Tratamiento intensivo para pieles deshidratadas que devuelve elasticidad y brillo.', includes: 'Ampolleta de ácido hialurónico puro, masaje linfático y mascarilla hidroplástica.', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=500' },
    { id: 'svc-7', title: 'Masaje Descontracturante', category: 'Cuerpo', price: 700, duration: 90, description: 'Presión profunda sobre contracturas localizadas en espalda, cuello y hombros.', includes: 'Calor local, maniobras de liberación miofascial y estiramientos asistidos.', image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=500' },
    { id: 'svc-8', title: 'Terapia con Mascarilla', category: 'Rostro', price: 380, duration: 35, description: 'Mascarilla nutritiva adaptada al tipo de piel para recuperar luminosidad.', includes: 'Diagnóstico de piel, mascarilla personalizada y sérum de sellado.', active: false, image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80&w=500' }
  ];

  const CANCEL_REASONS = ['Imprevisto', 'Problemas de salud', 'Reagendada por el cliente', 'Otro'];

  // Generador con semilla fija: los datos son los mismos en cada reinicio, lo
  // que hace comparables las capturas y las pruebas.
  function makeRandom(seed) {
    let value = seed;
    return function random() {
      value = (value * 1664525 + 1013904223) % 4294967296;
      return value / 4294967296;
    };
  }

  function pad(number) { return String(number).padStart(2, '0'); }

  function displayDate(date) {
    const shortDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    return `${shortDays[date.getDay()]} ${date.getDate()}`;
  }

  function displayTime(hour, minute) {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const display = hour % 12 === 0 ? 12 : hour % 12;
    return `${pad(display)}:${pad(minute)} ${suffix}`;
  }

  function build() {
    const random = makeRandom(20260820);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    /* ------------------------------- usuarios ------------------------------ */
    const users = [
      { name: 'Samuel', lastName: 'de Luque', email: 'admin@sgc.com', phone: '+52 55 0000 0000', birthDate: '1988-01-01', password: 'admin2026', role: 'admin', active: true }
    ];

    SPECIALISTS.forEach((specialist, index) => {
      users.push({
        ...specialist,
        birthDate: '1993-05-20',
        password: 'sgc2026',
        role: 'specialist',
        active: index !== SPECIALISTS.length - 1, // uno inactivo para ver el estado
        daysOff: ['saturday', 'sunday'],
        createdAt: new Date(today.getFullYear(), today.getMonth() - 10, 3).toISOString()
      });
    });

    CLIENTS.forEach((client) => {
      users.push({
        name: client.name,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        birthDate: '1996-03-11',
        password: 'sgc2026',
        role: 'client',
        active: true,
        status: 'active',
        createdAt: new Date(today.getFullYear(), today.getMonth() - client.monthsAgo, 5 + Math.floor(random() * 20)).toISOString()
      });
    });

    /* -------------------------------- citas -------------------------------- */
    const activeSpecialists = users.filter((user) => user.role === 'specialist' && user.active);
    const clients = users.filter((user) => user.role === 'client');
    const appointments = [];

    function addAppointment(date, hour, minute, client, specialist, service, status, extra) {
      const when = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute);
      // La cita se agenda unos dias antes, pero nunca en el futuro: createdAt
      // alimenta "Actividad reciente" y una fecha futura la dejaria en "Ahora".
      const bookedAt = Math.min(
        when.getTime() - (2 + Math.floor(random() * 6)) * 24 * 60 * 60 * 1000,
        now.getTime() - Math.floor(random() * 72) * 60 * 60 * 1000
      );
      appointments.push({
        id: `apt-demo-${appointments.length + 1}`,
        serviceName: service.title,
        price: `$${service.price} MXN`,
        date: displayDate(when),
        time: displayTime(hour, minute),
        iso: when.toISOString(),
        duration: service.duration,
        notes: '',
        specialist: `${specialist.name} ${specialist.lastName}`,
        specialistEmail: specialist.email,
        status,
        createdAt: new Date(bookedAt).toISOString(),
        summary: '',
        createdBy: { email: client.email, name: `${client.name} ${client.lastName}`, role: 'client', phone: client.phone },
        ...(extra || {})
      });
    }

    // Historial de los ultimos 45 dias.
    for (let offset = 45; offset >= 1; offset -= 1) {
      const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
      if (day.getDay() === 0) continue; // domingo cerrado

      const perDay = 1 + Math.floor(random() * 3);
      for (let index = 0; index < perDay; index += 1) {
        const client = clients[Math.floor(random() * clients.length)];
        const specialist = activeSpecialists[Math.floor(random() * activeSpecialists.length)];
        const service = SERVICES.filter((item) => item.active !== false)[Math.floor(random() * 7)];
        const hour = 9 + Math.floor(random() * 8);

        const roll = random();
        let status = 'previous';
        let extra = { summary: 'Cita atendida correctamente.' };
        if (roll > 0.88) {
          status = 'cancelled';
          extra = { summary: 'Cita cancelada.', cancelReason: CANCEL_REASONS[Math.floor(random() * CANCEL_REASONS.length)] };
        } else if (roll > 0.80) {
          status = 'no_show';
          extra = { summary: 'El cliente no asistió a la cita.' };
        }
        addAppointment(day, hour, random() > 0.5 ? 30 : 0, client, specialist, service, status, extra);
      }
    }

    // Citas de hoy, ya atendidas.
    for (let index = 0; index < 3; index += 1) {
      addAppointment(today, 9 + index * 2, 0,
        clients[index % clients.length],
        activeSpecialists[index % activeSpecialists.length],
        SERVICES[index % 6], 'previous', { summary: 'Cita atendida correctamente.' });
    }

    // Proximas citas: confirmadas y pendientes de confirmar.
    for (let offset = 1; offset <= 12; offset += 1) {
      const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
      if (day.getDay() === 0) continue;

      const perDay = 1 + Math.floor(random() * 2);
      for (let index = 0; index < perDay; index += 1) {
        const client = clients[Math.floor(random() * clients.length)];
        const specialist = activeSpecialists[Math.floor(random() * activeSpecialists.length)];
        const service = SERVICES.filter((item) => item.active !== false)[Math.floor(random() * 7)];
        const hour = 9 + Math.floor(random() * 8);
        const status = random() > 0.45 ? 'confirmed' : 'pending';
        addAppointment(day, hour, random() > 0.5 ? 30 : 0, client, specialist, service, status, {
          summary: status === 'confirmed' ? 'Cita confirmada por el especialista.' : 'Tu cita está pendiente de confirmación.'
        });
      }
    }

    // Dos citas sin especialista, para que el admin tenga algo que asignar.
    // Se corren al lunes si caen en domingo: el negocio no abre ese dia.
    const unassignedDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
    if (unassignedDay.getDay() === 0) unassignedDay.setDate(unassignedDay.getDate() + 1);
    [0, 1].forEach((index) => {
      addAppointment(unassignedDay, 15 + index, 0, clients[index + 2], activeSpecialists[0], SERVICES[index + 1], 'pending', {
        summary: 'Tu cita está pendiente de confirmación.'
      });
      appointments[appointments.length - 1].specialistEmail = '';
      appointments[appointments.length - 1].specialist = 'Cualquiera. Mejor disponible';
    });

    /* ----------------------------- inasistencias --------------------------- */
    // Se marcan faltas dirigidas para que el ranking de inasistencias tenga
    // nombres reconocibles y Configuracion tenga a quien aplicar la regla.
    const targeted = [
      { email: 'juancalvo@email.com', count: 3 },
      { email: 'emanuel@email.com', count: 3 },
      { email: 'natalia123@email.com', count: 2 },
      { email: 'mariaperez@email.com', count: 2 }
    ];
    targeted.forEach((target) => {
      const owned = appointments.filter((appointment) =>
        appointment.createdBy.email === target.email && appointment.status === 'previous'
      );
      owned.slice(0, target.count).forEach((appointment) => {
        appointment.status = 'no_show';
        appointment.summary = 'El cliente no asistió a la cita.';
      });
    });

    /* ------------------------------ promociones ---------------------------- */
    const year = today.getFullYear();
    const month = today.getMonth();
    const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
    const promotions = [
      { id: 'promo-1', title: 'Masaje relajante 2×1', description: 'En masaje relajante de 60 min', type: '2×1', discount: '2×1', serviceTitle: 'Masaje Relajante', startDate: iso(year, month, 1), endDate: iso(year, month + 1, 15) },
      { id: 'promo-2', title: '%50 Masajes de espalda', description: 'En masajes de espalda de 60 min', type: 'Porcentaje', discount: '50%', serviceTitle: 'Masaje Descontracturante', startDate: iso(year, month + 1, 1), endDate: iso(year, month + 1, 25) },
      { id: 'promo-3', title: 'Mascarillas 2×1', description: 'En cualquier compra de mascarilla hidratante', type: 'Paquete', discount: '2×1', serviceTitle: '', startDate: iso(year, month + 1, 16), endDate: iso(year, month + 1, 30) },
      { id: 'promo-4', title: '%20 Masajes descontracturantes', description: 'En masajes descontracturantes de 90 min', type: 'Porcentaje', discount: '20%', serviceTitle: 'Masaje Descontracturante', startDate: iso(year, month + 2, 1), endDate: iso(year, month + 2, 15) },
      { id: 'promo-5', title: 'Limpieza facial + mascarilla', description: 'Promocion especial', type: 'Paquete', discount: '15%', serviceTitle: 'Limpieza Facial Profunda', startDate: iso(year, month - 2, 1), endDate: iso(year, month - 1, 20) }
    ].map((promo) => ({ ...promo, tag: promo.type, validUntil: promo.endDate.split('-').reverse().join('/') }));

    /* --------------------------------- pagos ------------------------------- */
    const payments = appointments
      .filter((appointment) => appointment.status === 'previous')
      .slice(-8)
      .map((appointment, index) => ({
        id: `pay-demo-${index + 1}`,
        clientEmail: appointment.createdBy?.email || '',
        amount: appointment.price,
        date: new Date(appointment.iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
        description: appointment.serviceName,
        status: 'Pagado'
      }));

    const state = {
      appointments,
      notifications: [],
      profile: {
        name: 'Ana López', email: 'ana@sgc.com', phone: '+52 55 1234 5678', birthDate: '14/08/1997',
        avatar: 'https://www.gravatar.com/avatar/?d=mp&s=150', role: 'Cliente', memberSince: '2024',
        status: 'Normal', statusMessage: 'Tienes acceso completo a tratamientos y promociones exclusivas.',
        notes: 'Disfruta de citas semanales y descuentos especiales para clientes recurrentes.'
      },
      payments,
      promotions,
      services: SERVICES.map((service) => ({
        id: service.id,
        title: service.title,
        category: service.category,
        description: service.description,
        includes: service.includes,
        duration: `${service.duration} minutos`,
        price: `$${service.price} MXN`,
        image: service.image,
        active: service.active !== false
      })),
      activePromotionId: null,
      businessHours: {
        monday: { open: '09:00', close: '18:00', active: true },
        tuesday: { open: '10:00', close: '18:00', active: true },
        wednesday: { open: '08:00', close: '18:00', active: true },
        thursday: { open: '08:00', close: '18:00', active: true },
        friday: { open: '10:00', close: '18:00', active: true },
        saturday: { open: '11:00', close: '18:00', active: true },
        sunday: { open: '', close: '', active: false }
      }
    };

    return { users, state };
  }

  function reset() {
    const { users, state } = build();
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('sgc-state-updated'));
    return { users: users.length, appointments: state.appointments.length };
  }

  window.sgcDemoData = { build, reset };
})();
