<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<c:set var="tituloPagina" value="Gestion de servicios - SGC Cosmetic" scope="request" />
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
                <h1 class="fuente-titulo mb-0">Gestion de servicios</h1>
            </div>
            <button type="button" class="btn btn-sgc" onclick="AdminServicios.abrirNuevo()">
                <i class="bi bi-plus-lg"></i> Agregar servicio
            </button>
        </div>

        <div class="row g-3 mb-3">
            <div class="col-md-3">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-gris"><i class="bi bi-calendar2-week"></i></span>
                    <div><div class="valor"><c:out value="${totalServicios}" /></div><div class="etiqueta">Servicios registrados</div></div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-verde"><i class="bi bi-check2-circle"></i></span>
                    <div><div class="valor"><c:out value="${serviciosActivos}" /></div><div class="etiqueta">Servicios activos</div></div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-amarillo"><i class="bi bi-clock"></i></span>
                    <div><div class="valor"><c:out value="${duracionPromedio}" /> min</div><div class="etiqueta">Duracion promedio</div></div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-verde"><i class="bi bi-currency-dollar"></i></span>
                    <div><div class="valor">$<fmt:formatNumber value="${precioPromedio}" pattern="#,##0.00" /></div><div class="etiqueta">Precio promedio</div></div>
                </div>
            </div>
        </div>

        <form method="get" action="${ctx}/admin/servicios" class="sgc-buscador mb-3">
            <i class="bi bi-search"></i>
            <input type="text" name="q" placeholder="Buscar servicio..." value="${busqueda}">
        </form>

        <div class="sgc-card">
            <div class="table-responsive">
                <table class="sgc-tabla-admin">
                    <thead>
                    <tr><th>Servicios</th><th>Descripcion</th><th>Duracion</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                    <c:forEach var="s" items="${servicios}">
                        <tr>
                            <td>
                                <div class="sgc-nombre-fila">
                                    <div class="sgc-avatar-tabla" style="border-radius:10px;background:linear-gradient(135deg,var(--sgc-verde-claro),var(--sgc-verde-suave));"></div>
                                    <strong><c:out value="${s.nombre}" /></strong>
                                </div>
                            </td>
                            <td class="small text-muted" style="max-width:260px;"><c:out value="${s.descripcion}" /></td>
                            <td><c:out value="${s.duracionMinutos}" /> min</td>
                            <td><c:out value="${s.precioFormateado}" /></td>
                            <td>
                                <span class="badge-estado ${s.disponible ? 'badge-confirmada' : 'badge-cancelada'}"><c:out value="${s.estadoTexto}" /></span>
                            </td>
                            <td>
                                <div class="d-flex gap-1">
                                    <button type="button" class="sgc-btn-editar" title="Editar"
                                            data-id="${s.idServicio}" data-nombre="${s.nombre}"
                                            data-precio="${s.precio}" data-duracion="${s.duracionMinutos}"
                                            data-descripcion="${s.descripcion}" data-activo="${s.disponible}"
                                            data-foto="${s.rutaFoto}">
                                        <i class="bi bi-pen"></i>
                                    </button>
                                    <form method="post" action="${ctx}/admin/servicios/eliminar" onsubmit="return confirm('¿Eliminar este servicio?');">
                                        <input type="hidden" name="id" value="${s.idServicio}">
                                        <button type="submit" class="sgc-btn-eliminar" title="Eliminar"><i class="bi bi-trash"></i></button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    </c:forEach>
                    <c:if test="${empty servicios}">
                        <tr><td colspan="6" class="text-center text-muted py-4">No se encontraron servicios.</td></tr>
                    </c:if>
                    </tbody>
                </table>
            </div>
        </div>

        <jsp:include page="/WEB-INF/vistas_admin/includes/paginador.jsp">
            <jsp:param name="rutaBase" value="/admin/servicios" />
        </jsp:include>
    </main>
</div>

