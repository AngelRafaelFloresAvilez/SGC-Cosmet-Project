<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="com.proyecto.sgccosmetproject.model.Usuario" %>
<%@ page import="com.proyecto.sgccosmetproject.model.Servicio" %>
<%
    Usuario usuarioActivo = (Usuario) session.getAttribute("usuarioSesion");
    if (usuarioActivo == null) {
        response.sendRedirect(request.getContextPath() + "/login");
        return;
    }
    List<Servicio> listaServicios = (List<Servicio>) request.getAttribute("listaServicios");

    String fotoSrc = (usuarioActivo.getFotoPerfil() != null && !usuarioActivo.getFotoPerfil().isEmpty())
            ? usuarioActivo.getFotoPerfil()
            : "https://www.gravatar.com/avatar/?d=mp&s=150";
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SGC COSMETIC - Catálogo y Calendario</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/stylesCatalogo.css">
    <script src="${pageContext.request.contextPath}/js/catalogo.js" defer></script>
</head>
<body class="catalog-page">
<div class="main-wrapper">
    <div class="bg-overlay"></div>
    <div class="menu-overlay" id="menuOverlay"></div>

    <aside class="sidebar-menu" id="sidebarMenu">
        <div class="sidebar-user-box">
            <div class="sidebar-user-avatar" id="sidebarUserAvatar" style="cursor: pointer;">
                <img id="sidebarProfileImg" src="<%= fotoSrc %>" alt="Avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">
            </div>
            <div class="sidebar-user-meta">
                <span class="sidebar-user-name"><%= usuarioActivo.getNombreCompleto() %></span>
                <span class="sidebar-user-role">Rol ID: <%= usuarioActivo.getIdRol() %></span>
            </div>
        </div>
        <div class="sidebar-header"><hr class="sidebar-divider"></div>
        <div class="sidebar-section-label">General</div>
        <nav class="sidebar-nav">
            <a href="${pageContext.request.contextPath}/dashboardServlet"><i class="fa-solid fa-house"></i> Inicio</a>
            <a href="${pageContext.request.contextPath}/catalogoServlet" class="active"><i class="fa-solid fa-border-all"></i> Catálogo</a>
            <a href="${pageContext.request.contextPath}/CitasServlet"><i class="fa-regular fa-calendar-check"></i> Mis citas</a>
            <hr class="sidebar-divider">
            <a href="${pageContext.request.contextPath}/PerfilServlet" class="nav-profile-link"><i class="fa-regular fa-user"></i> Mi perfil</a>
        </nav>
        <button class="sidebar-logout" type="button" onclick="window.location.href='${pageContext.request.contextPath}/logout'"><i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión</button>
        <hr class="sidebar-divider"><div class="sidebar-brand">SGC COSMETICS</div>
    </aside>

    <header>
        <button class="menu-btn" style="color: #FFFFFF;"><i class="fa-solid fa-bars"></i></button>
        <div class="header-actions">
            <div style="position:relative;">
                <button class="btn-notification" type="button" data-notification-toggle>
                    <i class="fa-regular fa-bell"></i>
                    <span class="notification-badge"></span>
                </button>
                <div class="notification-panel" id="notificationPanel">
                    <div class="notification-header" style="padding: 12px 16px; font-weight: 600; border-bottom: 1px solid #f0f0f0; background: #fdfdfd; color: #2c3e50;">Notificaciones</div>
                    <div id="notificationList">
                        <div class="notification-empty" style="padding: 24px; text-align: center; color: #888; font-size: 13px;">No tienes notificaciones pendientes</div>
                    </div>
                </div>
            </div>

            <div class="user-profile" style="cursor: pointer;">
                <div class="user-avatar" aria-label="Avatar del cliente" style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <img src="<%= fotoSrc %>" alt="Avatar" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="user-meta">
                    <span class="user-name"><%= usuarioActivo.getNombreCompleto() %></span>
                    <span class="user-role">Rol ID: <%= usuarioActivo.getIdRol() %></span>
                </div>
            </div>
        </div>
    </header>

    <main class="catalog-container">

        <div class="catalog-header"><div class="hero-texts"><h1 class="text-catalog">Catálogo:</h1></div></div>
        <div class="catalog-content">
            <div class="services-grid">
                <%
                    if (listaServicios != null && !listaServicios.isEmpty()) {
                        for (int i = 0; i < listaServicios.size(); i++) {
                            Servicio s = listaServicios.get(i);
                            String hiddenClass = (i >= 6) ? "hidden-card" : "";
                %>
                <article class="service-card <%= hiddenClass %>" data-id="<%= s.getIdServicio() %>" data-category="<%= s.getCategoria() %>" data-includes="<%= s.getIncluye() %>" data-duration="<%= s.getDuracion() %>" data-price="<%= s.getPrecio() %>" data-image="<%= s.getImagenUrl() %>" data-title="<%= s.getNombre() %>" data-desc="<%= s.getDescripcion() %>">
                    <div class="service-img-container"><img src="<%= s.getImagenUrl() %>" alt="<%= s.getNombre() %>" class="service-img"></div>
                    <div class="service-info">
                        <span class="service-label"><%= s.getCategoria() %></span>
                        <h3 class="service-title"><%= s.getNombre() %></h3>
                        <p class="service-desc"><%= s.getDescripcion() %></p>
                        <div class="service-price-row"><span class="service-price">$<%= s.getPrecio() %> MXN</span></div>
                        <button class="cta-arrow btn-book" aria-label="Ver detalles"><i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </article>
                <% } } else { %>
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #5f6757;">
                    <h3>No hay servicios disponibles en este momento.</h3>
                </div>
                <% } %>
            </div>
            <div class="catalog-controls">
                <button class="catalog-nav-btn" data-direction="prev"><i class="fa-solid fa-chevron-left"></i></button>
                <button class="catalog-nav-btn" data-direction="next"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
        </div>
    </main>
