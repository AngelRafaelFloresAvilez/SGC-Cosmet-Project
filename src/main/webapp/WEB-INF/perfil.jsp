<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.proyecto.sgccosmetproject.model.Usuario" %>
<%
    // LÓGICA JSP: Validar la sesión directamente al renderizar la vista
    Usuario usuarioActivo = (Usuario) session.getAttribute("usuarioSesion");
    if (usuarioActivo == null) {
        response.sendRedirect(request.getContextPath() + "/login");
        return;
    }
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil - SGC Cosmetic</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <script src="${pageContext.request.contextPath}/js/perfil.js"></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/stylesPerfil.css">

</head>
<body>
<div class="main-wrapper">
<div class="menu-overlay" id="menuOverlay"></div>

<aside class="sidebar-menu" id="sidebarMenu">
    <div class="sidebar-user-box">
        <div class="sidebar-user-avatar" id="sidebarUserAvatar">
            <img id="sidebarProfileImg" src="${pageContext.request.contextPath}/assets/img/default-avatar.png" alt="Avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover; display:none;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <i class="fa-solid fa-circle-user"></i>
        </div>
        <div class="sidebar-user-meta">
            <span class="sidebar-user-name"><%= usuarioActivo.getNombreCompleto() %></span>
            <span class="sidebar-user-role">Rol ID: <%= usuarioActivo.getIdRol() %></span>
        </div>
    </div>

    <div class="sidebar-header">
        <hr class="sidebar-divider">
    </div>

    <div class="sidebar-section-label">General</div>

    <nav class="sidebar-nav">
        <a href="${pageContext.request.contextPath}/dashboard"><i class="fa-solid fa-house"></i> Inicio</a>
        <a href="${pageContext.request.contextPath}/catalogo"><i class="fa-solid fa-border-all"></i> Catálogo</a>
        <a href="${pageContext.request.contextPath}/CitasServlet"><i class="fa-regular fa-calendar-check"></i> Mis citas</a>
        <hr class="sidebar-divider">
        <a href="${pageContext.request.contextPath}/PerfilServlet" class="nav-profile-link active"><i class="fa-regular fa-user"></i> Mi perfil</a>
    </nav>

    <button class="sidebar-logout" type="button" onclick="window.location.href='${pageContext.request.contextPath}/logout'">
        <i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión
    </button>

    <hr class="sidebar-divider">
    <div class="sidebar-brand">SGC COSMETICS</div>
</aside>

<header>
    <button class="menu-btn">
        <i class="fa-solid fa-bars"></i>
    </button>

    <div class="header-actions">
        <div style="position:relative;">
            <button class="btn-notification" type="button" data-notification-toggle>
                <i class="fa-regular fa-bell"></i>
                <span class="notification-badge"></span>
            </button>
            <div class="notification-panel" id="notificationPanel">
                <div id="notificationList"></div>
            </div>
        </div>

        <div class="user-profile">
            <div class="user-avatar" aria-label="Avatar del cliente">
                <i class="fa-solid fa-circle-user"></i>
            </div>
            <div class="user-meta">
                <span class="user-name"><%= usuarioActivo.getNombreCompleto() %></span>
                <span class="user-role">Rol ID: <%= usuarioActivo.getIdRol() %></span>
            </div>
        </div>
    </div>
</header>

