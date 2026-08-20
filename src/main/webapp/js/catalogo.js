// ==========================================
// ESTADO GLOBAL DE LA RESERVA
// ==========================================
let reservaActual = {
    idServicio: 1,
    nombreServicio: '',
    precio: 0,
    duracion: '60 min',
    idEmpleado: 1,
    nombreEmpleado: 'Ana Torres',
    fecha: '2026-08-09', // Fecha por defecto
    hora: '14:00:00',     // Hora por defecto
    metodoPago: 'Efectivo'
};

// ==========================================
// FUNCIONES DE UI Y NAVEGACIÓN
// ==========================================

function abrirMenu() {
    const sidebar = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('menuOverlay');
    if (sidebar) sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
}

function cerrarMenu() {
    const sidebar = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('menuOverlay');
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

function cambiarCatalogo(direction) {
    const container = document.querySelector('.services-grid');
    if (container) {
        const scrollAmount = 300;
        if (direction === 'next') container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        else container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
}

// ==========================================
// FUNCIONES DE MODALES
// ==========================================

function cerrarModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) modal.classList.remove('active');
}

function abrirModal(titulo, categoria, desc, incluye, duracion, precio, img) {
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.innerText = titulo;

    const descEl = document.getElementById('modalDesc');
    if (descEl) descEl.innerText = desc;

    const incContainer = document.getElementById('modalIncludes');
    if (incContainer) {
        incContainer.innerHTML = '';
        const items = incluye.split(',');
        items.forEach(item => {
            if (item.trim() !== '') {
                const div = document.createElement('div');
                div.className = 'include-item';
                div.innerText = item.trim();
                incContainer.appendChild(div);
            }
        });
        if (incContainer.innerHTML === '') {
            incContainer.innerHTML = '<div class="include-item">Servicio estándar</div>';
        }
    }

    const durEl = document.getElementById('modalDuration');
    if (durEl) durEl.innerText = duracion;

    document.body.dataset.currentPrice = precio;

    const priceEl = document.getElementById('modalPrice');
    if (priceEl) priceEl.innerText = `$${precio} MXN`;

    const imgEl = document.getElementById('modalImg');
    if (imgEl) imgEl.src = img;

    const modal = document.getElementById('serviceModal');
    if (modal) modal.classList.add('active');
}

function abrirModalAgendamiento() {
    cerrarModal();
    const calendarModal = document.getElementById('calendarModal');
    if (calendarModal) calendarModal.classList.add('active');
}

function volverAModalServicio() {
    const calendarModal = document.getElementById('calendarModal');
    const serviceModal = document.getElementById('serviceModal');
    if (calendarModal) calendarModal.classList.remove('active');
    if (serviceModal) serviceModal.classList.add('active');
}

function volverAlCatalogo() {
    const modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach(m => m.classList.remove('active'));
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    const catalogGrid = document.querySelector('.services-grid');
    if (catalogGrid) catalogGrid.style.gridTemplateColumns = 'repeat(3, minmax(210px, 1fr))';
});

// ==========================================
// LISTENER GLOBAL DE EVENTOS (DELEGACIÓN)
// ==========================================

