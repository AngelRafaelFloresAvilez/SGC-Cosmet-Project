<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="com.proyecto.sgccosmetproject.model.Usuario" %>
<%-- IMPORTANTE: Asegúrate de tener tu clase modelo Servicio creada --%>
<%@ page import="com.proyecto.sgccosmetproject.model.Servicio" %>
<%
    // LÓGICA JSP: Validar la sesión directamente al renderizar la vista
    Usuario usuarioActivo = (Usuario) session.getAttribute("usuarioSesion");
    if (usuarioActivo == null) {
        response.sendRedirect(request.getContextPath() + "/login");
        return;
    }

    // Recuperamos la lista dinámica de servicios desde el Servlet
    List<Servicio> listaServicios = (List<Servicio>) request.getAttribute("listaServicios");
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SGC COSMETIC - Catálogo y Pagos</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/stylesCatalogo.css">
    <script src="${pageContext.request.contextPath}/js/catalogo.js"></script>

    <!-- ESTILOS AÑADIDOS PARA EL MODAL AVANZADO (Basado en la vista de diseño Figma) -->
    <style>
        .modal-advanced-box {
            width: 100%;
            max-width: 850px;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            position: relative;
        }

        .modal-banner-wrapper {
            width: 100%;
            height: 260px;
            position: relative;
        }

        .modal-banner-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .modal-close-floating {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #ffffff;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            color: #2C3527;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            z-index: 10;
        }

        .modal-advanced-content {
            display: flex;
            padding: 30px;
            gap: 40px;
            text-align: left;
        }

        .modal-left-col {
            flex: 1;
        }

        .modal-right-col {
            width: 300px;
            background: #ffffff;
            border: 1px solid #EBEBEB;
            border-radius: 16px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }

        .modal-main-title {
            font-family: 'Inter', sans-serif;
            font-size: 1.6rem;
            font-weight: 700;
            margin-bottom: 8px;
            color: #1A1A1A;
        }

        .modal-main-desc {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 24px;
            line-height: 1.5;
        }

        .modal-features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 24px;
            padding-bottom: 24px;
            border-bottom: 1px solid #F0F0F0;
        }

        .feature-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        .feature-item i {
            font-size: 1.1rem;
            color: #6A7C59;
            margin-top: 2px;
        }

        .feature-text {
            display: flex;
            flex-direction: column;
        }

        .feature-text span {
            font-size: 0.75rem;
            color: #888;
            margin-bottom: 2px;
        }

        .feature-text strong {
            font-size: 0.85rem;
            color: #333;
            font-weight: 600;
        }

        .modal-includes-section h4, .reviews-header h4 {
            font-size: 1rem;
            color: #1A1A1A;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .modal-includes-section p {
            font-size: 0.85rem;
            color: #555;
            margin-bottom: 24px;
            line-height: 1.5;
        }

        .reviews-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .view-all {
            font-size: 0.8rem;
            color: #6A7C59;
            text-decoration: none;
            font-weight: 500;
        }

        .review-card {
            display: flex;
            gap: 12px;
            background: #ffffff;
            padding: 16px;
            border: 1px solid #F0F0F0;
            border-radius: 12px;
            margin-bottom: 10px;
        }

        .review-avatar {
            width: 36px;
            height: 36px;
            background: #8e9e82;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            flex-shrink: 0;
        }

        .review-content p {
            font-size: 0.85rem;
            color: #555;
            margin-top: 6px;
            line-height: 1.4;
        }

        .review-meta {
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .stars { color: #5f6757; font-size: 0.7rem; }
        .time-ago { color: #999; font-size: 0.75rem;}

        .review-dots {
            text-align: center;
            margin-top: 10px;
        }

        .review-dots span {
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #D9D9D9;
            border-radius: 50%;
            margin: 0 3px;
        }

        .review-dots span.active { background: #6A7C59; }

        .price-section {
            border-bottom: 1px solid #F0F0F0;
            padding-bottom: 20px;
        }

        .price-label {
            font-size: 0.8rem;
            color: #888;
            font-weight: 500;
            display: block;
            margin-bottom: 4px;
        }

        .price-value {
            font-size: 1.8rem;
            color: #1A1A1A;
            margin-bottom: 16px;
            font-weight: 700;
        }

        .btn-agendar-advanced {
            width: 100%;
            background: #6A7C59;
            color: #fff;
            border: none;
            padding: 14px;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            transition: background 0.2s;
        }

        .btn-agendar-advanced:hover {
            background: #566548;
        }

        .trust-badges .badge-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 10px 0;
            border-bottom: 1px solid #f7f7f7;
        }

        .trust-badges .badge-item:last-child {
            border-bottom: none;
        }

        .trust-badges .badge-item i {
            font-size: 1.2rem;
            color: #1A1A1A;
            margin-top: 2px;
        }

        .trust-badges .badge-item strong {
            font-size: 0.85rem;
            color: #1A1A1A;
            display: block;
            margin-bottom: 2px;
        }

        .trust-badges .badge-item p {
            font-size: 0.75rem;
            color: #888;
            margin: 0;
        }

        .success-badge {
            background: #F4F8F1;
            padding: 12px;
            border-radius: 10px;
            margin-top: 10px;
            border: none !important;
        }

        .success-badge i {
            color: #6A7C59 !important;
        }

        .success-badge strong {
            color: #6A7C59 !important;
        }

        .success-badge p {
            color: #8e9e82 !important;
        }

        .avatar-group {
            display: flex;
            margin-top: 8px;
        }
        .avatar-group span {
            width: 24px;
            height: 24px;
            background: #8e9e82;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.6rem;
            border: 2px solid #F4F8F1;
            margin-left: -8px;
        }
        .avatar-group span:first-child { margin-left: 0; }
    </style>
</head>
<body class="catalog-page">
<div class="main-wrapper">
    <div class="bg-overlay"></div>
    <div class="menu-overlay" id="menuOverlay"></div>

    <aside class="sidebar-menu" id="sidebarMenu">
        <div class="sidebar-user-box">
            <div class="sidebar-user-avatar" id="sidebarUserAvatar">
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
            <a href="${pageContext.request.contextPath}/dashboardServlet"><i class="fa-solid fa-house"></i> Inicio</a>
            <a href="${pageContext.request.contextPath}/catalogoServlet" class="active"><i class="fa-solid fa-border-all"></i> Catálogo</a>
            <a href="${pageContext.request.contextPath}/CitasServlet"><i class="fa-regular fa-calendar-check"></i> Mis citas</a>
            <hr class="sidebar-divider">
            <a href="${pageContext.request.contextPath}/PerfilServlet" class="nav-profile-link"><i class="fa-regular fa-user"></i> Mi perfil</a>
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

            <div class="user-profile" onclick="window.location.href='${pageContext.request.contextPath}/PerfilServlet';" style="cursor: pointer;">
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

    <main class="catalog-container">
        <div class="catalog-header">
            <div class="hero-texts">
                <h1 class="text-catalog">Catálogo:</h1>
            </div>
        </div>

        <div class="catalog-content">
            <div class="services-grid">

                <%
                    // Generación dinámica de las tarjetas desde la Base de Datos
                    if (listaServicios != null && !listaServicios.isEmpty()) {
                        for (int i = 0; i < listaServicios.size(); i++) {
                            Servicio s = listaServicios.get(i);
                            // Ocultamos a partir de la tarjeta 6 para que la paginación JS funcione
                            String hiddenClass = (i >= 6) ? "hidden-card" : "";
                %>
                <article class="service-card <%= hiddenClass %>"
                         data-category="<%= s.getCategoria() %>"
                         data-includes="<%= s.getIncluye() %>"
                         data-duration="<%= s.getDuracion() %>"
                         data-price="$<%= s.getPrecio() %> MXN"
                         data-image="<%= s.getImagenUrl() %>"
                         data-title="<%= s.getNombre() %>"
                         data-desc="<%= s.getDescripcion() %>">
                    <div class="service-img-container">
                        <img src="<%= s.getImagenUrl() %>" alt="<%= s.getNombre() %>" class="service-img">
                    </div>
                    <div class="service-info">
                        <span class="service-label"><%= s.getCategoria() %></span>
                        <h3 class="service-title"><%= s.getNombre() %></h3>
                        <p class="service-desc"><%= s.getDescripcion() %></p>
                        <div class="service-price-row"><span class="service-price">$<%= s.getPrecio() %> MXN</span></div>
                        <button class="cta-arrow btn-book" aria-label="Ver detalles"><i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </article>
                <%
                    }
                } else {
                %>
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #5f6757;">
                    <h3>No hay servicios disponibles en este momento.</h3>
                    <p>Por favor, vuelve más tarde.</p>
                </div>
                <%
                    }
                %>

            </div>

            <div class="catalog-controls" aria-label="Cambiar servicios">
                <button class="catalog-nav-btn" data-direction="prev" aria-label="Servicios anteriores"><i class="fa-solid fa-chevron-left"></i></button>
                <button class="catalog-nav-btn" data-direction="next" aria-label="Siguientes servicios"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
        </div>
    </main>
</div>

<!-- === MODALES === -->

<!-- Modal de Detalles del Servicio (Actualizado al diseño avanzado de Figma) -->
<div class="modal-backdrop" id="serviceModal">
    <div class="modal-advanced-box">

        <!-- Banner Superior -->
        <div class="modal-banner-wrapper">
            <img id="modalImg" src="" alt="Imagen del Servicio" class="modal-banner-img">
            <!-- Botón cerrar con las clases necesarias para que el JS lo detecte -->
            <button class="modal-close modal-close-floating"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <!-- Contenido Inferior Dividido -->
        <div class="modal-advanced-content">

            <!-- Columna Izquierda: Información -->
            <div class="modal-left-col">
                <h2 id="modalTitle" class="modal-main-title">Nombre del Servicio</h2>
                <p id="modalDesc" class="modal-main-desc">Descripción del servicio.</p>

                <div class="modal-features-grid">
                    <div class="feature-item">
                        <i class="fa-regular fa-circle-check"></i>
                        <div class="feature-text">
                            <span>Disponibilidad</span>
                            <strong>Disponible</strong>
                        </div>
                    </div>
                    <div class="feature-item">
                        <i class="fa-regular fa-clock"></i>
                        <div class="feature-text">
                            <span>Duración</span>
                            <strong id="modalDuration">1h - 2h</strong>
                        </div>
                    </div>
                    <div class="feature-item">
                        <i class="fa-solid fa-star"></i>
                        <div class="feature-text">
                            <span>Calificación</span>
                            <strong>4.9 (120 opiniones)</strong>
                        </div>
                    </div>
                </div>

                <div class="modal-includes-section">
                    <h4>Incluye</h4>
                    <p id="modalIncludes">Detalles de lo que incluye.</p>
                </div>

                <!-- Sección de Reseñas (Estática por ahora como en el diseño) -->
                <div class="modal-reviews-section">
                    <div class="reviews-header">
                        <h4>Reseñas destacadas</h4>
                        <a href="#" class="view-all">Ver todas <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                    <div class="review-card">
                        <div class="review-avatar">J</div>
                        <div class="review-content">
                            <div class="review-meta">
                                <strong>Juan</strong>
                                <span class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></span>
                                <span class="time-ago">- Hace 2 días</span>
                            </div>
                            <p>Me gustó mucho este servicio, definitivamente volvería a agendar una cita.</p>
                        </div>
                    </div>
                    <div class="review-dots">
                        <span class="active"></span><span></span><span></span>
                    </div>
                </div>
            </div>

            <!-- Columna Derecha: Tarjeta de Precio y Acción -->
            <div class="modal-right-col">
                <div class="price-section">
                    <span class="price-label">Precio</span>
                    <h3 id="modalPrice" class="price-value">$0 MXN</h3>
                    <!-- Se mantiene la clase 'btn-agendar' para que funcione el JS -->
                    <button class="btn-agendar btn-agendar-advanced">
                        <i class="fa-regular fa-calendar-check"></i> Agendar cita
                    </button>
                </div>

                <div class="trust-badges">
                    <div class="badge-item">
                        <i class="fa-solid fa-shield-halved"></i>
                        <div>
                            <strong>Pago seguro</strong>
                            <p>Tus datos están protegidos</p>
                        </div>
                    </div>
                    <div class="badge-item">
                        <i class="fa-regular fa-credit-card"></i>
                        <div>
                            <strong>Métodos de pago</strong>
                            <p>Efectivo, tarjeta, transferencia</p>
                        </div>
                    </div>
                    <div class="badge-item success-badge">
                        <i class="fa-solid fa-users"></i>
                        <div>
                            <strong>+500 servicios realizados</strong>
                            <p>Clientes satisfechos</p>
                            <div class="avatar-group">
                                <span>A</span><span>J</span><span>M</span><span>+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

<!-- Modal de Agendamiento / Pago -->
<div class="modal-backdrop" id="bookingModal">
    <div class="modal-box booking-box">
        <button class="modal-close modal-back"><i class="fa-solid fa-arrow-left"></i></button>

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
                        <div class="date-btn active"><span class="day">Lun</span><span class="num">12</span></div>
                        <div class="date-btn"><span class="day">Mar</span><span class="num">13</span></div>
                        <div class="date-btn"><span class="day">Mié</span><span class="num">14</span></div>
                        <div class="date-btn"><span class="day">Jue</span><span class="num">15</span></div>
                        <div class="date-btn"><span class="day">Vie</span><span class="num">16</span></div>
                        <div class="date-btn"><span class="day">Sáb</span><span class="num">17</span></div>
                    </div>
                </div>

                <div class="time-section">
                    <div class="section-title"><i class="fa-regular fa-clock"></i> Horarios Recomendados</div>
                    <div class="time-grid">
                        <button class="time-btn"><i class="fa-solid fa-check"></i> 10:00 AM</button>
                        <button class="time-btn active"><i class="fa-solid fa-check"></i> 11:30 AM</button>
                        <button class="time-btn"><i class="fa-solid fa-check"></i> 01:00 PM</button>
                        <button class="time-btn"><i class="fa-solid fa-check"></i> 02:30 PM</button>
                        <button class="time-btn"><i class="fa-solid fa-check"></i> 04:00 PM</button>
                        <button class="time-btn"><i class="fa-solid fa-check"></i> 05:30 PM</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="booking-footer">
            <div class="booking-summary">
                <span>Total de tu reserva</span>
                <strong id="bookingPrice">$0 MXN</strong>
            </div>
            <button class="btn-pay">
                Confirmar cita <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    </div>
</div>

<!-- Modal de Confirmación -->
<div class="modal-backdrop" id="confirmationModal">
    <div class="modal-box confirmation-box">
        <div class="confirmation-icon"><i class="fa-solid fa-circle-check"></i></div>
        <h3>Cita confirmada</h3>
        <p>Tu cita quedó registrada correctamente. Puedes volver al catálogo y seguir explorando nuestros servicios.</p>
        <button class="btn-confirm" onclick="window.location.href='${pageContext.request.contextPath}/catalogoServlet'">Volver a catálogo</button>
    </div>
</div>

<!-- Modal de Cancelación -->
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

<script>
    // Variable global del contexto para el archivo JS
    window.contextPath = '${pageContext.request.contextPath}';
</script>
</body>
</html>