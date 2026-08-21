<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%--
    Paginador generico reutilizado por todas las tablas del admin. Requiere en request:
    "paginaActual" y "totalPaginas". Parametros del include:
      - rutaBase: ruta del servlet (ej. "/admin/citas")
      - extraQuery: query string adicional ya armado, ej. "&estado=activas" (opcional)
    Tambien preserva automaticamente "q" (busqueda) si esta presente en el request.
--%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="rutaBase" value="${param.rutaBase}" />
<c:set var="extra" value="${param.extraQuery}" />
<c:if test="${totalPaginas > 1}">
    <nav class="mt-4 d-flex justify-content-center">
        <ul class="pagination sgc-paginacion">
            <li class="page-item ${paginaActual <= 1 ? 'disabled' : ''}">
                <a class="page-link" href="${ctx}${rutaBase}?pagina=${paginaActual - 1}${not empty busqueda ? '&q=' : ''}${busqueda}${extra}">
                    <i class="bi bi-chevron-left"></i>
                </a>
            </li>
            <c:forEach var="p" begin="1" end="${totalPaginas}">
                <li class="page-item ${p == paginaActual ? 'active' : ''}">
                    <a class="page-link" href="${ctx}${rutaBase}?pagina=${p}${not empty busqueda ? '&q=' : ''}${busqueda}${extra}">
                        <c:out value="${p}" />
                    </a>
                </li>
            </c:forEach>
            <li class="page-item ${paginaActual >= totalPaginas ? 'disabled' : ''}">
                <a class="page-link" href="${ctx}${rutaBase}?pagina=${paginaActual + 1}${not empty busqueda ? '&q=' : ''}${busqueda}${extra}">
                    <i class="bi bi-chevron-right"></i>
                </a>
            </li>
        </ul>
    </nav>
</c:if>
