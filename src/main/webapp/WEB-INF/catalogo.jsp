<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="com.proyecto.sgccosmetproject.model.Usuario" %>
<%@ page import="com.proyecto.sgccosmetproject.model.Servicio" %>
<%!
    // Escapa un valor para insertarlo de forma segura en un atributo HTML
    private String attr(String v) {
        if (v == null) return "";
        return v.replace("&", "&amp;").replace("\"", "&quot;")
                .replace("<", "&lt;").replace(">", "&gt;");
    }
%>
<%
    Usuario usuarioActivo = (Usuario) session.getAttribute("usuarioSesion");
    if (usuarioActivo == null) {
        response.sendRedirect(request.getContextPath() + "/login");
        return;
    }
    List<Servicio> listaServicios = (List<Servicio>) request.getAttribute("listaServicios");

    String nombre = usuarioActivo.getNombreCompleto() != null ? usuarioActivo.getNombreCompleto() : "";
    String fotoSrc = (usuarioActivo.getFotoPerfil() != null && !usuarioActivo.getFotoPerfil().isEmpty())
            ? usuarioActivo.getFotoPerfil()
            : "https://www.gravatar.com/avatar/?d=mp&s=150";
    String imgDefault = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=500";
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
    <script>
        window.contextPath = '${pageContext.request.contextPath}';
    </script>
    <script src="${pageContext.request.contextPath}/js/catalogo.js" defer></script>