</div>

<!-- === MODALES === -->

<!-- 1. Modal de Detalles del Servicio -->
<div class="modal-backdrop" id="serviceModal">
    <div class="modal-advanced-box">
        <div class="modal-banner-wrapper">
            <img id="modalImg" src="" alt="Imagen del Servicio" class="modal-banner-img">
            <button class="modal-close modal-close-floating"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-advanced-content">
            <div class="modal-left-col">
                <h2 id="modalTitle" class="modal-main-title">Nombre del Servicio</h2>
                <p id="modalDesc" class="modal-main-desc">Descripción detallada del servicio.</p>

                <div class="modal-features-row">
                    <div class="feature-item">
                        <i class="fa-regular fa-circle-check"></i>
                        <div class="feature-text"><span>Disponibilidad</span><strong>Disponible</strong></div>
                    </div>
                    <div class="feature-item">
                        <i class="fa-regular fa-clock"></i>
                        <div class="feature-text"><span>Duración</span><strong id="modalDuration">1 h - 2 h</strong></div>
                    </div>
                    <div class="feature-item">
                        <i class="fa-solid fa-star"></i>
                        <div class="feature-text"><span>Calificación</span><strong id="modalRatingAvg">0.0 (0)</strong></div>
                    </div>
                </div>

                <div class="modal-includes-section">
                    <h4>Incluye</h4>
                    <div class="includes-grid" id="modalIncludes">
                        <div class="include-item">Evaluación previa</div>
                        <div class="include-item">Procedimiento</div>
                    </div>
                </div>

                <!-- Sección dinámicamente conectada a la BD para Reseñas -->
                <div class="reviews-section">
                    <div class="reviews-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="margin: 0;">Reseñas del servicio</h4>
                        <button type="button" id="btnOpenAddReview" style="background: #5f6757; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                            <i class="fa-solid fa-plus"></i> Añadir reseña
                        </button>
                    </div>
                    <div id="reviewsListContainer">
                        <div style="font-size: 13px; color: #777;">Cargando reseñas...</div>
                    </div>
                </div>
            </div>

            <div class="modal-right-col">
                <div class="price-booking-card">
                    <span class="price-label">Precio</span>
                    <h3 id="modalPrice" class="price-value">$500 MXN</h3>
                    <button class="btn-agendar btn-agendar-advanced"><i class="fa-regular fa-calendar-check"></i> Agendar cita</button>
                </div>

                <hr class="divider">

                <div class="trust-item">
                    <div class="trust-icon"><i class="fa-solid fa-shield-halved"></i></div>
                    <div class="trust-text">
                        <strong>Pago seguro</strong>
                        <span>Tus datos estan protegidos</span>
                    </div>
                </div>

                <div class="trust-item">
                    <div class="trust-icon"><i class="fa-regular fa-credit-card"></i></div>
                    <div class="trust-text">
                        <strong>Metodos de pago</strong>
                        <span>Efectivo, tarjeta, transferencia</span>
                    </div>
                    <i class="fa-solid fa-arrow-right trust-arrow"></i>
                </div>

                <div class="stats-badge">
                    <div class="stats-icon"><i class="fa-solid fa-user-group"></i></div>
                    <div class="stats-text">
                        <strong>+500 servicios realizados</strong>
                        <span>Clientes satisfechos</span>
                        <div class="stats-avatars">
                            <div><i class="fa-solid fa-user"></i></div>
                            <div><i class="fa-solid fa-user"></i></div>
                            <div><i class="fa-solid fa-user"></i></div>
                            <div>+500</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal para Escribir / Añadir Reseña -->
