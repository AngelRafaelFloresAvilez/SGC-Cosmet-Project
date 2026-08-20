<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<c:set var="tituloPagina" value="Dashboard Especialista - SGC Cosmetic" scope="request" />
<!DOCTYPE html>
<html lang="es">
<head>
    <jsp:include page="/WEB-INF/vistas_esp/includes/head.jsp" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/styles.css">

    <style>
        body {
            background-image:
            url('${pageContext.request.contextPath}/assets/img/fondo-especialista.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
        }
    </style>
</head>
<body>

<jsp:include page="/WEB-INF/vistas_esp/includes/sidebar.jsp" />

<div class="sgc-app-shell">
    <jsp:include page="/WEB-INF/vistas_esp/includes/topbar.jsp" />

    <main class="sgc-contenido flex-grow-1">
        <jsp:include page="/WEB-INF/vistas_esp/includes/alertas.jsp" />

        <div class="sgc-encabezado-hero mb-3">
            <h1 class="fuente-titulo mb-1">Hola de nuevo, <c:out value="${empleado.nombreCompleto}" /></h1>
            <p class="sgc-subtitulo mb-0">
                Hoy: <c:out value="${fechaHoyTexto}" />, aquí tienes un resumen de tu jornada.
            </p>
        </div>

        <!-- Tarjetas de estadísticas -->
        <div class="row g-3 mb-3">
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat h-100">
                    <div class="sgc-stat-icono"><i class="bi bi-calendar2-check"></i></div>
                    <div class="sgc-stat-valor"><c:out value="${totalCitasHoy}" /></div>
                    <div class="sgc-subtitulo">Citas hoy</div>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat h-100">
                    <div class="sgc-stat-icono"><i class="bi bi-clock"></i></div>
                    <div class="sgc-stat-valor"><c:out value="${pendientesHoy}" /></div>
                    <div class="sgc-subtitulo">Pendientes</div>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat h-100">
                    <div class="sgc-stat-icono"><i class="bi bi-check2-circle"></i></div>
                    <div class="sgc-stat-valor"><c:out value="${completadasHoy}" /></div>
                    <div class="sgc-subtitulo">Completadas</div>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat h-100">
                    <div class="sgc-stat-icono"><i class="bi bi-star"></i></div>
                    <div class="sgc-stat-valor">
                        <fmt:formatNumber value="${empleado.calificacionPromedio}" maxFractionDigits="1" minFractionDigits="1" />
                    </div>
                    <div class="sgc-subtitulo">Calificación promedio</div>
                </div>
            </div>
        </div>

        <div class="row g-3 flex-grow-1" style="min-height:0;">
            <!-- Agenda de hoy -->
            <div class="col-lg-5 d-flex" style="min-height:0;">
                <div class="sgc-card sgc-card-alta h-100 w-100">
                    <div class="card-header-plano">
                        <h2 class="h6 mb-0">Agenda hoy</h2>
                    </div>
                    <div class="pt-2 sgc-lista-scroll">
                        <c:choose>
                            <c:when test="${empty agendaHoy}">
                                <p class="text-center text-muted py-4 mb-0">No tienes citas programadas para hoy.</p>
                            </c:when>
                            <c:otherwise>
                                <c:forEach var="cita" items="${agendaHoy}">
                                    <div class="sgc-fila-cita d-flex align-items-center justify-content-between p-2 border-bottom">
                                        <div class="sgc-hora me-2 fw-bold"><c:out value="${cita.horaInicioFormateada}" /></div>
                                        <div class="flex-grow-1">
                                            <div class="fw-semibold"><c:out value="${cita.cliente.nombreCompleto}" /></div>
                                            <div class="small text-muted"><c:out value="${cita.servicio}" /></div>
                                        </div>
                                        <span class="badge ${cita.claseBadge}"><c:out value="${cita.etiquetaEstado}" /></span>
                                    </div>
                                </c:forEach>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>
            </div>

            <!-- Próximas citas -->
            <div class="col-lg-4 d-flex" style="min-height:0;">
                <div class="sgc-card sgc-card-alta h-100 w-100">
                    <div class="card-header-plano">
                        <h2 class="h6 mb-0">Próximas citas</h2>
                    </div>
                    <div class="pt-2 sgc-lista-scroll">
                        <c:choose>
                            <c:when test="${empty proximasCitas}">
                                <p class="text-center text-muted py-4 mb-0">No hay próximas citas registradas.</p>
                            </c:when>
                            <c:otherwise>
                                <c:forEach var="cita" items="${proximasCitas}">
                                    <div class="sgc-fila-cita p-2 border-bottom">
                                        <div class="fw-semibold">
                                            <c:out value="${cita.fechaFormateadaCorta}" /> - <c:out value="${cita.horaInicioFormateada}" />
                                        </div>
                                        <div class="small text-primary"><c:out value="${cita.servicio}" /></div>
                                        <div class="small text-muted"><c:out value="${cita.cliente.nombreCompleto}" /></div>
                                    </div>
                                </c:forEach>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>
            </div>

            <!-- Recordatorios -->
            <div class="col-lg-3 d-flex" style="min-height:0;">
                <div class="sgc-card sgc-card-alta h-100 w-100 p-3">
                    <h2 class="h6 mb-3">Recordatorios</h2>
                    <div class="sgc-lista-scroll">
                        <c:forEach var="rec" items="${recordatorios}">
                            <div class="sgc-recordatorio d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                                <span><i class="bi ${rec.icono} me-2"></i><c:out value="${rec.texto}" /></span>
                                <i class="bi bi-chevron-right"></i>
                            </div>
                        </c:forEach>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${pageContext.request.contextPath}/js/app.js"></script>
</body>
</html>