</head>
<body class="catalog-page">
    <div class="main-wrapper">
        <div class="bg-overlay"></div>

        <div class="menu-overlay" id="menuOverlay"></div>

        <aside class="sidebar-menu" id="sidebarMenu">
            <div class="sidebar-user-box">
                <div class="sidebar-user-avatar" id="sidebarUserAvatar" style="cursor:pointer;">
                    <img id="sidebarProfileImg" src="<%= fotoSrc %>" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover">
                </div>
                <div class="sidebar-user-meta">
                    <span class="sidebar-user-name"><%= nombre %></span>
                    <span class="sidebar-user-role">Cliente</span>
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

                <div class="user-profile">
                    <div class="user-avatar" aria-label="Avatar del cliente">
                        <img src="<%= fotoSrc %>" alt="Avatar del cliente" style="width:36px;height:36px;border-radius:50%;object-fit:cover">
                    </div>
                    <div class="user-meta">
                        <span class="user-name"><%= nombre %></span>
                        <span class="user-role">Cliente</span>
                    </div>
                </div>
            </div>
        </header>

        <main class="catalog-container">
            <div class="catalog-header">
                <div class="hero-texts">
                    <h1 class="text-catalog">Catalogo:</h1>
                </div>
            </div>

            <div class="catalog-content">
                <div class="services-grid">
                    <%
                        if (listaServicios != null && !listaServicios.isEmpty()) {
                            int idx = 0;
                            for (Servicio s : listaServicios) {
                                String img = (s.getImagenUrl() != null && !s.getImagenUrl().isEmpty()) ? s.getImagenUrl() : imgDefault;
                                String precioTxt = String.format("$%.0f MXN", s.getPrecio());
                                String dur = s.getDuracion() != null ? s.getDuracion() : "";
                                String cat = s.getCategoria() != null ? s.getCategoria() : "";
                                String desc = s.getDescripcion() != null ? s.getDescripcion() : "";
                                String inc = s.getIncluye() != null ? s.getIncluye() : "";
                                String hidden = idx >= 6 ? " hidden-card" : "";
                    %>
                    <article class="service-card<%= hidden %>"
                             data-id="<%= s.getIdServicio() %>"
                             data-title="<%= attr(s.getNombre()) %>"
                             data-price="<%= s.getPrecio() %>"
                             data-duration="<%= attr(dur) %>"
                             data-category="<%= attr(cat) %>"
                             data-desc="<%= attr(desc) %>"
                             data-includes="<%= attr(inc) %>"
                             data-image="<%= attr(img) %>">
                        <div class="service-img-container">
                            <img src="<%= attr(img) %>" alt="<%= attr(s.getNombre()) %>" class="service-img">
                        </div>
                        <div class="service-info">
                            <h3 class="service-title"><%= s.getNombre() %></h3>
                            <div class="service-meta">
                                <div class="service-meta-row">
                                    <span class="service-meta-label">Disponibilidad</span>
                                    <span class="service-meta-value">Disponible</span>
                                </div>
                                <div class="service-meta-row">
                                    <span class="service-meta-label">Precio</span>
                                    <span class="service-meta-value"><%= precioTxt %></span>
                                </div>
                                <div class="service-meta-row">
                                    <span class="service-meta-label">Duración</span>
                                    <span class="service-meta-value"><%= dur.isEmpty() ? "1 h" : dur %></span>
                                </div>
                                <div class="service-meta-row">
                                    <span class="service-meta-label">Categoría</span>
                                    <span class="service-meta-value rating"><%= cat.isEmpty() ? "General" : cat %></span>
                                </div>
                            </div>
                            <button class="cta-arrow" aria-label="Ver detalles"><i class="fa-solid fa-arrow-right"></i></button>
                        </div>
                    </article>
                    <%
                                idx++;
                            }
                        } else {
                    %>
                    <p style="color:#fff;padding:20px;">No hay servicios disponibles por el momento.</p>
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

    <!-- MODAL 1: INFORMACIÓN DEL SERVICIO -->
    <div class="modal-backdrop" id="serviceModal">
        <div class="modal-box modal-large">
            <button class="modal-close"><i class="fa-solid fa-xmark"></i></button>

            <div class="modal-body-content">
                <div class="modal-img-wrapper">
                    <img id="modalImg" src="" alt="Imagen del Servicio" class="modal-img">
                </div>

                <div class="modal-main-details">
                    <div>
                        <span id="modalCategory" class="service-category"></span>
                        <h3 id="modalTitle" class="modal-title-custom"></h3>
                        <p id="modalDesc" class="modal-desc-custom"></p>

                        <div class="service-meta-row">
                            <div class="meta-item"><i class="fa-solid fa-circle-check"></i><div><strong id="modalAvailability">Disponibilidad</strong><div class="muted">Disponible</div></div></div>
                            <div class="meta-item"><i class="fa-regular fa-clock"></i><div><strong>Duracion</strong><div class="muted" id="modalDuration">--</div></div></div>
                            <div class="meta-item"><i class="fa-solid fa-star"></i><div><strong id="modalRating">0.0</strong><div class="muted" id="modalRatingCount">(0 opiniones)</div></div></div>
                        </div>

                        <h4 class="includes-heading">Incluye</h4>
                        <div class="includes-grid" id="modalIncludesGrid">
                        </div>

                        <div class="review-card">
                            <div class="review-header"><strong>Reseñas destacadas</strong></div>
                            <div class="review-body" id="reviewsListContainer">
                                <div class="review-content"><div class="review-text muted">Cargando reseñas...</div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside class="modal-side-panel">
                    <div class="side-price">
                        <span class="side-price-label">Precio</span>
                        <strong id="modalPrice" class="side-price-value">$0 MXN</strong>
                        <button class="btn-book btn-agendar side-agendar">Agendar cita</button>
                    </div>

                    <div class="side-helpers">
                        <div class="side-row"><i class="fa-solid fa-shield-halved"></i> <div><strong>Pago seguro</strong><div class="muted">Tus datos están protegidos</div></div></div>
                        <div class="side-row"><i class="fa-solid fa-credit-card"></i> <div><strong>Métodos de pago</strong><div class="muted">Efectivo, tarjeta, transferencia</div></div></div>
                        <div class="side-row"><i class="fa-solid fa-spa"></i> <div><strong>Experiencia comprobada</strong><div class="muted">+500 servicios realizados</div></div></div>
                    </div>
                </aside>
            </div>
        </div>
    </div>

    <!-- MODAL 2: SELECCIÓN DE FECHA, HORA Y PROFESIONAL -->
    <div class="modal-backdrop" id="bookingModal">
        <div class="booking-box booking-redesign">
            <button class="modal-close modal-back" aria-label="Volver"><i class="fa-solid fa-arrow-left"></i></button>
            <div class="booking-sidebar">
                <div class="calendar-card">
                    <div class="calendar-toolbar">
                        <button type="button" class="calendar-nav" aria-label="Mes anterior"><i class="fa-solid fa-chevron-left"></i></button>
                        <strong id="bookingMonthLabel">Agosto 2026</strong>
                        <button type="button" class="calendar-nav" aria-label="Mes siguiente"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                    <button type="button" class="calendar-today">Hoy</button>
                    <div class="calendar-weekdays"><span>Do</span><span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sa</span></div>
                    <div class="calendar-days" id="bookingCalendarDays" aria-label="Calendario"></div>
                </div>
                <div class="booking-promo-card">
                    <span class="promo-kicker"></span>
                    <h3>Tu belleza,<br>nuestra prioridad</h3>
                    <p>Descubre tratamientos personalizados para ti.</p>
                    <button type="button" class="promo-catalog-btn">Ver catálogo</button>
                </div>
            </div>
            <div class="booking-schedule">
                <div class="booking-schedule-top">
                    <div>
                        <span class="booking-eyebrow">RESERVA TU CITA</span>
                        <h3 id="bookingServiceName">Nombre del Servicio</h3>
                    </div>
                    <label class="specialist-picker">Elige a tu especialista:
                        <select id="bookingSpecialistSelect"><option value="1">Cualquiera. Mejor disponible</option></select>
                    </label>
                </div>
                <div class="booking-schedule-controls">
                    <button type="button" class="schedule-today">Hoy</button>
                    <button type="button" class="schedule-arrow" aria-label="Semana anterior"><i class="fa-solid fa-chevron-left"></i></button>
                    <button type="button" class="schedule-arrow" aria-label="Semana siguiente"><i class="fa-solid fa-chevron-right"></i></button>
                    <label for="bookingPromotionSelect">Promoción</label>
                    <select id="bookingPromotionSelect"><option value="">Sin promoción</option></select>
                </div>
                <div class="schedule-grid">
                    <div class="schedule-time-column"></div>
                    <div class="schedule-days">
                        <div class="schedule-day-head" id="bookingScheduleDays"></div>
                        <div class="schedule-slots" id="bookingScheduleSlots"></div>
                    </div>
                </div>
                <div class="booking-footer booking-redesign-footer">
                    <div class="booking-summary"><span>Total de tu reserva</span><strong id="bookingPrice">$0 MXN</strong></div>
                    <button class="btn-pay">Siguiente <i class="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL 3: CONFIRMACIÓN DE CITA -->
    <div class="modal-backdrop" id="confirmationModal">
        <div class="modal-box confirmation-box appointment-confirmation-box">
            <h3 id="confirmationTitle">Nueva cita.</h3>
            <div class="confirmation-details">
                <label>Servicio<span id="confirmationService">--</span></label>
                <label>Especialista asignado<span id="confirmationSpecialist">--</span></label>
                <label>Fecha<span id="confirmationDate">--</span></label>
                <label>Hora<span id="confirmationTime">--</span></label>
            </div>
            <button class="btn-confirm confirmation-primary">Confirmar cita</button>
            <button class="btn-confirm confirmation-secondary"> <i class="fa-solid fa-arrow-left"></i> Volver atrás</button>
            <div class="confirmation-success" id="confirmationSuccess" hidden>
                <div class="confirmation-success-icon" aria-hidden="true"><i class="fa-regular fa-circle-check"></i></div>
                <h3 id="confirmationSuccessTitle">Cita confirmada</h3>
                <p id="confirmationSuccessMessage">Se agendó tu cita con éxito.<br>Te esperamos en la fecha y hora seleccionados</p>
                <button type="button" class="btn-confirm return-to-catalog">Regresar al catalogo</button>
            </div>
        </div>
    </div>
</body>
</html>
