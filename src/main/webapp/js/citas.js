// Variable global para almacenar qué cita se quiere cancelar
let citaACancelarId = null;

// ==========================================
// 1. DATOS DE PRUEBA (Mock Data)
// ==========================================
// NOTA: Cuando tu backend esté listo, reemplazaremos esto con un fetch() a tu CitasServlet
let misCitas = [
    { id: 101, servicio: "Limpieza Facial Profunda", fecha: "25 de Agosto, 2026", hora: "10:00 AM", precio: "$450.00 MXN", estado: "pending" },
    { id: 102, servicio: "Masaje Relajante", fecha: "28 de Agosto, 2026", hora: "04:00 PM", precio: "$600.00 MXN", estado: "pending" },
    { id: 103, servicio: "Manicura y Pedicura", fecha: "10 de Agosto, 2026", hora: "12:00 PM", precio: "$350.00 MXN", estado: "previous" },
    { id: 104, servicio: "Corte y Estilo", fecha: "05 de Agosto, 2026", hora: "02:00 PM", precio: "$250.00 MXN", estado: "cancelled" }
];

// ==========================================
// 2. LÓGICA DE RENDERIZADO
// ==========================================

function actualizarContadores() {
    const pending = misCitas.filter(c => c.estado === 'pending').length;
    const previous = misCitas.filter(c => c.estado === 'previous').length;
    const cancelled = misCitas.filter(c => c.estado === 'cancelled').length;

    document.getElementById('pendingCount').innerText = pending;
    document.getElementById('previousCount').innerText = previous;
    document.getElementById('cancelledSummaryCount').innerText = cancelled;
    document.getElementById('cancelledCount').innerText = cancelled;
}

function renderizarLista(estado) {
    const contenedor = document.getElementById('appointmentsList');
    const detalle = document.getElementById('appointmentDetail');

    // Limpiar contenedor
    contenedor.innerHTML = '';
    detalle.innerHTML = 'Selecciona una cita para ver su información.';

    // Filtrar citas por el estado seleccionado en el tab
    const citasFiltradas = misCitas.filter(cita => cita.estado === estado);

    if (citasFiltradas.length === 0) {
        contenedor.innerHTML = '<div class="empty-state">No hay citas en esta categoría.</div>';
        return;
    }

    // Crear HTML para cada cita
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

    // Botón de cancelar solo si está pendiente
    const botonCancelar = cita.estado === 'pending'
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
// 3. FUNCIONES DE MODALES Y MENÚ
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

function confirmarCancelacion() {
    if (!citaACancelarId) return;

    // REDIRECCIÓN AL SERVLET PARA CANCELAR
    // Cambia "/cancelar-cita" por el mapeo real de tu Servlet (ej. /CancelarCitaServlet)
    window.location.href = (window.contextPath || '') + '/cancelar-cita?id=' + citaACancelarId;
}

// ==========================================
// 4. DELEGACIÓN DE EVENTOS Y ARRANQUE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la vista con las citas pendientes
    actualizarContadores();
    renderizarLista('pending');
});

document.addEventListener('click', (e) => {
    const target = e.target;

    // Menú
    if (target.closest('.menu-btn') || target.closest('#menuOverlay')) {
        toggleMenu();
        return;
    }

    // Tabs (Pestañas Pendientes / Anteriores / Canceladas)
    if (target.closest('.tab-btn')) {
        const tabBtn = target.closest('.tab-btn');
        const estado = tabBtn.getAttribute('data-status-tab');

        // Cambiar clase activa en botones
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        tabBtn.classList.add('active');

        // Renderizar lista correspondiente
        renderizarLista(estado);
        return;
    }

    // Clic en una cita de la lista para ver el detalle
    const itemCita = target.closest('.appointment-item');
    if (itemCita) {
        const idCita = itemCita.getAttribute('data-id');
        mostrarDetalleCita(idCita);
        return;
    }

    // Clic en el botón "Cancelar Cita" dentro del detalle
    const btnCancelar = target.closest('.btn-abrir-modal-cancelar');
    if (btnCancelar) {
        const idCita = btnCancelar.getAttribute('data-id');
        abrirModalCancelar(idCita);
        return;
    }

    // Clics en el Modal de Cancelación
    if (target.closest('.cancel-cancel-btn') || target.id === 'cancelAppointmentModal') {
        cerrarModalCancelar();
        return;
    }
    if (target.closest('.cancel-confirm-btn')) {
        confirmarCancelacion();
        return;
    }
});