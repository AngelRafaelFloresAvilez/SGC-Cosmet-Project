<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.proyecto.sgccosmetproject.model.Usuario" %>
<%
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

    <!-- Google Fonts & FontAwesome -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        /* === BASE & LAYOUT === */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, html { width: 100%; height: 100%; font-family: 'Inter', sans-serif; overflow-x: hidden; background-color: #1a2a1a; }

        .main-wrapper {
            position: relative;
            min-height: 100vh;
            width: 100%;
            background: url('${pageContext.request.contextPath}/assets/img/ImagenFondoDashboard.jpeg') center/cover no-repeat;
        }

        .bg-curve-mask {
            position: absolute;
            inset: 0;
            z-index: 1;
            pointer-events: none;
        }

        /* === HEADER & ACTIONS === */
        header {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            padding: 25px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10;
        }

        .menu-btn {
            background: none;
            border: none;
            font-size: 28px;
            color: #1A1A1A;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .menu-btn:hover, .btn-notification:hover { transform: scale(1.1); }

        .header-actions { display: flex; align-items: center; gap: 20px; }

        .btn-notification {
            background: rgba(255, 255, 255, 0.6);
            border: none;
            font-size: 22px;
            color: #2C3527;
            cursor: pointer;
            position: relative;
            transition: transform 0.2s, background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            backdrop-filter: blur(5px);
        }
        .btn-notification:hover { background-color: rgba(255, 255, 255, 0.9); }

        .notification-badge {
            position: absolute;
            top: 8px;
            right: 10px;
            background-color: #C85A5A;
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }

        .notification-panel {
            position: absolute;
            top: 54px;
            right: 0;
            width: 320px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 16px 40px rgba(0,0,0,0.16);
            padding: 12px;
            display: none;
            z-index: 120;
        }
        .notification-panel.active { display: block; }
        .notification-item { padding: 12px; border-radius: 12px; background: #f8fbf7; margin-bottom: 8px; }
        .notification-item.unread { border-left: 4px solid #526B4A; }
        .notification-title { font-weight: 700; color: #2c3527; margin-bottom: 4px; }
        .notification-message { font-size: 0.9rem; color: #5f6757; margin-bottom: 6px; }
        .notification-meta { font-size: 0.75rem; color: #8a957e; }

        .user-profile {
            display: flex;
            align-items: center;
            gap: 12px;
            background-color: rgba(255, 255, 255, 0.9);
            padding: 8px 18px;
            border-radius: 30px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        }
        .user-profile:hover {
            background-color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
        }
        .user-avatar { font-size: 1.6rem; color: #526B4A; }
        .user-name { font-size: 0.9rem; font-weight: 600; color: #2C3527; }

        /* === BOTONES & SIDEBAR === */
        .btn-logout-green {
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 14px;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            background-color: #526B4A;
            color: #FFFFFF;
            border: none;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
        }
        .btn-logout-green:hover { background-color: #3e5237; }

        .menu-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(3px);
            z-index: 99;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .menu-overlay.active { opacity: 1; visibility: visible; }

        .sidebar-menu {
            position: fixed;
            top: 0;
            left: -320px;
            width: 300px;
            height: 100vh;
            background-color: #F4F7F2;
            color: #2C3527;
            z-index: 100;
            display: flex;
            flex-direction: column;
            padding: 30px 25px;
            box-shadow: 5px 0 25px rgba(0,0,0,0.15);
            transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sidebar-menu.active { left: 0; }

        .sidebar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            padding-bottom: 20px;
        }
        .sidebar-header h3 { font-family: 'Playfair Display', serif; font-size: 1.4rem; letter-spacing: 1px; }

        .close-btn {
            background: none;
            border: none;
            color: #2C3527;
            font-size: 1.5rem;
            cursor: pointer;
            transition: transform 0.2s, color 0.2s;
        }
        .close-btn:hover { color: #526B4A; transform: scale(1.1); }

        .sidebar-profile {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 25px 0 15px 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            margin-bottom: 20px;
        }
        .sidebar-profile img {
            width: 75px;
            height: 75px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #B2D296;
            margin-bottom: 12px;
        }
        .sidebar-profile h4 { font-size: 1.1rem; font-weight: 700; color: #2C3527; margin-bottom: 4px; }
        .sidebar-profile p { font-size: 0.85rem; color: #666; line-height: 1.4; }

        .sidebar-nav { display: flex; flex-direction: column; gap: 10px; flex-grow: 1; }
        .sidebar-nav a {
            display: flex;
            align-items: center;
            gap: 15px;
            color: #3A4E32;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 600;
            padding: 12px 16px;
            border-radius: 8px;
            transition: all 0.2s ease;
        }
        .sidebar-nav a i { font-size: 1.1rem; width: 20px; text-align: center; color: #526B4A; }
        .sidebar-nav a:hover, .sidebar-nav a.active { background-color: #E2ECE0; color: #1A2A1A; transform: translateX(5px); }

        .sidebar-footer { border-top: 1px solid rgba(0, 0, 0, 0.08); padding-top: 20px; margin-top: auto; }

        /* === CONTENIDO PRINCIPAL === */
        .content {
            position: relative;
            z-index: 2;
            width: 52%;
            padding: 12vh 0 30px 60px;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        .hero-title {
            font-family: 'Playfair Display', serif;
            font-size: 4.5rem;
            color: #2C3527;
            line-height: 1.1;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }

        .title-divider { width: 50px; height: 4px; background-color: #6C8C56; margin-bottom: 25px; }
        .hero-subtitle { font-size: 1.4rem; color: #3A4E32; font-weight: 700; margin-bottom: 15px; line-height: 1.3; }
        .hero-desc { font-size: 0.95rem; color: #555; line-height: 1.5; margin-bottom: 50px; max-width: 85%; }

        .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 35px 20px; margin-bottom: 50px; max-width: 95%; }
        .feature-item { display: flex; align-items: center; gap: 15px; }
        .feature-icon {
            width: 55px;
            height: 55px;
            background-color: #B2D296;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.4rem;
            color: #3A4E32;
            flex-shrink: 0;
            box-shadow: 0 4px 10px rgba(0,0,0,0.06);
        }
        .feature-text h4 { font-size: 0.95rem; color: #2C3527; margin-bottom: 4px; }
        .feature-text p { font-size: 0.8rem; color: #666; line-height: 1.3; }

        .trust-banner {
            background: linear-gradient(to right, #BFE19D, #ADD485);
            border-radius: 12px;
            padding: 15px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 95%;
            margin-bottom: 40px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        .trust-item { flex: 1; display: flex; align-items: center; gap: 10px; padding: 0 10px; border-right: 1px solid rgba(0,0,0,0.1); }
        .trust-item:last-child { border-right: none; }
        .trust-item i { font-size: 1.3rem; color: #2C3527; }
        .trust-item h5 { font-size: 0.75rem; color: #1A1A1A; margin-bottom: 2px; }
        .trust-item p { font-size: 0.65rem; color: #333; line-height: 1.2; }

        footer {
            margin-top: auto;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.75rem;
            color: #333;
            max-width: 95%;
            flex-wrap: wrap;
        }
        .footer-logo { width: 25px; height: 25px; border-radius: 50%; object-fit: cover; mix-blend-mode: multiply; }
        .separator { color: #999; }
        footer i { font-size: 1.1rem; color: #333; cursor: pointer; }
    </style>
</head>
<body>

<!-- OVERLAY & SIDEBAR -->
<div class="menu-overlay" id="menuOverlay" onclick="cerrarMenu()"></div>

<aside class="sidebar-menu" id="sidebarMenu">
    <div class="sidebar-header">
        <h3>SGC COSMETIC</h3>
        <button class="close-btn" onclick="cerrarMenu()"><i class="fa-solid fa-xmark"></i></button>
    </div>

    <div class="sidebar-profile">
        <img src="https://i.pravatar.cc/150?img=47" alt="Foto de perfil">
        <h4><%= usuarioActivo.getNombreCompleto() %></h4>
        <p>Rol ID: <%= usuarioActivo.getIdRol() %><br>Estado: <%= usuarioActivo.getEstadoVeto() %></p>
    </div>

    <nav class="sidebar-nav">
        <a href="#" class="active" onclick="cerrarMenu()"><i class="fa-solid fa-house"></i> Inicio</a>
        <a href="${pageContext.request.contextPath}/catalogo"><i class="fa-solid fa-border-all"></i> Catálogo</a>
        <a href="${pageContext.request.contextPath}/CitasServlet"><i class="fa-regular fa-calendar-check"></i> Citas</a>
        <a href="${pageContext.request.contextPath}/PerfilServlet"><i class="fa-regular fa-user"></i> Perfil</a>
    </nav>

    <div class="sidebar-footer">
        <button class="btn-logout-green" onclick="window.location.href='${pageContext.request.contextPath}/logout'">
            <i class="fa-solid fa-right-from-bracket"></i> CERRAR SESIÓN
        </button>
    </div>
</aside>

<!-- MAIN WRAPPER -->
<div class="main-wrapper">
    <div class="bg-curve-mask">
        <svg preserveAspectRatio="none" viewBox="0 0 100 100" style="width: 100%; height: 100%;">
            <path d="M0,0 L50,0 C42,40, 52,70, 75,100 L0,100 Z" fill="rgba(249, 251, 248, 0.96)" />
        </svg>
    </div>

    <header>
        <button class="menu-btn" onclick="abrirMenu()"><i class="fa-solid fa-bars"></i></button>

        <div class="header-actions">
            <div style="position:relative;">
                <button class="btn-notification" type="button" onclick="mostrarNotificaciones()">
                    <i class="fa-regular fa-bell"></i>
                    <span class="notification-badge" hidden></span>
                </button>
                <div class="notification-panel" id="notificationPanel">
                    <div id="notificationList"></div>
                </div>
            </div>

            <div class="user-profile" onclick="window.location.href='${pageContext.request.contextPath}/PerfilServlet'">
                <i class="fa-solid fa-circle-user user-avatar"></i>
                <span class="user-name"><%= usuarioActivo.getNombreCompleto() %></span>
            </div>
        </div>
    </header>

    <!-- MAIN CONTENT -->
    <div class="content">
        <div class="hero-title">SGC<br>COSMETIC</div>
        <div class="title-divider"></div>
        <div class="hero-subtitle">Sistema de gestion de<br>servicios cosmetologicos</div>
        <div class="hero-desc">Una plataforma integral para administrar, organizar y<br>hacer crecer tu negocio.</div>

        <div class="features-grid">
            <div class="feature-item">
                <div class="feature-icon"><i class="fa-regular fa-calendar-check"></i></div>
                <div class="feature-text">
                    <h4>Agenda inteligente</h4>
                    <p>Gestiona citas, recordatorios y disponibilidad en tiempo real</p>
                </div>
            </div>
            <div class="feature-item">
                <div class="feature-icon"><i class="fa-solid fa-user-group"></i></div>
                <div class="feature-text">
                    <h4>Control de Clientes</h4>
                    <p>Historiales clínicos y seguimiento personalizado al instante.</p>
                </div>
            </div>
            <div class="feature-item">
                <div class="feature-icon"><i class="fa-solid fa-cart-shopping"></i></div>
                <div class="feature-text">
                    <h4>Inventario y Ventas</h4>
                    <p>Control exacto de tus productos y tratamientos cosméticos.</p>
                </div>
            </div>
            <div class="feature-item">
                <div class="feature-icon"><i class="fa-solid fa-chart-column"></i></div>
                <div class="feature-text">
                    <h4>Reportes Financieros</h4>
                    <p>Visualiza tus ganancias y métricas de crecimiento con claridad.</p>
                </div>
            </div>
        </div>

        <div class="trust-banner">
            <div class="trust-item">
                <i class="fa-solid fa-shield-halved"></i>
                <div>
                    <h5>Seguro y confiable</h5>
                    <p>Protegemos la info de tu negocio y clientes.</p>
                </div>
            </div>
            <div class="trust-item">
                <i class="fa-solid fa-cloud"></i>
                <div>
                    <h5>Desde cualquier lugar</h5>
                    <p>Ingresa desde cualquier dispositivo.</p>
                </div>
            </div>
            <div class="trust-item">
                <i class="fa-solid fa-lock"></i>
                <div>
                    <h5>Respaldo Automático</h5>
                    <p>Tu información siempre guardada y respaldada en la nube.</p>
                </div>
            </div>
            <div class="trust-item">
                <i class="fa-solid fa-headset"></i>
                <div>
                    <h5>Soporte técnico</h5>
                    <p>Estamos aquí para ayudarte siempre que lo necesites.</p>
                </div>
            </div>
        </div>

        <footer>
            <span>contacto:sgccosmetic@gmail.com</span>
            <span class="separator">|</span>
            <span>+ 52 567 850 4567</span>
            <span class="separator">|</span>
            <i class="fa-brands fa-facebook"></i>
            <i class="fa-brands fa-instagram"></i>
            <img src="${pageContext.request.contextPath}/assets/img/ImagenLogotipo.png" alt="SGC Logo" class="footer-logo">
            <span>@sgccosmetic</span>
        </footer>
    </div>
</div>

<!-- SCRIPTS -->
<script src="appointments-system.js"></script>
<script>
    function abrirMenu() {
        document.getElementById('sidebarMenu').classList.add('active');
        document.getElementById('menuOverlay').classList.add('active');
    }

    function cerrarMenu() {
        document.getElementById('sidebarMenu').classList.remove('active');
        document.getElementById('menuOverlay').classList.remove('active');
    }

    function mostrarNotificaciones() {
        const panel = document.getElementById('notificationPanel');
        if (panel) panel.classList.toggle('active');
    }

    window.addEventListener('DOMContentLoaded', () => {
        if (window.appointmentsSystem) {
            window.appointmentsSystem.init();
        }
    });
</script>
</body>
</html>