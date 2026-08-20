<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:if test="${not empty mensajeExito}">
    <div class="alert alert-success alert-dismissible fade show alert-auto-cierre" role="alert">
        <i class="bi bi-check-circle me-2"></i><c:out value="${mensajeExito}" />
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
</c:if>
<c:if test="${not empty mensajeError}">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="bi bi-exclamation-circle me-2"></i><c:out value="${mensajeError}" />
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
</c:if>
