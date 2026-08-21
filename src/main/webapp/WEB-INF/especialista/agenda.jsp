<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<c:set var="tituloPagina" value="Agenda - SGC Cosmetic" scope="request" />
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
    <jsp:include page="/WEB-INF/vistas_esp/includes/head.jsp" />
</head>
<body>

<jsp:include page="/WEB-INF/vistas_esp/includes/sidebar.jsp" />

<div class="sgc-app-shell">
    <jsp:include page="/WEB-INF/vistas_esp/includes/topbar.jsp" />

    <main class="sgc-contenido flex-grow-1">
        <jsp:include page="/WEB-INF/vistas_esp/includes/alertas.jsp" />

        <div class="d-flex flex-wrap justify-content-between align-items-start mb-3 gap-2">
            <div class="sgc-encabezado-hero">
                <h1 class="fuente-titulo mb-1">Agenda</h1>
                <p class="sgc-subtitulo mb-0">Administra tus citas y horarios</p>
            </div>
            <a href="${ctx}/especialista/agenda" class="btn btn-sgc"><i class="bi bi-arrow-repeat"></i> Ver todas las citas</a>
        </div>

        <div class="sgc-barra-herramientas d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div class="d-flex align-items-center gap-2">
                <a class="btn btn-outline-sgc btn-sm" href="${ctx}/especialista/agenda?vista=${vista}">Hoy</a>
                <a class="btn btn-icono" href="${ctx}/especialista/agenda?vista=${vista}&fecha=${fechaAnterior}">
                    <i class="bi bi-chevron-left"></i>
                </a>
                <span class="fw-semibold">
                    <c:choose>
                        <c:when test="${vista == 'semana'}">
                            <c:out value="${inicioSemana}" /> - <c:out value="${finSemana}" />
                        </c:when>
                        <c:otherwise><c:out value="${fechaRef}" /></c:otherwise>
                    </c:choose>
                </span>
                <a class="btn btn-icono" href="${ctx}/especialista/agenda?vista=${vista}&fecha=${fechaSiguiente}">
                    <i class="bi bi-chevron-right"></i>
                </a>
            </div>

            <div class="btn-group sgc-toggle-vista" role="group">
                <a class="btn ${vista == 'dia' ? 'btn-sgc' : 'btn-outline-sgc'}" href="${ctx}/especialista/agenda?vista=dia&fecha=${fechaRef}">Dia</a>
                <a class="btn ${vista == 'semana' ? 'btn-sgc' : 'btn-outline-sgc'}" href="${ctx}/especialista/agenda?vista=semana&fecha=${fechaRef}">Semana</a>
                <a class="btn ${vista == 'mes' ? 'btn-sgc' : 'btn-outline-sgc'}" href="${ctx}/especialista/agenda?vista=mes&fecha=${fechaRef}">Mes</a>
            </div>
        </div>

        <c:choose>
        <%-- ================= VISTA DIA ================= --%>
        <c:when test="${vista == 'dia'}">
            <div class="row g-3 flex-grow-1" style="min-height:0;">
                <div class="col-lg-8 d-flex" style="min-height:0;">
                    <div class="sgc-card sgc-card-alta h-100 w-100">
                        <div class="sgc-lista-scroll">
                        <c:choose>
                            <c:when test="${empty citasDelDia}">
                                <p class="text-center text-muted py-5 mb-0">No hay citas programadas para este dia.</p>
                            </c:when>
                            <c:otherwise>
                                <c:forEach var="cita" items="${citasDelDia}">
                                    <a class="sgc-fila-cita text-decoration-none text-dark"
                                       href="${ctx}/especialista/cita?id=${cita.idCita}">
                                        <div class="sgc-hora">
                                            <c:out value="${cita.horaInicioFormateada}" /><br>
                                            <span class="text-muted" style="font-size:.72rem;">- <c:out value="${cita.horaFinFormateada}" /></span>
                                        </div>
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

                <div class="col-lg-4 d-flex flex-column gap-3" style="min-height:0;">
                    <div class="sgc-card p-3">
                        <h2 class="h6">Proxima cita</h2>
                        <c:choose>
                            <c:when test="${proximaCita != null}">
                                <div class="d-flex align-items-center gap-2 mb-3">
                                    <div class="avatar-cliente" style="width:48px;height:48px;"></div>
                                    <div>
                                        <div class="fw-semibold"><c:out value="${proximaCita.cliente.nombreCompleto}" /></div>
                                        <div class="small text-muted"><c:out value="${proximaCita.servicio}" /></div>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center gap-2 small text-muted mb-3">
                                    <i class="bi bi-clock"></i>
                                    <c:out value="${proximaCita.horaInicioFormateada}" /> - <c:out value="${proximaCita.horaFinFormateada}" />
                                </div>
                                <a href="${ctx}/especialista/cita?id=${proximaCita.idCita}" class="btn btn-sgc-suave w-100">Ver detalle</a>
                            </c:when>
                            <c:otherwise>
                                <p class="text-muted small mb-0">No tienes mas citas por venir este dia.</p>
                            </c:otherwise>
                        </c:choose>
                    </div>

                    <div class="sgc-card p-3">
                        <h2 class="h6 mb-3">Resumen del dia</h2>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="sgc-stat-icono"><i class="bi bi-calendar2"></i></span>
                            <strong><c:out value="${totalProgramadas}" /></strong> <span class="text-muted small">Citas programadas</span>
                        </div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="sgc-stat-icono"><i class="bi bi-check2"></i></span>
                            <strong><c:out value="${totalConfirmadas}" /></strong> <span class="text-muted small">Citas confirmadas</span>
                        </div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="sgc-stat-icono"><i class="bi bi-clock"></i></span>
                            <strong><c:out value="${totalPendientes}" /></strong> <span class="text-muted small">Citas pendientes</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <span class="sgc-stat-icono" style="background:var(--sgc-estado-cancelada-bg); color: var(--sgc-estado-cancelada-texto);"><i class="bi bi-x"></i></span>
                            <strong><c:out value="${totalCanceladas}" /></strong> <span class="text-muted small">Citas canceladas</span>
                        </div>
                    </div>
                </div>
            </div>
        </c:when>

        <%-- ================= VISTA SEMANA ================= --%>
        <c:when test="${vista == 'semana'}">
            <div class="row g-3">
                <c:forEach var="entrada" items="${citasPorDia}">
                    <div class="col-md-6 col-lg-4 col-xl-3">
                        <div class="sgc-card h-100">
                            <div class="card-header-plano">
                                <h2 class="h6 mb-0">
                                    <c:out value="${entrada.key}" />
                                    <c:if test="${entrada.key == hoy}"><span class="badge bg-success ms-1">Hoy</span></c:if>
                                </h2>
                            </div>
                            <div class="pt-2 pb-2">
                                <c:choose>
                                    <c:when test="${empty entrada.value}">
                                        <p class="text-center text-muted small py-3 mb-0">Sin citas</p>
                                    </c:when>
                                    <c:otherwise>
                                        <c:forEach var="cita" items="${entrada.value}">
                                            <a class="sgc-fila-cita text-decoration-none text-dark py-2"
                                               href="${ctx}/especialista/cita?id=${cita.idCita}">
                                                <div class="sgc-hora" style="width:60px;"><c:out value="${cita.horaInicioFormateada}" /></div>
                                                <div class="flex-grow-1">
                                                    <div class="small fw-semibold"><c:out value="${cita.cliente.nombreCompleto}" /></div>
                                                    <div class="small text-muted"><c:out value="${cita.servicio}" /></div>
                                                </div>
                                            </a>
                                        </c:forEach>
                                    </c:otherwise>
                                </c:choose>
                            </div>
                        </div>
                    </div>
                </c:forEach>
            </div>
        </c:when>

        <%-- ================= VISTA MES ================= --%>
        <c:otherwise>
            <div class="sgc-card p-3">
                <div class="sgc-calendario-mes mb-2">
                    <div class="text-center small text-muted fw-semibold">Lun</div>
                    <div class="text-center small text-muted fw-semibold">Mar</div>
                    <div class="text-center small text-muted fw-semibold">Mie</div>
                    <div class="text-center small text-muted fw-semibold">Jue</div>
                    <div class="text-center small text-muted fw-semibold">Vie</div>
                    <div class="text-center small text-muted fw-semibold">Sab</div>
                    <div class="text-center small text-muted fw-semibold">Dom</div>
                </div>
                <div class="sgc-calendario-mes">
                    <c:forEach var="dia" items="${diasCalendario}">
                        <a class="sgc-dia-mes text-decoration-none text-dark d-block
                                  ${dia.month != primerDiaMes.month ? 'fuera-de-mes' : ''}
                                  ${dia == hoy ? 'es-hoy' : ''}"
                           href="${ctx}/especialista/agenda?vista=dia&fecha=${dia}">
                            <div class="d-flex justify-content-between align-items-start">
                                <span><c:out value="${dia.dayOfMonth}" /></span>
                                <c:if test="${conteoPorDia[dia] > 0}">
                                    <span class="badge-conteo"><c:out value="${conteoPorDia[dia]}" /></span>
                                </c:if>
                            </div>
                        </a>
                    </c:forEach>
                </div>
            </div>
        </c:otherwise>
        </c:choose>
    </main>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${pageContext.request.contextPath}/js/app.js"></script></body>
</html>
