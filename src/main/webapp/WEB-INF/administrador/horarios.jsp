<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Horarios - SGC Cosmetic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesAdmin.css">
</head>
<body data-admin-page="horarios">
  <jsp:include page="/WEB-INF/administrador/includes/shell.jsp" />

  <div class="main-wrapper">
    <section class="page-head"><div><h1>Horarios</h1></div></section>

    <section class="grid-2">
      <article class="panel">
        <div class="panel-head"><span class="panel-title">Horario general de atencion</span><span class="panel-title">Estado</span></div>
        <div class="schedule-list" id="generalList">
          <div class="config-row"><div><b>Lunes</b><small>08:00 - 18:00</small></div><span class="tag tag-ok">Abierto</span></div>
          <div class="config-row"><div><b>Martes</b><small>08:00 - 18:00</small></div><span class="tag tag-ok">Abierto</span></div>
          <div class="config-row"><div><b>Miercoles</b><small>08:00 - 18:00</small></div><span class="tag tag-ok">Abierto</span></div>
          <div class="config-row"><div><b>Jueves</b><small>08:00 - 18:00</small></div><span class="tag tag-ok">Abierto</span></div>
          <div class="config-row"><div><b>Viernes</b><small>08:00 - 18:00</small></div><span class="tag tag-ok">Abierto</span></div>
          <div class="config-row"><div><b>Sabado</b><small>09:00 - 14:00</small></div><span class="tag tag-ok">Abierto</span></div>
          <div class="config-row"><div><b>Domingo</b><small>Cerrado</small></div><span class="tag tag-neutral">Cerrado</span></div>
        </div>
      </article>

      <article class="panel">
        <div class="panel-head"><span class="panel-title">Horario por empleado</span><span class="panel-title">Días</span></div>
        <div class="schedule-list" id="employeeList">
          <c:choose>
            <c:when test="${not empty empleados}">
              <c:forEach var="e" items="${empleados}">
                <div class="config-row" style="align-items:flex-start">
                  <div>
                    <b><c:out value="${e.nombreCompleto}" /></b>
                    <small><c:out value="${e.especialidad}" /></small>
                    <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px">
                      <c:forEach var="dia" items="${e.horario}">
                        <span class="tag ${empty dia.value ? 'tag-neutral' : 'tag-ok'}" title="${dia.key} ${dia.value}">${fn:substring(dia.key,0,3)}</span>
                      </c:forEach>
                    </div>
                  </div>
                </div>
              </c:forEach>
            </c:when>
            <c:otherwise><p class="muted">No hay empleados registrados.</p></c:otherwise>
          </c:choose>
        </div>
      </article>
    </section>
  </div>
</body>
</html>
