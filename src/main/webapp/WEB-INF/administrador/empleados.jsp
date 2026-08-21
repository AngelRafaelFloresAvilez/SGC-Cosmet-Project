<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="tituloPagina" value="Gestion de empleados - SGC Cosmetic" scope="request" />
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
                <h1 class="fuente-titulo mb-0">Gestion de empleados</h1>
            </div>
            <button type="button" class="btn btn-sgc" onclick="AdminEmpleados.abrirNuevo()">
                <i class="bi bi-plus-lg"></i> Nuevo empleado
            </button>
        </div>

        <div class="row g-3 mb-3">
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-gris"><i class="bi bi-people"></i></span>
                    <div><div class="valor"><c:out value="${totalEmpleados}" /></div><div class="etiqueta">Empleados registrados</div><div class="subetiqueta">Total en el sistema</div></div>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-verde"><i class="bi bi-person"></i></span>
                    <div><div class="valor"><c:out value="${empleadosActivos}" /></div><div class="etiqueta">Empleados activos</div><div class="subetiqueta">Actualmente trabajando</div></div>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-rojo"><i class="bi bi-calendar-x"></i></span>
                    <div><div class="valor">2</div><div class="etiqueta">Dias no laborales</div><div class="subetiqueta">Configurados</div></div>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="sgc-card sgc-stat-admin h-100">
                    <span class="icono icono-morado"><i class="bi bi-clock"></i></span>
                    <div><div class="valor">9 hrs</div><div class="etiqueta">Jornada laboral</div><div class="subetiqueta">Horas por dia</div></div>
                </div>
            </div>
        </div>

        <form method="get" action="${ctx}/admin/empleados" class="sgc-buscador mb-3">
            <i class="bi bi-search"></i>
            <input type="text" name="q" placeholder="Buscar empleado..." value="${busqueda}">
        </form>

        <div class="sgc-card">
            <div class="table-responsive">
                <table class="sgc-tabla-admin">
                    <thead>
                    <tr><th>Empleado</th><th>Especialidad</th><th>Horario laboral</th><th>Dias no laborales</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                    <c:forEach var="e" items="${empleados}">
                        <tr>
                            <td>
                                <div class="sgc-nombre-fila">
                                    <div class="sgc-avatar-tabla"></div>
                                    <div>
                                        <div class="fw-semibold"><c:out value="${e.nombreCompleto}" /></div>
                                        <div class="small text-muted"><c:out value="${e.correo}" /></div>
                                        <div class="small text-muted"><c:out value="${e.telefono}" /></div>
                                    </div>
                                </div>
                            </td>
                            <td><c:out value="${e.especialidad}" /></td>
                            <td><c:out value="${e.horarioResumen}" /><br><span class="small text-muted"><c:out value="${e.rangoDiasLaborales}" /></span></td>
                            <td class="small"><c:out value="${e.diasNoLaboralesTexto}" /></td>
                            <td>
                                <span class="badge-estado ${e.activo ? 'badge-confirmada' : 'badge-cancelada'}"><c:out value="${e.activo ? 'Activo' : 'Inactivo'}" /></span>
                            </td>
                            <td>
                                <div class="d-flex gap-1">
                                    <button type="button" class="sgc-btn-editar" title="Editar"
                                            data-id="${e.idEmpleado}" data-nombre="${e.nombreCompleto}"
                                            data-correo="${e.correo}" data-telefono="${e.telefono}"
                                            data-especialidad="${e.especialidad}">
                                        <i class="bi bi-pen"></i>
                                    </button>
                                    <form method="post" action="${ctx}/admin/empleados/estado" class="d-inline">
                                        <input type="hidden" name="id" value="${e.idEmpleado}">
                                        <input type="hidden" name="accion" value="${e.activo ? 'desactivar' : 'activar'}">
                                        <button type="submit" class="sgc-btn-editar" title="${e.activo ? 'Desactivar' : 'Activar'}">
                                            <i class="bi ${e.activo ? 'bi-toggle-on' : 'bi-toggle-off'}"></i>
                                        </button>
                                    </form>
                                    <form method="post" action="${ctx}/admin/empleados/estado" onsubmit="return confirm('¿Eliminar este empleado?');">
                                        <input type="hidden" name="id" value="${e.idEmpleado}">
                                        <input type="hidden" name="accion" value="eliminar">
                                        <button type="submit" class="sgc-btn-eliminar" title="Eliminar"><i class="bi bi-trash"></i></button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    </c:forEach>
                    <c:if test="${empty empleados}">
                        <tr><td colspan="6" class="text-center text-muted py-4">No se encontraron empleados.</td></tr>
                    </c:if>
                    </tbody>
                </table>
            </div>
        </div>

        <jsp:include page="/WEB-INF/vistas_admin/includes/paginador.jsp">
            <jsp:param name="rutaBase" value="/admin/empleados" />
        </jsp:include>
    </main>
