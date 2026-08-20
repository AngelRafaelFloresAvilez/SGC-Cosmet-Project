// ==========================================
// ESTADO GLOBAL DE LA RESERVA Y RESEÑAS
// ==========================================
let reservaActual = {
    idServicio: 1,
    nombreServicio: '',
    precio: 0,
    duracion: '60 min',
    idEmpleado: 1,
    nombreEmpleado: 'Ana Torres',
    fecha: '2026-08-09',
    hora: '14:00:00',
    metodoPago: 'Efectivo'
};

let totalNotificaciones = 0;
let resenasActuales = [];

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
// SISTEMA DE NOTIFICACIONES (CON PERSISTENCIA LOCAL)
// ==========================================

function obtenerNotificacionesGuardadas() {
    try {
        return JSON.parse(localStorage.getItem('sgc_notificaciones')) || [];
    } catch (e) {
        return [];
    }
}

function guardarNotificacionEnStorage(titulo, mensaje) {
    const notis = obtenerNotificacionesGuardadas();
    notis.unshift({ titulo, mensaje, fecha: 'Justo ahora' });
    localStorage.setItem('sgc_notificaciones', JSON.stringify(notis.slice(0, 15)));
}

function cargarNotificacionesDeStorage() {
    const notis = obtenerNotificacionesGuardadas();
    const list = document.getElementById('notificationList');
    const badge = document.querySelector('.notification-badge');

    if (!list) return;

    if (notis.length === 0) {
        list.innerHTML = `<div class="notification-empty" style="padding: 24px; text-align: center; color: #888; font-size: 13px;">No tienes notificaciones pendientes</div>`;
        if (badge) badge.style.display = 'none';
        totalNotificaciones = 0;
        return;
    }

    list.innerHTML = '';
    notis.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'notification-item';
        itemEl.style.padding = '12px 16px';
        itemEl.style.borderBottom = '1px solid #f5f5f5';

        itemEl.innerHTML = `
            <div style="display:flex; align-items:flex-start; gap:10px;">
                <i class="fa-solid fa-circle-check" style="color: #4A5D4E; font-size:16px; margin-top:2px;"></i>
                <div style="flex:1;">
                    <strong style="display:block; font-size:13px; color:#2c3e50; margin-bottom:2px;">${item.titulo}</strong>
                    <span style="display:block; font-size:12px; color:#666; line-height:1.3;">${item.mensaje}</span>
                    <small style="display:block; font-size:10px; color:#999; margin-top:4px;">${item.fecha || 'Justo ahora'}</small>
                </div>
            </div>
        `;
        list.appendChild(itemEl);
    });

    totalNotificaciones = notis.length;
    if (badge) {
        badge.innerText = totalNotificaciones;
        badge.style.display = 'flex';
    }
}

function agregarNotificacion(titulo, mensaje) {
    guardarNotificacionEnStorage(titulo, mensaje);
    cargarNotificacionesDeStorage();
}

// ==========================================
// SISTEMA DE RESEÑAS (AJAX & COMPARTIMENTACIÓN POR SERVICIO)
// ==========================================

function renderizarCardResena(item) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
        estrellas += (i <= item.calificacion)
            ? '<i class="fa-solid fa-star" style="color:#f39c12; margin-right:2px;"></i>'
            : '<i class="fa-regular fa-star" style="color:#ccc; margin-right:2px;"></i>';
    }
    const inicial = item.nombreCliente ? item.nombreCliente.charAt(0).toUpperCase() : 'U';

    return `
        <div class="review-card" style="display:flex; gap:12px; margin-bottom:12px; padding:10px; background:#f9f9f9; border-radius:8px;">
            <div class="review-avatar" style="width:36px; height:36px; background:#5f6757; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold;">${inicial}</div>
            <div class="review-content" style="flex:1;">
                <h5 style="margin:0 0 4px 0; font-size:14px; color:#333;">${item.nombreCliente}</h5>
                <div class="review-stars" style="font-size:12px; margin-bottom:4px;">${estrellas}</div>
                <p class="review-text" style="margin:0; font-size:13px; color:#555; word-break:break-word;">${item.comentario || ''}</p>
            </div>
        </div>
    `;
}