document.addEventListener('click', (e) => {
    const target = e.target;

    // --- 1. Controles Básicos ---
    if (target.closest('#menuOverlay') || target.closest('.close-btn')) { cerrarMenu(); return; }
    if (target.closest('.menu-btn')) { abrirMenu(); return; }
    if (target.closest('.catalog-nav-btn')) {
        const btn = target.closest('.catalog-nav-btn');
        cambiarCatalogo(btn.dataset.direction || 'next');
        return;
    }
    if (target.closest('.sidebar-logout')) {
        window.location.href = (window.contextPath || '') + '/logout';
        return;
    }

    // --- 2. Abrir Detalles del Servicio (Tarjeta Catálogo) ---
    const card = target.closest('.service-card');
    if (card && (target.closest('.btn-book') || target === card || target.closest('.service-card'))) {
        e.stopPropagation();

        // Guardar datos en el objeto global de reserva
        reservaActual.idServicio = parseInt(card.dataset.id || '1');
        reservaActual.nombreServicio = card.dataset.title || '';
        reservaActual.precio = parseFloat(card.dataset.price || '0');
        reservaActual.duracion = card.dataset.duration || '60 min';

        abrirModal(
            reservaActual.nombreServicio,
            card.dataset.category || '',
            card.dataset.desc || '',
            card.dataset.includes || '',
            reservaActual.duracion,
            reservaActual.precio,
            card.dataset.image || ''
        );
        return;
    }

    // --- 3. Cierre Modales ---
    if (target.closest('#serviceModal') && e.target.id === 'serviceModal') { cerrarModal(); return; }
    if (target.closest('.modal-close') && !target.closest('.modal-back-calendar')) { cerrarModal(); return; }

    // --- 4. Transición Modal Detalles -> Calendario ---
    if (target.closest('.btn-agendar')) { abrirModalAgendamiento(); return; }
    if (target.closest('.modal-back-calendar')) { volverAModalServicio(); return; }

    // --- 5. Interactividad Calendario ---
    if (target.closest('.mini-cal-date')) {
        const dateElement = target.closest('.mini-cal-date');
        document.querySelectorAll('.mini-cal-date').forEach(el => el.classList.remove('active'));
        dateElement.classList.add('active');

        // Formatear día seleccionado a YYYY-MM-DD
        const dayNumber = dateElement.innerText.padStart(2, '0');
        reservaActual.fecha = `2026-08-${dayNumber}`;
        return;
    }

    if (target.closest('#btnVerCatalogo')) {
        const calendarModal = document.getElementById('calendarModal');
        if (calendarModal) calendarModal.classList.remove('active');
        return;
    }

    // --- 6. Transición Calendario -> Modal Nueva Cita ---
    if (target.closest('.btn-select-slot')) {
        const slot = target.closest('.btn-select-slot');
        const timeText = slot.querySelector('strong') ? slot.querySelector('strong').innerText : '14:00 PM';
        const spans = slot.querySelectorAll('span');
        const specialistText = spans.length > 1 ? spans[1].innerText : 'Ana Torres';

        // Guardar hora y especialista
        reservaActual.hora = timeText.includes('11:00') ? '11:00:00' : '14:00:00';
        reservaActual.nombreEmpleado = specialistText;

        const activeDateEl = document.querySelector('.mini-cal-date.active');
        const dayNumber = activeDateEl ? activeDateEl.innerText : '09';
        const dateText = `${dayNumber} de Agosto, 2026`;

        if (document.getElementById('confirmServiceName')) document.getElementById('confirmServiceName').innerText = reservaActual.nombreServicio || 'Servicio Estético';
        if (document.getElementById('confirmSpecialist')) document.getElementById('confirmSpecialist').innerText = specialistText;
        if (document.getElementById('confirmTime')) document.getElementById('confirmTime').innerText = timeText;
        if (document.getElementById('confirmDate')) document.getElementById('confirmDate').innerText = dateText;

        const calendarModal = document.getElementById('calendarModal');
        if (calendarModal) calendarModal.classList.remove('active');
        const newApptModal = document.getElementById('newAppointmentModal');
        if (newApptModal) newApptModal.classList.add('active');
        return;
    }

    // --- 7. Volver de Nueva Cita -> Calendario ---
    if (target.closest('#btnGoBackAppt')) {
        const newApptModal = document.getElementById('newAppointmentModal');
        if (newApptModal) newApptModal.classList.remove('active');
        const calendarModal = document.getElementById('calendarModal');
        if (calendarModal) calendarModal.classList.add('active');
        return;
    }

    // --- 8. Transición Nueva Cita -> MÉTODO DE PAGO ---
    if (target.closest('#btnProceedPay')) {
        const basePrice = reservaActual.precio || 500;

        if (document.getElementById('payServiceName')) document.getElementById('payServiceName').innerText = reservaActual.nombreServicio;
        if (document.getElementById('paySpecialist')) document.getElementById('paySpecialist').innerText = reservaActual.nombreEmpleado;
        if (document.getElementById('payDateTime')) document.getElementById('payDateTime').innerText = reservaActual.fecha;
        if (document.getElementById('paySubtotal')) document.getElementById('paySubtotal').innerText = `$${basePrice} MXN`;
        if (document.getElementById('payTotal')) document.getElementById('payTotal').innerText = `$${basePrice} MXN`;

        const newApptModal = document.getElementById('newAppointmentModal');
        if (newApptModal) newApptModal.classList.remove('active');
        const paymentModal = document.getElementById('paymentModal');
        if (paymentModal) paymentModal.classList.add('active');
        return;
    }

    // --- 9. Interactividad: Seleccionar Método de Pago ---
    if (target.closest('.payment-option')) {
        const option = target.closest('.payment-option');
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        const metodoText = option.querySelector('.payment-info strong') ? option.querySelector('.payment-info strong').innerText : 'Efectivo';
        reservaActual.metodoPago = metodoText;
        return;
    }

    // --- 10. Volver de Método de Pago -> Nueva Cita ---
    if (target.closest('#btnGoBackPayment')) {
        const paymentModal = document.getElementById('paymentModal');
        if (paymentModal) paymentModal.classList.remove('active');
        const newApptModal = document.getElementById('newAppointmentModal');
        if (newApptModal) newApptModal.classList.add('active');
        return;
    }

    // --- 11. Transición Final: Confirmar y Guardar en BD ---
    if (target.closest('#btnConfirmFinal')) {
        e.preventDefault();
        registrarCitaEnServidor();
        return;
    }

    // --- 12. Cerrar Modal de Confirmación ---
    if (target.closest('#confirmationModal') && target.closest('.btn-confirm')) {
        volverAlCatalogo();
        return;
    }
});

// ==========================================
// FUNCIÓN DE ENVÍO CON FETCH A ORACLE
// ==========================================
async function registrarCitaEnServidor() {
    const btnConfirmFinal = document.getElementById('btnConfirmFinal');
    if (btnConfirmFinal) {
        btnConfirmFinal.disabled = true;
        btnConfirmFinal.innerText = 'Procesando...';
    }

    const params = new URLSearchParams();
    params.append('idServicio', reservaActual.idServicio);
    params.append('idEmpleado', reservaActual.idEmpleado);
    params.append('fecha', reservaActual.fecha);
    params.append('hora', reservaActual.hora);
    params.append('monto', reservaActual.precio);
    params.append('duracion', reservaActual.duracion || '01:00:00');
    params.append('metodoPago', reservaActual.metodoPago);

    try {
        const response = await fetch(`${window.contextPath || ''}/agendarCitaServlet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: params.toString()
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            const paymentModal = document.getElementById('paymentModal');
            if (paymentModal) paymentModal.classList.remove('active');

            const confirmationModal = document.getElementById('confirmationModal');
            if (confirmationModal) confirmationModal.classList.add('active');
        } else {
            alert(`Error: ${data.message || 'No se pudo registrar la cita en Oracle'}`);
        }
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        alert('Ocurrió un error de red al intentar agendar la cita.');
    } finally {
        if (btnConfirmFinal) {
            btnConfirmFinal.disabled = false;
            btnConfirmFinal.innerText = 'Confirmar cita';
        }
    }
}