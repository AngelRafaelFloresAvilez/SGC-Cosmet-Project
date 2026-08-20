<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="tituloPagina" value="Promociones - SGC Cosmetic" scope="request" />
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

        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div class="sgc-encabezado-hero mb-0">
                <h1 class="fuente-titulo mb-1">Promociones</h1>
                <p class="sgc-subtitulo mb-0">Administra y controla las promociones y descuentos disponibles para tus clientes</p>
            </div>
            <button type="button" class="btn btn-sgc" onclick="AdminPromociones.abrirNuevo()">
                <i class="bi bi-plus-lg"></i> Nueva promocion
            </button>
        </div>

        <div class="sgc-tabs-admin mb-3">
            <a href="${ctx}/admin/promociones?estado=todas" class="${pestanaActual == 'todas' ? 'activo' : ''}">
                Todas las promociones <span class="contador"><c:out value="${totalTodas}" /></span>
            </a>
            <a href="${ctx}/admin/promociones?estado=Activa" class="${pestanaActual == 'Activa' ? 'activo' : ''}">
                Activas <span class="contador"><c:out value="${totalActivas}" /></span>
            </a>
            <a href="${ctx}/admin/promociones?estado=Programada" class="${pestanaActual == 'Programada' ? 'activo' : ''}">
                Programadas <span class="contador"><c:out value="${totalProgramadas}" /></span>
            </a>
            <a href="${ctx}/admin/promociones?estado=Expirada" class="${pestanaActual == 'Expirada' ? 'activo' : ''}">
                Expiradas <span class="contador"><c:out value="${totalExpiradas}" /></span>
            </a>
        </div>

        <form method="get" action="${ctx}/admin/promociones" class="sgc-buscador mb-3">
            <input type="hidden" name="estado" value="${pestanaActual}">
            <i class="bi bi-search"></i>
            <input type="text" name="q" placeholder="Buscar por servicio, tipo..." value="${busqueda}">
        </form>

        <div class="sgc-card">
            <div class="table-responsive">
                <table class="sgc-tabla-admin">
                    <thead>
                    <tr><th>Promocion</th><th>Tipo</th><th>Descuento</th><th>Vigencia</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                    <c:forEach var="p" items="${promociones}">
                        <tr>
                            <td>
                                <div class="sgc-nombre-fila">
                                    <div class="sgc-avatar-tabla"></div>
                                    <div>
                                        <div class="fw-semibold"><c:out value="${p.nombre}" /></div>
                                        <div class="small text-muted"><c:out value="${p.descripcion}" /></div>
                                    </div>
                                </div>
                            </td>
                            <td><c:out value="${p.etiquetaTipo}" /></td>
                            <td><c:out value="${p.descuentoTexto}" /></td>
                            <td class="small"><c:out value="${p.vigenciaTexto}" /></td>
                            <td><span class="badge-estado ${p.claseBadgeEstado}"><c:out value="${p.estadoTexto}" /></span></td>
                            <td>
                                <div class="d-flex gap-1">
                                    <button type="button" class="sgc-btn-editar" title="Editar"
                                            data-id="${p.idPromocion}" data-nombre="${p.nombre}" data-descripcion="${p.descripcion}"
                                            data-tipo="${p.tipo}" data-descuento="${p.descuentoTexto}"
                                            data-inicio="${p.fechaInicio}" data-fin="${p.fechaFin}">
                                        <i class="bi bi-pen"></i>
                                    </button>
                                    <form method="post" action="${ctx}/admin/promociones/eliminar" onsubmit="return confirm('¿Eliminar esta promocion?');">
                                        <input type="hidden" name="id" value="${p.idPromocion}">
                                        <button type="submit" class="sgc-btn-eliminar" title="Eliminar"><i class="bi bi-trash"></i></button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    </c:forEach>
                    <c:if test="${empty promociones}">
                        <tr><td colspan="6" class="text-center text-muted py-4">No se encontraron promociones.</td></tr>
                    </c:if>
                    </tbody>
                </table>
            </div>
        </div>

        <jsp:include page="/WEB-INF/vistas_admin/includes/paginador.jsp">
            <jsp:param name="rutaBase" value="/admin/promociones" />
            <jsp:param name="extraQuery" value="&estado=${pestanaActual}" />
        </jsp:include>
    </main>
