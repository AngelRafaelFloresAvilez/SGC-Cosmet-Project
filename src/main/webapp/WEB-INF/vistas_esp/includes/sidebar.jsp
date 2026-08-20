<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div class="offcanvas offcanvas-start sgc-sidebar" tabindex="-1" id="sgcSidebar" aria-labelledby="sgcSidebarLabel">
    <div class="sgc-sidebar-header d-flex align-items-center gap-2">
        <div class="avatar-sidebar">
            <c:choose>
                <c:when test="${not empty empleado and not empty empleado.rutaFoto}">
                    <img src="${pageContext.request.contextPath}${empleado.rutaFoto}" alt="Foto de perfil">
                </c:when>
                <c:otherwise><i class="bi bi-person-fill"></i></c:otherwise>
            </c:choose>
        </div>
        <div>
            <div class="fw-semibold" id="sgcSidebarLabel">
                <c:out value="${not empty usuarioSesion ? usuarioSesion.nombreCompleto : 'Especialista'}" />
            </div>
            <small>Especialista</small>
        </div>
        <button type="button" class="btn-close ms-auto d-lg-none" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
    </div>

    <div class="nav-section-title">General</div>
    <nav class="nav flex-column mb-2">
        <a class="nav-link ${paginaActiva == 'dashboard' ? 'activo' : ''}"
           href="${pageContext.request.contextPath}/especialista/dashboard">
            <i class="bi bi-house"></i> Dashboard
        </a>
        <a class="nav-link ${paginaActiva == 'agenda' ? 'activo' : ''}"
           href="${pageContext.request.contextPath}/especialista/agenda">
            <i class="bi bi-calendar2-week"></i> Agenda
        </a>
        <a class="nav-link ${paginaActiva == 'perfil' ? 'activo' : ''}"
           href="${pageContext.request.contextPath}/especialista/perfil">
            <i class="bi bi-person-badge"></i> Mi perfil
        </a>
    </nav>

    <div class="mt-auto">
        <div class="nav-section-title">Cuenta</div>
        <nav class="nav flex-column mb-2">
            <a class="btn btn-cerrar-sesion d-flex align-items-center justify-content-center gap-2"
               href="${pageContext.request.contextPath}/logout">
                <i class="bi bi-box-arrow-right"></i> Cerrar sesión
            </a>
        </nav>
    </div>

    <div class="marca-footer">SGC COSMETIC</div>
</div>