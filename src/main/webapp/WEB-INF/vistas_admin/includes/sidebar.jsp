<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%-- Requiere en request: "paginaActiva" --%>
<div class="offcanvas offcanvas-start sgc-sidebar" tabindex="-1" id="sgcSidebar" aria-labelledby="sgcSidebarLabel">
    <div class="sgc-sidebar-header d-flex align-items-center gap-2">
        <div class="avatar-sidebar">
            <i class="bi bi-person-fill"></i>
        </div>
        <div>
            <div class="fw-semibold" id="sgcSidebarLabel">Samuel de Luque</div>
            <small>Administrador</small>
        </div>
        <button type="button" class="btn-close ms-auto d-lg-none" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
    </div>

    <div class="nav-section-title">General</div>
    <nav class="nav flex-column mb-2">
        <a class="nav-link ${paginaActiva == 'dashboard' ? 'activo' : ''}" href="${pageContext.request.contextPath}/admin/dashboard">
            <i class="bi bi-house"></i> Dashboard
        </a>
        <a class="nav-link ${paginaActiva == 'citas' ? 'activo' : ''}" href="${pageContext.request.contextPath}/admin/citas">
            <i class="bi bi-journal-check"></i> Gestion de citas
        </a>
        <a class="nav-link ${paginaActiva == 'servicios' ? 'activo' : ''}" href="${pageContext.request.contextPath}/admin/servicios">
            <i class="bi bi-calendar2-week"></i> Servicios
        </a>
        <a class="nav-link ${paginaActiva == 'empleados' ? 'activo' : ''}" href="${pageContext.request.contextPath}/admin/empleados">
            <i class="bi bi-people"></i> Empleados
        </a>
        <a class="nav-link ${paginaActiva == 'clientes' ? 'activo' : ''}" href="${pageContext.request.contextPath}/admin/clientes">
            <i class="bi bi-person"></i> Clientes
        </a>
        <a class="nav-link ${paginaActiva == 'promociones' ? 'activo' : ''}" href="${pageContext.request.contextPath}/admin/promociones">
            <i class="bi bi-tag"></i> Promociones
        </a>
    </nav>

    <div class="mt-auto">
        <div class="nav-section-title">Cuenta</div>
        <nav class="nav flex-column mb-2">
            <a class="btn btn-cerrar-sesion d-flex align-items-center justify-content-center gap-2 mt-2"
               href="${pageContext.request.contextPath}/cerrar-sesion">
                <i class="bi bi-box-arrow-right"></i> Cerrar sesion
            </a>
        </nav>
    </div>

    <div class="marca-footer">SGC COSMETIC</div>
</div>