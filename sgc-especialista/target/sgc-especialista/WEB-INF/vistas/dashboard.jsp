<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<c:set var="tituloPagina" value="Dashboard - SGC Cosmetic" scope="request" />
<!DOCTYPE html>
<html lang="es">
<head>
    <jsp:include page="/WEB-INF/vistas/includes/head.jsp" />
</head>
<body>

<jsp:include page="/WEB-INF/vistas/includes/sidebar.jsp" />

<div class="sgc-app-shell">
    <jsp:include page="/WEB-INF/vistas/includes/topbar.jsp" />

    <main class="sgc-contenido flex-grow-1">
        <jsp:include page="/WEB-INF/vistas/includes/alertas.jsp" />

        <div class="sgc-encabezado-hero mb-3">
            <h1 class="fuente-titulo mb-1">Hola de nuevo, <c:out value="${empleado.nombreCompleto}" /></h1>
            <p class="sgc-subtitulo mb-0">
                Hoy: <c:out value="${fechaHoyTexto}" />, aqui tienes un resumen de tu jornada de hoy
            </p>
        </div>

        <!-- Tarjetas de estadisticas -->
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
                    <div class="sgc-subtitulo">Pendiente</div>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat h-100">
                    <div class="sgc-stat-icono"><i class="bi bi-check2-circle"></i></div>
                    <div class="sgc-stat-valor"><c:out value="${completadasHoy}" /></div>
                    <div class="sgc-subtitulo">Citas completadas</div>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat h-100">
                    <div class="sgc-stat-icono"><i class="bi bi-star"></i></div>
                    <div class="sgc-stat-valor"><fmt:formatNumber value="${empleado.calificacionPromedio}" maxFractionDigits="1" minFractionDigits="1" /></div>
                    <div class="sgc-subtitulo">Calificacion promedio</div>
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
                                    <a class="sgc-fila-cita text-decoration-none text-dark"
                                       href="${pageContext.request.contextPath}/especialista/cita?id=${cita.idCita}">
                                        <div class="sgc-hora"><c:out value="${cita.horaInicioFormateada}" /></div>
                                        <div class="avatar-cliente"></div>
                                        <div class="flex-grow-1">
                                            <div class="fw-semibold"><c:out value="${cita.cliente.nombreCompleto}" /></div>
                                            <div class="small text-muted"><c:out value="${cita.servicio}" /></div>
                                        </div>
                                        <span class="badge-estado ${cita.claseBadge}"><c:out value="${cita.etiquetaEstado}" /></span>
                                    </a>
                                </c:forEach>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>
            </div>

            <!-- Proximas citas -->
            <div class="col-lg-4 d-flex" style="min-height:0;">
                <div class="sgc-card sgc-card-alta h-100 w-100">
                    <div class="card-header-plano">
                        <h2 class="h6 mb-0">Proximas citas</h2>
                    </div>
                    <div class="pt-2 sgc-lista-scroll">
                        <c:choose>
                            <c:when test="${empty proximasCitas}">
                                <p class="text-center text-muted py-4 mb-0">No hay proximas citas registradas.</p>
                            </c:when>
                            <c:otherwise>
                                <c:forEach var="cita" items="${proximasCitas}">
                                    <a class="sgc-fila-cita text-decoration-none text-dark"
                                       href="${pageContext.request.contextPath}/especialista/cita?id=${cita.idCita}">
                                        <div class="avatar-cliente"></div>
                                        <div class="flex-grow-1">
                                            <div class="fw-semibold">
                                                <c:out value="${cita.fecha.equals(hoy.plusDays(1)) ? 'Manana' : cita.fechaFormateadaCorta}" />
                                                <c:out value="${cita.horaInicioFormateada}" />
                                            </div>
                                            <div class="small"><c:out value="${cita.servicio}" /></div>
                                            <div class="small text-muted"><c:out value="${cita.cliente.nombreCompleto}" /></div>
                                        </div>
                                    </a>
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
                            <div class="sgc-recordatorio">
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
<script src="${pageContext.request.contextPath}/assets/js/app.js"></script>
</body>
</html>
