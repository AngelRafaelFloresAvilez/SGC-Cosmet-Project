<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="tituloPagina" value="Horarios - SGC Cosmetic" scope="request" />
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
            <h1 class="fuente-titulo mb-0">Horarios</h1>
        </div>

        <div class="row g-3">
            <div class="col-lg-6">
                <div class="sgc-card p-3">
                    <div class="sgc-tabs-admin mb-3">
                        <a href="${ctx}/admin/horarios?vista=general" class="${pestanaActual == 'general' ? 'activo' : ''}">Horario general</a>
                        <a href="${ctx}/admin/horarios?vista=empleado" class="${pestanaActual == 'empleado' ? 'activo' : ''}">Horario por empleado</a>
                    </div>

                    <c:choose>
                        <c:when test="${pestanaActual == 'empleado'}">
                            <form method="get" action="${ctx}/admin/horarios" class="mb-3">
                                <input type="hidden" name="vista" value="empleado">
                                <select name="empleado" class="form-select" onchange="this.form.submit()">
                                    <option value="">Selecciona un empleado...</option>
                                    <c:forEach var="e" items="${empleados}">
                                        <option value="${e.idEmpleado}" ${empleadoSeleccionado != null && empleadoSeleccionado.idEmpleado == e.idEmpleado ? 'selected' : ''}>
                                            <c:out value="${e.nombreCompleto}" />
                                        </option>
                                    </c:forEach>
                                </select>
                            </form>

                            <c:if test="${empleadoSeleccionado == null}">
                                <p class="text-muted small">Selecciona un empleado para ver su horario.</p>
                            </c:if>
                            <c:if test="${empleadoSeleccionado != null}">
                                <c:forEach var="dia" items="${empleadoSeleccionado.horario}">
                                    <div class="sgc-horario-fila-admin">
                                        <strong class="text-capitalize"><c:out value="${dia.key.toLowerCase()}" /></strong>
                                        <span class="text-muted small"><c:out value="${dia.value != null ? dia.value : 'Cerrado'}" /></span>
                                        <span class="badge-estado ${dia.value != null ? 'badge-confirmada' : 'badge-cancelada'}">
                                            <c:out value="${dia.value != null ? 'Activo' : 'Inactivo'}" />
                                        </span>
                                    </div>
                                </c:forEach>
                            </c:if>
                        </c:when>

                        <c:otherwise>
                            <form method="post" action="${ctx}/admin/horarios/guardar" id="formHorarioGeneral">
                                <div class="sgc-aplicar-todos mb-3">
                                    <label class="form-label-sgc mb-2">Aplicar el mismo horario a todos los dias seleccionados</label>
                                    <div class="d-flex align-items-center gap-2 flex-wrap">
                                        <input type="time" id="horaInicioMasivo" class="form-control form-control-sm" style="width:120px;" value="09:00">
                                        <span class="text-muted small">a</span>
                                        <input type="time" id="horaFinMasivo" class="form-control form-control-sm" style="width:120px;" value="18:00">
                                        <button type="button" class="btn btn-outline-sgc btn-sm" id="btnAplicarMasivo">
                                            <i class="bi bi-magic"></i> Aplicar a los seleccionados
                                        </button>
                                    </div>
                                </div>

                                <c:forEach var="dia" items="${horarioGeneral}">
                                    <div class="sgc-horario-fila-admin" data-dia-fila="${dia.key}">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" name="activo_${dia.key}" id="activo${dia.key}" ${dia.value != null ? 'checked' : ''}>
                                            <label class="form-check-label fw-semibold text-capitalize" for="activo${dia.key}"><c:out value="${dia.key.toLowerCase()}" /></label>
                                        </div>
                                        <div class="d-flex align-items-center gap-2">
                                            <input type="time" name="inicio_${dia.key}" class="form-control form-control-sm sgc-input-inicio" style="width:120px;"
                                                   value="${horarioGeneralInputs[dia.key][0]}">
                                            <span class="text-muted small">a</span>
                                            <input type="time" name="fin_${dia.key}" class="form-control form-control-sm sgc-input-fin" style="width:120px;"
                                                   value="${horarioGeneralInputs[dia.key][1]}">
                                        </div>
                                    </div>
                                </c:forEach>
                                <button type="submit" class="btn btn-sgc w-100 mt-3">Guardar horario general</button>
                            </form>
                        </c:otherwise>
                    </c:choose>
                </div>
            </div>

            <div class="col-lg-6">
                <div class="sgc-card p-3">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h2 class="h6 mb-0">Vista semanal</h2>
                        <div class="d-flex align-items-center gap-2">
                            <a class="btn btn-icono text-dark" href="${ctx}/admin/horarios?vista=${pestanaActual}&fecha=${fechaAnterior}${empleadoSeleccionado != null ? '&empleado=' : ''}${empleadoSeleccionado != null ? empleadoSeleccionado.idEmpleado : ''}">
                                <i class="bi bi-chevron-left"></i>
                            </a>
                            <span class="small fw-semibold"><c:out value="${inicioSemana}" /> - <c:out value="${finSemana}" /></span>
                            <a class="btn btn-icono text-dark" href="${ctx}/admin/horarios?vista=${pestanaActual}&fecha=${fechaSiguiente}${empleadoSeleccionado != null ? '&empleado=' : ''}${empleadoSeleccionado != null ? empleadoSeleccionado.idEmpleado : ''}">
                                <i class="bi bi-chevron-right"></i>
                            </a>
                        </div>
                    </div>

                    <div class="sgc-barras-semana">
                        <c:forEach var="dia" items="${vistaSemanal}">
                            <div class="sgc-barra-dia">
                                <div class="barra ${dia.value[1] ? '' : 'no-disponible'}" style="height: ${dia.value[1] ? '80%' : '20%'};"></div>
                                <div class="etiqueta"><c:out value="${dia.key}" /></div>
                            </div>
                        </c:forEach>
                    </div>
                    <div class="sgc-leyenda-horario">
                        <span><span class="cuadro" style="background: var(--sgc-verde-clarisimo); border: 1px solid var(--sgc-verde-claro);"></span>Disponible</span>
                        <span><span class="cuadro" style="background: #fbe3e1; border: 1px solid #f2b8b4;"></span>No disponible</span>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${ctx}/assets/js/app.js"></script>
<script>
    // Copia el horario de los dos campos "masivos" a todos los dias cuyo checkbox
    // este marcado en ese momento, sin quitar la posibilidad de seguir editando
    // cada dia por separado despues de aplicar.
    var btnAplicarMasivo = document.getElementById('btnAplicarMasivo');
    if (btnAplicarMasivo) {
        btnAplicarMasivo.addEventListener('click', function () {
            var horaInicio = document.getElementById('horaInicioMasivo').value;
            var horaFin = document.getElementById('horaFinMasivo').value;
            if (!horaInicio || !horaFin) {
                return;
            }
            document.querySelectorAll('[data-dia-fila]').forEach(function (fila) {
                var checkbox = fila.querySelector('input[type="checkbox"]');
                if (checkbox && checkbox.checked) {
                    fila.querySelector('.sgc-input-inicio').value = horaInicio;
                    fila.querySelector('.sgc-input-fin').value = horaFin;
                }
            });
        });
    }
</script>
</body>
</html>
