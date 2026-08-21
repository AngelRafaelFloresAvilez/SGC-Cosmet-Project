<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Promociones - SGC Cosmetic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesAdmin.css">
</head>
<body data-admin-page="promociones">
  <jsp:include page="/WEB-INF/administrador/includes/shell.jsp" />

  <div class="main-wrapper">
    <section class="page-head">
      <div><h1>Promociones</h1><p>Administra y controla las promociones y descuentos disponibles para tus clientes</p></div>
      <button class="btn-primary" type="button" onclick="abrirPromo()">+ Nueva promocion</button>
    </section>

    <div class="tabs" id="tabs">
      <a href="${ctx}/admin/promociones" class="${empty pestanaActual ? 'active' : ''}">Todas las promociones</a>
      <a href="${ctx}/admin/promociones?estado=Activa" class="${pestanaActual == 'Activa' ? 'active' : ''}">Activas <span class="count">${totalActivas}</span></a>
      <a href="${ctx}/admin/promociones?estado=Programada" class="${pestanaActual == 'Programada' ? 'active' : ''}">Programadas <span class="count">${totalProgramadas}</span></a>
      <a href="${ctx}/admin/promociones?estado=Expirada" class="${pestanaActual == 'Expirada' ? 'active' : ''}">Expiradas <span class="count">${totalExpiradas}</span></a>
    </div>

    <form class="toolbar" style="border-radius:0" method="get" action="${ctx}/admin/promociones">
      <c:if test="${not empty pestanaActual}"><input type="hidden" name="estado" value="${pestanaActual}"></c:if>
      <div class="search-box"><i class="fa-solid fa-magnifying-glass"></i><input type="search" name="q" value="<c:out value='${busqueda}'/>" placeholder="Buscar por servicio, tipo..."></div>
      <button class="btn-primary" type="submit">Buscar</button>
    </form>

    <div class="table-card">
      <table class="data">
        <thead><tr><th>Promocion</th><th>Tipo</th><th>Descuento</th><th>Vigencia</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody id="rows">
          <c:choose>
            <c:when test="${not empty promociones}">
              <c:forEach var="p" items="${promociones}">
                <c:set var="tag" value="${p.estadoTexto == 'Activa' ? 'tag-ok' : (p.estadoTexto == 'Programada' ? 'tag-warn' : 'tag-neutral')}" />
                <tr data-id="${p.idPromocion}" data-nombre="<c:out value='${p.nombre}'/>" data-descripcion="<c:out value='${p.descripcion}'/>" data-tipo="<c:out value='${p.tipo}'/>" data-descuento="<c:out value='${p.descuentoTexto}'/>" data-inicio="<c:out value='${p.fechaInicio}'/>" data-fin="<c:out value='${p.fechaFin}'/>">
                  <td><div class="cell-person"><span class="cell-thumb"></span><span><b><c:out value="${p.nombre}" /></b><span><c:out value="${p.descripcion}" /></span></span></div></td>
                  <td><c:out value="${p.etiquetaTipo}" /></td>
                  <td><c:out value="${p.descuentoTexto}" /></td>
                  <td><c:out value="${p.vigenciaTexto}" /></td>
                  <td><span class="tag ${tag}"><c:out value="${p.estadoTexto}" /></span></td>
                  <td>
                    <div class="row-actions" style="display:flex;gap:6px">
                      <button class="icon-btn" type="button" aria-label="Editar" onclick="editarPromo(this)"><i class="fa-solid fa-pen-to-square"></i></button>
                      <form method="post" action="${ctx}/admin/promociones/eliminar" onsubmit="return confirm('¿Eliminar esta promoción?')"><input type="hidden" name="id" value="${p.idPromocion}"><button class="icon-btn danger" type="submit" aria-label="Eliminar"><i class="fa-regular fa-trash-can"></i></button></form>
                    </div>
                  </td>
                </tr>
              </c:forEach>
            </c:when>
            <c:otherwise><tr class="empty-row"><td colspan="6">No hay promociones en esta vista.</td></tr></c:otherwise>
          </c:choose>
        </tbody>
      </table>
    </div>

    <div class="pager" id="pager">
      <c:if test="${totalPaginas > 1}">
        <c:if test="${paginaActual > 1}"><a href="${ctx}/admin/promociones?estado=${pestanaActual}&q=${busqueda}&pagina=${paginaActual-1}"><i class="fa-solid fa-chevron-left"></i></a></c:if>
        <c:forEach var="pg" begin="1" end="${totalPaginas}"><a href="${ctx}/admin/promociones?estado=${pestanaActual}&q=${busqueda}&pagina=${pg}" class="${pg == paginaActual ? 'active' : ''}">${pg}</a></c:forEach>
        <c:if test="${paginaActual < totalPaginas}"><a href="${ctx}/admin/promociones?estado=${pestanaActual}&q=${busqueda}&pagina=${paginaActual+1}"><i class="fa-solid fa-chevron-right"></i></a></c:if>
      </c:if>
    </div>
  </div>

  <!-- Modal promoción -->
  <div class="modal-backdrop" id="promoModal">
    <div class="modal">
      <h2 id="promoModalTitle">Nueva promocion</h2>
      <form method="post" action="${ctx}/admin/promociones/guardar">
        <input type="hidden" name="id" id="pId">
        <div style="display:grid;gap:10px;margin-top:10px">
          <label>Nombre<input name="nombre" id="pNombre" required></label>
          <label>Descripción<textarea name="descripcion" id="pDescripcion" rows="2"></textarea></label>
          <label>Tipo<select name="tipo" id="pTipo"><option value="Porcentaje">Porcentaje</option><option value="DOS_POR_UNO">2x1</option><option value="Paquete">Paquete</option></select></label>
          <label>Descuento<input name="descuento" id="pDescuento" placeholder="Ej. 20% o 2x1"></label>
          <div style="display:flex;gap:10px">
            <label style="flex:1">Inicio<input name="fechaInicio" id="pInicio" type="date"></label>
            <label style="flex:1">Fin<input name="fechaFin" id="pFin" type="date"></label>
          </div>
        </div>
        <div class="modal-actions" style="margin-top:14px;display:flex;gap:8px;justify-content:flex-end">
          <button class="btn-ghost" type="button" onclick="cerrarPromo()">Cancelar</button>
          <button class="btn-primary" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    function abrirPromo() {
      document.getElementById('promoModalTitle').textContent = 'Nueva promocion';
      ['pId','pNombre','pDescripcion','pDescuento','pInicio','pFin'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('pTipo').value = 'Porcentaje';
      document.getElementById('promoModal').classList.add('open');
    }
    function editarPromo(btn) {
      const tr = btn.closest('tr');
      document.getElementById('promoModalTitle').textContent = 'Editar promocion';
      document.getElementById('pId').value = tr.dataset.id;
      document.getElementById('pNombre').value = tr.dataset.nombre;
      document.getElementById('pDescripcion').value = tr.dataset.descripcion;
      document.getElementById('pTipo').value = tr.dataset.tipo;
      document.getElementById('pDescuento').value = tr.dataset.descuento;
      document.getElementById('pInicio').value = tr.dataset.inicio;
      document.getElementById('pFin').value = tr.dataset.fin;
      document.getElementById('promoModal').classList.add('open');
    }
    function cerrarPromo() { document.getElementById('promoModal').classList.remove('open'); }
    document.getElementById('promoModal').addEventListener('click', (e) => { if (e.target.id === 'promoModal') cerrarPromo(); });
  </script>
</body>
</html>