</div>

<!-- Modal: Nueva / Editar promocion -->
<div class="modal fade" id="modalPromocion" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content sgc-modal-content">
            <div class="modal-header">
                <div>
                    <h3 class="fuente-titulo h5 mb-1" id="tituloModalPromocion">Nueva promocion</h3>
                    <p class="text-muted small mb-0">Configura el descuento y su vigencia.</p>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
                <form method="post" action="${ctx}/admin/promociones/guardar" id="formPromocion">
                    <input type="hidden" name="id" id="promocionId">
                    <label class="form-label-sgc">Nombre de la promocion</label>
                    <input type="text" name="nombre" id="promocionNombre" class="form-control mb-3" placeholder="Ej. Masaje relajante 2x1" required>

                    <label class="form-label-sgc">Descripcion</label>
                    <input type="text" name="descripcion" id="promocionDescripcion" class="form-control mb-3" placeholder="Ej. En masaje relajante de 60 min">

                    <div class="row">
                        <div class="col-sm-6">
                            <label class="form-label-sgc">Tipo</label>
                            <select name="tipo" id="promocionTipo" class="form-select mb-3" required>
                                <option value="DOS_POR_UNO">2x1</option>
                                <option value="PORCENTAJE">Porcentaje</option>
                                <option value="PAQUETE">Paquete</option>
                            </select>
                        </div>
                        <div class="col-sm-6">
                            <label class="form-label-sgc">Descuento</label>
                            <input type="text" name="descuento" id="promocionDescuento" class="form-control mb-3" placeholder="Ej. 2x1, 50%" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <label class="form-label-sgc">Fecha de inicio</label>
                            <input type="date" name="fechaInicio" id="promocionInicio" class="form-control mb-3" required>
                        </div>
                        <div class="col-sm-6">
                            <label class="form-label-sgc">Fecha de fin</label>
                            <input type="date" name="fechaFin" id="promocionFin" class="form-control mb-3" required>
                        </div>
                    </div>

                    <div class="d-flex gap-2 mt-2">
                        <button type="button" class="btn btn-outline-sgc flex-grow-1" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-sgc flex-grow-1" id="btnGuardarPromocion">Crear promocion</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${ctx}/assets/js/app.js"></script>
<script>
    const AdminPromociones = (function () {
        function abrirNuevo() {
            document.getElementById('formPromocion').reset();
            document.getElementById('promocionId').value = '';
            document.getElementById('tituloModalPromocion').textContent = 'Nueva promocion';
            document.getElementById('btnGuardarPromocion').textContent = 'Crear promocion';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalPromocion')).show();
        }
        function abrirEditar(boton) {
            const d = boton.dataset;
            document.getElementById('promocionId').value = d.id;
            document.getElementById('promocionNombre').value = d.nombre;
            document.getElementById('promocionDescripcion').value = d.descripcion;
            document.getElementById('promocionTipo').value = d.tipo;
            document.getElementById('promocionDescuento').value = d.descuento;
            document.getElementById('promocionInicio').value = d.inicio;
            document.getElementById('promocionFin').value = d.fin;
            document.getElementById('tituloModalPromocion').textContent = 'Editar promocion';
            document.getElementById('btnGuardarPromocion').textContent = 'Guardar cambios';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalPromocion')).show();
        }
        return { abrirNuevo, abrirEditar };
    })();

    document.querySelectorAll('.sgc-btn-editar[data-id]').forEach(function (btn) {
        btn.addEventListener('click', function () { AdminPromociones.abrirEditar(btn); });
    });

    <c:if test="${promocionEditar != null}">
    window.addEventListener('DOMContentLoaded', function () {
        const btn = document.querySelector('.sgc-btn-editar[data-id="${promocionEditar.idPromocion}"]');
        if (btn) AdminPromociones.abrirEditar(btn);
    });
    </c:if>
</script>
</body>
</html>