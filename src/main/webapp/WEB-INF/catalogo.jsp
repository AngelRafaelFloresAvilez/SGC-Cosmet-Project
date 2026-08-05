<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.proyecto.sgccosmetproject.model.Usuario" %>
<%
    // Validar la sesión directamente al renderizar la vista
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
    <title>SGC COSMETIC - Catálogo y Pagos</title>

    <!-- Tipografías de Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- FontAwesome para los íconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        /* === ESTILOS BASE Y VARIABLES === */
        :root {
            --primary-dark: #1A2A1A;
            --primary-green: #526B4A;
            --primary-hover: #3E5237;
            --accent-green: #B2D296;
            --bg-light: #F4F7F2;
            --card-bg: #FFFFFF;
            --text-main: #2C3527;
            --text-muted: #666666;
            --border-color: rgba(0, 0, 0, 0.08);
            --shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.12);
            --shadow-card: 0 6px 20px rgba(0, 0, 0, 0.06);
            --transition-smooth: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body, html {
            width: 100%;
            height: 100%;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
            background-color: var(--primary-dark);
            -webkit-font-smoothing: antialiased;
        }

        /* === FONDO PRINCIPAL COBERTURA TOTAL === */
        .main-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
            background-image: url('${pageContext.request.contextPath}/assets/img/ImagenFondoDashboard.jpeg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .bg-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, rgba(26, 42, 26, 0.65) 0%, rgba(10, 15, 10, 0.8) 100%);
            z-index: 1;
        }

        /* === ENCABEZADO (HEADER) === */
        header {
            position: relative;
            width: 100%;
            padding: 24px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10;
        }

        .menu-btn {
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.2);
            font-size: 22px;
            color: #FFFFFF;
            cursor: pointer;
            width: 46px;
            height: 46px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(8px);
            transition: var(--transition-smooth);
        }

        .menu-btn:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: scale(1.05);
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .btn-notification {
            background: rgba(255, 255, 255, 0.95);
            border: none;
            font-size: 18px;
            color: var(--text-main);
            cursor: pointer;
            position: relative;
            transition: var(--transition-smooth);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 46px;
            height: 46px;
            border-radius: 50%;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        .btn-notification:hover {
            transform: translateY(-2px);
            background: #ffffff;
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        .notification-panel {
            position: absolute;
            top: 58px;
            right: 0;
            width: 320px;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
            padding: 12px;
            display: none;
            z-index: 130;
        }

        .notification-panel.active { display: block; }
        .notification-item { padding: 12px; border-radius: 12px; background: #f8fbf7; margin-bottom: 8px; }
        .notification-item.unread { border-left: 4px solid var(--primary-green); }
        .notification-title { font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
        .notification-message { font-size: 0.9rem; color: #5f6757; margin-bottom: 6px; }
        .notification-meta { font-size: 0.75rem; color: #8a957e; }
        .empty-state { padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.95rem; }

        .notification-badge {
            position: absolute;
            top: 11px; right: 12px;
            background-color: #D97777;
            width: 9px; height: 9px;
            border-radius: 50%;
            border: 2px solid #fff;
        }

        .user-profile {
            display: flex;
            align-items: center;
            gap: 12px;
            background-color: rgba(255, 255, 255, 0.95);
            padding: 8px 18px 8px 10px;
            border-radius: 35px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            transition: var(--transition-smooth);
        }

        .user-profile:hover {
            background-color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .user-avatar {
            font-size: 2.1rem;
            color: var(--primary-green);
            line-height: 1;
        }
        .user-text {
            display: flex;
            flex-direction: column;
            text-align: left;
        }
        .user-role {
            font-size: 0.7rem;
            color: var(--text-muted);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .user-name {
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--text-main);
        }

        /* === MENÚ LATERAL === */
        .menu-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
            background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px);
            z-index: 99; opacity: 0; visibility: hidden; transition: var(--transition-smooth);
        }
        .menu-overlay.active { opacity: 1; visibility: visible; }

        .sidebar-menu {
            position: fixed; top: 0; left: -320px; width: 300px; height: 100vh;
            background-color: var(--bg-light); color: var(--text-main); z-index: 100;
            display: flex; flex-direction: column; padding: 30px 25px;
            box-shadow: 10px 0 30px rgba(0,0,0,0.25); transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sidebar-menu.active { left: 0; }

        .sidebar-header {
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid var(--border-color); padding-bottom: 20px;
        }
        .sidebar-header h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700; color: var(--text-main); letter-spacing: 0.5px; }

        .close-btn {
            background: rgba(0,0,0,0.05); border: none; color: var(--text-main);
            width: 32px; height: 32px; border-radius: 50%;
            font-size: 1rem; cursor: pointer; transition: var(--transition-smooth);
            display: flex; align-items: center; justify-content: center;
        }
        .close-btn:hover { background: rgba(0,0,0,0.1); transform: scale(1.1); }

        .sidebar-profile {
            display: flex; flex-direction: column; align-items: center; text-align: center;
            padding: 25px 0 20px 0; border-bottom: 1px solid var(--border-color); margin-bottom: 20px;
        }
        .sidebar-profile img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent-green); margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .sidebar-profile h4 { font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
        .sidebar-profile p { font-size: 0.82rem; color: var(--text-muted); line-height: 1.4; }

        .sidebar-nav { display: flex; flex-direction: column; gap: 8px; flex-grow: 1; }
        .sidebar-nav a {
            display: flex; align-items: center; gap: 15px; color: #3A4E32; text-decoration: none;
            font-size: 0.95rem; font-weight: 600; padding: 12px 16px; border-radius: 10px; transition: var(--transition-smooth);
        }
        .sidebar-nav a i { font-size: 1.1rem; width: 22px; text-align: center; color: var(--primary-green); }
        .sidebar-nav a:hover, .sidebar-nav a.active { background-color: #E2ECE0; color: var(--primary-dark); transform: translateX(6px); }

        .sidebar-footer { border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: auto; }
        .btn-logout-green {
            background-color: var(--primary-green); color: #FFFFFF; border: none;
            box-shadow: 0 4px 12px rgba(82, 107, 74, 0.3); display: flex; align-items: center;
            justify-content: center; gap: 10px; padding: 13px; border-radius: 10px;
            cursor: pointer; width: 100%; font-weight: 600; font-size: 0.9rem; font-family: 'Inter';
            transition: var(--transition-smooth);
        }
        .btn-logout-green:hover { background-color: var(--primary-hover); transform: translateY(-2px); }

        /* === PANEL DEL CATÁLOGO === */
        .catalog-container {
            position: relative;
            z-index: 2;
            flex-grow: 1;
            margin: 0 40px 35px 40px;
            background-color: rgba(252, 253, 251, 0.96);
            backdrop-filter: blur(15px);
            border-radius: 24px;
            box-shadow: var(--shadow-soft);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.6);
        }

        .catalog-header {
            padding: 32px 40px 24px 40px;
            border-bottom: 1px solid var(--border-color);
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .hero-texts .text-hello {
            color: var(--primary-green);
            font-size: 1.2rem;
            font-family: 'Cormorant Garamond', serif;
            font-weight: 600;
            font-style: italic;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
        }

        .hero-texts .text-catalog {
            color: var(--text-main);
            font-size: 2.3rem;
            font-family: 'Cormorant Garamond', serif;
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 6px;
        }

        .hero-texts .text-desc {
            color: var(--text-muted);
            font-size: 0.9rem;
            font-family: 'Inter', sans-serif;
            font-weight: 400;
        }

        .catalog-content {
            padding: 35px 40px;
            overflow-y: auto;
            height: 100%;
        }

        .catalog-content::-webkit-scrollbar { width: 6px; }
        .catalog-content::-webkit-scrollbar-track { background: transparent; }
        .catalog-content::-webkit-scrollbar-thumb { background: #D5E2CD; border-radius: 10px; }
        .catalog-content::-webkit-scrollbar-thumb:hover { background: var(--primary-green); }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 28px;
        }

        /* === TARJETAS DE SERVICIOS === */
        .service-card {
            background: var(--card-bg);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: var(--shadow-card);
            transition: var(--transition-smooth);
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(0, 0, 0, 0.04);
            cursor: pointer;
            position: relative;
        }

        .service-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
            border-color: rgba(82, 107, 74, 0.2);
        }

        .service-img-container {
            width: 100%;
            height: 190px;
            overflow: hidden;
            position: relative;
        }

        .service-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .service-card:hover .service-img {
            transform: scale(1.05);
        }

        .service-info {
            padding: 22px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }

        .service-category {
            font-size: 0.72rem;
            color: var(--primary-green);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            margin-bottom: 8px;
        }

        .service-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.45rem;
            font-weight: 700;
            color: var(--text-main);
            margin-bottom: 8px;
            line-height: 1.2;
        }

        .service-desc {
            font-size: 0.87rem;
            color: var(--text-muted);
            line-height: 1.5;
            margin-bottom: 20px;
            flex-grow: 1;
        }

        .service-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #F0F4EC;
            padding-top: 16px;
            margin-top: auto;
        }

        .service-price {
            font-weight: 700;
            color: var(--text-main);
            font-size: 1.15rem;
            font-family: 'Inter', sans-serif;
        }

        .btn-book {
            background-color: var(--primary-green);
            color: white;
            border: none;
            padding: 9px 20px;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            transition: var(--transition-smooth);
            box-shadow: 0 4px 10px rgba(82, 107, 74, 0.2);
        }

        .btn-book:hover {
            background-color: var(--primary-hover);
            transform: translateY(-1px);
            box-shadow: 0 6px 15px rgba(82, 107, 74, 0.3);
        }

        /* === VENTANAS EMERGENTES (MODALES) === */
        .modal-backdrop {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(10, 15, 10, 0.6);
            backdrop-filter: blur(8px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: var(--transition-smooth);
            padding: 20px;
        }

        .modal-backdrop.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-box {
            background: #ffffff;
            width: 100%;
            max-width: 720px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 45px rgba(0,0,0,0.3);
            position: relative;
            transform: translateY(25px) scale(0.97);
            transition: var(--transition-smooth);
        }

        .modal-backdrop.active .modal-box {
            transform: translateY(0) scale(1);
        }

        .modal-close {
            position: absolute;
            top: 18px; right: 18px;
            background: rgba(0, 0, 0, 0.06);
            border: none;
            width: 38px; height: 38px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            color: var(--text-main);
            display: flex; align-items: center; justify-content: center;
            z-index: 10;
            transition: var(--transition-smooth);
        }

        .modal-close:hover {
            background: rgba(0, 0, 0, 0.12);
            transform: rotate(90deg);
        }

        /* === MODAL DE DETALLES === */
        .modal-body-content {
            display: flex;
            flex-direction: column;
        }

        @media (min-width: 768px) {
            .modal-body-content { flex-direction: row; }
            .modal-img-wrapper { width: 45%; min-height: 400px; }
            .modal-details { width: 55%; }
        }

        .modal-img-wrapper {
            position: relative;
            overflow: hidden;
            background: #E2ECE0;
        }

        .modal-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            min-height: 240px;
        }

        .modal-details {
            padding: 36px 32px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-grow: 1;
        }

        .modal-price-action {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            border-top: 1px solid #ECEFF2;
            padding-top: 20px;
        }

        .modal-extra-info {
            background: #F4F7F2;
            padding: 16px;
            border-radius: 12px;
            margin: 16px 0;
            font-size: 0.85rem;
            color: var(--text-main);
            display: flex;
            flex-direction: column;
            gap: 10px;
            border: 1px solid rgba(82, 107, 74, 0.1);
        }

        .modal-extra-info p {
            display: flex;
            align-items: flex-start;
            line-height: 1.4;
        }

        .modal-extra-info p i {
            color: var(--primary-green);
            width: 20px;
            text-align: center;
            margin-right: 8px;
            margin-top: 2px;
            font-size: 0.95rem;
        }

        .modal-title-custom {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--text-main);
            line-height: 1.15;
            margin-top: 4px;
        }

        .modal-desc-custom {
            font-size: 0.88rem;
            color: var(--text-muted);
            line-height: 1.5;
            margin-top: 8px;
        }

        /* === MODAL DE AGENDAMIENTO === */
        .booking-box {
            max-width: 650px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
        }

        .booking-header {
            padding: 30px 32px 20px 32px;
            border-bottom: 1px solid #ECEFF2;
            text-align: center;
        }

        .booking-header h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.8rem;
            color: var(--text-main);
            margin-bottom: 4px;
        }

        .booking-header p {
            color: var(--primary-green);
            font-size: 0.95rem;
            font-weight: 600;
        }

        .booking-body {
            padding: 24px 32px;
            overflow-y: auto;
            max-height: 60vh;
        }

        .professional-card {
            display: flex;
            align-items: center;
            gap: 16px;
            background: var(--bg-light);
            padding: 16px 20px;
            border-radius: 12px;
            border: 1px solid rgba(82, 107, 74, 0.15);
            margin-bottom: 28px;
        }

        .professional-card img {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--accent-green);
        }

        .prof-info h4 {
            font-size: 1.05rem;
            color: var(--text-main);
            margin-bottom: 3px;
        }

        .prof-info span {
            font-size: 0.8rem;
            color: var(--text-muted);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .prof-info span i {
            color: var(--primary-green);
        }

        .datetime-layout {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        @media (min-width: 600px) {
            .datetime-layout {
                flex-direction: row;
                gap: 32px;
            }
            .date-section { width: 45%; }
            .time-section { width: 55%; }
        }

        .section-title {
            font-size: 0.9rem;
            color: var(--text-main);
            font-weight: 700;
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .section-title i {
            color: var(--primary-green);
        }

        .date-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }

        .date-btn {
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 12px 5px;
            text-align: center;
            cursor: pointer;
            background: #ffffff;
            transition: var(--transition-smooth);
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .date-btn:hover {
            border-color: var(--primary-green);
            background: #F4F7F2;
        }

        .date-btn.active {
            background: var(--primary-green);
            border-color: var(--primary-green);
            color: #ffffff;
            box-shadow: 0 4px 10px rgba(82, 107, 74, 0.25);
        }

        .date-btn .day {
            font-size: 0.75rem;
            text-transform: uppercase;
            font-weight: 600;
            color: inherit;
            opacity: 0.8;
        }

        .date-btn .num {
            font-size: 1.2rem;
            font-weight: 700;
            color: inherit;
        }

        .date-btn:not(.active) .num {
            color: var(--text-main);
        }

        .time-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }

        .time-btn {
            background: #ffffff;
            border: 1px solid var(--border-color);
            padding: 12px;
            border-radius: 10px;
            font-family: 'Inter', sans-serif;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-main);
            cursor: pointer;
            transition: var(--transition-smooth);
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
        }

        .time-btn i {
            font-size: 0.7rem;
            color: var(--accent-green);
            opacity: 0;
            transition: opacity 0.2s;
        }

        .time-btn:hover {
            border-color: var(--primary-green);
            color: var(--primary-green);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }

        .time-btn.active {
            background: #E2ECE0;
            border-color: var(--primary-green);
            color: var(--primary-dark);
        }

        .time-btn.active i {
            opacity: 1;
            color: var(--primary-green);
        }

        .booking-footer {
            padding: 20px 32px;
            border-top: 1px solid #ECEFF2;
            background: #FAFCF9;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .booking-summary {
            display: flex;
            flex-direction: column;
        }

        .booking-summary span {
            font-size: 0.75rem;
            color: var(--text-muted);
            font-weight: 500;
            text-transform: uppercase;
        }

        .booking-summary strong {
            font-size: 1.3rem;
            color: var(--text-main);
            font-family: 'Inter', sans-serif;
        }

        .btn-pay {
            background-color: var(--text-main);
            color: white;
            border: none;
            padding: 12px 28px;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: var(--transition-smooth);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .btn-pay:hover {
            background: linear-gradient(135deg, #AFCB8A 0%, #6E8B54 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(82, 107, 74, 0.25);
        }

        .confirmation-box {
            max-width: 500px;
            text-align: center;
            padding: 36px 32px;
        }

        .confirmation-icon {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: rgba(82, 107, 74, 0.12);
            color: var(--primary-green);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            margin: 0 auto 18px;
        }

        .confirmation-box h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.8rem;
            color: var(--text-main);
            margin-bottom: 10px;
        }

        .confirmation-box p {
            color: var(--text-muted);
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .btn-confirm {
            background: linear-gradient(135deg, #AFCB8A 0%, #6E8B54 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition-smooth);
            box-shadow: 0 6px 15px rgba(82, 107, 74, 0.2);
        }

        .btn-confirm:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 18px rgba(82, 107, 74, 0.28);
        }
    </style>
</head>
<body>

<!-- OVERLAY MENÚ LATERAL -->
<div class="menu-overlay" id="menuOverlay" onclick="cerrarMenu()"></div>

<!-- MENÚ LATERAL -->
<aside class="sidebar-menu" id="sidebarMenu">
    <div class="sidebar-header">
        <h3>SGC COSMETIC</h3>
        <button class="close-btn" onclick="cerrarMenu()"><i class="fa-solid fa-xmark"></i></button>
    </div>

    <!-- DATOS DINÁMICOS DEL USUARIO LOGUEADO EN EL MENÚ -->
    <div class="sidebar-profile">
        <img src="https://i.pravatar.cc/150?img=47" alt="Foto de perfil">
        <h4><%= usuarioActivo.getNombreCompleto() %></h4>
        <p>Cliente VIP<br>Rol ID: <%= usuarioActivo.getIdRol() %></p>
    </div>

    <!-- RUTAS DINÁMICAS JAVA JSP CON CONTEXT PATH -->
    <nav class="sidebar-nav">
        <a href="${pageContext.request.contextPath}/dashboard"><i class="fa-solid fa-house"></i> Inicio</a>
        <a href="${pageContext.request.contextPath}/catalogo" class="active"><i class="fa-solid fa-border-all"></i> Catálogo</a>
        <a href="${pageContext.request.contextPath}//CitasServlet"><i class="fa-regular fa-calendar-check"></i> Citas</a>
        <a href="${pageContext.request.contextPath}/PerfilServlet"><i class="fa-regular fa-user"></i> Perfil</a>
    </nav>

    <div class="sidebar-footer">
        <!-- CIERRE DE SESIÓN ENRUTADO AL LOGOUT SERVLET -->
        <button class="btn-logout-green" onclick="window.location.href='${pageContext.request.contextPath}/logout'">
            <i class="fa-solid fa-right-from-bracket"></i> CERRAR SESIÓN
        </button>
    </div>
</aside>

<div class="main-wrapper">
    <div class="bg-overlay"></div>

    <!-- HEADER -->
    <header>
        <button class="menu-btn" onclick="abrirMenu()" title="Abrir menú">
            <i class="fa-solid fa-bars"></i>
        </button>

        <div class="header-actions">
            <div style="position:relative;">
                <button class="btn-notification" type="button" data-notification-toggle title="Notificaciones" onclick="mostrarNotificaciones()">
                    <i class="fa-regular fa-bell"></i>
                    <span class="notification-badge" hidden></span>
                </button>
                <div class="notification-panel" id="notificationPanel">
                    <div id="notificationList"></div>
                </div>
            </div>

            <!-- DATOS DINÁMICOS EN EL ENCABEZADO -->
            <div class="user-profile" onclick="window.location.href='${pageContext.request.contextPath}/PerfilServlet'" title="Ver perfil">
                <i class="fa-solid fa-circle-user user-avatar"></i>
                <div class="user-text">
                    <span class="user-role">Rol ID: <%= usuarioActivo.getIdRol() %></span>
                    <span class="user-name"><%= usuarioActivo.getNombreCompleto() %></span>
                </div>
            </div>
        </div>
    </header>

    <!-- 🌟 CONTENEDOR DEL CATÁLOGO 🌟 -->
    <main class="catalog-container">
        <div class="catalog-header">
            <div class="hero-texts">
                <!-- SALUDO PERSONALIZADO CON EL NOMBRE DEL USUARIO -->
                <div class="text-hello">Bienvenido/a de nuevo, <%= usuarioActivo.getNombreCompleto() %></div>
                <div class="text-catalog">Catálogo de Servicios</div>
                <div class="text-desc">Explora tratamientos exclusivos diseñados para realzar tu belleza natural con la máxima comodidad.</div>
            </div>
        </div>

        <div class="catalog-content">
            <div class="services-grid">

                <!-- TARJETAS DE SERVICIOS -->
                <article class="service-card" onclick="abrirModal('Limpieza Facial Profunda', 'Rostro', 'Elimina impurezas, células muertas y puntos negros con vaporización y alta frecuencia.', 'Vaporización con ozono, extracción manual, alta frecuencia bactericida y mascarilla calmante de caléndula.', '60 minutos', '$450 MXN', 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=500')">
                    <div class="service-img-container">
                        <img src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=500" alt="Limpieza Facial Profunda" class="service-img">
                    </div>
                    <div class="service-info">
                        <span class="service-category">Rostro</span>
                        <h3 class="service-title">Limpieza Facial Profunda</h3>
                        <p class="service-desc">Elimina impurezas, células muertas y puntos negros devolviendo la frescura y oxigenación a tu piel.</p>
                        <div class="service-footer">
                            <span class="service-price">$450 MXN</span>
                            <button class="btn-book" onclick="event.stopPropagation(); abrirModal('Limpieza Facial Profunda', 'Rostro', 'Elimina impurezas, células muertas y puntos negros con vaporización y alta frecuencia.', 'Vaporización con ozono, extracción manual, alta frecuencia bactericida y mascarilla calmante de caléndula.', '60 minutos', '$450 MXN', 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=500')">Ver Detalles</button>
                        </div>
                    </div>
                </article>

                <article class="service-card" onclick="abrirModal('Masaje Relajante', 'Cuerpo', 'Terapia manual diseñada para aliviar tensiones musculares profundas y reducir el estrés.', 'Aceites esenciales orgánicos aromaterapéuticos, música ambiental y técnica relajante de cuerpo completo.', '60 minutos', '$600 MXN', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=500')">
                    <div class="service-img-container">
                        <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=500" alt="Masaje Relajante" class="service-img">
                    </div>
                    <div class="service-info">
                        <span class="service-category">Cuerpo</span>
                        <h3 class="service-title">Masaje Relajante</h3>
                        <p class="service-desc">Terapia manual diseñada para aliviar tensiones musculares, reducir el estrés y mejorar la circulación.</p>
                        <div class="service-footer">
                            <span class="service-price">$600 MXN</span>
                            <button class="btn-book" onclick="event.stopPropagation(); abrirModal('Masaje Relajante', 'Cuerpo', 'Terapia manual diseñada para aliviar tensiones musculares profundas y reducir el estrés.', 'Aceites esenciales orgánicos aromaterapéuticos, música ambiental y técnica relajante de cuerpo completo.', '60 minutos', '$600 MXN', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=500')">Ver Detalles</button>
                        </div>
                    </div>
                </article>

                <article class="service-card" onclick="abrirModal('Lifting de Pestañas', 'Mirada', 'Alarga y eleva tus pestañas naturales desde la raíz con efecto de mayor amplitud.', 'Tinte de pestañas de larga duración, baño de keratina nutritiva y diseño de curvatura natural.', '45 minutos', '$350 MXN', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=500')">
                    <div class="service-img-container">
                        <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=500" alt="Lifting de Pestañas" class="service-img">
                    </div>
                    <div class="service-info">
                        <span class="service-category">Mirada</span>
                        <h3 class="service-title">Lifting de Pestañas</h3>
                        <p class="service-desc">Alarga y eleva tus pestañas naturales desde la raíz, logrando una mirada más abierta y expresiva.</p>
                        <div class="service-footer">
                            <span class="service-price">$350 MXN</span>
                            <button class="btn-book" onclick="event.stopPropagation(); abrirModal('Lifting de Pestañas', 'Mirada', 'Alarga y eleva tus pestañas naturales desde la raíz con efecto de mayor amplitud.', 'Tinte de pestañas de larga duración, baño de keratina nutritiva y diseño de curvatura natural.', '45 minutos', '$350 MXN', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=500')">Ver Detalles</button>
                        </div>
                    </div>
                </article>

                <article class="service-card" onclick="abrirModal('Microdermoabrasión', 'Tratamiento Clínico', 'Renovación celular profunda que minimiza poros dilatados y líneas finas.', 'Exfoliación con punta de diamante, loción equilibrante sin alcohol y aplicación de pantalla solar con FPS 50+.', '50 minutos', '$800 MXN', 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=500')">
                    <div class="service-img-container">
                        <img src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=500" alt="Microdermoabrasión" class="service-img">
                    </div>
                    <div class="service-info">
                        <span class="service-category">Tratamiento Clínico</span>
                        <h3 class="service-title">Microdermoabrasión</h3>
                        <p class="service-desc">Renovación celular profunda que minimiza poros dilatados, cicatrices leves de acné y marcas de expresión.</p>
                        <div class="service-footer">
                            <span class="service-price">$800 MXN</span>
                            <button class="btn-book" onclick="event.stopPropagation(); abrirModal('Microdermoabrasión', 'Tratamiento Clínico', 'Renovación celular profunda que minimiza poros dilatados y líneas finas.', 'Exfoliación con punta de diamante, loción equilibrante sin alcohol y aplicación de pantalla solar con FPS 50+.', '50 minutos', '$800 MXN', 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=500')">Ver Detalles</button>
                        </div>
                    </div>
                </article>

                <article class="service-card" onclick="abrirModal('Depilación Láser Diodo', 'Depilación', 'Eliminación progresiva del vello corporal con tecnología avanzada y segura.', 'Aplicación en zona pequeña seleccionada, gel criogénico conductor y emulsión hidratante post-tratamiento.', '30 minutos', '$500 MXN', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=500')">
                    <div class="service-img-container">
                        <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=500" alt="Depilación Láser Diodo" class="service-img">
                    </div>
                    <div class="service-info">
                        <span class="service-category">Depilación</span>
                        <h3 class="service-title">Depilación Láser Diodo</h3>
                        <p class="service-desc">Eliminación progresiva del vello corporal con tecnología indolora. Precio aplicable por zona pequeña.</p>
                        <div class="service-footer">
                            <span class="service-price">$500 MXN</span>
                            <button class="btn-book" onclick="event.stopPropagation(); abrirModal('Depilación Láser Diodo', 'Depilación', 'Eliminación progresiva del vello corporal con tecnología avanzada y segura.', 'Aplicación en zona pequeña seleccionada, gel criogénico conductor y emulsión hidratante post-tratamiento.', '30 minutos', '$500 MXN', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=500')">Ver Detalles</button>
                        </div>
                    </div>
                </article>

                <article class="service-card" onclick="abrirModal('Hidratación Profunda con Ácido Hialurónico', 'Rostro', 'Tratamiento intensivo para pieles deshidratadas que devuelve elasticidad y brillo.', 'Ampolleta de ácido hialurónico puro de alta penetración, masaje facial linfático y mascarilla hidroplástica.', '60 minutos', '$550 MXN', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=500')">
                    <div class="service-img-container">
                        <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=500" alt="Hidratación Facial" class="service-img">
                    </div>
                    <div class="service-info">
                        <span class="service-category">Rostro</span>
                        <h3 class="service-title">Hidratación con Ácido Hialurónico</h3>
                        <p class="service-desc">Tratamiento intensivo para pieles secas o deshidratadas. Devuelve la luminosidad y elasticidad natural.</p>
                        <div class="service-footer">
                            <span class="service-price">$550 MXN</span>
                            <button class="btn-book" onclick="event.stopPropagation(); abrirModal('Hidratación Profunda con Ácido Hialurónico', 'Rostro', 'Tratamiento intensivo para pieles deshidratadas que devuelve elasticidad y brillo.', 'Ampolleta de ácido hialurónico puro de alta penetración, masaje facial linfático y mascarilla hidroplástica.', '60 minutos', '$550 MXN', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=500')">Ver Detalles</button>
                        </div>
                    </div>
                </article>

            </div>
        </div>
    </main>
</div>

<!-- MODAL 1: INFORMACIÓN DEL SERVICIO -->
<div class="modal-backdrop" id="serviceModal" onclick="cerrarModalFuera(event)">
    <div class="modal-box">
        <button class="modal-close" onclick="cerrarModal()"><i class="fa-solid fa-xmark"></i></button>

        <div class="modal-body-content">
            <div class="modal-img-wrapper">
                <img id="modalImg" src="" alt="Imagen del Servicio" class="modal-img">
            </div>
            <div class="modal-details">
                <div>
                    <span id="modalCategory" class="service-category"></span>
                    <h3 id="modalTitle" class="modal-title-custom"></h3>
                    <p id="modalDesc" class="modal-desc-custom"></p>

                    <div class="modal-extra-info">
                        <p><i class="fa-solid fa-check-circle"></i> <span><strong>Lo que incluye:</strong> <span id="modalIncludes"></span></span></p>
                        <p><i class="fa-regular fa-clock"></i> <span><strong>Cuánto dura:</strong> <span id="modalDuration"></span></span></p>
                    </div>
                </div>

                <div class="modal-price-action">
                    <div>
                        <span style="font-size: 0.75rem; color: var(--text-muted); display: block; font-weight: 500;">Precio del Servicio</span>
                        <span id="modalPrice" class="service-price"></span>
                    </div>
                    <button class="btn-book" onclick="abrirModalAgendamiento()">Agendar Cita</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- MODAL 2: SELECCIÓN DE FECHA Y HORA -->
<div class="modal-backdrop" id="bookingModal" onclick="cerrarBookingFuera(event)">
    <div class="modal-box booking-box">
        <button class="modal-close" onclick="volverAModalServicio()"><i class="fa-solid fa-arrow-left"></i></button>

        <div class="booking-header">
            <h3>Reserva tu cita</h3>
            <p id="bookingServiceName">Nombre del Servicio</p>
            <div style="margin-top:8px">
                <label for="bookingPromotionSelect" style="font-size:0.8rem;color:#5f6757;display:block;margin-bottom:6px">Promoción</label>
                <select id="bookingPromotionSelect" style="padding:8px;border-radius:8px;border:1px solid #e6e6e6;min-width:220px">
                    <option value="">-- Selecciona una promoción (opcional) --</option>
                </select>
            </div>
        </div>

        <div class="booking-body">
            <div class="professional-card">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200" alt="Dra. Sofía Reyes">
                <div class="prof-info">
                    <h4>Dra. Sofía Reyes</h4>
                    <span><i class="fa-solid fa-star"></i> Cosmetóloga Principal Asignada</span>
                </div>
            </div>

            <div class="datetime-layout">
                <div class="date-section">
                    <div class="section-title"><i class="fa-regular fa-calendar"></i> Fechas Disponibles</div>
                    <div class="date-grid">
                        <div class="date-btn active" onclick="seleccionarBoton(this, 'date-btn')">
                            <span class="day">Lun</span>
                            <span class="num">12</span>
                        </div>
                        <div class="date-btn" onclick="seleccionarBoton(this, 'date-btn')">
                            <span class="day">Mar</span>
                            <span class="num">13</span>
                        </div>
                        <div class="date-btn" onclick="seleccionarBoton(this, 'date-btn')">
                            <span class="day">Mié</span>
                            <span class="num">14</span>
                        </div>
                        <div class="date-btn" onclick="seleccionarBoton(this, 'date-btn')">
                            <span class="day">Jue</span>
                            <span class="num">15</span>
                        </div>
                        <div class="date-btn" onclick="seleccionarBoton(this, 'date-btn')">
                            <span class="day">Vie</span>
                            <span class="num">16</span>
                        </div>
                        <div class="date-btn" onclick="seleccionarBoton(this, 'date-btn')">
                            <span class="day">Sáb</span>
                            <span class="num">17</span>
                        </div>
                    </div>
                </div>

                <div class="time-section">
                    <div class="section-title"><i class="fa-regular fa-clock"></i> Horarios Recomendados</div>
                    <div class="time-grid">
                        <button class="time-btn" onclick="seleccionarBoton(this, 'time-btn')"><i class="fa-solid fa-check"></i> 10:00 AM</button>
                        <button class="time-btn active" onclick="seleccionarBoton(this, 'time-btn')"><i class="fa-solid fa-check"></i> 11:30 AM</button>
                        <button class="time-btn" onclick="seleccionarBoton(this, 'time-btn')"><i class="fa-solid fa-check"></i> 01:00 PM</button>
                        <button class="time-btn" onclick="seleccionarBoton(this, 'time-btn')"><i class="fa-solid fa-check"></i> 02:30 PM</button>
                        <button class="time-btn" onclick="seleccionarBoton(this, 'time-btn')"><i class="fa-solid fa-check"></i> 04:00 PM</button>
                        <button class="time-btn" onclick="seleccionarBoton(this, 'time-btn')"><i class="fa-solid fa-check"></i> 05:30 PM</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="booking-footer">
            <div class="booking-summary">
                <span>Total de tu reserva</span>
                <strong id="bookingPrice">$0 MXN</strong>
            </div>
            <button class="btn-pay" onclick="confirmarCita()">
                Confirmar cita <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    </div>
</div>

<!-- MODAL 3: CONFIRMACIÓN DE CITA -->
<div class="modal-backdrop" id="confirmationModal" onclick="cerrarConfirmationFuera(event)">
    <div class="modal-box confirmation-box">
        <div class="confirmation-icon"><i class="fa-solid fa-circle-check"></i></div>
        <h3>Cita confirmada</h3>
        <p>Tu cita quedó registrada correctamente. Puedes volver al catálogo y seguir explorando nuestros servicios.</p>
        <button class="btn-confirm" onclick="volverAlCatalogo()">Volver a catálogo</button>
    </div>
</div>

<div class="modal-backdrop" id="cancelAppointmentModal">
    <div class="modal-box confirmation-box">
        <div class="confirmation-icon" style="color:#C95C5C;"><i class="fa-solid fa-circle-exclamation"></i></div>
        <h3>Cancelar cita</h3>
        <p>¿Deseas cancelar esta cita? Esta acción contará como una falta y aparecerá en tu historial.</p>
        <div class="modal-actions" style="display:flex; gap:12px; justify-content:center; margin-top:16px;">
            <button class="btn-confirm cancel-cancel-btn" style="background:#EDEEEE; color:#2C3527;">No, mantener</button>
            <button class="btn-confirm cancel-confirm-btn" style="background:#C95C5C;">Sí, cancelar</button>
        </div>
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

    function mostrarNotificaciones() {
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.classList.toggle('active');
        }
    }

    /* Lógica Modal de Servicio */
    function abrirModal(titulo, categoria, desc, incluye, duracion, precio, img) {
        document.getElementById('modalTitle').innerText = titulo;
        document.getElementById('modalCategory').innerText = categoria;
        document.getElementById('modalDesc').innerText = desc;
        document.getElementById('modalIncludes').innerText = incluye;
        document.getElementById('modalDuration').innerText = duracion;
        document.getElementById('modalPrice').innerText = precio;
        document.getElementById('modalImg').src = img;

        document.getElementById('serviceModal').classList.add('active');
    }

    function cerrarModal() {
        document.getElementById('serviceModal').classList.remove('active');
    }

    function cerrarModalFuera(event) {
        if (event.target.id === 'serviceModal') {
            cerrarModal();
        }
    }

    /* Lógica Modal de Agendamiento */
    function abrirModalAgendamiento() {
        const titulo = document.getElementById('modalTitle').innerText;
        const precio = document.getElementById('modalPrice').innerText;

        document.getElementById('bookingServiceName').innerText = titulo;
        document.getElementById('bookingPrice').innerText = precio;

        try {
            const select = document.getElementById('bookingPromotionSelect');
            if (select && window.appointmentsSystem && typeof window.appointmentsSystem.readState === 'function') {
                const state = window.appointmentsSystem.readState();
                select.innerHTML = '<option value="">-- Selecciona una promoción (opcional) --</option>' + (state.promotions || []).map(p => `<option value="${p.id}">${p.title}</option>`).join('');
                select.onchange = function () {
                    const val = select.value;
                    if (window.appointmentsSystem && typeof window.appointmentsSystem.applyPromotion === 'function') {
                        window.appointmentsSystem.applyPromotion(val || null);
                    }
                    try {
                        const selPromo = (state.promotions || []).find(pp => pp.id === val);
                        if (selPromo && /(%)/.test(selPromo.title)) {
                            const match = String(selPromo.title).match(/(\d+)%/);
                            if (match) {
                                const pct = Number(match[1]);
                                const num = Number(String(precio).replace(/[^0-9.,]/g, '').replace(/,/g, '.')) || 0;
                                const computed = Math.round((num * (1 - pct / 100)) * 100) / 100;
                                document.getElementById('bookingPrice').innerText = `$${computed} MXN`;
                                return;
                            }
                        }
                        document.getElementById('bookingPrice').innerText = precio;
                    } catch (e) { document.getElementById('bookingPrice').innerText = precio; }
                };
            }
        } catch (e) { /* ignore */ }

        document.getElementById('serviceModal').classList.remove('active');
        document.getElementById('bookingModal').classList.add('active');
    }

    function volverAModalServicio() {
        document.getElementById('bookingModal').classList.remove('active');
        document.getElementById('serviceModal').classList.add('active');
    }

    function cerrarBookingFuera(event) {
        if (event.target.id === 'bookingModal') {
            document.getElementById('bookingModal').classList.remove('active');
        }
    }

    function seleccionarBoton(elemento, clase) {
        let botones = document.getElementsByClassName(clase);
        for (let i = 0; i < botones.length; i++) {
            botones[i].classList.remove('active');
        }
        elemento.classList.add('active');
    }

    function confirmarCita() {
        document.getElementById('bookingModal').classList.remove('active');
        document.getElementById('confirmationModal').classList.add('active');
    }

    function cerrarConfirmationFuera(event) {
        if (event.target.id === 'confirmationModal') {
            document.getElementById('confirmationModal').classList.remove('active');
        }
    }

    function volverAlCatalogo() {
        document.getElementById('confirmationModal').classList.remove('active');
        window.location.href = '${pageContext.request.contextPath}/catalogo';
    }
</script>

<script src="${pageContext.request.contextPath}/assets/js/appointments-system.js"></script>
<script>
    window.addEventListener('DOMContentLoaded', () => {
        if (window.appointmentsSystem) {
            window.appointmentsSystem.init();
        }
    });
</script>
</body>
</html>