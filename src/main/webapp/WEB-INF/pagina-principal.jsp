<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SGC COSMETIC</title>

    <!-- Tipografías de Google Fonts: Playfair Display para títulos, Inter para el cuerpo -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">

    <!-- FontAwesome para los íconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        /* === ESTILOS BASE === */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body, html {
            width: 100%;
            height: 100%;
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
            background-color: #1a2a1a;
        }

        /* === CONTENEDOR PRINCIPAL Y FONDO === */
        .main-wrapper {
            position: relative;
            min-height: 100vh;
            width: 100%;
            /* Se adapta la ruta usando la raíz del contexto web */
            background-image: url('${pageContext.request.contextPath}/assets/img/ImagenFondoDashboard.jpeg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }

        /* Curva blanca en SVG */
        .bg-curve-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }

        /* === ENCABEZADO (HEADER) === */
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

        .menu-btn:hover {
            transform: scale(1.1);
        }

        .auth-buttons {
            display: flex;
            gap: 15px;
        }

        .btn {
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 14px;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-login {
            background-color: #526B4A;
            color: #FFFFFF;
            border: none;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .btn-login:hover {
            background-color: #3e5237;
        }

        .btn-register {
            background-color: #FFFFFF;
            color: #526B4A;
            border: none;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .btn-register:hover {
            background-color: #f0f0f0;
        }

        /* === 🌟 ESTILOS MENÚ LATERAL (SIDEBAR MÁS CLARO) 🌟 === */
        .menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(3px);
            z-index: 99;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .menu-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .sidebar-menu {
            position: fixed;
            top: 0;
            left: -320px;
            width: 300px;
            height: 100vh;
            background-color: #F4F7F2; /* Tono claro, suave e higiénico */
            color: #2C3527;
            z-index: 100;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 30px 25px;
            box-shadow: 5px 0 25px rgba(0,0,0,0.15);
            transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-menu.active {
            left: 0;
        }

        .sidebar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            padding-bottom: 20px;
        }

        .sidebar-header h3 {
            font-family: 'Playfair Display', serif;
            font-size: 1.4rem;
            color: #2C3527;
            letter-spacing: 1px;
        }

        .close-btn {
            background: none;
            border: none;
            color: #2C3527;
            font-size: 1.5rem;
            cursor: pointer;
            transition: transform 0.2s, color 0.2s;
        }

        .close-btn:hover {
            color: #526B4A;
            transform: scale(1.1);
        }

        .sidebar-nav {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 25px;
            flex-grow: 1;
        }

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

        .sidebar-nav a i {
            font-size: 1.1rem;
            width: 20px;
            text-align: center;
            color: #526B4A;
        }

        .sidebar-nav a:hover, .sidebar-nav a.active {
            background-color: #E2ECE0;
            color: #1A2A1A;
            transform: translateX(5px);
        }

        .sidebar-footer {
            display: flex;
            flex-direction: column;
            gap: 12px;
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            padding-top: 20px;
        }

        .w-100 {
            width: 100%;
            text-align: center;
        }

        /* === CONTENIDO IZQUIERDO === */
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

        .title-divider {
            width: 50px;
            height: 4px;
            background-color: #6C8C56;
            margin-bottom: 25px;
        }

        .hero-subtitle {
            font-size: 1.4rem;
            color: #3A4E32;
            font-weight: 700;
            margin-bottom: 15px;
            line-height: 1.3;
        }

        .hero-desc {
            font-size: 0.95rem;
            color: #555;
            line-height: 1.5;
            margin-bottom: 50px;
            max-width: 85%;
        }

        /* === CUADRÍCULA DE CARACTERÍSTICAS === */
        .features-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 35px 20px;
            margin-bottom: 50px;
            max-width: 95%;
        }

        .feature-item {
            display: flex;
            align-items: center;
            gap: 15px;
        }

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

        .feature-text h4 {
            font-size: 0.95rem;
            color: #2C3527;
            margin-bottom: 4px;
        }

        .feature-text p {
            font-size: 0.8rem;
            color: #666;
            line-height: 1.3;
        }

        /* === BANNER DE CONFIANZA === */
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

        .trust-item {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0 10px;
            border-right: 1px solid rgba(0,0,0,0.1);
        }

        .trust-item:last-child {
            border-right: none;
        }

        .trust-item i {
            font-size: 1.3rem;
            color: #2C3527;
        }

        .trust-item h5 {
            font-size: 0.75rem;
            color: #1A1A1A;
            margin-bottom: 2px;
        }

        .trust-item p {
            font-size: 0.65rem;
            color: #333;
            line-height: 1.2;
        }

        /* === FOOTER === */
        .footer-logo {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            object-fit: cover;
            mix-blend-mode: multiply;
        }

        .separator {
            color: #999;
        }

        footer i {
            font-size: 1.1rem;
            color: #333;
            cursor: pointer;
        }
    </style>
</head>
<body>

<!-- CAPA DE FONDO (OVERLAY) -->
<div class="menu-overlay" id="menuOverlay" onclick="cerrarMenu()"></div>

<!-- MENÚ LATERAL (SIDEBAR REVISADO) -->
<aside class="sidebar-menu" id="sidebarMenu">
    <div class="sidebar-header">
        <h3>SGC COSMETIC</h3>
        <button class="close-btn" onclick="cerrarMenu()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <!-- Opciones de navegación redirigiendo a la pantalla de login -->
    <nav class="sidebar-nav">
        <a href="#" class="active" onclick="cerrarMenu()"><i class="fa-solid fa-house"></i> Inicio</a>
        <a href="${pageContext.request.contextPath}/login"><i class="fa-solid fa-border-all"></i> Catálogo</a>
        <a href="${pageContext.request.contextPath}/login"><i class="fa-regular fa-calendar-check"></i> Citas</a>
        <a href="${pageContext.request.contextPath}/login"><i class="fa-regular fa-user"></i> Perfil</a>
    </nav>

    <div class="sidebar-footer">
        <button class="btn btn-login w-100" onclick="window.location.href='${pageContext.request.contextPath}/login'">INICIAR SESIÓN</button>
        <button class="btn btn-register w-100" onclick="window.location.href='${pageContext.request.contextPath}/register'">REGISTRARSE</button>
    </div>
</aside>

<div class="main-wrapper">
    <div class="bg-curve-mask">
        <svg preserveAspectRatio="none" viewBox="0 0 100 100" style="width: 100%; height: 100%;">
            <path d="M0,0 L50,0 C42,40, 52,70, 75,100 L0,100 Z" fill="rgba(249, 251, 248, 0.96)" />
        </svg>
    </div>

    <!-- Header -->
    <header>
        <button class="menu-btn" onclick="abrirMenu()">
            <i class="fa-solid fa-bars"></i>
        </button>
        <div class="auth-buttons">
            <button class="btn btn-login" onclick="window.location.href='${pageContext.request.contextPath}/login'">INICIAR SESIÓN</button>
            <button class="btn btn-register" onclick="window.location.href='${pageContext.request.contextPath}/register'">REGISTRARSE</button>
        </div>
    </header>

    <!-- Contenido principal -->
    <div class="content">

        <div class="hero-title">
            SGC<br>COSMETIC
        </div>

        <div class="title-divider"></div>

        <div class="hero-subtitle">
            Sistema de gestion de<br>servicios cosmetologicos
        </div>

        <div class="hero-desc">
            Una plataforma integral para administrar, organizar y<br>hacer crecer tu negocio.
        </div>

        <!-- Grid de Características -->
        <div class="features-grid">
            <div class="feature-item">
                <div class="feature-icon"><i class="fa-regular fa-calendar-check"></i></div>
                <div class="feature-text">
                    <h4>Agenda inteligente</h4>
                    <p>Gestiona citas, recordatorios y<br>disponibilidad en tiempo real</p>
                </div>
            </div>
            <div class="feature-item">
                <div class="feature-icon"><i class="fa-solid fa-user-group"></i></div>
                <div class="feature-text">
                    <h4>Gestión de clientes</h4>
                    <p>Historial estético, fichas técnicas y<br>seguimiento personalizado</p>
                </div>
            </div>
            <div class="feature-item">
                <div class="feature-icon"><i class="fa-solid fa-cart-shopping"></i></div>
                <div class="feature-text">
                    <h4>Control de Inventario</h4>
                    <p>Productos de cabina, stock y<br>ventas directas</p>
                </div>
            </div>
            <div class="feature-item">
                <div class="feature-icon"><i class="fa-solid fa-chart-column"></i></div>
                <div class="feature-text">
                    <h4>Reportes y Métricas</h4>
                    <p>Analiza ingresos, servicios populares y<br>rendimiento del negocio</p>
                </div>
            </div>
        </div>

        <!-- Banner Verde Inferior -->
        <div class="trust-banner">
            <div class="trust-item">
                <i class="fa-solid fa-shield-halved"></i>
                <div>
                    <h5>Seguro y confiable</h5>
                    <p>Protegemos la info de tu<br>negocio y clientes.</p>
                </div>
            </div>
            <div class="trust-item">
                <i class="fa-solid fa-cloud"></i>
                <div>
                    <h5>Desde cualquier lugar</h5>
                    <p>Ingresa desde cualquier<br>dispositivo.</p>
                </div>
            </div>
            <div class="trust-item">
                <i class="fa-solid fa-lock"></i>
                <div>
                    <h5>Respaldo Automatico</h5>
                    <p>Tu informacion siempre<br>guardada y respaldada.</p>
                </div>
            </div>
            <div class="trust-item">
                <i class="fa-solid fa-headset"></i>
                <div>
                    <h5>Soporte técnico</h5>
                    <p>Estamos aqui para ayudarte<br>siempre que lo necesites</p>
                </div>
            </div>
        </div>

        <!-- Footer -->
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

<!-- JAVASCRIPT -->
<script>
    function abrirMenu() {
        document.getElementById('sidebarMenu').classList.add('active');
        document.getElementById('menuOverlay').classList.add('active');
    }

    function cerrarMenu() {
        document.getElementById('sidebarMenu').classList.remove('active');
        document.getElementById('menuOverlay').classList.remove('active');
    }
</script>
</body>
</html>