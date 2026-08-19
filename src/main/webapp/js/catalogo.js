function abrirMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('menuOverlay');

    if (sidebar) sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    if (menuBtn) menuBtn.classList.add('active');
}

function cerrarMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('menuOverlay');

    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (menuBtn) menuBtn.classList.remove('active');
}

function mostrarNotificaciones() {
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.classList.toggle('active');
    }
}

function abrirModal(titulo, categoria, desc, incluye, duracion, precio, img) {
    // Validaciones de seguridad: Solo actualizamos si el elemento existe en el HTML
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.innerText = titulo;

    const catEl = document.getElementById('modalCategory');
    if (catEl) catEl.innerText = categoria; // Este elemento ya no está en el nuevo diseño, pero no romperá el código

    const descEl = document.getElementById('modalDesc');
    if (descEl) descEl.innerText = desc;

    const incEl = document.getElementById('modalIncludes');
    if (incEl) incEl.innerText = incluye;

    const durEl = document.getElementById('modalDuration');
    if (durEl) durEl.innerText = duracion;

    const priceEl = document.getElementById('modalPrice');
    if (priceEl) priceEl.innerText = precio;

    const imgEl = document.getElementById('modalImg');
    if (imgEl) imgEl.src = img;

    const modal = document.getElementById('serviceModal');
    if (modal) modal.classList.add('active');
}

function cambiarCatalogo(direction) {
    const cards = Array.from(document.querySelectorAll('.service-card'));
    if (!cards.length) return;

    const pageSize = 6;
    const total = cards.length;
    let startIndex = Number(document.body.dataset.catalogStart || 0);

    startIndex = (startIndex + (direction === 'next' ? pageSize : -pageSize) + total) % total;
    document.body.dataset.catalogStart = String(startIndex);

    const visibleIndexes = new Set();
    for (let i = 0; i < Math.min(pageSize, total); i += 1) {
        visibleIndexes.add((startIndex + i) % total);
    }

    cards.forEach((card, index) => {
        card.classList.toggle('hidden-card', !visibleIndexes.has(index));
    });
}

function cerrarModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) modal.classList.remove('active');
}

function cerrarModalFuera(event) {
    if (event.target.id === 'serviceModal') {
        cerrarModal();
    }
}

function abrirModalAgendamiento() {
    const titleEl = document.getElementById('modalTitle');
    const priceEl = document.getElementById('modalPrice');

    const titulo = titleEl ? titleEl.innerText : 'Servicio';
    const precio = priceEl ? priceEl.innerText : '$0 MXN';

    const bookingNameEl = document.getElementById('bookingServiceName');
    if (bookingNameEl) bookingNameEl.innerText = titulo;

    const bookingPriceEl = document.getElementById('bookingPrice');
    if (bookingPriceEl) bookingPriceEl.innerText = precio;

    try {
        const select = document.getElementById('bookingPromotionSelect');
        if (select && window.appointmentsSystem && typeof window.appointmentsSystem.readState === 'function') {
            const state = window.appointmentsSystem.readState();
            select.innerHTML = '<option value="">-- Selecciona una promoción (opcional) --</option>' +
                (state.promotions || []).map((p) => `<option value="${p.id}">${p.title}</option>`).join('');
            select.onchange = function () {
                const val = select.value;
                if (window.appointmentsSystem && typeof window.appointmentsSystem.applyPromotion === 'function') {
                    window.appointmentsSystem.applyPromotion(val || null);
                }
                try {
                    const selPromo = (state.promotions || []).find((pp) => pp.id === val);
                    if (selPromo && /(%)/.test(selPromo.title)) {
                        const match = String(selPromo.title).match(/(\d+)%/);
                        if (match) {
                            const pct = Number(match[1]);
                            const num = Number(String(precio).replace(/[^0-9.,]/g, '').replace(/,/g, '.')) || 0;
                            const computed = Math.round((num * (1 - pct / 100)) * 100) / 100;
                            if (bookingPriceEl) bookingPriceEl.innerText = `$${computed} MXN`;
                            return;
                        }
                    }
                    if (bookingPriceEl) bookingPriceEl.innerText = precio;
                } catch (e) {
                    if (bookingPriceEl) bookingPriceEl.innerText = precio;
                }
            };
        }
    } catch (e) {
        /* ignore */
    }

    cerrarModal();
    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal) bookingModal.classList.add('active');
}

function volverAModalServicio() {
    const bookingModal = document.getElementById('bookingModal');
    const serviceModal = document.getElementById('serviceModal');

    if (bookingModal) bookingModal.classList.remove('active');
    if (serviceModal) serviceModal.classList.add('active');
}

function cerrarBookingFuera(event) {
    if (event.target.id === 'bookingModal') {
        const bookingModal = document.getElementById('bookingModal');
        if (bookingModal) bookingModal.classList.remove('active');
    }
}

function seleccionarBoton(elemento, clase) {
    const botones = document.getElementsByClassName(clase);
    for (let i = 0; i < botones.length; i += 1) {
        botones[i].classList.remove('active');
    }
    elemento.classList.add('active');
}

function confirmarCita() {
    const bookingModal = document.getElementById('bookingModal');
    const confirmationModal = document.getElementById('confirmationModal');

    if (bookingModal) bookingModal.classList.remove('active');
    if (confirmationModal) confirmationModal.classList.add('active');
}

function cerrarConfirmationFuera(event) {
    if (event.target.id === 'confirmationModal') {
        const confirmationModal = document.getElementById('confirmationModal');
        if (confirmationModal) confirmationModal.classList.remove('active');
    }
}

