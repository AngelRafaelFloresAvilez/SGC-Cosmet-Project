<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<%
    java.util.Map<String, Integer> csem = (java.util.Map<String, Integer>) request.getAttribute("citasSemana");
    int maxSemana = 1;
    if (csem != null) for (Integer v : csem.values()) if (v != null && v > maxSemana) maxSemana = v;
    request.setAttribute("maxSemana", maxSemana);
%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reportes - SGC Cosmetic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesAdmin.css">
</head>
<body data-admin-page="reportes">
  <jsp:include page="/WEB-INF/administrador/includes/shell.jsp" />

  <div class="main-wrapper">
    <section class="page-head">
      <div><h1>Reportes</h1><p>Consulta el rendimiento de tu negocio</p></div>
    </section>

    <section class="stat-row cols-4">
      <article class="stat-bar"><div><strong>${statAppointments}</strong><small>Citas realizadas</small></div></article>
      <article class="stat-bar"><div><strong>${statClients}</strong><small>Clientes registrados</small></div></article>
      <article class="stat-bar"><div><strong>${statSpecialists}</strong><small>Especialistas activos</small></div></article>
      <article class="stat-bar"><div><strong>$<c:out value="${statRevenue}" /></strong><small>Ventas (completadas)</small></div></article>
    </section>

    <section class="grid-3">
      <article class="panel">
        <div class="panel-head"><span class="panel-title">Citas por dia de la semana</span></div>
        <div class="chart-box" id="weekdayChart" style="display:flex;align-items:flex-end;gap:10px;height:180px;padding:10px 4px">
          <c:forEach var="dia" items="${citasSemana}">
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:6px">
              <strong style="font-size:12px">${dia.value}</strong>
              <div style="width:70%;background:#6a8a4f;border-radius:6px 6px 0 0;height:${(dia.value * 100) / maxSemana}%;min-height:4px"></div>
              <small style="font-size:11px;color:#556">${fn:substring(dia.key,0,3)}</small>
            </div>
          </c:forEach>
        </div>
      </article>

      <article class="panel">
        <div class="panel-head"><span class="panel-title">Clientes con inasistencias</span></div>
        <div class="rank-list" id="noShowList">
          <c:choose>
            <c:when test="${not empty noShowList}">
              <c:forEach var="n" items="${noShowList}">
                <div class="config-row"><div><b><c:out value="${n.nombreCompleto}" /></b></div><span class="tag tag-danger">${n.faltas}</span></div>
              </c:forEach>
            </c:when>
            <c:otherwise><p class="muted">Sin inasistencias registradas.</p></c:otherwise>
          </c:choose>
        </div>
      </article>

      <article class="panel">
        <div class="panel-head"><span class="panel-title">Cancelaciones recientes</span></div>
        <table class="data">
          <thead><tr><th>Cliente</th><th>Servicio</th><th>Fecha</th><th>Hora</th></tr></thead>
          <tbody>
            <c:choose>
              <c:when test="${not empty cancelaciones}">
                <c:forEach var="cx" items="${cancelaciones}">
                  <tr><td><c:out value="${cx.cliente}" /></td><td><c:out value="${cx.servicio}" /></td><td><c:out value="${cx.fecha}" /></td><td><c:out value="${cx.hora}" /></td></tr>
                </c:forEach>
              </c:when>
              <c:otherwise><tr class="empty-row"><td colspan="4">Sin cancelaciones recientes.</td></tr></c:otherwise>
            </c:choose>
          </tbody>
        </table>
      </article>
    </section>

    <section class="grid-2">
      <article class="panel">
        <div class="panel-head"><span class="panel-title">Servicios mas solicitados</span></div>
        <table class="data">
          <thead><tr><th>Servicio</th><th>Citas realizadas</th><th>Ingresos generados</th></tr></thead>
          <tbody id="serviceRows">
            <c:choose>
              <c:when test="${not empty topServicios}">
                <c:forEach var="s" items="${topServicios}">
                  <tr><td><c:out value="${s.nombre}" /></td><td>${s.total}</td><td>$<c:out value="${s.ingresos}" /></td></tr>
                </c:forEach>
              </c:when>
              <c:otherwise><tr class="empty-row"><td colspan="3">Aun no hay datos.</td></tr></c:otherwise>
            </c:choose>
          </tbody>
        </table>
      </article>
    </section>
  </div>
</body>
</html>
