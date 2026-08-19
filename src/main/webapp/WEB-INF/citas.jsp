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
    <title>SGC COSMETIC - Gestión de Citas</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <script src="${pageContext.request.contextPath}/js/citas.js"></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/stylesCitas.css">

    <!-- Configuración de Context Path para JavaScript -->
    <script>
        window.contextPath = '${pageContext.request.contextPath}';
    </script>

</head>
<body>
<!-- OVERLAY MENÚ LATERAL -->
<div class="menu-overlay" id="menuOverlay"></div>

<!-- MENÚ LATERAL -->
<aside class="sidebar-menu" id="sidebarMenu">
    <div class="sidebar-user-box">
        <div class="sidebar-user-avatar" id="sidebarUserAvatar">
            <i class="fa-solid fa-circle-user"></i>
        </div>
        <div class="sidebar-user-meta">
            <!-- JSP: Nombre y Rol dinámicos -->
            <span class="sidebar-user-name"><%= usuarioActivo.getNombreCompleto() %></span>
            <span class="sidebar-user-role">Rol ID: <%= usuarioActivo.getIdRol() %></span>
        </div>
    </div>

    <div class="sidebar-header">
        <hr class="sidebar-divider">
    </div>

    <div class="sidebar-section-label">General</div>

    <nav class="sidebar-nav">
        <!-- JSP: Rutas dinámicas al servidor -->
        <a href="${pageContext.request.contextPath}/dashboardServlet"><i class="fa-solid fa-house"></i> Inicio</a>
        <a href="${pageContext.request.contextPath}/catalogoServlet"><i class="fa-solid fa-border-all"></i> Catálogo</a>
        <a href="${pageContext.request.contextPath}/CitasServlet" class="active"><i class="fa-regular fa-calendar-check"></i> Mis citas</a>
        <hr class="sidebar-divider">
        <a href="${pageContext.request.contextPath}/PerfilServlet" class="nav-profile-link"><i class="fa-regular fa-user"></i> Mi perfil</a>
    </nav>

    <!-- JSP: Ruta de cierre de sesión seguro -->
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

        <div class="user-profile" onclick="window.location.href='${pageContext.request.contextPath}/PerfilServlet';">
            <div class="user-avatar" aria-label="Avatar del cliente">
                <i class="fa-solid fa-circle-user"></i>
            </div>
            <div class="user-meta">
                <!-- JSP: Nombre y Rol dinámicos en el Header -->
                <span class="user-name"><%= usuarioActivo.getNombreCompleto() %></span>
                <span class="user-role">Rol ID: <%= usuarioActivo.getIdRol() %></span>
            </div>
        </div>
    </div>
</header>

<main class="catalog-container">
    <div class="catalog-header">
        <div class="hero-texts">
            <!-- JSP: Saludo dinámico con el nombre del usuario -->
            <div class="text-hello">Bienvenida de nuevo, <%= usuarioActivo.getNombreCompleto() %></div>
            <div class="text-catalog">Gestión de citas</div>
            <div class="text-desc">Consulta tus reservas, revisa el historial y mantén el control de tus próximas citas con un estilo consistente con el catálogo.</div>
        </div>
    </div>

    <div class="catalog-content">
        <section class="appointments-panel">
            <div class="stats-grid">
                <div class="stat-card"><span>Pendientes</span><strong id="pendingCount">0</strong></div>
                <div class="stat-card"><span>Anteriores</span><strong id="previousCount">0</strong></div>
                <div class="stat-card"><span>Canceladas</span><strong id="cancelledSummaryCount">0</strong></div>
            </div>

            <div class="tabs">
                <button class="tab-btn active" data-status-tab="pending">Pendientes</button>
                <button class="tab-btn" data-status-tab="previous">Anteriores</button>
                <button class="tab-btn" data-status-tab="cancelled">Canceladas</button>
            </div>

            <div class="panel-layout">
                <div class="list-panel">
                    <div id="appointmentsList"></div>
                </div>
                <div class="detail-panel">
                    <div id="appointmentDetail">Selecciona una cita para ver su información.</div>
                </div>
            </div>

            <div class="stat-card" id="cancelledSummaryCard" style="margin-top:16px;"><span>Cancelaciones acumuladas</span><strong id="cancelledCount">0</strong></div>
        </section>
    </div>
</main>
</div>

<!-- Modal Cancelar Cita -->
<div class="modal-backdrop" id="cancelAppointmentModal">
    <div class="modal-card">
        <h3>Cancelar cita</h3>
        <p>¿Deseas cancelar esta cita? Esta acción contará como una falta y aparecerá en tu historial.</p>
        <div class="modal-actions">
            <button class="btn-secondary cancel-cancel-btn">No, mantener</button>
            <button class="btn-primary cancel-confirm-btn">Sí, cancelar</button>
        </div>
    </div>
</div>

<script src="citas.js"></script>
</body>
</html>