function cargarResenas(serviceId) {
    const container = document.getElementById('reviewsListContainer');
    const ratingAvgText = document.getElementById('modalRatingAvg');
    const btnOpenAll = document.getElementById('btnOpenAllReviews');
    const totalCountEl = document.getElementById('totalReviewsCount');

    if (!container) return;
    container.innerHTML = '<div style="font-size:13px; color:#777;">Cargando reseñas...</div>';

    const basePath = window.contextPath || '';
    fetch(`${basePath}/obtenerResenas?idServicio=${serviceId}`)
        .then(res => res.json())
        .then(data => {
            resenasActuales = data || [];

            if (resenasActuales.length === 0) {
                container.innerHTML = '<p style="font-size:13px; color:#777; margin:10px 0;">Aún no hay reseñas para este servicio. ¡Sé el primero en calificar!</p>';
                if (ratingAvgText) ratingAvgText.textContent = '0.0 (0)';
                if (btnOpenAll) btnOpenAll.style.display = 'none';
                return;
            }

            let totalScore = 0;
            resenasActuales.forEach(r => totalScore += r.calificacion);
            const promedio = (totalScore / resenasActuales.length).toFixed(1);

            if (ratingAvgText) {
                ratingAvgText.textContent = `${promedio} (${resenasActuales.length} opiniones)`;
            }

            const limitePreview = resenasActuales.slice(0, 3);
            let htmlPreview = '';
            limitePreview.forEach(item => {
                htmlPreview += renderizarCardResena(item);
            });
            container.innerHTML = htmlPreview;

            if (btnOpenAll && totalCountEl) {
                totalCountEl.textContent = resenasActuales.length;
                btnOpenAll.style.display = (resenasActuales.length > 3) ? 'inline-block' : 'none';
            }
        })
        .catch(err => {
            console.error("Error al cargar reseñas:", err);
            container.innerHTML = '<p style="font-size:13px; color:red;">Error al cargar las reseñas.</p>';
        });
}

function mostrarTodasLasResenasModal() {
    const allContainer = document.getElementById('allReviewsListContainer');
    const modalTitle = document.getElementById('allReviewsModalTitle');
    const allModal = document.getElementById('allReviewsModal');

    if (!allContainer) return;

    if (modalTitle) modalTitle.textContent = `Reseñas: ${reservaActual.nombreServicio}`;

    let htmlFull = '';
    resenasActuales.forEach(item => {
        htmlFull += renderizarCardResena(item);
    });
    allContainer.innerHTML = htmlFull;

    if (allModal) {
        allModal.style.display = 'flex';
        allModal.classList.add('active');
    }
}

function setRating(val) {
    const reviewRatingInput = document.getElementById('reviewRating');
    if (reviewRatingInput) reviewRatingInput.value = val;

    const starBtns = document.querySelectorAll('#starRatingInput .star-btn');
    starBtns.forEach(star => {
        const starVal = parseInt(star.getAttribute('data-value'));
        star.style.color = (starVal <= val) ? '#f39c12' : '#ddd';
    });
}

// ==========================================
// FUNCIONES DE MODALES
// ==========================================

function cerrarModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) modal.classList.remove('active');
}

