<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Control de citas - SGC Cosmetic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesAdmin.css">
</head>
<body data-admin-page="citas">
  <jsp:include page="/WEB-INF/administrador/includes/shell.jsp" />

  <div class="main-wrapper">
    <section class="page-head"><div><h1>Control de citas</h1></div></section>

    <section class="stat-row cols-4">
      <article class="stat-icon"><i class="fa-regular fa-calendar"></i><div><strong>${totalCitas}</strong><small>Total de citas</small></div></article>
      <article class="stat-icon"><i class="fa-regular fa-circle-check"></i><div><strong>${pendientes}</strong><small>Citas pendientes</small></div></article>
      <article class="stat-icon tone-red"><i class="fa-solid fa-xmark"></i><div><strong>${canceladasEsteMes}</strong><small>Canceladas este mes</small></div></article>
      <article class="stat-icon"><i class="fa-solid fa-user-clock"></i><div><strong>${totalPaginas}</strong><small>Páginas</small></div></article>
    </section>

    <form class="toolbar" method="get" action="${ctx}/admin/citas">
      <div class="search-box">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="search" name="q" value="<c:out value='${busqueda}'/>" placeholder="Buscar por cliente o servicio...">
      </div>
      <button class="btn-primary" type="submit">Buscar</button>
    </form>

    <div class="table-card">
      <table class="data">
        <thead><tr><th>Cliente</th><th>Servicio</th><th>Especialista</th><th>Fecha</th><th>Hora</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody id="rows">
          <c:choose>
            <c:when test="${not empty citas}">
              <c:forEach var="cita" items="${citas}">
                <c:set var="tag" value="${cita.estado == 'CANCELADA' ? 'tag-danger' : (cita.estado == 'PENDIENTE' ? 'tag-warn' : 'tag-ok')}" />
                <tr data-id="${cita.idCita}">
                  <td>
                    <div class="cell-person">
                      <span class="avatar round"><i class="fa-regular fa-user"></i></span>
                      <span><b><c:out value="${cita.cliente.nombreCompleto}" /></b><span><c:out value="${not empty cita.cliente.correo ? cita.cliente.correo : 'Sin correo'}" /></span></span>
                    </div>
                  </td>
                  <td><c:out value="${cita.servicio}" /></td>
                  <td><c:out value="${not empty nombresEmpleados[cita.idEmpleado] ? nombresEmpleados[cita.idEmpleado] : 'Sin asignar'}" /></td>
                  <td><c:out value="${cita.fechaFormateadaCorta}" /></td>
                  <td><c:out value="${cita.horaInicioFormateada}" /></td>
                  <td><span class="tag ${tag}"><c:out value="${cita.etiquetaEstado}" /></span></td>
                  <td>
                    <div class="kebab-wrap">
                      <button class="icon-btn" type="button" aria-label="Acciones"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                      <div class="kebab-menu">
                        <form method="post" action="${ctx}/admin/citas/accion"><input type="hidden" name="id" value="${cita.idCita}"><input type="hidden" name="accion" value="confirmar"><input type="hidden" name="pagina" value="${paginaActual}"><button type="submit"><i class="fa-regular fa-circle-check"></i> Marcar confirmada</button></form>
                        <form method="post" action="${ctx}/admin/citas/accion"><input type="hidden" name="id" value="${cita.idCita}"><input type="hidden" name="accion" value="inasistencia"><input type="hidden" name="pagina" value="${paginaActual}"><button type="submit"><i class="fa-solid fa-user-xmark"></i> Marcar inasistencia</button></form>
                        <form method="post" action="${ctx}/admin/citas/accion"><input type="hidden" name="id" value="${cita.idCita}"><input type="hidden" name="accion" value="cancelar"><input type="hidden" name="pagina" value="${paginaActual}"><button type="submit" class="danger"><i class="fa-solid fa-xmark"></i> Cancelar cita</button></form>
                      </div>
                    </div>
                  </td>
                </tr>
              </c:forEach>
            </c:when>
            <c:otherwise><tr class="empty-row"><td colspan="7">No hay citas que coincidan con la busqueda.</td></tr></c:otherwise>
          </c:choose>
        </tbody>
      </table>
    </div>

    <div class="pager" id="pager">
      <c:if test="${totalPaginas > 1}">
        <c:if test="${paginaActual > 1}"><a href="${ctx}/admin/citas?q=${busqueda}&pagina=${paginaActual-1}"><i class="fa-solid fa-chevron-left"></i></a></c:if>
        <c:forEach var="p" begin="1" end="${totalPaginas}">
          <a href="${ctx}/admin/citas?q=${busqueda}&pagina=${p}" class="${p == paginaActual ? 'active' : ''}">${p}</a>
        </c:forEach>
        <c:if test="${paginaActual < totalPaginas}"><a href="${ctx}/admin/citas?q=${busqueda}&pagina=${paginaActual+1}"><i class="fa-solid fa-chevron-right"></i></a></c:if>
      </c:if>
    </div>
  </div>
</body>
</html>
