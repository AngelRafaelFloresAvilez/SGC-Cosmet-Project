let fotoBase64Nueva = null;

function abrirMenu() {
    const menu = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('menuOverlay');
    const menuBtn = document.querySelector('.menu-btn');
    if (menu) menu.classList.add('active');
    if (overlay) overlay.classList.add('active');
    if (menuBtn) menuBtn.classList.add('active');
}

function cerrarMenu() {
    const menu = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('menuOverlay');
    const menuBtn = document.querySelector('.menu-btn');
    if (menu) menu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (menuBtn) menuBtn.classList.remove('active');
}

function toggleMenu() {
    const menu = document.getElementById('sidebarMenu');
    if (menu && menu.classList.contains('active')) {
        cerrarMenu();
    } else {
        abrirMenu();
    }
}

function mostrarNotificaciones() {
    const panel = document.getElementById('notificationPanel');
    if (panel) panel.classList.toggle('active');
}

// ==========================================
// SISTEMA DE POPUP PERSONALIZADO
// ==========================================

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

// ==========================================
// PETICIÓN Y RENDERIZADO DE DATOS
// ==========================================

async function cargarDatosPerfil() {
    try {
        const context = window.contextPath || '';
        const url = `${context}/PerfilServlet?action=obtenerDatos`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Error ${response.status}: ${errText}`);
        }

        const data = await response.json();

        if (data.fotoPerfil && data.fotoPerfil.trim() !== '') {
            const imgAvatar = document.getElementById('profileAvatarImg');
            const imgSidebar = document.getElementById('sidebarProfileImg');
            if (imgAvatar) imgAvatar.src = data.fotoPerfil;
            if (imgSidebar) imgSidebar.src = data.fotoPerfil;
        }

        renderizarCitas(data.citas || []);
        renderizarPagos(data.pagos || []);

    } catch (error) {
        console.error("Error al cargar datos del perfil:", error);
        const historyContainer = document.getElementById('historyList');
        const paymentsContainer = document.getElementById('paymentsList');
        if (historyContainer) historyContainer.innerHTML = `<p style="color:#a00;">Error al obtener historial: ${error.message}</p>`;
        if (paymentsContainer) paymentsContainer.innerHTML = '<p style="color:#a00;">Error al consultar pagos.</p>';
    }
}

function renderizarCitas(citas) {
    const historyContainer = document.getElementById('historyList');
    const nextApptEl = document.getElementById('profileNextAppointment');
    const nextApptCompact = document.getElementById('profileNextAppointmentCompact');
    const cancelledCountEl = document.getElementById('profileCancelledCount');

    if (!historyContainer) return;
    historyContainer.innerHTML = '';

    if (citas.length === 0) {
        historyContainer.innerHTML = '<p style="color:#777;">No tienes citas registradas.</p>';
        if (nextApptEl) nextApptEl.innerText = 'Sin citas próximas';
        if (nextApptCompact) nextApptCompact.innerText = 'Sin reservas';
        if (cancelledCountEl) cancelledCountEl.innerText = '0';
        return;
    }

    let canceladas = 0;
    let proximaCita = null;

    citas.forEach(cita => {
        if ((cita.estadoCita || '').toLowerCase() === 'cancelada') {
            canceladas++;
        } else if (!proximaCita && ((cita.estadoCita || '').toLowerCase() === 'pendiente' || (cita.estadoCita || '').toLowerCase() === 'confirmada')) {
            proximaCita = cita;
        }

        const card = document.createElement('div');
        card.className = 'info-box';
        card.style.marginBottom = '10px';
        card.style.display = 'flex';
        card.style.justifyContent = 'space-between';
        card.style.alignItems = 'center';
        card.style.padding = '12px';
        card.style.borderRadius = '10px';
        card.style.background = '#F9F8F6';

        card.innerHTML = `
            <div>
                <strong style="display:block; color:#333;">${cita.nombreServicio || 'Tratamiento Estético'}</strong>
                <small style="color:#666;">${cita.fecha} - ${cita.hora}</small>
            </div>
            <div>
                <span class="mini-pill" style="margin-right:8px; background:${obtenerColorEstado(cita.estadoCita)}; color:#fff; padding:4px 8px; border-radius:6px; font-size:12px;">
                    ${cita.estadoCita}
                </span>
                <button class="btn-primary btn-ver-detalle" type="button" style="padding:4px 8px; border-radius:6px; font-size:12px;">
                    Ver
                </button>
            </div>
        `;

        card.querySelector('.btn-ver-detalle').addEventListener('click', () => abrirModalDetalle(cita));
        historyContainer.appendChild(card);
    });

    if (cancelledCountEl) cancelledCountEl.innerText = canceladas;

    if (proximaCita) {
        const txt = `${proximaCita.nombreServicio || 'Servicio'} - ${proximaCita.fecha} (${proximaCita.hora})`;
        if (nextApptEl) nextApptEl.innerText = txt;
        if (nextApptCompact) nextApptCompact.innerText = `${proximaCita.fecha}`;
    } else {
        if (nextApptEl) nextApptEl.innerText = 'Sin citas próximas';
        if (nextApptCompact) nextApptCompact.innerText = 'Sin reservas';
    }
}

function renderizarPagos(pagos) {
    const paymentsContainer = document.getElementById('paymentsList');
    if (!paymentsContainer) return;
    paymentsContainer.innerHTML = '';

    if (pagos.length === 0) {
        paymentsContainer.innerHTML = '<p style="color:#777;">No hay registros de pagos.</p>';
        return;
    }

    pagos.forEach(pago => {
        const item = document.createElement('div');
        item.style.padding = '10px 0';
        item.style.borderBottom = '1px solid #eee';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';

        item.innerHTML = `
            <div>
                <strong style="display:block; font-size:14px;">${pago.metodoPago}</strong>
                <small style="color:#888;">Estado: ${pago.estadoPago}</small>
            </div>
            <strong style="color:#526B4A;">$${pago.montoTotal} MXN</strong>
        `;
        paymentsContainer.appendChild(item);
    });
}

function obtenerColorEstado(estado) {
    switch ((estado || '').toLowerCase()) {
        case 'confirmada':
        case 'completado': return '#526B4A';
        case 'pendiente': return '#D9A74A';
        case 'cancelada': return '#A84848';
        default: return '#777777';
    }
}

function abrirModalDetalle(cita) {
    document.getElementById('modalServicioNombre').innerText = cita.nombreServicio || 'Detalle de Cita';
    document.getElementById('modalCitaFecha').innerText = cita.fecha || 'N/A';
    document.getElementById('modalCitaHora').innerText = cita.hora || 'N/A';
    document.getElementById('modalCitaEmpleado').innerText = cita.nombreEmpleado || 'Asignado en recepción';
    document.getElementById('modalCitaCosto').innerText = `$${cita.costoPactado || 0} MXN`;
    document.getElementById('modalCitaEstado').innerText = cita.estadoCita || 'Pendiente';

    const modal = document.getElementById('citaDetailModal');
    if (modal) modal.style.display = 'flex';
}

// ==========================================
// EDICIÓN Y SUBIDA DE FOTO A LA BD
// ==========================================

function configurarEdicionPerfil() {
    const editBtn = document.getElementById('editProfileBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const cancelBtn = document.getElementById('cancelProfileBtn');
    const avatarLabel = document.getElementById('avatarBadgeLabel');

    const inputNombre = document.getElementById('inputNombre');
    const headingNombre = document.getElementById('profileNameHeading');
    const inputsInfo = document.querySelectorAll('.profile-edit-input');
    const textsInfo = document.querySelectorAll('.profile-text-val');
    const nameDisplays = document.querySelectorAll('.profile-name-display');

    if (!editBtn || !saveBtn || !cancelBtn) return;

    editBtn.addEventListener('click', () => {
        if (headingNombre) headingNombre.style.display = 'none';
        if (inputNombre) inputNombre.style.display = 'block';

        textsInfo.forEach(el => el.style.display = 'none');
        inputsInfo.forEach(el => el.style.display = 'block');

        if (avatarLabel) avatarLabel.style.display = 'flex';

        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-flex';
        cancelBtn.style.display = 'inline-flex';

        if (inputNombre) inputNombre.focus();
    });

    cancelBtn.addEventListener('click', () => {
        if (headingNombre) headingNombre.style.display = 'block';
        if (inputNombre) inputNombre.style.display = 'none';

        inputsInfo.forEach(el => el.style.display = 'none');
        textsInfo.forEach(el => el.style.display = 'inline');

        if (avatarLabel) avatarLabel.style.display = 'none';

        editBtn.style.display = 'inline-flex';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';

        fotoBase64Nueva = null;
    });

    saveBtn.addEventListener('click', async () => {
        const nombre = inputNombre.value.trim();
        const correo = document.getElementById('inputCorreo').value.trim();
        const telefono = document.getElementById('inputTelefono').value.trim();
        const fechaNacimiento = document.getElementById('inputFechaNac').value;

        if (!nombre || !correo) {
            mostrarAlerta("Campos incompletos", "El nombre y el correo electrónico son obligatorios.", true);
            return;
        }

        try {
            const context = window.contextPath || '';
            const url = `${context}/PerfilServlet`;

            const params = new URLSearchParams();
            params.append('action', 'actualizarPerfil');
            params.append('nombre', nombre);
            params.append('correo', correo);
            params.append('telefono', telefono);
            params.append('fechaNacimiento', fechaNacimiento);

            if (fotoBase64Nueva) {
                params.append('fotoPerfil', fotoBase64Nueva);
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString()
            });

            if (!response.ok) {
                throw new Error(`Error en el servidor: ${response.status}`);
            }

            const resData = await response.json();

            if (resData.success) {
                if (headingNombre) {
                    headingNombre.innerText = nombre;
                    headingNombre.style.display = 'block';
                }
                nameDisplays.forEach(el => el.innerText = nombre);

                document.getElementById('textCorreo').innerText = correo || 'Sin registro';
                document.getElementById('textTelefono').innerText = telefono || 'Sin registro';
                document.getElementById('textFechaNac').innerText = fechaNacimiento || 'Sin registro';

                if (inputNombre) inputNombre.style.display = 'none';
                inputsInfo.forEach(el => el.style.display = 'none');
                textsInfo.forEach(el => el.style.display = 'inline');

                if (avatarLabel) avatarLabel.style.display = 'none';

                editBtn.style.display = 'inline-flex';
                saveBtn.style.display = 'none';
                cancelBtn.style.display = 'none';

                fotoBase64Nueva = null;
                mostrarAlerta("¡Perfil Actualizado!", "Tus datos han sido guardados correctamente.", false);
            } else {
                mostrarAlerta("Error al guardar", resData.error || 'No se pudo completar la actualización.', true);
            }

        } catch (err) {
            console.error("Error guardando perfil:", err);
            mostrarAlerta("Error del servidor", "Ocurrió un fallo de conexión al intentar guardar.", true);
        }
    });
}

function initPerfil() {
    const inputAvatar = document.getElementById('profileAvatarInput');
    const imgAvatar = document.getElementById('profileAvatarImg');
    const sidebarImg = document.getElementById('sidebarProfileImg');
    const menuBtn = document.querySelector('.menu-btn');
    const overlay = document.getElementById('menuOverlay');
    const notificationToggle = document.querySelector('[data-notification-toggle]');
    const closeDetailModalBtn = document.getElementById('closeDetailModal');
    const alertCloseBtn = document.getElementById('customAlertCloseBtn');

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', cerrarMenu);
    if (notificationToggle) notificationToggle.addEventListener('click', mostrarNotificaciones);
    if (alertCloseBtn) alertCloseBtn.addEventListener('click', cerrarAlerta);

    if (closeDetailModalBtn) {
        closeDetailModalBtn.addEventListener('click', () => {
            const modal = document.getElementById('citaDetailModal');
            if (modal) modal.style.display = 'none';
        });
    }

    if (inputAvatar) {
        inputAvatar.addEventListener('change', function () {
            const file = inputAvatar.files && inputAvatar.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) {
                fotoBase64Nueva = e.target.result;
                if (imgAvatar) imgAvatar.src = fotoBase64Nueva;
                if (sidebarImg) sidebarImg.src = fotoBase64Nueva;
            };
            reader.readAsDataURL(file);
        });
    }

    configurarEdicionPerfil();
    cargarDatosPerfil();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerfil);
} else {
    initPerfil();
}