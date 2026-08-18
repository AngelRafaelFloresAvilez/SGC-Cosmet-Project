<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="tituloPagina" value="Detalle cita - SGC Cosmetic" scope="request" />
<c:set var="ctx" value="${pageContext.request.contextPath}" />
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

        <div class="sgc-encabezado-hero d-flex align-items-center gap-2 mb-3">
            <a href="${ctx}/especialista/agenda" class="btn btn-icono" title="Volver a la agenda">
                <i class="bi bi-arrow-left"></i>
            </a>
            <h1 class="fuente-titulo mb-0">Detalle cita</h1>
        </div>

        <div class="row g-3">
            <!-- Tarjeta del cliente -->
            <div class="col-lg-3">
                <div class="sgc-card p-4 text-center h-100">
                    <div class="avatar-cliente-grande mb-3">
                        <c:if test="${cita.cliente.rutaFoto != null}">
                            <img src="${ctx}${cita.cliente.rutaFoto}" alt="Foto de ${cita.cliente.nombreCompleto}">
                        </c:if>
                    </div>
                    <h2 class="h5 mb-1"><c:out value="${cita.cliente.nombreCompleto}" /></h2>
                    <p class="text-muted mb-2"><c:out value="${cita.cliente.telefono}" /></p>
                    <c:if test="${cita.cliente.frecuente}">
                        <span class="fw-semibold" style="color: var(--sgc-verde);">
                            <i class="bi bi-patch-check-fill"></i> Cliente frecuente
                        </span>
                    </c:if>
                </div>
            </div>

            <!-- Info de la cita -->
            <div class="col-lg-4">
                <div class="sgc-card p-4 h-100">
                    <dl class="row mb-0">
                        <dt class="col-5 text-muted fw-normal">Servicio</dt>
                        <dd class="col-7"><c:out value="${cita.servicio}" /></dd>

                        <dt class="col-5 text-muted fw-normal">Fecha</dt>
                        <dd class="col-7"><c:out value="${cita.fechaFormateadaLarga}" /></dd>

                        <dt class="col-5 text-muted fw-normal">Hora</dt>
                        <dd class="col-7"><c:out value="${cita.horaInicioFormateada}" /></dd>

                        <dt class="col-5 text-muted fw-normal">Duracion</dt>
                        <dd class="col-7"><c:out value="${cita.duracionMinutos}" /> Minutos</dd>

                        <dt class="col-5 text-muted fw-normal">Ubicacion</dt>
                        <dd class="col-7"><c:out value="${cita.ubicacion}" /></dd>

                        <dt class="col-5 text-muted fw-normal">Precio</dt>
                        <dd class="col-7"><c:out value="${cita.precioFormateado}" /></dd>

                        <dt class="col-5 text-muted fw-normal">Estado</dt>
                        <dd class="col-7">
                            <span class="badge-estado ${cita.claseBadge}"><c:out value="${cita.etiquetaEstado}" /></span>
                        </dd>
                    </dl>

                    <c:if test="${not empty cita.notas}">
                        <div class="mt-3 p-3 rounded-3" style="background: var(--sgc-verde-clarisimo);">
                            <div class="fw-semibold small mb-1" style="color: var(--sgc-verde-oscuro);">Notas</div>
                            <div class="small" style="color: var(--sgc-verde-oscuro);"><c:out value="${cita.notas}" /></div>
                        </div>
                    </c:if>

                    <!-- Acciones sobre la cita -->
                    <c:if test="${cita.estado == 'PENDIENTE' || cita.estado == 'CONFIRMADA'}">
                        <div class="d-flex flex-wrap gap-2 mt-4">
                            <c:if test="${cita.estado == 'PENDIENTE'}">
                                <form method="post" action="${ctx}/especialista/cita/accion">
                                    <input type="hidden" name="id" value="${cita.idCita}">
                                    <input type="hidden" name="accion" value="confirmar">
                                    <button type="submit" class="btn btn-sgc btn-sm">
                                        <i class="bi bi-check2"></i> Confirmar
                                    </button>
                                </form>
                            </c:if>
                            <c:if test="${cita.estado == 'CONFIRMADA' && !cita.fecha.isAfter(hoyServidor)}">
                                <form method="post" action="${ctx}/especialista/cita/accion">
                                    <input type="hidden" name="id" value="${cita.idCita}">
                                    <input type="hidden" name="accion" value="completar">
                                    <button type="submit" class="btn btn-sgc-suave btn-sm">
                                        <i class="bi bi-flag"></i> Marcar completada
                                    </button>
                                </form>
                            </c:if>
                            <form method="post" action="${ctx}/especialista/cita/accion" class="js-confirmar-cancelacion">
                                <input type="hidden" name="id" value="${cita.idCita}">
                                <input type="hidden" name="accion" value="cancelar">
                                <button type="submit" class="btn btn-outline-danger btn-sm">
                                    <i class="bi bi-x-circle"></i> Cancelar
                                </button>
                            </form>
                        </div>
                    </c:if>
                </div>
            </div>

            <!-- Historial del cliente -->
            <div class="col-lg-5">
                <div class="sgc-card p-4 h-100">
                    <h2 class="h6 mb-3">Historial del cliente</h2>

                    <c:choose>
                        <c:when test="${empty historial}">
                            <p class="text-center text-muted py-4 mb-0">Este cliente aun no tiene historial registrado.</p>
                        </c:when>
                        <c:otherwise>
                            <c:forEach var="resena" items="${historial}" varStatus="st">
                                <div class="d-flex justify-content-between align-items-start ${!st.last ? 'pb-3 mb-3 border-bottom' : ''}">
                                    <div class="d-flex align-items-start gap-2">
                                        <span class="sgc-stat-icono" style="width:32px;height:32px;"><i class="bi ${resena.icono}"></i></span>
                                        <div>
                                            <div class="fw-semibold small"><c:out value="${resena.servicio}" /></div>
                                            <div class="text-muted small"><c:out value="${resena.fechaFormateada}" /></div>
                                        </div>
                                    </div>
                                    <div class="text-end">
                                        <div>
                                            <c:forEach begin="1" end="${resena.estrellasLlenas}">
                                                <i class="bi bi-star-fill" style="color:#e0a458;"></i>
                                            </c:forEach>
                                            <c:if test="${resena.tieneMediaEstrella}">
                                                <i class="bi bi-star-half" style="color:#e0a458;"></i>
                                            </c:if>
                                            <c:forEach begin="1" end="${resena.estrellasVacias}">
                                                <i class="bi bi-star" style="color:#e0a458;"></i>
                                            </c:forEach>
                                        </div>
                                        <div class="small text-muted"><c:out value="${resena.calificacion}" /></div>
                                    </div>
                                </div>
                            </c:forEach>
                        </c:otherwise>
                    </c:choose>
                </div>
            </div>
        </div>
    </main>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${ctx}/assets/js/app.js"></script>
</body>
</html>