function volverAlCatalogo() {
    const confirmationModal = document.getElementById('confirmationModal');
    if (confirmationModal) confirmationModal.classList.remove('active');

    // CORRECCIÓN: Usamos window.contextPath para redirigir al Servlet del catálogo
    window.location.href = (window.contextPath || '') + '/catalogoServlet';
}

window.addEventListener('DOMContentLoaded', () => {
    if (window.appointmentsSystem && typeof window.appointmentsSystem.init === 'function') {
        window.appointmentsSystem.init();
    }

    const catalogGrid = document.querySelector('.services-grid');
    if (catalogGrid) {
        catalogGrid.style.gridTemplateColumns = 'repeat(3, minmax(210px, 1fr))';
    }

    const cards = document.querySelectorAll('.service-card');
    if (cards.length) {
        document.body.dataset.catalogStart = '0';
        const pageSize = 6;
        const total = cards.length;
        const visibleIndexes = new Set();
        for (let i = 0; i < Math.min(pageSize, total); i += 1) {
            visibleIndexes.add(i);
        }
        cards.forEach((card, index) => {
            card.classList.toggle('hidden-card', !visibleIndexes.has(index));
        });
    }
});

// Delegated event handlers to replace inline `onclick` attributes
document.addEventListener('click', (e) => {
    const target = e.target;

    // Sidebar overlay and close
    if (target.closest('#menuOverlay') || target.closest('.close-btn')) {
        cerrarMenu();
        return;
    }

    // Open menu
    if (target.closest('.menu-btn')) {
        abrirMenu();
        return;
    }

    // Navegación del Catálogo
    if (target.closest('.catalog-nav-btn')) {
        const btn = target.closest('.catalog-nav-btn');
        cambiarCatalogo(btn.dataset.direction || 'next');
        return;
    }

    // Cerrar sesión
    if (target.closest('.btn-logout-green') || target.closest('.sidebar-logout')) {
        window.location.href = (window.contextPath || '') + '/logout';
        return;
    }

    // Abrir Modal de Servicio (Ver Detalles)
    const card = target.closest('.service-card');
    if (card && (target.closest('.btn-book') || target === card || target.closest('.service-card'))) {
        e.stopPropagation();

        // Extracción segura de datos
        const title = card.dataset.title || (card.querySelector('.service-title') ? card.querySelector('.service-title').innerText : '');
        const category = card.dataset.category || (card.querySelector('.service-label') ? card.querySelector('.service-label').innerText : '');
        const desc = card.dataset.desc || (card.querySelector('.service-desc') ? card.querySelector('.service-desc').innerText : '');
        const includes = card.dataset.includes || '';
        const duration = card.dataset.duration || '';
        const price = card.dataset.price || (card.querySelector('.service-price') ? card.querySelector('.service-price').innerText : '');
        const img = card.dataset.image || (card.querySelector('.service-img') ? card.querySelector('.service-img').src : '');

        abrirModal(title, category, desc, includes, duration, price, img);
        return;
    }

    // Cerrar Modal de Servicio
    if (target.closest('#serviceModal')) {
        const modal = document.getElementById('serviceModal');
        if (e.target === modal) cerrarModal();
    }

    if (target.closest('.modal-close') && !target.closest('.modal-back')) {
        cerrarModal();
        // Si el click fue en un botón de cerrar genérico, intentamos cerrar todos los modales por si acaso
        const modals = document.querySelectorAll('.modal-backdrop');
        modals.forEach(m => m.classList.remove('active'));
        return;
    }

    // Botón "Agendar cita" dentro del modal de servicio
    if (target.closest('.btn-agendar')) {
        abrirModalAgendamiento();
        return;
    }

    // Cerrar Modal de Reserva al hacer click afuera
    if (target.closest('#bookingModal')) {
        const booking = document.getElementById('bookingModal');
        if (e.target === booking) {
            booking.classList.remove('active');
        }
    }

    // Regresar al Modal de Servicio desde Reserva
    if (target.closest('.modal-back')) {
        volverAModalServicio();
        return;
    }

    // Lógica dentro del Modal de Reserva (Fechas y horas)
    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal && bookingModal.contains(target)) {
        const dateBtn = target.closest('.date-btn');
        if (dateBtn) {
            seleccionarBoton(dateBtn, 'date-btn');
            return;
        }
        const timeBtn = target.closest('.time-btn');
        if (timeBtn) {
            seleccionarBoton(timeBtn, 'time-btn');
            return;
        }

        const payBtn = target.closest('.btn-pay');
        if (payBtn) {
            const serviceName = document.getElementById('bookingServiceName') ? document.getElementById('bookingServiceName').innerText : 'Servicio';
            const price = document.getElementById('bookingPrice') ? document.getElementById('bookingPrice').innerText : '';
            const selectedDateBtn = bookingModal.querySelector('.date-btn.active');
            const selectedTimeBtn = bookingModal.querySelector('.time-btn.active');

            const date = selectedDateBtn
                ? `${selectedDateBtn.querySelector('.day') ? selectedDateBtn.querySelector('.day').innerText : ''} ${selectedDateBtn.querySelector('.num') ? selectedDateBtn.querySelector('.num').innerText : ''}`.trim()
                : '';
            const time = selectedTimeBtn ? selectedTimeBtn.textContent.trim() : '';

            const result = window.appointmentsSystem && typeof window.appointmentsSystem.createAppointment === 'function'
                ? window.appointmentsSystem.createAppointment(serviceName, price, date, time)
                : { allowed: false, reason: 'missing_system' };

            function showSiteAlert(message, type) {
                console.log(`[${type.toUpperCase()}] ${message}`);
            }

            confirmarCita();
            return;
        }
    }

    // Acciones del modal de confirmación
    if (target.closest('#confirmationModal') && target.closest('.btn-confirm')) {
        volverAlCatalogo();
        return;
    }
});