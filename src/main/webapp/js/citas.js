let citaACancelarId = null;
let misCitas = [];
let estadoTabActual = 'pending';

// ==========================================
// 1. OBTENER DATOS DE LA BASE DE DATOS
// ==========================================

async function cargarCitasBD() {
    try {
        const context = window.contextPath || '';
        const url = `${context}/CitasServlet?action=obtenerCitas`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const citasBD = await response.json();

        // Normalizar la categoría de cada cita
        misCitas = citasBD.map(c => {
            const st = (c.estado || '').toLowerCase();
            let cat = 'pending';
            if (st === 'cancelada' || st === 'cancelled' || st === 'cancelado') {
                cat = 'cancelled';
            } else if (st === 'completada' || st === 'completado' || st === 'realizada' || st === 'previous') {
                cat = 'previous';
            }
            return { ...c, categoria: cat };
        });

        actualizarContadores();
        renderizarLista(estadoTabActual);

    } catch (error) {
        console.error('Error al cargar citas:', error);
        const contenedor = document.getElementById('appointmentsList');
        if (contenedor) {
            contenedor.innerHTML = '<div class="empty-state">Ocurrió un error al cargar tus citas.</div>';
        }
    }
}

// ==========================================
// 2. LÓGICA DE RENDERIZADO
// ==========================================

function actualizarContadores() {
    const pending = misCitas.filter(c => c.categoria === 'pending').length;
    const previous = misCitas.filter(c => c.categoria === 'previous').length;
    const cancelled = misCitas.filter(c => c.categoria === 'cancelled').length;

    document.getElementById('pendingCount').innerText = pending;
    document.getElementById('previousCount').innerText = previous;
    document.getElementById('cancelledSummaryCount').innerText = cancelled;
    document.getElementById('cancelledCount').innerText = cancelled;
}

function renderizarLista(estado) {
    estadoTabActual = estado;
    const contenedor = document.getElementById('appointmentsList');
    const detalle = document.getElementById('appointmentDetail');

    contenedor.innerHTML = '';
    detalle.innerHTML = 'Selecciona una cita para ver su información.';

    const citasFiltradas = misCitas.filter(cita => cita.categoria === estado);

    if (citasFiltradas.length === 0) {
        contenedor.innerHTML = '<div class="empty-state">No hay citas en esta categoría.</div>';
        return;
    }

    citasFiltradas.forEach(cita => {
        const item = document.createElement('div');
        item.className = 'appointment-item';
        item.setAttribute('data-id', cita.id);

        let badgeColor = estado === 'pending' ? '#e3f2fd' : (estado === 'previous' ? '#e8f5e9' : '#ffebee');
        let badgeText = estado === 'pending' ? 'Pendiente' : (estado === 'previous' ? 'Completada' : 'Cancelada');
        let badgeTextColor = estado === 'pending' ? '#1976d2' : (estado === 'previous' ? '#388e3c' : '#d32f2f');

        item.innerHTML = `
            <div class="appointment-item-head">
                <strong>${cita.servicio}</strong>
                <span class="appointment-badge" style="background:${badgeColor}; color:${badgeTextColor};">${badgeText}</span>
            </div>
            <div class="appointment-item-meta">
                <i class="fa-regular fa-calendar"></i> ${cita.fecha} | <i class="fa-regular fa-clock"></i> ${cita.hora}
            </div>
        `;

        contenedor.appendChild(item);
    });
}

function mostrarDetalleCita(idCita) {
    const cita = misCitas.find(c => c.id == idCita);
    if (!cita) return;

    const detalle = document.getElementById('appointmentDetail');

    const botonCancelar = cita.categoria === 'pending'
        ? `<button class="btn-cancel btn-abrir-modal-cancelar" data-id="${cita.id}"><i class="fa-solid fa-ban"></i> Cancelar Cita</button>`
        : '';

    detalle.innerHTML = `
        <div class="detail-card">
            <div class="detail-card-head">
                <h3>Detalles de la Cita</h3>
                <strong>ID: #${cita.id}</strong>
            </div>
            <div class="detail-grid">
                <div><span>Servicio:</span> <strong>${cita.servicio}</strong></div>
                <div><span>Fecha:</span> <strong>${cita.fecha}</strong></div>
                <div><span>Hora:</span> <strong>${cita.hora}</strong></div>
                <div><span>Precio estimado:</span> <strong style="color: var(--primary-green);">${cita.precio}</strong></div>
                <div><span>Estado:</span> <span style="text-transform: capitalize;">${cita.estado}</span></div>
            </div>
            <div style="text-align: right; margin-top: 15px;">
                ${botonCancelar}
            </div>
        </div>
    `;
}

