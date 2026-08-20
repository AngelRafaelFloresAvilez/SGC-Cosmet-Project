<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="tituloPagina" value="Control de citas - SGC Cosmetic" scope="request" />
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
            <h1 class="fuente-titulo mb-0">Control de citas</h1>
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
                    <span class="icono icono-verde"><i class="bi bi-check2-circle"></i></span>
                    <div><div class="valor"><c:out value="${pendientes}" /></div><div class="etiqueta">Citas pendientes</div></div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-rojo"><i class="bi bi-x-circle"></i></span>
                    <div><div class="valor"><c:out value="${canceladasEsteMes}" /></div><div class="etiqueta">Citas canceladas este mes</div></div>
                </div>
            </div>
        </div>

        <form method="get" action="${ctx}/admin/citas" class="sgc-buscador mb-3">
            <i class="bi bi-search"></i>
            <input type="text" name="q" placeholder="Buscar por cliente, servicio o especialista..." value="${busqueda}">
        </form>

        <div class="sgc-card">
            <div class="table-responsive">
                <table class="sgc-tabla-admin">
                    <thead>
                    <tr>
                        <th>Cliente</th><th>Servicio</th><th>Especialista</th><th>Fecha</th><th>Hora</th><th>Estado</th><th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    <c:forEach var="cita" items="${citas}">
                        <c:set var="nombreEmpleado" value="${nombresEmpleados[cita.idEmpleado]}" />
                        <tr>
                            <td>
                                <div class="sgc-nombre-fila">
                                    <div class="sgc-avatar-tabla"></div>
                                    <div>
                                        <div class="fw-semibold"><c:out value="${cita.cliente.nombreCompleto}" /></div>
                                        <div class="small text-muted"><c:out value="${cita.cliente.correo}" /></div>
                                    </div>
                                </div>
                            </td>
                            <td><c:out value="${cita.servicio}" /></td>
                            <td><c:out value="${not empty nombreEmpleado ? nombreEmpleado : 'Sin asignar'}" /></td>
                            <td><c:out value="${cita.fechaFormateadaCorta}" /></td>
                            <td><c:out value="${cita.horaInicioFormateada}" /></td>
                            <td><span class="badge-estado ${cita.claseBadge}"><c:out value="${cita.etiquetaEstado}" /></span></td>
                            <td>
                                <c:if test="${cita.estado == 'PENDIENTE'}">
                                    <div class="d-flex gap-1">
                                        <form method="post" action="${ctx}/admin/citas/accion">
                                            <input type="hidden" name="id" value="${cita.idCita}">
                                            <input type="hidden" name="accion" value="confirmar">
                                            <input type="hidden" name="pagina" value="${paginaActual}">
                                            <button type="submit" class="sgc-btn-editar" title="Confirmar"><i class="bi bi-check2"></i></button>
                                        </form>
                                        <form method="post" action="${ctx}/admin/citas/accion" class="js-confirmar-cancelacion">
                                            <input type="hidden" name="id" value="${cita.idCita}">
                                            <input type="hidden" name="accion" value="cancelar">
                                            <input type="hidden" name="pagina" value="${paginaActual}">
                                            <button type="submit" class="sgc-btn-eliminar" title="Cancelar"><i class="bi bi-x-lg"></i></button>
                                        </form>
                                    </div>
                                </c:if>
                            </td>
                        </tr>
                    </c:forEach>
                    <c:if test="${empty citas}">
                        <tr><td colspan="7" class="text-center text-muted py-4">No se encontraron citas.</td></tr>
                    </c:if>
                    </tbody>
                </table>
            </div>
        </div>

        <jsp:include page="/WEB-INF/vistas_admin/includes/paginador.jsp">
            <jsp:param name="rutaBase" value="/admin/citas" />
        </jsp:include>
    </main>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${ctx}/js/appAdmin.js"></script>
</body>
</html>