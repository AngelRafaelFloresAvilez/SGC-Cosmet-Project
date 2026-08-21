<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="tituloPagina" value="Gestion de clientes - SGC Cosmetic" scope="request" />
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
            <h1 class="fuente-titulo mb-0">Gestion de clientes</h1>
        </div>

        <div class="row g-3 mb-3">
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-gris"><i class="bi bi-people"></i></span>
                    <div><div class="valor"><c:out value="${totalClientes}" /></div><div class="etiqueta">Clientes registrados</div><div class="subetiqueta">Total en el sistema</div></div>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-verde"><i class="bi bi-person"></i></span>
                    <div><div class="valor"><c:out value="${clientesActivos}" /></div><div class="etiqueta">Clientes activos</div><div class="subetiqueta">Sin veto</div></div>
                </div>
            </div>
        </div>

        <form method="get" action="${ctx}/admin/clientes" class="sgc-buscador mb-3">
            <i class="bi bi-search"></i>
            <input type="text" name="q" placeholder="Buscar cliente..." value="${busqueda}">
        </form>

        <div class="sgc-card">
            <div class="table-responsive">
                <table class="sgc-tabla-admin">
                    <thead>
                    <tr><th>Cliente</th><th>Telefono</th><th>Email</th><th>Faltas</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                    <c:forEach var="c" items="${clientes}">
                        <tr>
                            <td>
                                <div class="sgc-nombre-fila">
                                    <div class="sgc-avatar-tabla"></div>
                                    <strong><c:out value="${c.nombreCompleto}" /></strong>
                                </div>
                            </td>
                            <td><c:out value="${c.telefono}" /></td>
                            <td><c:out value="${c.correo}" /></td>
                            <td><c:out value="${c.faltas}" /></td>
                            <td><span class="badge-estado ${c.vetado ? 'badge-cancelada' : 'badge-confirmada'}"><c:out value="${c.estadoTexto}" /></span></td>
                            <td>
                                <div class="dropdown sgc-menu-acciones">
                                    <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="bi bi-three-dots-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end">
                                        <c:if test="${c.faltas > 0}">
                                            <li>
                                                <form method="post" action="${ctx}/admin/clientes/accion">
                                                    <input type="hidden" name="id" value="${c.idCliente}">
                                                    <input type="hidden" name="accion" value="quitar-bloqueo">
                                                    <button type="submit" class="dropdown-item">Quitar bloqueo por faltas</button>
                                                </form>
                                            </li>
                                        </c:if>
                                        <c:choose>
                                            <c:when test="${c.vetado}">
                                                <li>
                                                    <form method="post" action="${ctx}/admin/clientes/accion">
                                                        <input type="hidden" name="id" value="${c.idCliente}">
                                                        <input type="hidden" name="accion" value="activar">
                                                        <button type="submit" class="dropdown-item">Reactivar cliente</button>
                                                    </form>
                                                </li>
                                            </c:when>
                                            <c:otherwise>
                                                <li>
                                                    <form method="post" action="${ctx}/admin/clientes/accion" onsubmit="return confirm('¿Vetar a este cliente?');">
                                                        <input type="hidden" name="id" value="${c.idCliente}">
                                                        <input type="hidden" name="accion" value="vetar">
                                                        <button type="submit" class="dropdown-item text-danger">Vetar cliente</button>
                                                    </form>
                                                </li>
                                            </c:otherwise>
                                        </c:choose>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    </c:forEach>
                    <c:if test="${empty clientes}">
                        <tr><td colspan="6" class="text-center text-muted py-4">No se encontraron clientes.</td></tr>
                    </c:if>
                    </tbody>
                </table>
            </div>
        </div>

        <jsp:include page="/WEB-INF/vistas_admin/includes/paginador.jsp">
            <jsp:param name="rutaBase" value="/admin/clientes" />
        </jsp:include>
    </main>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${ctx}/assets/js/app.js"></script>
</body>
</html>