<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gestion de clientes - SGC Cosmetic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesAdmin.css">
</head>
<body data-admin-page="clientes">
  <jsp:include page="/WEB-INF/administrador/includes/shell.jsp" />

  <div class="main-wrapper">
    <section class="page-head"><div><h1>Gestion de clientes</h1></div></section>

    <section class="stat-row cols-4">
      <article class="stat-icon tone-grey"><i class="fa-solid fa-users"></i><div><strong>${totalClientes}</strong><small>Clientes registrados<span class="stat-sub">Total en el sistema</span></small></div></article>
      <article class="stat-icon"><i class="fa-regular fa-user"></i><div><strong>${clientesActivos}</strong><small>Clientes activos<span class="stat-sub">Sin restricciones</span></small></div></article>
      <article class="stat-icon tone-red"><i class="fa-solid fa-user-slash"></i><div><strong>${totalClientes - clientesActivos}</strong><small>Clientes vetados<span class="stat-sub">Por inasistencias</span></small></div></article>
      <article class="stat-icon tone-purple"><i class="fa-regular fa-calendar-xmark"></i><div><strong>${totalPaginas}</strong><small>Páginas<span class="stat-sub">De resultados</span></small></div></article>
    </section>

    <form class="toolbar" method="get" action="${ctx}/admin/clientes">
      <div class="search-box"><i class="fa-solid fa-magnifying-glass"></i><input type="search" name="q" value="<c:out value='${busqueda}'/>" placeholder="Buscar cliente..."></div>
      <button class="btn-primary" type="submit">Buscar</button>
    </form>

    <div class="table-card">
      <table class="data">
        <thead><tr><th>Cliente</th><th>Telefono</th><th>Email</th><th>Faltas</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody id="rows">
          <c:choose>
            <c:when test="${not empty clientes}">
              <c:forEach var="cl" items="${clientes}">
                <tr data-id="${cl.idCliente}">
                  <td><div class="cell-person"><span class="avatar round"><i class="fa-regular fa-user"></i></span><span><b><c:out value="${cl.nombreCompleto}" /></b></span></div></td>
                  <td><c:out value="${not empty cl.telefono ? cl.telefono : '—'}" /></td>
                  <td><c:out value="${cl.correo}" /></td>
                  <td>${cl.faltas}</td>
                  <td><span class="tag ${cl.vetado ? 'tag-danger' : 'tag-ok'}">${cl.vetado ? 'Vetado' : 'Activo'}</span></td>
                  <td>
                    <div class="kebab-wrap">
                      <button class="icon-btn" type="button" aria-label="Acciones"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                      <div class="kebab-menu">
                        <c:choose>
                          <c:when test="${cl.vetado}">
                            <form method="post" action="${ctx}/admin/clientes/accion"><input type="hidden" name="id" value="${cl.idCliente}"><input type="hidden" name="accion" value="activar"><button type="submit"><i class="fa-solid fa-user-check"></i> Reactivar cliente</button></form>
                          </c:when>
                          <c:otherwise>
                            <form method="post" action="${ctx}/admin/clientes/accion"><input type="hidden" name="id" value="${cl.idCliente}"><input type="hidden" name="accion" value="vetar"><button type="submit" class="danger"><i class="fa-solid fa-user-slash"></i> Vetar cliente</button></form>
                          </c:otherwise>
                        </c:choose>
                      </div>
                    </div>
                  </td>
                </tr>
              </c:forEach>
            </c:when>
            <c:otherwise><tr class="empty-row"><td colspan="6">No hay clientes que coincidan con la busqueda.</td></tr></c:otherwise>
          </c:choose>
        </tbody>
      </table>
    </div>

    <div class="pager" id="pager">
      <c:if test="${totalPaginas > 1}">
        <c:if test="${paginaActual > 1}"><a href="${ctx}/admin/clientes?q=${busqueda}&pagina=${paginaActual-1}"><i class="fa-solid fa-chevron-left"></i></a></c:if>
        <c:forEach var="p" begin="1" end="${totalPaginas}"><a href="${ctx}/admin/clientes?q=${busqueda}&pagina=${p}" class="${p == paginaActual ? 'active' : ''}">${p}</a></c:forEach>
        <c:if test="${paginaActual < totalPaginas}"><a href="${ctx}/admin/clientes?q=${busqueda}&pagina=${paginaActual+1}"><i class="fa-solid fa-chevron-right"></i></a></c:if>
      </c:if>
    </div>
  </div>
</body>
</html>