// ==========================================
// 3. POPUPS Y MODALES
// ==========================================

function toggleMenu() {
    document.getElementById('sidebarMenu').classList.toggle('active');
    document.getElementById('menuOverlay').classList.toggle('active');
}

function abrirModalCancelar(idCita) {
    citaACancelarId = idCita;
    document.getElementById('cancelAppointmentModal').classList.add('active');
}

function cerrarModalCancelar() {
    citaACancelarId = null;
    document.getElementById('cancelAppointmentModal').classList.remove('active');
}

function mostrarAlerta(titulo, mensaje, esError = false) {
    const modal = document.getElementById('customAlertModal');
    const iconDiv = document.getElementById('customAlertIcon');
    const iconI = document.getElementById('customAlertIconI');
    const titleEl = document.getElementById('customAlertTitle');
    const msgEl = document.getElementById('customAlertMessage');

    if (!modal) {
        alert(mensaje);
        return;
    }

    if (esError) {
        iconDiv.className = 'custom-alert-icon error';
        iconI.className = 'fa-solid fa-triangle-exclamation';
    } else {
        iconDiv.className = 'custom-alert-icon success';
        iconI.className = 'fa-solid fa-check';
    }

    titleEl.innerText = titulo;
    msgEl.innerText = mensaje;
    modal.classList.add('active');
}

function cerrarAlerta() {
    const modal = document.getElementById('customAlertModal');
    if (modal) modal.classList.remove('active');
}

async function confirmarCancelacion() {
    if (!citaACancelarId) return;

    try {
        const context = window.contextPath || '';
        const url = `${context}/CitasServlet`;

        const params = new URLSearchParams();
        params.append('action', 'cancelarCita');
        params.append('id', citaACancelarId);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        const resData = await response.json();
        cerrarModalCancelar();

        if (resData.success) {
            mostrarAlerta("Cita Cancelada", "Tu cita ha sido cancelada correctamente.", false);
            cargarCitasBD();
        } else {
            mostrarAlerta("Error", resData.error || "No se pudo cancelar la cita.", true);
        }

    } catch (err) {
        console.error("Error al cancelar cita:", err);
        cerrarModalCancelar();
        mostrarAlerta("Error de Conexión", "Ocurrió un problema de comunicación con el servidor.", true);
    }
}

// ==========================================
// 4. EVENTOS Y ARRANQUE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    cargarCitasBD();

    const alertCloseBtn = document.getElementById('customAlertCloseBtn');
    if (alertCloseBtn) alertCloseBtn.addEventListener('click', cerrarAlerta);

    const notificationToggle = document.querySelector('[data-notification-toggle]');
    if (notificationToggle) {
        notificationToggle.addEventListener('click', () => {
            const panel = document.getElementById('notificationPanel');
            if (panel) panel.classList.toggle('active');
        });
    }
});

document.addEventListener('click', (e) => {
    const target = e.target;

    if (target.closest('.menu-btn') || target.closest('#menuOverlay')) {
        toggleMenu();
        return;
    }

    if (target.closest('.tab-btn')) {
        const tabBtn = target.closest('.tab-btn');
        const estado = tabBtn.getAttribute('data-status-tab');

        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        tabBtn.classList.add('active');

        renderizarLista(estado);
        return;
    }

    const itemCita = target.closest('.appointment-item');
    if (itemCita) {
        const idCita = itemCita.getAttribute('data-id');
        mostrarDetalleCita(idCita);
        return;
    }

    const btnCancelar = target.closest('.btn-abrir-modal-cancelar');
    if (btnCancelar) {
        const idCita = btnCancelar.getAttribute('data-id');
        abrirModalCancelar(idCita);
        return;
    }

    if (target.closest('.cancel-cancel-btn') || target.id === 'cancelAppointmentModal') {
        cerrarModalCancelar();
        return;
    }

    if (target.closest('.cancel-confirm-btn')) {
        confirmarCancelacion();
        return;
    }
});