<div class="modal-backdrop" id="addReviewModal" style="display:none; z-index: 1050;">
    <div style="background:#fff; width:90%; max-width:450px; padding:25px; border-radius:12px; position:relative; margin:auto; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
        <button type="button" id="btnCloseAddReview" style="position:absolute; top:15px; right:15px; background:none; border:none; font-size:20px; cursor:pointer; color:#666;"><i class="fa-solid fa-xmark"></i></button>
        <h3 style="margin-top:0; margin-bottom:15px; color:#2c3e50;">Añadir Reseña</h3>

        <form id="formAddReview">
            <input type="hidden" id="reviewServiceId" name="idServicio">

            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:6px; font-weight:600; font-size:14px; color:#333;">Calificación:</label>
                <div id="starRatingInput" style="font-size:26px; color:#ddd; cursor:pointer;">
                    <i class="fa-solid fa-star star-btn" data-value="1"></i>
                    <i class="fa-solid fa-star star-btn" data-value="2"></i>
                    <i class="fa-solid fa-star star-btn" data-value="3"></i>
                    <i class="fa-solid fa-star star-btn" data-value="4"></i>
                    <i class="fa-solid fa-star star-btn" data-value="5"></i>
                </div>
                <input type="hidden" id="reviewRating" name="calificacion" value="5">
            </div>

            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:6px; font-weight:600; font-size:14px; color:#333;">Comentario (Máx. 4000 caracteres):</label>
                <textarea id="reviewComment" name="comentario" maxlength="4000" rows="4" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:6px; font-family:inherit; resize:vertical;" placeholder="Cuéntanos tu experiencia con este servicio..."></textarea>
                <small style="color:#777; display:block; text-align:right; margin-top:4px;" id="charCount">0 / 4000</small>
            </div>

            <button type="submit" style="width:100%; background:#5f6757; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:600; cursor:pointer; font-size:14px;">Guardar Reseña</button>
        </form>
    </div>
</div>

