<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%--
    Si ya hay sesion activa, mandamos directo al dashboard del especialista en vez de
    mostrar la landing de nuevo.
--%>
<c:set var="rolSesion" value="${sessionScope.rol}" />
<c:if test="${rolSesion == 'ESPECIALISTA'}">
    <c:redirect url="/especialista/dashboard" />
</c:if>

<c:if test="${empty rolSesion}">
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SGC Cosmetic - Sistema de gestion de servicios cosmetologicos</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${ctx}/assets/css/estilos.css">
    <link rel="stylesheet" href="${ctx}/assets/css/publico.css">
</head>
<body class="sgc-landing-body">

<header class="sgc-landing-topbar d-flex align-items-center justify-content-between">
    <button class="btn-icono" type="button" data-bs-toggle="offcanvas" data-bs-target="#sgcSidebarPublico" title="Abrir menu">
        <i class="bi bi-list"></i>
    </button>
    <div class="d-flex gap-2">
        <a href="${ctx}/login" class="btn btn-sgc-oscuro">Iniciar sesion</a>
    </div>
</header>

<!-- Menu lateral publico (Inicio / Iniciar sesion) -->
<div class="offcanvas offcanvas-start sgc-sidebar" tabindex="-1" id="sgcSidebarPublico">
    <div class="sgc-sidebar-header d-flex align-items-center justify-content-between">
        <span class="fw-semibold">Menu</span>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
    </div>
    <div class="nav-section-title">General</div>
    <nav class="nav flex-column mb-2">
        <a class="nav-link activo" href="${ctx}/"><i class="bi bi-house"></i> Inicio</a>
        <a class="nav-link" href="${ctx}/login"><i class="bi bi-box-arrow-in-right"></i> Iniciar sesion</a>
    </nav>
    <div class="marca-footer mt-auto">SGC COSMETIC</div>
</div>

<section class="sgc-hero">
    <div class="sgc-hero-texto">
        <h1 class="fuente-titulo sgc-hero-titulo">SGC<br>COSMETIC</h1>
        <div class="sgc-hero-linea"></div>
        <h2 class="sgc-hero-subtitulo">Sistema de gestion de servicios cosmetologicos</h2>
        <p class="sgc-hero-parrafo">Una plataforma integral para administrar, organizar y hacer crecer tu negocio.</p>

        <div class="row g-3 mt-2">
            <div class="col-sm-6">
                <div class="sgc-feature">
                    <span class="sgc-feature-icono"><i class="bi bi-calendar2-check"></i></span>
                    <div>
                        <strong>Agenda inteligente</strong>
                        <p class="mb-0">Gestiona citas, recordatorios y disponibilidad en tiempo real.</p>
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="sgc-feature">
                    <span class="sgc-feature-icono"><i class="bi bi-people"></i></span>
                    <div>
                        <strong>Gestion de clientes</strong>
                        <p class="mb-0">Historial, preferencias y contacto de cada cliente en un solo lugar.</p>
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="sgc-feature">
                    <span class="sgc-feature-icono"><i class="bi bi-bag-check"></i></span>
                    <div>
                        <strong>Catalogo de servicios</strong>
                        <p class="mb-0">Publica tus servicios con precios, duracion y disponibilidad.</p>
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="sgc-feature">
                    <span class="sgc-feature-icono"><i class="bi bi-bar-chart"></i></span>
                    <div>
                        <strong>Reportes y estadisticas</strong>
                        <p class="mb-0">Visualiza el desempeno de tu negocio y tus especialistas.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="sgc-hero-foto"></div>
</section>

<section class="sgc-landing-franja">
    <div class="sgc-franja-item">
        <i class="bi bi-shield-check"></i>
        <div>
            <strong>Seguro y confiable</strong>
            <p class="mb-0">Protegemos la info de tu negocio y clientes.</p>
        </div>
    </div>
    <div class="sgc-franja-item">
        <i class="bi bi-cloud-check"></i>
        <div>
            <strong>Desde cualquier lugar</strong>
            <p class="mb-0">Ingresa desde cualquier dispositivo.</p>
        </div>
    </div>
    <div class="sgc-franja-item">
        <i class="bi bi-shield-lock"></i>
        <div>
            <strong>Respaldo automatico</strong>
            <p class="mb-0">Tu informacion siempre guardada y respaldada.</p>
        </div>
    </div>
    <div class="sgc-franja-item">
        <i class="bi bi-headset"></i>
        <div>
            <strong>Soporte tecnico</strong>
            <p class="mb-0">Estamos aqui para ayudarte siempre que lo necesites.</p>
        </div>
    </div>
</section>

<footer class="sgc-landing-footer">
    <span><i class="bi bi-envelope"></i> contacto@sgccosmetic.com</span>
    <span><i class="bi bi-telephone"></i> +52 567 850 4567</span>
    <span class="sgc-landing-redes">
        <i class="bi bi-facebook"></i>
        <i class="bi bi-instagram"></i>
        <i class="bi bi-whatsapp"></i>
        @sgccosmetic
    </span>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
</c:if>
