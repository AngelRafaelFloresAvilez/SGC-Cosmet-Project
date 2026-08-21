<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gestion de servicios - SGC Cosmetic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesAdmin.css">
</head>
<body data-admin-page="servicios">
  <jsp:include page="/WEB-INF/administrador/includes/shell.jsp" />

  <div class="main-wrapper">
    <section class="page-head">
      <div><h1>Gestion de servicios</h1></div>
      <button class="btn-primary" type="button" onclick="abrirServicio()">+ Agregar servicio</button>
    </section>

    <section class="stat-row cols-4">
      <article class="stat-note"><strong>Informacion de servicios</strong><small>Administra los servicios que ofrece SGC - Cosmetic</small></article>
      <article class="stat-icon"><i class="fa-regular fa-calendar"></i><div><strong>${totalServicios}</strong><small>servicios registrados</small></div></article>
      <article class="stat-icon tone-yellow"><i class="fa-regular fa-clock"></i><div><strong><c:out value="${duracionPromedio}" /></strong><small>Duracion promedio</small></div></article>
      <article class="stat-icon"><i class="fa-solid fa-dollar-sign"></i><div><strong><c:out value="${precioPromedio}" /></strong><small>Precio promedio</small></div></article>
    </section>

    <form class="toolbar" method="get" action="${ctx}/admin/servicios">
      <div class="search-box"><i class="fa-solid fa-magnifying-glass"></i><input type="search" name="q" value="<c:out value='${busqueda}'/>" placeholder="Buscar servicio..."></div>
      <button class="btn-primary" type="submit">Buscar</button>
    </form>

    <div class="table-card">
      <table class="data">
        <thead><tr><th>Servicios</th><th>Descripción</th><th>Duración</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody id="rows">
          <c:choose>
            <c:when test="${not empty servicios}">
              <c:forEach var="s" items="${servicios}">
                <tr data-id="${s.idServicio}" data-nombre="<c:out value='${s.nombre}'/>" data-precio="${s.precio}" data-duracion="<c:out value='${s.duracionTexto}'/>" data-descripcion="<c:out value='${s.descripcion}'/>" data-estado="${s.disponible ? 'Activo' : 'Inactivo'}">
                  <td><div class="cell-person"><span class="cell-thumb"></span><span><b><c:out value="${s.nombre}" /></b></span></div></td>
                  <td style="max-width:280px"><c:out value="${s.descripcion}" /></td>
                  <td><c:out value="${s.duracionTexto}" /></td>
                  <td><c:out value="${s.precioFormateado}" /></td>
                  <td><span class="tag ${s.disponible ? 'tag-ok' : 'tag-danger'}">${s.disponible ? 'Activo' : 'Inactivo'}</span></td>
                  <td>
                    <div class="row-actions" style="display:flex;gap:6px">
                      <button class="icon-btn" type="button" aria-label="Editar" onclick="editarServicio(this)"><i class="fa-solid fa-pen-to-square"></i></button>
                      <form method="post" action="${ctx}/admin/servicios/desactivar" onsubmit="return confirm('¿Desactivar este servicio?')"><input type="hidden" name="id" value="${s.idServicio}"><button class="icon-btn" type="submit" aria-label="Desactivar"><i class="fa-regular fa-eye-slash"></i></button></form>
                      <form method="post" action="${ctx}/admin/servicios/eliminar" onsubmit="return confirm('¿Eliminar este servicio?')"><input type="hidden" name="id" value="${s.idServicio}"><button class="icon-btn danger" type="submit" aria-label="Eliminar"><i class="fa-regular fa-trash-can"></i></button></form>
                    </div>
                  </td>
                </tr>
              </c:forEach>
            </c:when>
            <c:otherwise><tr class="empty-row"><td colspan="6">No hay servicios que coincidan con la busqueda.</td></tr></c:otherwise>
          </c:choose>
        </tbody>
      </table>
    </div>

    <div class="pager" id="pager">
      <c:if test="${totalPaginas > 1}">
        <c:if test="${paginaActual > 1}"><a href="${ctx}/admin/servicios?q=${busqueda}&pagina=${paginaActual-1}"><i class="fa-solid fa-chevron-left"></i></a></c:if>
        <c:forEach var="p" begin="1" end="${totalPaginas}"><a href="${ctx}/admin/servicios?q=${busqueda}&pagina=${p}" class="${p == paginaActual ? 'active' : ''}">${p}</a></c:forEach>
        <c:if test="${paginaActual < totalPaginas}"><a href="${ctx}/admin/servicios?q=${busqueda}&pagina=${paginaActual+1}"><i class="fa-solid fa-chevron-right"></i></a></c:if>
      </c:if>
    </div>
  </div>

  <!-- Modal servicio -->
  <div class="modal-backdrop" id="servicioModal">
    <div class="modal">
      <h2 id="servicioModalTitle">Agregar servicio</h2>
      <form method="post" action="${ctx}/admin/servicios/guardar">
        <input type="hidden" name="id" id="sId">
        <div style="display:grid;gap:10px;margin-top:10px">
          <label>Nombre<input name="nombre" id="sNombre" required></label>
          <label>Descripción<textarea name="descripcion" id="sDescripcion" rows="2"></textarea></label>
          <label>Duración<input name="duracion" id="sDuracion" placeholder="Ej. 60 min"></label>
          <label>Precio<input name="precio" id="sPrecio" type="number" step="0.01" placeholder="Ej. 450"></label>
          <label>Estado
            <select name="estado" id="sEstado"><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select>
          </label>
          <input type="hidden" name="fotoUrl" value="">
        </div>
        <div class="modal-actions" style="margin-top:14px;display:flex;gap:8px;justify-content:flex-end">
          <button class="btn-ghost" type="button" onclick="cerrarServicio()">Cancelar</button>
          <button class="btn-primary" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    function abrirServicio() {
      document.getElementById('servicioModalTitle').textContent = 'Agregar servicio';
      document.getElementById('sId').value = '';
      document.getElementById('sNombre').value = '';
      document.getElementById('sDescripcion').value = '';
      document.getElementById('sDuracion').value = '';
      document.getElementById('sPrecio').value = '';
      document.getElementById('sEstado').value = 'Activo';
      document.getElementById('servicioModal').classList.add('open');
    }
    function editarServicio(btn) {
      const tr = btn.closest('tr');
      document.getElementById('servicioModalTitle').textContent = 'Editar servicio';
      document.getElementById('sId').value = tr.dataset.id;
      document.getElementById('sNombre').value = tr.dataset.nombre;
      document.getElementById('sDescripcion').value = tr.dataset.descripcion;
      document.getElementById('sDuracion').value = tr.dataset.duracion;
      document.getElementById('sPrecio').value = tr.dataset.precio;
      document.getElementById('sEstado').value = tr.dataset.estado;
      document.getElementById('servicioModal').classList.add('open');
    }
    function cerrarServicio() { document.getElementById('servicioModal').classList.remove('open'); }
    document.getElementById('servicioModal').addEventListener('click', (e) => { if (e.target.id === 'servicioModal') cerrarServicio(); });
  </script>
</body>
</html>