<main class="profile-shell">
    <section class="profile-hero">
        <div class="hero-card">
            <div class="profile-top">
                <div style="position:relative">
                    <img id="profileAvatarImg" class="profile-avatar" src="https://www.gravatar.com/avatar/?d=mp&s=150" alt="<%= usuarioActivo.getNombreCompleto() %>">
                    <input id="profileAvatarInput" type="file" accept="image/*" title="Cambiar foto de perfil" style="position:absolute;right:6px;bottom:6px;opacity:0;width:40px;height:40px;cursor:pointer">
                </div>
                <div class="profile-meta">
                    <h2 class="profile-name"><%= usuarioActivo.getNombreCompleto() %></h2>
                    <p class="profile-role">Rol ID: <%= usuarioActivo.getIdRol() %></p>

                    <div class="profile-status-pill ${usuarioSesion.estadoVeto != 'Normal' ? 'alert' : ''}">
                        <i class="fa-solid ${usuarioSesion.estadoVeto == 'Normal' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
                        <span class="profile-status">${not empty usuarioSesion.estadoVeto ? usuarioSesion.estadoVeto : 'Normal'}</span>
                    </div>
                </div>
            </div>
            <p class="profile-status-message">Tu acceso sigue activo y puedes seguir disfrutando de tratamientos y promociones.</p>

            <div class="profile-grid">
                <div class="info-box">
                    <label>Correo</label>
                    <span class="profile-email">${not empty usuarioSesion.correo ? usuarioSesion.correo : 'Sin registro'}</span>
                </div>
                <div class="info-box">
                    <label>Teléfono</label>
                    <span class="profile-phone">${not empty usuarioSesion.telefono ? usuarioSesion.telefono : 'Sin registro'}</span>
                </div>
                <div class="info-box">
                    <label>Fecha de nacimiento</label>
                    <span class="profile-birth">${not empty usuarioSesion.fechaNacimiento ? usuarioSesion.fechaNacimiento : 'Sin registro'}</span>
                </div>
                <div class="info-box">
                    <label>Estado de la Cuenta</label>
                    <span class="profile-member">${not empty usuarioSesion.estadoVeto ? usuarioSesion.estadoVeto : 'Activo'}</span>
                </div>
            </div>

            <div class="profile-summary">
                <div>
                    <strong>Próxima cita</strong>
                    <p id="profileNextAppointment">Sin citas próximas</p>
                </div>
                <div class="mini-pill"><i class="fa-regular fa-calendar-check"></i> Estado activo</div>
            </div>

            <div style="margin-top:12px; display:flex; gap:8px;">
                <button id="editProfileBtn" class="btn-primary" style="width:auto; padding:8px 12px; border-radius:10px;">Editar perfil</button>
                <button id="saveProfileBtn" class="btn-primary" style="width:auto; padding:8px 12px; border-radius:10px; display:none; background:#6ea57a;">Guardar</button>
                <button id="cancelProfileBtn" class="btn-register" style="width:auto; padding:8px 12px; border-radius:10px; display:none;">Cancelar</button>
            </div>
        </div>

        <div class="side-card">
            <h3>Resumen de tu experiencia</h3>
            <div class="stat-card" id="cancelledSummaryCard">
                <span>Cancelaciones acumuladas</span>
                <strong id="profileCancelledCount">0</strong>
            </div>
            <div class="stat-card">
                <span>Próxima reserva</span>
                <strong id="profileNextAppointmentCompact">Sin reservas</strong>
            </div>
            <div class="stat-card">
                <span>Promoción activa</span>
                <div id="activePromotionBox" style="margin-top: 8px;"></div>
            </div>
            <button id="restoreAccessBtn" type="button" style="margin-top: 12px; width: 100%; border: none; border-radius: 999px; padding: 10px 12px; background: #526B4A; color: #fff; font-weight: 700; cursor: pointer;">Quitar cancelaciones y recuperar acceso</button>
        </div>
    </section>

    <section class="profile-hero" style="margin-top: 24px;">
        <div class="hero-card">
            <h3 style="margin-bottom: 14px;">Historial de citas</h3>
            <div id="historyList"></div>
        </div>
        <div class="side-card">
            <h3>Pagos y promociones</h3>
            <div id="paymentsList" style="margin-bottom: 18px;"></div>
            <div id="promotionsList"></div>
        </div>
    </section>
</main>

<script>
    window.contextPath = '${pageContext.request.contextPath}';
</script>
<script>
    (function () {
        const input = document.getElementById('profileAvatarInput');
        const img = document.getElementById('profileAvatarImg');
        const sidebarImg = document.getElementById('sidebarProfileImg');

        function updateImgs(url) {
            if (img) img.src = url;
            if (sidebarImg) {
                sidebarImg.src = url;
                sidebarImg.style.display = 'block';
                sidebarImg.nextElementSibling.style.display = 'none'; // Oculta el ícono
            }
        }

        if (input) {
            input.addEventListener('change', function () {
                const file = input.files && input.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = function (e) {
                    const dataUrl = e.target.result;
                    updateImgs(dataUrl);
                    if (window.appointmentsSystem && typeof window.appointmentsSystem.setProfileAvatar === 'function') {
                        window.appointmentsSystem.setProfileAvatar(dataUrl);
                    }
                };
                reader.readAsDataURL(file);
            });
        }

        // Escuchar actualizaciones externas de estado
        window.addEventListener('sgc-state-updated', function () {
            try {
                const state = window.appointmentsSystem && window.appointmentsSystem.readState ? window.appointmentsSystem.readState() : null;
                if (state && state.profile && state.profile.avatar) {
                    updateImgs(state.profile.avatar);
                }
            } catch (e) { /* capturar de forma silenciosa */ }
        });
    })();
</script>
</div>
</body>
</html>