</div>

<!-- Modal: Nuevo / Editar empleado -->
<div class="modal fade" id="modalEmpleado" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content sgc-modal-content">
            <div class="modal-header">
                <div>
                    <h3 class="fuente-titulo h5 mb-1" id="tituloModalEmpleado">Nuevo empleado</h3>
                    <p class="text-muted small mb-0">Agrega un miembro nuevo al equipo.</p>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
                <form method="post" action="${ctx}/admin/empleados/guardar" id="formEmpleado">
                    <input type="hidden" name="id" id="empleadoId">
                    <div class="row">
                        <div class="col-sm-6">
                            <label class="form-label-sgc">Nombre completo</label>
                            <input type="text" name="nombre" id="empleadoNombre" class="form-control mb-3" placeholder="Ej. Ana Torres" required>
                        </div>
                        <div class="col-sm-6">
                            <label class="form-label-sgc">Especialidad</label>
                            <select name="especialidad" id="empleadoEspecialidad" class="form-select mb-3" required>
                                <option value="">Selecciona...</option>
                                <option value="Masajista">Masajista</option>
                                <option value="Facialista">Facialista</option>
                                <option value="Manicurista">Manicurista</option>
                                <option value="Cosmetologo">Cosmetologo</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <label class="form-label-sgc">Correo</label>
                            <input type="email" name="correo" id="empleadoCorreo" class="form-control mb-3" placeholder="correo@ejemplo.com" required>
                        </div>
                        <div class="col-sm-6">
                            <label class="form-label-sgc">Telefono</label>
                            <input type="tel" name="telefono" id="empleadoTelefono" class="form-control mb-3" placeholder="+52 55 0000 0000" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <label class="form-label-sgc">Hora de inicio</label>
                            <input type="time" name="horaInicio" id="empleadoHoraInicio" class="form-control mb-3" value="09:00" required>
                        </div>
                        <div class="col-sm-6">
                            <label class="form-label-sgc">Hora de fin</label>
                            <input type="time" name="horaFin" id="empleadoHoraFin" class="form-control mb-3" value="18:00" required>
                        </div>
                    </div>
                    <label class="form-label-sgc">Dias laborales</label>
                    <div class="d-flex flex-wrap gap-3 mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="dias" value="LUNES" id="diaLUNES" checked>
                            <label class="form-check-label small" for="diaLUNES">Lunes</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="dias" value="MARTES" id="diaMARTES" checked>
                            <label class="form-check-label small" for="diaMARTES">Martes</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="dias" value="MIERCOLES" id="diaMIERCOLES" checked>
                            <label class="form-check-label small" for="diaMIERCOLES">Miercoles</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="dias" value="JUEVES" id="diaJUEVES" checked>
                            <label class="form-check-label small" for="diaJUEVES">Jueves</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="dias" value="VIERNES" id="diaVIERNES" checked>
                            <label class="form-check-label small" for="diaVIERNES">Viernes</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="dias" value="SABADO" id="diaSABADO">
                            <label class="form-check-label small" for="diaSABADO">Sabado</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="dias" value="DOMINGO" id="diaDOMINGO">
                            <label class="form-check-label small" for="diaDOMINGO">Domingo</label>
                        </div>
                    </div>

                    <div class="d-flex gap-2 mt-2">
                        <button type="button" class="btn btn-outline-sgc flex-grow-1" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-sgc flex-grow-1" id="btnGuardarEmpleado">Crear empleado</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${ctx}/js/appAdmin.js"></script>
<script>
    const AdminEmpleados = (function () {
        function abrirNuevo() {
            document.getElementById('formEmpleado').reset();
            document.getElementById('empleadoId').value = '';
            document.getElementById('tituloModalEmpleado').textContent = 'Nuevo empleado';
            document.getElementById('btnGuardarEmpleado').textContent = 'Crear empleado';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEmpleado')).show();
        }
        function abrirEditar(boton) {
            const d = boton.dataset;
            document.getElementById('empleadoId').value = d.id;
            document.getElementById('empleadoNombre').value = d.nombre;
            document.getElementById('empleadoCorreo').value = d.correo;
            document.getElementById('empleadoTelefono').value = d.telefono;
            document.getElementById('empleadoEspecialidad').value = d.especialidad;
            document.getElementById('tituloModalEmpleado').textContent = 'Editar empleado';
            document.getElementById('btnGuardarEmpleado').textContent = 'Guardar cambios';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEmpleado')).show();
        }
        return { abrirNuevo, abrirEditar };
    })();

    document.querySelectorAll('.sgc-btn-editar[data-id]').forEach(function (btn) {
        btn.addEventListener('click', function () { AdminEmpleados.abrirEditar(btn); });
    });
</script>
</body>
</html>