<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.proyecto.sgccosmetproject.model.Usuario" %>
<%
    // LÓGICA JSP: Validar que la sesión exista, si no, redirigir al login
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
    <title>SGC COSMETIC - Panel Principal</title>

    <!-- Tipografías de Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">

    <!-- FontAwesome para los íconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Tu nuevo diseño CSS -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/stylesDashboard.css">
</head>
<body>

<!-- CAPA DE FONDO -->
<div class="menu-overlay" id="menuOverlay"></div>

<!-- MENÚ LATERAL -->
<aside class="sidebar-menu" id="sidebarMenu">
    <div class="sidebar-user-box">
        <div class="sidebar-user-avatar" id="sidebarUserAvatar">
            <i class="fa-solid fa-circle-user"></i>
        </div>
        <div class="sidebar-user-meta">
            <!-- JSP: Nombre dinámico del usuario que inició sesión -->
            <span class="sidebar-user-name"><%= usuarioActivo.getNombreCompleto() %></span>
            <!-- JSP: Rol dinámico -->
            <span class="sidebar-user-role">Rol ID: <%= usuarioActivo.getIdRol() %></span>
        </div>
    </div>

    <div class="sidebar-header">
        <hr class="sidebar-divider">
    </div>

    <div class="sidebar-section-label">General</div>

    <nav class="sidebar-nav">
        <a href="#" class="active"><i class="fa-solid fa-house"></i> Inicio</a>
        <!-- JSP: Rutas dinámicas correctas del backend -->
        <a href="${pageContext.request.contextPath}/catalogo"><i class="fa-solid fa-border-all"></i> Catálogo</a>
        <a href="${pageContext.request.contextPath}/CitasServlet"><i class="fa-regular fa-calendar-check"></i> Mis citas</a>
        <hr class="sidebar-divider">
        <a href="${pageContext.request.contextPath}/PerfilServlet" class="nav-profile-link"><i class="fa-regular fa-user"></i> Mi perfil</a>
    </nav>

    <!-- JSP: Ruta dinámica para cerrar sesión correctamente en el servidor -->
    <button class="sidebar-logout" type="button" onclick="window.location.href='${pageContext.request.contextPath}/logout'">
        <i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión
    </button>

    <hr class="sidebar-divider">
    <div class="sidebar-brand">SGC COSMETICS</div>
</aside>

<div class="main-wrapper">
    <div class="bg-curve-mask">
        <svg preserveAspectRatio="none" viewBox="0 0 100 100" style="width: 100%; height: 100%;">
            <path d="M0,0 L50,0 C42,40, 52,70, 75,100 L0,100 Z" fill="rgba(249, 251, 248, 0.8)" />
        </svg>
    </div>

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
                    <!-- JSP: Nombre y rol dinámicos para la esquina superior -->
                    <span class="user-name"><%= usuarioActivo.getNombreCompleto() %></span>
                    <span class="user-role">Rol ID: <%= usuarioActivo.getIdRol() %></span>
                </div>
            </div>
        </div>
    </header>

    <!-- Contenido principal -->
    <div class="content">

        <div class="hero-title">
            SGC<br>COSMETICS
        </div>

        <div class="title-divider"></div>

        <div class="hero-subtitle">
            Sistema de gestion de
            <p class="hero-subtitlee">
                servicios cosmetologicos
            </p>
        </div>

        <div class="hero-desc">
            Una plataforma integral para administrar, organizar y<br>hacer crecer tu negocio.
        </div>

        <div class="features-grid">
            <div class="feature-item">
                <div class="feature-icon"><i class="fa-regular fa-calendar-check"></i></div>
                <div class="feature-text">
                    <h4>Agenda inteligente</h4>
                    <p>Gestiona citas, recordatorios y<br>disponibilidad.</p>
                </div>
            </div>
            <div class="feature-item">
                <div class="feature-icon"><i class="fa-solid fa-user-group"></i></div>
                <div class="feature-text">
                    <h4>Gestion de usuarios</h4>
                    <p>Gestiona usuarios y <br> administra roles.</p>
                </div>
            </div>
            <div class="feature-item">
                <div class="feature-icon"><i class="fa-solid fa-cart-shopping"></i></div>
                <div class="feature-text">
                    <h4>Pagos protegidos</h4>
                    <p>Gestiona los pagos<br>en persona.</p>
                </div>
            </div>
            <div class="feature-item">
                <div class="feature-icon"><i class="fa-solid fa-chart-column"></i></div>
                <div class="feature-text">
                    <h4>Metricas</h4>
                    <p>Mostramos metricas <br>sobre datos reales.</p>
                </div>
            </div>
        </div>

        <div class="trust-banner">
            <div class="trust-item">
                <i class="fa-solid fa-shield-halved"></i>
                <div>
                    <h5>Seguro y confiable</h5>
                    <p>Protegemos la <br>información de tu negocio y clientes.</p>
                </div>
            </div>
            <div class="trust-item">
                <i class="fa-solid fa-cloud"></i>
                <div>
                    <h5>Accesible</h5>
                    <p>Ingresa desde cualquier<br>dispositivo.</p>
                </div>
            </div>
            <div class="trust-item">
                <i class="fa-solid fa-lock"></i>
                <div>
                    <h5>Respaldo</h5>
                    <p>Tu informacion segura <br>y respaldada.</p>
                </div>
            </div>
            <div class="trust-item">
                <i class="fa-solid fa-headset"></i>
                <div>
                    <h5>Soporte tecnico</h5>
                    <p>Estamos aqui para ayudarte siempre<br> que lo necesites</p>
                </div>
            </div>
        </div>

        <footer>
            <span>sgccosmetics@gmail.com</span>
            <span class="separator">|</span>
            <span>+ 52 22 9850 2428</span>
            <span class="separator">|</span>
            <!-- JSP: Ruta dinámica para que el logo siempre cargue en el servidor -->
            <img src="${pageContext.request.contextPath}/assets/img/ImagenLogotipo.png" alt="SGC Logo" class="footer-logo">
        </footer>

    </div>
</div>

<!-- Tus nuevos Scripts -->
<script>
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

    window.addEventListener('DOMContentLoaded', () => {
        const menuBtn = document.querySelector('.menu-btn');
        const overlay = document.getElementById('menuOverlay');

        if (menuBtn) {
            menuBtn.addEventListener('click', toggleMenu);
        }

        if (overlay) {
            overlay.addEventListener('click', cerrarMenu);
        }

        if (window.appointmentsSystem && typeof window.appointmentsSystem.init === 'function') {
            window.appointmentsSystem.init();
        }
    });
</script>
</body>
</html>