function abrirModal(titulo, categoria, desc, incluye, duracion, precio, img, idServicio) {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.dataset.serviceId = idServicio;
        modal.classList.add('active');
    }

    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.innerText = titulo;

    const descEl = document.getElementById('modalDesc');
    if (descEl) descEl.innerText = desc;

    const incContainer = document.getElementById('modalIncludes');
    if (incContainer) {
        incContainer.innerHTML = '';
        const items = incluye ? incluye.split(',') : [];
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

    if (idServicio) {
        cargarResenas(idServicio);
    }
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
    modals.forEach(m => {
        m.classList.remove('active');
        m.style.display = 'none';
    });
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Cargar notificaciones almacenadas
    cargarNotificacionesDeStorage();

    const catalogGrid = document.querySelector('.services-grid');
    if (catalogGrid) catalogGrid.style.gridTemplateColumns = 'repeat(3, minmax(210px, 1fr))';

    const reviewComment = document.getElementById('reviewComment');
    const charCount = document.getElementById('charCount');
    if (reviewComment && charCount) {
        reviewComment.addEventListener('input', function() {
            charCount.textContent = `${this.value.length} / 4000`;
        });
    }

    const formAddReview = document.getElementById('formAddReview');
    if (formAddReview) {
        formAddReview.addEventListener('submit', function(e) {
            e.preventDefault();

            const params = new URLSearchParams(new FormData(formAddReview));
            const basePath = window.contextPath || '';

            fetch(`${basePath}/guardarResena`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: params
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const addReviewModal = document.getElementById('addReviewModal');
                        if (addReviewModal) {
                            addReviewModal.style.display = 'none';
                            addReviewModal.classList.remove('active');
                        }
                        const serviceModal = document.getElementById('serviceModal');
                        const activeServiceId = serviceModal ? serviceModal.dataset.serviceId : null;
                        if (activeServiceId) cargarResenas(activeServiceId);
                    } else {
                        alert('Error: ' + data.message);
                    }
                })
                .catch(err => {
                    console.error("Error al guardar reseña:", err);
                    alert('No se pudo procesar la solicitud.');
                });
        });
    }
});

// ==========================================
// LISTENER GLOBAL DE EVENTOS
// ==========================================