<!-- 2. Modal del Calendario -->
<div class="modal-backdrop" id="calendarModal">
    <button class="modal-close-floating modal-back-calendar" style="position: absolute; top: 20px; right: 20px; z-index: 1000;"><i class="fa-solid fa-xmark"></i></button>
    <div class="calendar-layout-container">
        <div class="calendar-sidebar-left">
            <div class="calendar-card-white">
                <div class="mini-cal-header"><i class="fa-solid fa-chevron-left mini-cal-nav"></i><span>Agosto 2026</span><i class="fa-solid fa-chevron-right mini-cal-nav"></i></div>
                <div class="mini-cal-grid">
                    <div class="mini-cal-day-name">Su</div><div class="mini-cal-day-name">Mo</div><div class="mini-cal-day-name">Tu</div><div class="mini-cal-day-name">We</div><div class="mini-cal-day-name">Th</div><div class="mini-cal-day-name">Fr</div><div class="mini-cal-day-name">Sa</div>
                    <div class="mini-cal-date faded">25</div><div class="mini-cal-date faded">26</div><div class="mini-cal-date faded">27</div><div class="mini-cal-date faded">28</div><div class="mini-cal-date faded">29</div><div class="mini-cal-date">1</div><div class="mini-cal-date">2</div>
                    <div class="mini-cal-date">3</div><div class="mini-cal-date">4</div><div class="mini-cal-date">5</div><div class="mini-cal-date">6</div><div class="mini-cal-date">7</div><div class="mini-cal-date">8</div><div class="mini-cal-date active">9</div>
                    <div class="mini-cal-date">10</div><div class="mini-cal-date">11</div><div class="mini-cal-date">12</div><div class="mini-cal-date">13</div><div class="mini-cal-date">14</div><div class="mini-cal-date">15</div><div class="mini-cal-date">16</div>
                    <div class="mini-cal-date">17</div><div class="mini-cal-date">18</div><div class="mini-cal-date">19</div><div class="mini-cal-date">20</div><div class="mini-cal-date">21</div><div class="mini-cal-date">22</div><div class="mini-cal-date">23</div>
                    <div class="mini-cal-date">24</div><div class="mini-cal-date">25</div><div class="mini-cal-date">26</div><div class="mini-cal-date">27</div><div class="mini-cal-date">28</div><div class="mini-cal-date">29</div><div class="mini-cal-date">30</div>
                    <div class="mini-cal-date">31</div><div class="mini-cal-date faded">1</div><div class="mini-cal-date faded">2</div><div class="mini-cal-date faded">3</div><div class="mini-cal-date faded">4</div><div class="mini-cal-date faded">5</div><div class="mini-cal-date faded">6</div>
                </div>
            </div>
            <div class="calendar-card-white promo-banner-card">
                <h3>Tu belleza,<br>nuestra prioridad</h3>
                <p>Descubre tratamientos<br>personalizados para ti</p>
                <button class="promo-btn" id="btnVerCatalogo">Ver catálogo</button>
            </div>
        </div>

        <div class="calendar-main-area">
            <div class="calendar-main-header">
                <div class="calendar-controls">
                    <button class="btn-cal-control">Hoy</button>
                    <button class="btn-cal-control btn-cal-icon"><i class="fa-solid fa-chevron-left"></i></button>
                    <button class="btn-cal-control btn-cal-icon"><i class="fa-solid fa-chevron-right"></i></button>
                </div>
                <div class="specialist-select-area">
                    <label>Elige a tu especialista:</label>
                    <select class="specialist-select">
                        <option>Cualquiera, Mejor disponible</option>
                        <option>Ana Torres</option>
                    </select>
                </div>
            </div>
            <div class="week-grid-container">
                <div class="week-header-row">
                    <div></div>
                    <div class="week-day-header"><span class="day-name">Lun</span><span class="day-number">17</span></div>
                    <div class="week-day-header"><span class="day-name">Mar</span><span class="day-number">18</span></div>
                    <div class="week-day-header"><span class="day-name">Mié</span><span class="day-number">19</span></div>
                    <div class="week-day-header"><span class="day-name">Jue</span><span class="day-number">20</span></div>
                    <div class="week-day-header"><span class="day-name">Vie</span><span class="day-number">21</span></div>
                    <div class="week-day-header"><span class="day-name">Sáb</span><span class="day-number">22</span></div>
                    <div class="week-day-header"><span class="day-name">Dom</span><span class="day-number">23</span></div>
                </div>

                <div class="week-body-wrapper">
                    <div class="time-axis">
                        <div class="time-label">8:00</div>
                        <div class="time-label">9:00</div>
                        <div class="time-label">10:00</div>
                        <div class="time-label">11:00</div>
                        <div class="time-label">12:00</div>
                        <div class="time-label">13:00</div>
                        <div class="time-label">14:00</div>
                        <div class="time-label">15:00</div>
                        <div class="time-label">16:00</div>
                        <div class="time-label">17:00</div>
                        <div class="time-label">18:00</div>
                    </div>

                    <div class="day-column">
                        <div class="event-slot slot-grey" style="top: 0px; height: 60px;"><strong>08:00 AM</strong><span>Fuera de horario</span></div>
                        <div class="event-slot slot-white btn-select-slot" data-hora="10:00:00" style="top: 120px; height: 50px;"><strong>10:00 AM</strong><span>Disponible</span></div>
                        <div class="event-slot slot-white btn-select-slot" data-hora="12:00:00" style="top: 240px; height: 50px;"><strong>12:00 PM</strong><span>Disponible</span></div>
                        <div class="event-slot slot-grey" style="top: 540px; height: 60px;"><strong>17:00 PM</strong><span>Fuera de horario</span></div>
                    </div>

                    <div class="day-column">
                        <div class="event-slot slot-grey" style="top: 0px; height: 60px;"><strong>08:00 AM</strong><span>Fuera de horario</span></div>
                        <div class="event-slot slot-white btn-select-slot" data-hora="10:00:00" style="top: 120px; height: 50px;"><strong>10:00 AM</strong><span>Disponible</span></div>
                        <div class="event-slot slot-green" style="top: 180px; height: 110px;">
                            <strong>11:00 AM</strong><span>Facial profundo</span><span style="display:block; margin-top:2px;">Ocupado - Ana Torres</span>
                        </div>
                        <div class="event-slot slot-white btn-select-slot" data-hora="14:00:00" style="top: 360px; height: 50px;"><strong>14:00 PM</strong><span>Disponible</span></div>
                        <div class="event-slot slot-grey" style="top: 540px; height: 60px;"><strong>17:00 PM</strong><span>Fuera de horario</span></div>
                    </div>

                    <div class="day-column">
                        <div class="event-slot slot-grey" style="top: 0px; height: 60px;"><strong>08:00 AM</strong><span>Fuera de horario</span></div>
                        <div class="event-slot slot-white btn-select-slot" data-hora="10:00:00" style="top: 120px; height: 50px;"><strong>10:00 AM</strong><span>Disponible</span></div>
                        <div class="event-slot slot-white btn-select-slot" data-hora="11:00:00" style="top: 180px; height: 50px;"><strong>11:00 AM</strong><span>Disponible</span></div>
                        <div class="event-slot slot-white btn-select-slot" data-hora="12:00:00" style="top: 240px; height: 50px;"><strong>12:00 PM</strong><span>Disponible</span></div>
                        <div class="event-slot slot-grey" style="top: 540px; height: 60px;"><strong>17:00 PM</strong><span>Fuera de horario</span></div>
                    </div>

                    <div class="day-column">
                        <div class="event-slot slot-grey" style="top: 0px; height: 60px;"><strong>08:00 AM</strong><span>Fuera de horario</span></div>
                        <div class="event-slot slot-white btn-select-slot" data-hora="10:00:00" style="top: 120px; height: 50px;"><strong>10:00 AM</strong><span>Disponible</span></div>
                        <div class="event-slot slot-white btn-select-slot" data-hora="13:00:00" style="top: 300px; height: 50px;"><strong>13:00 PM</strong><span>Disponible</span></div>
                        <div class="event-slot slot-grey" style="top: 540px; height: 60px;"><strong>17:00 PM</strong><span>Fuera de horario</span></div>
                    </div>

                    <div class="day-column">
                        <div class="event-slot slot-grey" style="top: 0px; height: 60px;"><strong>08:00 AM</strong><span>Fuera de horario</span></div>
                        <div class="event-slot slot-white btn-select-slot" data-hora="11:00:00" style="top: 180px; height: 50px;"><strong>11:00 AM</strong><span>Disponible</span></div>
                        <div class="event-slot slot-green" style="top: 300px; height: 55px;">
                            <strong>13:00 PM</strong><span>Masaje de espalda</span><span style="display:block;">Ocupado - Ana Torres</span>
                        </div>
                        <div class="event-slot slot-white btn-select-slot" data-hora="14:00:00" style="top: 360px; height: 50px;"><strong>14:00 PM</strong><span>Disponible</span></div>
                        <div class="event-slot slot-grey" style="top: 540px; height: 60px;"><strong>17:00 PM</strong><span>Fuera de horario</span></div>
                    </div>

                    <div class="day-column">
                        <div class="event-slot slot-grey" style="top: 0px; height: 60px;"><strong>08:00 AM</strong><span>Fuera de horario</span></div>
                        <div class="event-slot slot-white btn-select-slot" data-hora="10:00:00" style="top: 120px; height: 50px;"><strong>10:00 AM</strong><span>Disponible</span></div>
                        <div class="event-slot slot-white btn-select-slot" data-hora="12:00:00" style="top: 240px; height: 50px;"><strong>12:00 PM</strong><span>Disponible</span></div>
                        <div class="event-slot slot-grey" style="top: 540px; height: 60px;"><strong>17:00 PM</strong><span>Fuera de horario</span></div>
                    </div>

                    <div class="day-column">
                        <div class="event-slot slot-grey" style="top: 0px; height: 600px;"><strong>08:00 AM - 18:00 PM</strong><span>Cerrado</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 3. Modal: Resumen de Nueva Cita -->
