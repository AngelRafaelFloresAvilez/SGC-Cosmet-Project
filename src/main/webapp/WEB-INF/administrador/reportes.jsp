<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<c:set var="tituloPagina" value="Reportes - SGC Cosmetic" scope="request" />
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
    <jsp:include page="/WEB-INF/vistas/includes/head.jsp" />
    <link rel="stylesheet" href="${ctx}/assets/css/admin.css">
</head>
<body>

<jsp:include page="/WEB-INF/vistas/admin/includes/sidebar.jsp" />

<div class="sgc-app-shell">
    <jsp:include page="/WEB-INF/vistas/admin/includes/topbar.jsp" />

    <main class="sgc-contenido flex-grow-1">
        <jsp:include page="/WEB-INF/vistas/includes/alertas.jsp" />

        <div class="sgc-encabezado-hero mb-3">
            <h1 class="fuente-titulo mb-1">Reportes</h1>
            <p class="sgc-subtitulo mb-0">Citas por dia y mes, clientes con inasistencias, servicios mas solicitados e ingresos generados</p>
        </div>

        <div class="row g-3 mb-3">
            <div class="col-md-4">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-verde"><i class="bi bi-calendar2-check"></i></span>
                    <div><div class="valor"><c:out value="${totalCitas}" /></div><div class="etiqueta">Total de citas</div></div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-amarillo"><i class="bi bi-hourglass-split"></i></span>
                    <div><div class="valor"><c:out value="${citasPendientes}" /></div><div class="etiqueta">Citas pendientes</div></div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-verde"><i class="bi bi-cash-coin"></i></span>
                    <div><div class="valor">$<fmt:formatNumber value="${ventasDelMes}" pattern="#,##0" /></div><div class="etiqueta">Ingresos generados este mes</div></div>
                </div>
            </div>
        </div>

        <div class="row g-3">
            <div class="col-lg-6">
                <div class="sgc-card p-3 h-100">
                    <h2 class="h6 mb-2">Citas por dia (semana actual)</h2>
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

            <div class="col-lg-6">
                <div class="sgc-card p-3 h-100">
                    <h2 class="h6 mb-2">Servicios mas solicitados</h2>
                    <c:forEach var="entrada" items="${serviciosMasSolicitados}">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span style="width:20px;height:20px;background:var(--sgc-verde-claro);border-radius:6px;flex-shrink:0;"></span>
                            <span class="flex-grow-1 small fw-semibold"><c:out value="${entrada.key}" /></span>
                            <span class="small text-muted"><c:out value="${entrada.value}" /> citas</span>
                        </div>
                    </c:forEach>
                    <c:if test="${empty serviciosMasSolicitados}">
                        <p class="text-muted small mb-0">Todavia no hay citas registradas.</p>
                    </c:if>
                </div>
            </div>

            <div class="col-12">
                <div class="sgc-card p-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h2 class="h6 mb-0">Clientes con inasistencias</h2>
                    </div>
                    <c:forEach var="c" items="${clientesInasistencias}" varStatus="st">
                        <div class="sgc-fila-numerada">
                            <span class="sgc-numero-circulo"><c:out value="${st.index + 1}" /></span>
                            <span class="flex-grow-1"><c:out value="${c.nombreCompleto}" /></span>
                            <span class="badge-estado badge-cancelada"><c:out value="${c.faltas}" /> faltas</span>
                        </div>
                    </c:forEach>
                    <c:if test="${empty clientesInasistencias}">
                        <p class="text-muted small mb-0">No hay clientes con inasistencias registradas.</p>
                    </c:if>
                </div>
            </div>
        </div>
    </main>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${ctx}/assets/js/app.js"></script>
</body>
</html>
