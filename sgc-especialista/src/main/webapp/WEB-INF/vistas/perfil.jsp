<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<c:set var="tituloPagina" value="Mi perfil profesional - SGC Cosmetic" scope="request" />
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<%-- Si hubo un error de validacion, "valoresEnviados" trae lo que el usuario escribio;
     si no, partimos de los datos actuales del empleado. --%>
<c:set var="v" value="${valoresEnviados}" />
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

        <div class="sgc-encabezado-hero mb-3">
            <h1 class="fuente-titulo mb-1">Mi perfil profesional</h1>
            <p class="sgc-subtitulo mb-0">Gestiona tu informacion personal y laboral</p>
        </div>

        <ul class="nav nav-tabs sgc-barra-herramientas mb-3">
            <li class="nav-item">
                <span class="nav-link active fw-semibold" style="color:#151E10; text-shadow: 0 1px 5px rgba(0,0,0,.55); border-color: transparent transparent rgba(255,255,255,.85);">
                    Informacion
                </span>
            </li>
        </ul>

        <div class="row g-3">
            <!-- Foto y datos de contacto -->
            <div class="col-lg-3">
                <div class="sgc-card p-4 text-center h-100">
                    <div class="sgc-foto-wrapper mb-4">
                        <div class="avatar-cliente-grande d-flex align-items-center justify-content-center">
                            <c:choose>
                                <c:when test="${empleado.rutaFoto != null}">
                                    <img id="previewFoto" src="${ctx}${empleado.rutaFoto}" alt="Foto de perfil">
                                </c:when>
                                <c:otherwise>
                                    <img id="previewFoto" src="" alt="Foto de perfil" style="display:none;">
                                    <span id="inicialesFoto" class="h3 mb-0" style="color: var(--sgc-verde-oscuro);"><c:out value="${empleado.iniciales}" /></span>
                                </c:otherwise>
                            </c:choose>
                        </div>

                        <form id="formFoto" method="post" action="${ctx}/especialista/perfil/foto" enctype="multipart/form-data" class="mt-3">
                            <label class="btn btn-outline-sgc btn-sm w-100" for="inputFoto">Cambiar foto</label>
                            <input type="file" id="inputFoto" name="foto" accept="image/png, image/jpeg, image/webp">
                        </form>
                        <div id="errorFoto" class="text-danger small mt-2 d-none"></div>
                        <div class="text-muted small mt-2">JPG, PNG o WEBP. Maximo 2 MB.</div>
                    </div>

                    <hr class="sgc-separador">

                    <h2 class="h5 mb-1 mt-3"><c:out value="${empleado.nombreCompleto}" /></h2>
                    <p class="text-muted mb-3">Empleado</p>

                    <hr class="sgc-separador">

                    <div class="text-start small mt-3">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <i class="bi bi-telephone" style="color: var(--sgc-verde);"></i>
                            <c:out value="${empleado.telefono}" />
                        </div>
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <i class="bi bi-envelope" style="color: var(--sgc-verde);"></i>
                            <c:out value="${empleado.correo}" />
                        </div>
                        <div class="d-flex align-items-center gap-3">
                            <i class="bi bi-person-vcard" style="color: var(--sgc-verde);"></i>
                            ID Empleado: <c:out value="${empleado.idEmpleado}" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Informacion personal -->
            <div class="col-lg-5">
                <div class="sgc-card p-4 h-100">
                    <h2 class="h6 mb-3">Informacion personal</h2>
                    <form id="formPerfil" method="post" action="${ctx}/especialista/perfil" novalidate>
                        <div class="mb-3">
                            <label class="form-label form-label-sgc" for="nombreCompleto">Nombre completo</label>
                            <input type="text" class="form-control ${errores.nombreCompleto != null ? 'is-invalid' : ''}"
                                   id="nombreCompleto" name="nombreCompleto" maxlength="80"
                                   value="${v != null ? v.nombreCompleto : empleado.nombreCompleto}">
                            <c:if test="${errores.nombreCompleto != null}">
                                <div class="invalid-feedback"><c:out value="${errores.nombreCompleto}" /></div>
                            </c:if>
                        </div>

                        <div class="mb-3">
                            <label class="form-label form-label-sgc" for="fechaNacimiento">Fecha de nacimiento</label>
                            <input type="date" class="form-control ${errores.fechaNacimiento != null ? 'is-invalid' : ''}"
                                   id="fechaNacimiento" name="fechaNacimiento"
                                   value="${v != null ? v.fechaNacimiento : empleado.fechaNacimientoIso}">
                            <c:if test="${errores.fechaNacimiento != null}">
                                <div class="invalid-feedback"><c:out value="${errores.fechaNacimiento}" /></div>
                            </c:if>
                        </div>

                        <div class="mb-3">
                            <label class="form-label form-label-sgc" for="genero">Genero</label>
                            <c:set var="generoActual" value="${v != null ? v.genero : empleado.genero}" />
                            <select class="form-select ${errores.genero != null ? 'is-invalid' : ''}" id="genero" name="genero">
                                <option value="" ${empty generoActual ? 'selected' : ''}>Selecciona...</option>
                                <option value="Masculino" ${generoActual == 'Masculino' ? 'selected' : ''}>Masculino</option>
                                <option value="Femenino" ${generoActual == 'Femenino' ? 'selected' : ''}>Femenino</option>
                                <option value="Otro" ${generoActual == 'Otro' ? 'selected' : ''}>Otro</option>
                            </select>
                            <c:if test="${errores.genero != null}">
                                <div class="invalid-feedback"><c:out value="${errores.genero}" /></div>
                            </c:if>
                        </div>

                        <div class="mb-3">
                            <label class="form-label form-label-sgc" for="especialidad">Especialidad</label>
                            <input type="text" class="form-control ${errores.especialidad != null ? 'is-invalid' : ''}"
                                   id="especialidad" name="especialidad" maxlength="60"
                                   value="${v != null ? v.especialidad : empleado.especialidad}">
                            <c:if test="${errores.especialidad != null}">
                                <div class="invalid-feedback"><c:out value="${errores.especialidad}" /></div>
                            </c:if>
                        </div>

                        <div class="mb-3">
                            <label class="form-label form-label-sgc" for="experienciaAnios">Experiencia (años)</label>
                            <input type="number" min="0" max="65" class="form-control ${errores.experienciaAnios != null ? 'is-invalid' : ''}"
                                   id="experienciaAnios" name="experienciaAnios"
                                   value="${v != null ? v.experienciaAnios : empleado.experienciaAnios}">
                            <c:if test="${errores.experienciaAnios != null}">
                                <div class="invalid-feedback"><c:out value="${errores.experienciaAnios}" /></div>
                            </c:if>
                        </div>

                        <div class="mb-3">
                            <label class="form-label form-label-sgc" for="telefono">Telefono</label>
                            <input type="text" class="form-control ${errores.telefono != null ? 'is-invalid' : ''}"
                                   id="telefono" name="telefono" maxlength="20"
                                   value="${v != null ? v.telefono : empleado.telefono}">
                            <c:if test="${errores.telefono != null}">
                                <div class="invalid-feedback"><c:out value="${errores.telefono}" /></div>
                            </c:if>
                        </div>

                        <div class="mb-4">
                            <label class="form-label form-label-sgc" for="correo">Correo electronico</label>
                            <input type="email" class="form-control ${errores.correo != null ? 'is-invalid' : ''}"
                                   id="correo" name="correo" maxlength="120"
                                   value="${v != null ? v.correo : empleado.correo}">
                            <c:if test="${errores.correo != null}">
                                <div class="invalid-feedback"><c:out value="${errores.correo}" /></div>
                            </c:if>
                        </div>

                        <button type="submit" class="btn btn-sgc">Guardar cambios</button>
                    </form>
                </div>
            </div>

            <!-- Servicios y horario -->
            <div class="col-lg-4 d-flex flex-column gap-3">
                <div class="sgc-card p-4">
                    <h2 class="h6 mb-3">Servicios que realizo</h2>
                    <c:forEach var="servicio" items="${empleado.servicios}">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <i class="bi bi-check-circle-fill" style="color: var(--sgc-verde);"></i>
                            <c:out value="${servicio}" />
                        </div>
                    </c:forEach>
                    <c:if test="${empty empleado.servicios}">
                        <p class="text-muted small mb-0">Aun no tienes servicios asignados.</p>
                    </c:if>
                </div>

                <div class="sgc-card p-4">
                    <h2 class="h6 mb-3">Horario laboral</h2>
                    <c:forEach var="dia" items="${empleado.horario}">
                        <div class="sgc-horario-fila">
                            <span class="text-capitalize small">
                                <c:out value="${fn:toLowerCase(dia.key)}" />
                            </span>
                            <c:choose>
                                <c:when test="${dia.value != null}">
                                    <span class="badge-horario-activo"><c:out value="${dia.value}" /></span>
                                </c:when>
                                <c:otherwise>
                                    <span class="badge-horario-inactivo">No trabaja</span>
                                </c:otherwise>
                            </c:choose>
                        </div>
                    </c:forEach>
                </div>
            </div>
        </div>
    </main>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${ctx}/assets/js/app.js"></script>
</body>
</html>
