<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%-- Requiere en request: "empleado" --%>
<header class="sgc-topbar d-flex align-items-center justify-content-between">
    <button class="btn-icono" type="button" data-bs-toggle="offcanvas" data-bs-target="#sgcSidebar"
            aria-controls="sgcSidebar" title="Abrir menu">
        <i class="bi bi-list"></i>
    </button>

    <div class="d-flex align-items-center gap-3">
        <button class="btn-icono position-relative" type="button" title="Notificaciones">
            <i class="bi bi-bell"></i>
        </button>
        <div class="sgc-chip-usuario">
            <i class="bi bi-person-circle fs-5"></i>
            <div>
                <span class="fw-semibold"><c:out value="${empleado != null ? empleado.nombreCompleto : ''}" /></span>
                <small>Empleado</small>
            </div>
        </div>
    </div>
</header>
