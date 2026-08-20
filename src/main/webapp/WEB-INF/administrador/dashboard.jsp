<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<c:set var="tituloPagina" value="Dashboard - SGC Cosmetic" scope="request" />
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
    <jsp:include page="/WEB-INF/vistas_admin/includes/head.jsp" />
    <link rel="stylesheet" href="${ctx}/assets/css/admin.css">
</head>
<body>

<jsp:include page="/WEB-INF/vistas_admin/includes/sidebar.jsp" />

<div class="sgc-app-shell">
    <jsp:include page="/WEB-INF/vistas_admin/includes/topbar.jsp" />

    <main class="sgc-contenido flex-grow-1">
        <jsp:include page="/WEB-INF/vistas_admin/includes/alertas.jsp" />

        <div class="sgc-encabezado-hero mb-3">
            <h1 class="fuente-titulo mb-1">Hola de nuevo, administrador</h1>
            <p class="sgc-subtitulo mb-0">Hoy: <c:out value="${fechaHoyTexto}" />, aqui tienes un resumen del rendimiento del negocio</p>
        </div>

        <!-- Estadisticas -->
        <div class="row g-3 mb-3">
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-verde"><i class="bi bi-calendar2-check"></i></span>
                    <div><div class="valor"><c:out value="${citasHoy}" /></div><div class="etiqueta">Citas realizadas hoy</div></div>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-azul"><i class="bi bi-people"></i></span>
                    <div><div class="valor"><c:out value="${clientesRegistrados}" /></div><div class="etiqueta">Clientes registrados</div></div>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-morado"><i class="bi bi-person-badge"></i></span>
                    <div><div class="valor"><c:out value="${especialistasActivos}" /></div><div class="etiqueta">Especialistas activos</div></div>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-amarillo"><i class="bi bi-cash-coin"></i></span>
                    <div><div class="valor">$<fmt:formatNumber value="${ventasDelMes}" pattern="#,##0" /></div><div class="etiqueta">Ventas este mes</div></div>
                </div>
            </div>
        </div>

        <div class="row g-3 mb-3">
            <!-- Citas semanales -->
            <div class="col-lg-4">
                <div class="sgc-card p-3 h-100">
                    <h2 class="h6 mb-2">Citas semanales</h2>
                    <div class="sgc-grafica-barras">
                        <c:set var="maxCitas" value="1" />
                        <c:forEach var="entrada" items="${citasSemana}">
                            <c:if test="${entrada.value > maxCitas}"><c:set var="maxCitas" value="${entrada.value}" /></c:if>
                        </c:forEach>
                        <c:forEach var="entrada" items="${citasSemana}">
                            <div class="columna">
                                <div class="barra" style="height: ${(entrada.value / maxCitas) * 100}%;" title="${entrada.value} citas"></div>
                                <div class="etiqueta"><c:out value="${entrada.key.substring(0,3)}" /></div>
                            </div>
                        </c:forEach>
                    </div>
                </div>
            </div>

            <!-- Citas pendientes -->
            <div class="col-lg-4">
                <div class="sgc-card h-100">
                    <div class="card-header-plano">
                        <h2 class="h6 mb-0">Citas pendientes</h2>
                    </div>
                    <div class="pt-2">
                        <c:choose>
                            <c:when test="${empty citasPendientes}">
                                <p class="text-center text-muted py-4 mb-0">No hay citas pendientes.</p>
                            </c:when>
                            <c:otherwise>
                                <c:forEach var="cita" items="${citasPendientes}">
                                    <div class="sgc-fila-cita">
                                        <div class="avatar-cliente"></div>
                                        <div class="flex-grow-1">
                                            <div class="fw-semibold"><c:out value="${cita.cliente.nombreCompleto}" /></div>
                                            <div class="small text-muted"><c:out value="${cita.servicio}" /></div>
                                        </div>
                                        <div class="text-end small text-muted">
                                            <c:out value="${cita.fechaFormateadaCorta}" /><br><c:out value="${cita.horaInicioFormateada}" />
                                        </div>
                                    </div>
                                </c:forEach>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>
            </div>

            <!-- Servicios mas solicitados -->
            <div class="col-lg-4">
                <div class="sgc-card h-100 p-3">
                    <h2 class="h6 mb-2">Servicios mas solicitados</h2>
                    <c:forEach var="entrada" items="${topServicios}">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span style="width:20px;height:20px;background:var(--sgc-verde-claro);border-radius:6px;flex-shrink:0;"></span>
                            <span class="flex-grow-1 small fw-semibold"><c:out value="${entrada.key}" /></span>
                            <span class="small text-muted"><c:out value="${entrada.value}" /> citas</span>
                        </div>
                    </c:forEach>
                    <c:if test="${empty topServicios}">
                        <p class="text-muted small mb-0">Todavia no hay citas registradas.</p>
                    </c:if>
                </div>
            </div>
        </div>

        <div class="row g-3">
            <!-- Actividad reciente -->
            <div class="col-lg-4">
                <div class="sgc-card h-100 p-3">
                    <h2 class="h6 mb-2">Actividad reciente</h2>
                    <c:forEach var="texto" items="${actividadReciente}">
                        <div class="sgc-actividad-item">
                            <span class="sgc-actividad-icono" style="background: var(--sgc-verde-clarisimo); color: var(--sgc-verde);">
                                <i class="bi bi-calendar-event"></i>
                            </span>
                            <span class="small"><c:out value="${texto}" /></span>
                        </div>
                    </c:forEach>
                    <c:if test="${empty actividadReciente}">
                        <p class="text-muted small mb-0">Todavia no hay actividad registrada.</p>
                    </c:if>
                </div>
            </div>

            <!-- Recordatorios -->
            <div class="col-lg-4">
                <div class="sgc-card h-100 p-3">
                    <h2 class="h6 mb-3">Recordatorios</h2>
                    <div class="sgc-recordatorio">
                        <span><i class="bi bi-calendar-event me-2"></i>Tienes <c:out value="${citasPendientes.size()}" /> citas pendientes por confirmar</span>
                    </div>
                    <a href="#" data-bs-toggle="modal" data-bs-target="#modalInasistencias" class="sgc-recordatorio text-decoration-none text-dark">
                        <span><i class="bi bi-exclamation-triangle me-2"></i><c:out value="${clientesInasistencias.size()}" /> clientes tienen inasistencias registradas</span>
                        <i class="bi bi-chevron-right"></i>
                    </a>
                </div>
            </div>

            <!-- Especialistas disponibles -->
            <div class="col-lg-4">
                <div class="sgc-card h-100 p-3">
                    <h2 class="h6 mb-2">Especialistas disponibles</h2>
                    <c:forEach var="e" items="${especialistasDisponibles}">
                        <div class="sgc-fila-especialista">
                            <div class="avatar-cliente"></div>
                            <div class="flex-grow-1">
                                <div class="fw-semibold small"><c:out value="${e.nombreCompleto}" /></div>
                                <div class="small text-muted"><c:out value="${e.especialidad}" /></div>
                            </div>
                            <c:choose>
                                <c:when test="${e.estaOcupado}">
                                    <span class="badge-estado badge-pendiente">En cita</span>
                                </c:when>
                                <c:otherwise>
                                    <span class="badge-estado badge-confirmada">Disponible</span>
                                </c:otherwise>
                            </c:choose>
                        </div>
                    </c:forEach>
                    <c:if test="${empty especialistasDisponibles}">
                        <p class="text-muted small mb-0">No hay especialistas activos.</p>
                    </c:if>
                </div>
            </div>
        </div>
    </main>
</div>

<!-- Modal: Clientes con inasistencias -->
<div class="modal fade" id="modalInasistencias" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content sgc-modal-content">
            <div class="modal-header">
                <div>
                    <h3 class="fuente-titulo h5 mb-1">Clientes con inasistencias</h3>
                    <p class="text-muted small mb-0">Aqui puedes ver los clientes con inasistencias</p>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
                <c:forEach var="c" items="${clientesInasistencias}" varStatus="st">
                    <div class="sgc-fila-numerada">
                        <span class="sgc-numero-circulo"><c:out value="${st.index + 1}" /></span>
                        <span class="flex-grow-1"><c:out value="${c.nombreCompleto}" /></span>
                        <span class="badge-estado badge-cancelada"><c:out value="${c.faltas}" /> faltas</span>
                    </div>
                </c:forEach>
                <c:if test="${empty clientesInasistencias}">
                    <p class="text-muted small text-center py-3 mb-0">No hay clientes con inasistencias registradas.</p>
                </c:if>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${ctx}/js/appAdmin.js"></script>
</body>
</html>