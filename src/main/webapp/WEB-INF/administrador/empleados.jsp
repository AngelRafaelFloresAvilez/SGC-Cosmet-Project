<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gestion de empleados - SGC Cosmetic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesAdmin.css">
</head>
<body data-admin-page="empleados">
  <jsp:include page="/WEB-INF/administrador/includes/shell.jsp" />

  <div class="main-wrapper">
    <section class="page-head">
      <div><h1>Gestion de empleados</h1></div>
      <button class="btn-primary" type="button" onclick="abrirEmpleado()">+ Nuevo empleado</button>
    </section>

    <section class="stat-row cols-4">
      <article class="stat-icon tone-grey"><i class="fa-solid fa-users"></i><div><strong>${totalEmpleados}</strong><small>Empleados registrados<span class="stat-sub">Total en el sistema</span></small></div></article>
      <article class="stat-icon"><i class="fa-regular fa-user"></i><div><strong>${empleadosActivos}</strong><small>Empleados activos<span class="stat-sub">Actualmente trabajando</span></small></div></article>
      <article class="stat-icon tone-red"><i class="fa-regular fa-calendar"></i><div><strong>${totalPaginas}</strong><small>Páginas<span class="stat-sub">De resultados</span></small></div></article>
      <article class="stat-icon tone-purple"><i class="fa-regular fa-clock"></i><div><strong>8 hrs</strong><small>Jornada laboral<span class="stat-sub">Horas por día</span></small></div></article>
    </section>

    <form class="toolbar" method="get" action="${ctx}/admin/empleados">
      <div class="search-box"><i class="fa-solid fa-magnifying-glass"></i><input type="search" name="q" value="<c:out value='${busqueda}'/>" placeholder="Buscar empleado..."></div>
      <button class="btn-primary" type="submit">Buscar</button>
    </form>

    <div class="table-card">
      <table class="data">
        <thead><tr><th>Empleado</th><th>Especialidad</th><th>Horario laboral</th><th>Días no laborales</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody id="rows">
          <c:choose>
            <c:when test="${not empty empleados}">
              <c:forEach var="e" items="${empleados}">
                <tr data-id="${e.idEmpleado}" data-nombre="<c:out value='${e.nombreCompleto}'/>" data-especialidad="<c:out value='${e.especialidad}'/>" data-correo="<c:out value='${e.correo}'/>" data-telefono="<c:out value='${e.telefono}'/>">
                  <td><div class="cell-person"><span class="avatar round"><i class="fa-regular fa-user"></i></span><span><b><c:out value="${e.nombreCompleto}" /></b><span><c:out value="${e.correo}" /></span><span><c:out value="${e.telefono}" /></span></span></div></td>
                  <td><c:out value="${e.especialidad}" /></td>
                  <td><c:out value="${e.horarioResumen}" /></td>
                  <td><c:out value="${e.diasNoLaboralesTexto}" /></td>
                  <td><span class="tag ${e.activo ? 'tag-ok' : 'tag-neutral'}">${e.activo ? 'Activo' : 'Inactivo'}</span></td>
                  <td>
                    <div class="row-actions" style="display:flex;gap:6px">
                      <button class="icon-btn" type="button" aria-label="Editar" onclick="editarEmpleado(this)"><i class="fa-solid fa-pen-to-square"></i></button>
                      <form method="post" action="${ctx}/admin/empleados/estado"><input type="hidden" name="id" value="${e.idEmpleado}"><input type="hidden" name="accion" value="${e.activo ? 'desactivar' : 'activar'}"><button class="icon-btn" type="submit" aria-label="Cambiar estado"><i class="fa-solid fa-power-off"></i></button></form>
                      <form method="post" action="${ctx}/admin/empleados/estado" onsubmit="return confirm('¿Eliminar este empleado?')"><input type="hidden" name="id" value="${e.idEmpleado}"><input type="hidden" name="accion" value="eliminar"><button class="icon-btn danger" type="submit" aria-label="Eliminar"><i class="fa-regular fa-trash-can"></i></button></form>
                    </div>
                  </td>
                </tr>
              </c:forEach>
            </c:when>
            <c:otherwise><tr class="empty-row"><td colspan="6">No hay empleados que coincidan con la busqueda.</td></tr></c:otherwise>
          </c:choose>
        </tbody>
      </table>
    </div>

    <div class="pager" id="pager">
      <c:if test="${totalPaginas > 1}">
        <c:if test="${paginaActual > 1}"><a href="${ctx}/admin/empleados?q=${busqueda}&pagina=${paginaActual-1}"><i class="fa-solid fa-chevron-left"></i></a></c:if>
        <c:forEach var="p" begin="1" end="${totalPaginas}"><a href="${ctx}/admin/empleados?q=${busqueda}&pagina=${p}" class="${p == paginaActual ? 'active' : ''}">${p}</a></c:forEach>
        <c:if test="${paginaActual < totalPaginas}"><a href="${ctx}/admin/empleados?q=${busqueda}&pagina=${paginaActual+1}"><i class="fa-solid fa-chevron-right"></i></a></c:if>
      </c:if>
    </div>
  </div>

  <!-- Modal empleado -->
  <div class="modal-backdrop" id="empleadoModal">
    <div class="modal">
      <h2 id="empleadoModalTitle">Nuevo empleado</h2>
      <form method="post" action="${ctx}/admin/empleados/guardar">
        <input type="hidden" name="id" id="eId">
        <div style="display:grid;gap:10px;margin-top:10px">
          <label>Nombre completo<input name="nombre" id="eNombre" required></label>
          <label>Especialidad<input name="especialidad" id="eEspecialidad"></label>
          <label>Correo<input name="correo" id="eCorreo" type="email" required></label>
          <label>Teléfono<input name="telefono" id="eTelefono"></label>
          <div style="display:flex;gap:10px">
            <label style="flex:1">Hora inicio<input name="horaInicio" id="eHoraInicio" type="time"></label>
            <label style="flex:1">Hora fin<input name="horaFin" id="eHoraFin" type="time"></label>
          </div>
        </div>
        <div class="modal-actions" style="margin-top:14px;display:flex;gap:8px;justify-content:flex-end">
          <button class="btn-ghost" type="button" onclick="cerrarEmpleado()">Cancelar</button>
          <button class="btn-primary" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    function abrirEmpleado() {
      document.getElementById('empleadoModalTitle').textContent = 'Nuevo empleado';
      ['eId','eNombre','eEspecialidad','eCorreo','eTelefono','eHoraInicio','eHoraFin'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('empleadoModal').classList.add('open');
    }
    function editarEmpleado(btn) {
      const tr = btn.closest('tr');
      document.getElementById('empleadoModalTitle').textContent = 'Editar empleado';
      document.getElementById('eId').value = tr.dataset.id;
      document.getElementById('eNombre').value = tr.dataset.nombre;
      document.getElementById('eEspecialidad').value = tr.dataset.especialidad;
      document.getElementById('eCorreo').value = tr.dataset.correo;
      document.getElementById('eTelefono').value = tr.dataset.telefono;
      document.getElementById('eHoraInicio').value = '';
      document.getElementById('eHoraFin').value = '';
      document.getElementById('empleadoModal').classList.add('open');
    }
    function cerrarEmpleado() { document.getElementById('empleadoModal').classList.remove('open'); }
    document.getElementById('empleadoModal').addEventListener('click', (e) => { if (e.target.id === 'empleadoModal') cerrarEmpleado(); });
  </script>
</body>
</html>
