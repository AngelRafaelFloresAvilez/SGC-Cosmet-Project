<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="tituloPagina" value="Configuracion - SGC Cosmetic" scope="request" />
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
            <h1 class="fuente-titulo mb-0">Configuracion</h1>
        </div>

        <div class="row g-3">
            <div class="col-lg-6">
                <div class="sgc-card p-4">
                    <h2 class="h6 mb-1">Cuenta de administrador</h2>
                    <p class="text-muted small mb-3">Correo de acceso: <c:out value="${correoAdmin}" /></p>

                    <form method="post" action="${ctx}/admin/configuracion">
                        <label class="form-label-sgc">Contrasena actual</label>
                        <input type="password" name="contrasenaActual" class="form-control mb-3" required>

                        <label class="form-label-sgc">Nueva contrasena</label>
                        <input type="password" name="contrasenaNueva" class="form-control mb-3" required>

                        <label class="form-label-sgc">Confirmar nueva contrasena</label>
                        <input type="password" name="confirmarContrasena" class="form-control mb-3" required>

                        <button type="submit" class="btn btn-sgc w-100">Actualizar contrasena</button>
                    </form>
                </div>
            </div>

            <div class="col-lg-6">
                <div class="sgc-card p-4">
                    <h2 class="h6 mb-1">Informacion del negocio</h2>
                    <p class="text-muted small mb-3">Estos datos aparecen en la landing publica y en el pie de pagina.</p>
                    <dl class="row mb-0">
                        <dt class="col-5 text-muted fw-normal">Nombre</dt>
                        <dd class="col-7">SGC Cosmetic</dd>
                        <dt class="col-5 text-muted fw-normal">Correo</dt>
                        <dd class="col-7">contacto@sgccosmetic.com</dd>
                        <dt class="col-5 text-muted fw-normal">Telefono</dt>
                        <dd class="col-7">+52 567 850 4567</dd>
                    </dl>
                    <p class="small text-muted mt-3 mb-0">
                        La edicion de estos datos generales todavia no esta disponible; se agregara cuando
                        se comparta el diseno correspondiente.
                    </p>
                </div>
            </div>
        </div>
    </main>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${ctx}/assets/js/app.js"></script>
</body>
</html>