document.addEventListener('click', (e) => {
    const target = e.target;
    const panel = document.getElementById('notificationPanel');

    if (target.closest('[data-notification-toggle]') || target.closest('.btn-notification')) {
        e.stopPropagation();
        if (panel) {
            panel.classList.toggle('active');
            if (panel.classList.contains('active')) {
                totalNotificaciones = 0;
                const badge = document.querySelector('.notification-badge');
                if (badge) badge.style.display = 'none';
            }
        }
        return;
    }

    if (panel && panel.classList.contains('active') && !target.closest('#notificationPanel')) {
        panel.classList.remove('active');
    }

    if (target.closest('.user-profile') || target.closest('.nav-profile-link') || target.closest('#sidebarUserAvatar')) {
        window.location.href = `${window.contextPath || ''}/PerfilServlet`;
        return;
    }

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

    // Tarjeta del catálogo -> Abrir detalles
    const card = target.closest('.service-card');
    if (card && (target.closest('.btn-book') || target === card || target.closest('.service-card'))) {
        e.stopPropagation();

        const cardServiceId = parseInt(card.dataset.id || '1');
        reservaActual.idServicio = cardServiceId;
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
            card.dataset.image || '',
            cardServiceId
        );
        return;
    }

    // Botón "Ver todas las reseñas"
    if (target.closest('#btnOpenAllReviews')) {
        e.stopPropagation();
        mostrarTodasLasResenasModal();
        return;
    }

    // Cerrar modal de todas las reseñas
    if (target.closest('#btnCloseAllReviews')) {
        const allModal = document.getElementById('allReviewsModal');
        if (allModal) {
            allModal.style.display = 'none';
            allModal.classList.remove('active');
        }
        return;
    }

    // Abrir "Añadir Reseña"
    if (target.closest('#btnOpenAddReview') || target.closest('#btnOpenAddReviewFromAll')) {
        e.stopPropagation();
        const serviceModal = document.getElementById('serviceModal');
        const activeServiceId = serviceModal ? serviceModal.dataset.serviceId : reservaActual.idServicio;

        if (!activeServiceId) {
            alert("No se pudo identificar el servicio activo.");
            return;
        }

        const reviewServiceIdInput = document.getElementById('reviewServiceId');
        const reviewComment = document.getElementById('reviewComment');
        const charCount = document.getElementById('charCount');
        const addReviewModal = document.getElementById('addReviewModal');

        if (reviewServiceIdInput) reviewServiceIdInput.value = activeServiceId;
        if (reviewComment) reviewComment.value = '';
        setRating(5);
        if (charCount) charCount.textContent = '0 / 4000';

        if (addReviewModal) {
            addReviewModal.style.display = 'flex';
            addReviewModal.classList.add('active');
        }
        return;
    }

    // Cerrar modal de añadir reseña
    if (target.closest('#btnCloseAddReview')) {
        const addReviewModal = document.getElementById('addReviewModal');
        if (addReviewModal) {
            addReviewModal.style.display = 'none';
            addReviewModal.classList.remove('active');
        }
        return;
    }

    // Selección de estrellas
    if (target.closest('#starRatingInput .star-btn')) {
        const star = target.closest('.star-btn');
        const val = parseInt(star.getAttribute('data-value'));
        setRating(val);
        return;
    }

    if (target.closest('#serviceModal') && e.target.id === 'serviceModal') { cerrarModal(); return; }
    if (target.closest('.modal-close') && !target.closest('.modal-back-calendar')) { cerrarModal(); return; }

    if (target.closest('.btn-agendar')) { abrirModalAgendamiento(); return; }
    if (target.closest('.modal-back-calendar')) { volverAModalServicio(); return; }

    if (target.closest('.mini-cal-date')) {
        const dateElement = target.closest('.mini-cal-date');
        document.querySelectorAll('.mini-cal-date').forEach(el => el.classList.remove('active'));
        dateElement.classList.add('active');

        const dayNumber = dateElement.innerText.padStart(2, '0');
        reservaActual.fecha = `2026-08-${dayNumber}`;
        return;
    }

    if (target.closest('#btnVerCatalogo')) {
        const calendarModal = document.getElementById('calendarModal');
        if (calendarModal) calendarModal.classList.remove('active');
        return;
    }

    const slotBlanco = target.closest('.slot-white');
    if (slotBlanco) {
        const timeText = slotBlanco.querySelector('strong') ? slotBlanco.querySelector('strong').innerText : '14:00 PM';
        const horaExacta = slotBlanco.getAttribute('data-hora') || '14:00:00';

        const selectEspecialista = document.querySelector('.specialist-select');
        const specialistText = selectEspecialista ? selectEspecialista.value : 'Ana Torres';

        reservaActual.hora = horaExacta;
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

    if (target.closest('#btnGoBackAppt')) {
        const newApptModal = document.getElementById('newAppointmentModal');
        if (newApptModal) newApptModal.classList.remove('active');
        const calendarModal = document.getElementById('calendarModal');
        if (calendarModal) calendarModal.classList.add('active');
        return;
    }

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

    if (target.closest('.payment-option')) {
        const option = target.closest('.payment-option');
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        const metodoText = option.querySelector('.payment-info strong') ? option.querySelector('.payment-info strong').innerText : 'Efectivo';
        reservaActual.metodoPago = metodoText;
        return;
    }

    if (target.closest('#btnGoBackPayment')) {
        const paymentModal = document.getElementById('paymentModal');
        if (paymentModal) paymentModal.classList.remove('active');
        const newApptModal = document.getElementById('newAppointmentModal');
        if (newApptModal) newApptModal.classList.add('active');
        return;
    }

    if (target.closest('#btnConfirmFinal')) {
        e.preventDefault();
        registrarCitaEnServidor();
        return;
    }

    if (target.closest('#confirmationModal') && target.closest('.btn-confirm')) {
        volverAlCatalogo();
        return;
    }
});

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
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: params.toString()
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            const paymentModal = document.getElementById('paymentModal');
            if (paymentModal) paymentModal.classList.remove('active');

            agregarNotificacion(
                '¡Cita Agendada con Éxito!',
                `Servicio: ${reservaActual.nombreServicio} el ${reservaActual.fecha} a las ${reservaActual.hora}.`
            );

            const confirmationModal = document.getElementById('confirmationModal');
            if (confirmationModal) confirmationModal.classList.add('active');
        } else {
            alert(`Error: ${data.message || 'No se pudo registrar la cita'}`);
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