<div class="modal-backdrop" id="newAppointmentModal">
    <div class="new-appointment-box">
        <h2 class="new-appointment-title">Nueva cita.</h2>
        <div class="form-group-readonly">
            <label>Servicio</label>
            <div class="readonly-input" id="confirmServiceName">Masaje de espalda</div>
        </div>
        <div class="form-group-readonly">
            <label>Especialista asignado</label>
            <div class="readonly-input" id="confirmSpecialist">Ana Torres</div>
        </div>
        <div class="form-group-readonly">
            <label>Fecha</label>
            <div class="readonly-input" id="confirmDate">09 de Agosto, 2026</div>
        </div>
        <div class="form-group-readonly">
            <label>Hora</label>
            <div class="readonly-input" id="confirmTime">14:00 P.M</div>
        </div>
        <button class="btn-proceed-pay" id="btnProceedPay">Proceder al pago</button>
        <button class="btn-go-back" id="btnGoBackAppt">← Volver atrás</button>
    </div>
</div>

<!-- 4. Modal: Selecciona tu Método de Pago -->
<div class="modal-backdrop" id="paymentModal">
    <div class="payment-modal-box">
        <div class="payment-header">
            <h2>Selecciona tu metodo de pago</h2>
            <p>Elige el metodo de pago que prefieras, tu pago esta 100% asegurado</p>
        </div>

        <div class="payment-body">
            <div class="payment-left-col">
                <h3 class="col-title">Resumen del servicio</h3>
                <div class="summary-item">
                    <div class="summary-icon"><i class="fa-solid fa-shirt"></i></div>
                    <div class="summary-text"><strong>Servicio</strong><span id="payServiceName">Masaje de espalda</span></div>
                </div>
                <div class="summary-item">
                    <div class="summary-icon"><i class="fa-regular fa-circle-user"></i></div>
                    <div class="summary-text"><strong>Profesional</strong><span id="paySpecialist">Ana Torres</span></div>
                </div>
                <div class="summary-item">
                    <div class="summary-icon"><i class="fa-regular fa-calendar"></i></div>
                    <div class="summary-text"><strong>Fecha y hora</strong><span id="payDateTime">09 de Agosto, 2026</span></div>
                </div>

                <div class="summary-totals">
                    <div class="summary-row"><span class="label">Subtotal</span><span class="value" id="paySubtotal">$480 MXN</span></div>
                    <div class="summary-row total-row"><span class="label">Total</span><span class="value" id="payTotal">$500 MXN</span></div>
                </div>

                <div class="safe-payment-badge">
                    <i class="fa-solid fa-shield-halved"></i>
                    <div class="safe-payment-text"><strong>Pago seguro</strong><span>Tus datos estan protegidos</span></div>
                </div>
            </div>

            <div class="payment-right-col">
                <h3 class="col-title">Selecciona tu metodo de pago</h3>
                <div class="payment-option active">
                    <div class="payment-radio"></div>
                    <div class="payment-info"><strong>Efectivo</strong><span>Paga desde tienda</span></div>
                    <div class="payment-icon-right"><i class="fa-solid fa-money-bill-wave"></i></div>
                </div>
                <div class="payment-option">
                    <div class="payment-radio"></div>
                    <div class="payment-info"><strong>Tarjeta de credito</strong><span>Visa, AmericanExpress, MasterCard</span></div>
                    <div class="payment-icon-right"><i class="fa-brands fa-cc-visa" style="color: #1434CB;"></i><i class="fa-brands fa-cc-amex" style="color: #002663;"></i><i class="fa-brands fa-cc-mastercard" style="color: #EB001B;"></i></div>
                </div>
                <div class="payment-option">
                    <div class="payment-radio"></div>
                    <div class="payment-info"><strong>Tarjeta de debito</strong><span>Paga desde tu banca en linea</span></div>
                    <div class="payment-icon-right"><i class="fa-regular fa-credit-card"></i></div>
                </div>
                <div class="payment-option">
                    <div class="payment-radio"></div>
                    <div class="payment-info"><strong>Transferencia</strong><span>Paga desde tu telefono con tu aplicacion</span></div>
                    <div class="payment-icon-right"><i class="fa-solid fa-mobile-screen-button"></i></div>
                </div>
                <div class="payment-option">
                    <div class="payment-radio"></div>
                    <div class="payment-info"><strong>Cortesia</strong><span>Introduce tu cupon de cortesia</span></div>
                    <div class="payment-icon-right"><i class="fa-solid fa-ticket"></i></div>
                </div>
            </div>
        </div>

        <div class="payment-actions">
            <button class="btn-payment-back" id="btnGoBackPayment">← Volver atras</button>
            <button class="btn-payment-confirm" id="btnConfirmFinal">Confirmar cita</button>
        </div>
    </div>
</div>

<!-- 5. Modal de Confirmación FINAL -->
<div class="modal-backdrop" id="confirmationModal">
    <div class="modal-box confirmation-box">
        <div class="confirmation-icon"><i class="fa-solid fa-circle-check"></i></div>
        <h3>Cita confirmada</h3>
        <p>Tu cita quedó registrada exitosamente. Puedes volver al catálogo.</p>
        <button class="btn-confirm" type="button">Volver a catálogo</button>
    </div>
</div>

<script>
    window.contextPath = '${pageContext.request.contextPath}';
</script>
</body>
</html>