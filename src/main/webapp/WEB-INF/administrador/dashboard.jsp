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
  <title>Panel del administrador - SGC Cosmetic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesAdmin.css">
</head>
<body data-admin-page="dashboard">
  <jsp:include page="/WEB-INF/administrador/includes/shell.jsp" />

  <div class="main-wrapper">
    <section class="page-head">
      <div>
        <h1>Hola de nuevo, <span id="welcomeName">${sessionScope.usuarioSesion.nombreCompleto}</span></h1>
        <p id="todayLabel"><c:out value="${fechaHoyTexto}" /></p>
      </div>
    </section>

    <section class="stat-row cols-4">
      <article class="stat-bar"><div><strong id="statToday">${citasHoy}</strong><small>Citas realizadas hoy</small></div></article>
      <article class="stat-bar"><div><strong id="statNewClients">${clientesRegistrados}</strong><small>Clientes registrados</small></div></article>
      <article class="stat-bar"><div><strong id="statSpecialists">${especialistasActivos}</strong><small>Especialistas activos</small></div></article>
      <article class="stat-bar"><div><strong id="statRevenue">$<c:out value="${ventasDelMes}" /></strong><small>Ventas este mes</small></div></article>
    </section>

    <section class="grid-3">
      <article class="panel">
        <div class="panel-head"><span class="panel-title">Citas semanales</span></div>
        <div class="chart-box" id="weeklyChart" style="display:flex;align-items:flex-end;gap:10px;height:180px;padding:10px 4px">
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
        <div class="panel-head">
          <span class="panel-title">Citas pendientes</span>
          <a class="panel-link" href="${ctx}/admin/citas">ver mas <i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="pending-list" id="pendingList">
          <c:choose>
            <c:when test="${not empty citasPendientes}">
              <c:forEach var="cita" items="${citasPendientes}">
                <a class="pending-item" href="${ctx}/admin/citas" style="text-decoration:none;color:inherit">
                  <span class="avatar"><i class="fa-regular fa-user"></i></span>
                  <span class="who"><b><c:out value="${cita.cliente.nombreCompleto}" /></b><small><c:out value="${cita.servicio}" /></small></span>
                  <span class="when"><b><c:out value="${cita.fechaFormateadaCorta}" /></b> <c:out value="${cita.horaInicioFormateada}" /></span>
                </a>
              </c:forEach>
            </c:when>
            <c:otherwise><p class="muted">No hay citas pendientes.</p></c:otherwise>
          </c:choose>
        </div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <span class="panel-title">Servicios mas solicitados</span>
          <a class="panel-link" href="${ctx}/admin/reportes">ver mas <i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div id="topServicesList">
          <c:choose>
            <c:when test="${not empty topServicios}">
              <c:forEach var="serv" items="${topServicios}">
                <div class="top-service"><span class="swatch"></span><b><c:out value="${serv.key}" /></b><span class="count">${serv.value}<small>citas</small></span></div>
              </c:forEach>
            </c:when>
            <c:otherwise><p class="muted">Aun no hay citas registradas.</p></c:otherwise>
          </c:choose>
        </div>
      </article>
    </section>

    <section class="grid-3">
      <article class="panel">
        <div class="panel-head"><span class="panel-title">Actividad reciente</span></div>
        <div class="activity-list" id="activityList">
          <c:choose>
            <c:when test="${not empty actividadReciente}">
              <c:forEach var="act" items="${actividadReciente}">
                <div class="activity-item"><i class="fa-regular fa-calendar"></i><span class="txt"><c:out value="${act}" /></span></div>
              </c:forEach>
            </c:when>
            <c:otherwise><p class="muted">Sin actividad registrada todavia.</p></c:otherwise>
          </c:choose>
        </div>
      </article>

      <article class="panel">
        <div class="panel-head"><span class="panel-title">Recordatorios</span></div>
        <div class="reminder-list" id="remindersList">
          <div class="activity-item"><i class="fa-regular fa-calendar-check"></i><span class="txt">${not empty citasPendientes ? fn:length(citasPendientes) : 0} cita(s) pendientes por confirmar</span></div>
          <c:if test="${not empty clientesInasistencias}">
            <div class="activity-item"><i class="fa-regular fa-circle-xmark red"></i><span class="txt">${fn:length(clientesInasistencias)} cliente(s) con inasistencias acumuladas</span></div>
          </c:if>
          <div class="activity-item"><i class="fa-regular fa-tag"></i><span class="txt">Revisa las promociones activas del mes</span></div>
        </div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <span class="panel-title">Especialistas</span>
          <a class="panel-link" href="${ctx}/admin/empleados">ver mas <i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="people-list" id="specialistsList">
          <c:choose>
            <c:when test="${not empty especialistasDisponibles}">
              <c:forEach var="esp" items="${especialistasDisponibles}">
                <div class="person-row">
                  <span class="avatar"><i class="fa-regular fa-user"></i></span>
                  <span class="meta"><b><c:out value="${esp.nombreCompleto}" /></b><small><c:out value="${esp.especialidad}" /></small></span>
                  <span class="tag ${esp.estaOcupado ? 'tag-warn' : 'tag-ok'}">${esp.estaOcupado ? 'En cita' : 'Disponible'}</span>
                </div>
              </c:forEach>
            </c:when>
            <c:otherwise><p class="muted">No hay especialistas registrados.</p></c:otherwise>
          </c:choose>
        </div>
      </article>
    </section>
  </div>
</body>
</html>