<!-- Modal: Nuevo / Editar servicio -->
<div class="modal fade" id="modalServicio" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content sgc-modal-content">
            <div class="modal-header">
                <div>
                    <h3 class="fuente-titulo h5 mb-1" id="tituloModalServicio">Nuevo servicio</h3>
                    <p class="text-muted small mb-0">Agrega un servicio nuevo.</p>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
                <form method="post" action="${ctx}/admin/servicios/guardar" id="formServicio" enctype="multipart/form-data">
                    <input type="hidden" name="id" id="servicioId">
                    <div class="row">
                        <div class="col-sm-6">
                            <label class="form-label-sgc">Nombre del servicio</label>
                            <input type="text" name="nombre" id="servicioNombre" class="form-control mb-3" placeholder="Ej. Masaje" required>
                        </div>
                        <div class="col-sm-6">
                            <label class="form-label-sgc">Precio del servicio (MXN)</label>
                            <input type="number" step="0.01" min="1" name="precio" id="servicioPrecio" class="form-control mb-3" placeholder="Ingresa el costo" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <label class="form-label-sgc">Duracion aproximada (minutos)</label>
                            <input type="number" min="10" max="480" name="duracion" id="servicioDuracion" class="form-control mb-3" placeholder="60" required>
                        </div>
                        <div class="col-sm-6">
                            <label class="form-label-sgc">Estado</label>
                            <select name="estado" id="servicioEstado" class="form-select mb-3">
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>
                    <label class="form-label-sgc">Descripcion del servicio</label>
                    <textarea name="descripcion" id="servicioDescripcion" class="form-control mb-3" rows="3"
                              placeholder="Ingresa una breve descripcion del servicio."></textarea>

                    <label class="form-label-sgc">Foto del servicio</label>
                    <div class="sgc-foto-servicio-preview mb-2" id="servicioFotoPreviewWrapper">
                        <img id="servicioFotoPreview" src="" alt="Vista previa" class="d-none">
                        <span id="servicioFotoPlaceholder" class="text-muted small"><i class="bi bi-image me-1"></i>Sin foto</span>
                    </div>
                    <ul class="nav nav-pills sgc-subtabs-foto mb-2" role="tablist">
                        <li class="nav-item">
                            <button class="nav-link active" type="button" data-bs-toggle="pill" data-bs-target="#tabSubirArchivo">Subir archivo</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" type="button" data-bs-toggle="pill" data-bs-target="#tabUrlFoto">Usar URL</button>
                        </li>
                    </ul>
                    <div class="tab-content mb-3">
                        <div class="tab-pane fade show active" id="tabSubirArchivo">
                            <input type="file" name="fotoArchivo" id="servicioFotoArchivo" class="form-control" accept="image/png, image/jpeg, image/webp">
                            <div class="small text-muted mt-1">Solo formato JPG, PNG o WEBP. Maximo 2 MB.</div>
                        </div>
                        <div class="tab-pane fade" id="tabUrlFoto">
                            <input type="url" name="fotoUrl" id="servicioFotoUrl" class="form-control"
                                   placeholder="https://ejemplo.com/imagen.jpg">
                            <div class="small text-muted mt-1">Pega el enlace directo a una imagen ya publicada en internet.</div>
                        </div>
                    </div>

                    <div class="d-flex gap-2 mt-2">
                        <button type="button" class="btn btn-outline-sgc flex-grow-1" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-sgc flex-grow-1" id="btnGuardarServicio">Crear servicio</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>window.SGC_CTX = "${ctx}";</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${ctx}/js/appAdmin.js"></script>
<script>
    const AdminServicios = (function () {
        function abrirNuevo() {
            document.getElementById('formServicio').reset();
            document.getElementById('servicioId').value = '';
            document.getElementById('tituloModalServicio').textContent = 'Nuevo servicio';
            document.getElementById('btnGuardarServicio').textContent = 'Crear servicio';
            limpiarPreviewFoto();
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalServicio')).show();
        }
        function abrirEditar(boton) {
            const d = boton.dataset;
            document.getElementById('servicioId').value = d.id;
            document.getElementById('servicioNombre').value = d.nombre;
            document.getElementById('servicioPrecio').value = d.precio;
            document.getElementById('servicioDuracion').value = d.duracion;
            document.getElementById('servicioDescripcion').value = d.descripcion;
            document.getElementById('servicioEstado').value = d.activo === 'true' ? 'activo' : 'inactivo';
            document.getElementById('tituloModalServicio').textContent = 'Editar servicio';
            document.getElementById('btnGuardarServicio').textContent = 'Guardar cambios';
            document.getElementById('servicioFotoArchivo').value = '';
            document.getElementById('servicioFotoUrl').value = '';
            if (d.foto && d.foto !== 'null' && d.foto !== '') {
                mostrarPreviewFoto(d.foto.startsWith('http') ? d.foto : (window.SGC_CTX || '') + d.foto);
            } else {
                limpiarPreviewFoto();
            }
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalServicio')).show();
        }
        function mostrarPreviewFoto(src) {
            const img = document.getElementById('servicioFotoPreview');
            const placeholder = document.getElementById('servicioFotoPlaceholder');
            img.src = src;
            img.classList.remove('d-none');
            placeholder.classList.add('d-none');
        }
        function limpiarPreviewFoto() {
            const img = document.getElementById('servicioFotoPreview');
            const placeholder = document.getElementById('servicioFotoPlaceholder');
            img.src = '';
            img.classList.add('d-none');
            placeholder.classList.remove('d-none');
        }
        return { abrirNuevo, abrirEditar, mostrarPreviewFoto, limpiarPreviewFoto };
    })();

    document.getElementById('servicioFotoArchivo').addEventListener('change', function (evento) {
        const archivo = evento.target.files && evento.target.files[0];
        if (!archivo) return;
        document.getElementById('servicioFotoUrl').value = '';
        const lector = new FileReader();
        lector.onload = function (e) { AdminServicios.mostrarPreviewFoto(e.target.result); };
        lector.readAsDataURL(archivo);
    });
    document.getElementById('servicioFotoUrl').addEventListener('change', function (evento) {
        const url = evento.target.value.trim();
        if (!url) return;
        document.getElementById('servicioFotoArchivo').value = '';
        AdminServicios.mostrarPreviewFoto(url);
    });

    document.querySelectorAll('.sgc-btn-editar[data-id]').forEach(function (btn) {
        btn.addEventListener('click', function () { AdminServicios.abrirEditar(btn); });
    });

    <c:if test="${servicioEditar != null}">
    window.addEventListener('DOMContentLoaded', function () {
        const btn = document.querySelector('.sgc-btn-editar[data-id="${servicioEditar.idServicio}"]');
        if (btn) AdminServicios.abrirEditar(btn);
    });
    </c:if>
</script>
</body>
</html>