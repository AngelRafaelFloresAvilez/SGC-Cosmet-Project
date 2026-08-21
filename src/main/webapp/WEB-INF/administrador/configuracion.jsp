<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="u" value="${sessionScope.usuarioSesion}" />
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Configuracion - SGC Cosmetic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesAdmin.css">
</head>
<body data-admin-page="configuracion">
  <jsp:include page="/WEB-INF/administrador/includes/shell.jsp" />

  <div class="main-wrapper">
    <section class="page-head">
      <div><h1>Configuracion</h1><p>Datos de tu cuenta y reglas generales del sistema</p></div>
    </section>

    <section class="config-grid">
      <article class="panel">
        <div class="panel-head"><span class="panel-title">Mi cuenta</span></div>
        <div class="config-row"><div><b>Nombre</b><small><c:out value="${u.nombreCompleto}" /></small></div></div>
        <div class="config-row"><div><b>Correo</b><small><c:out value="${u.correo}" /></small></div></div>
        <div class="config-row"><div><b>Telefono</b><small><c:out value="${not empty u.telefono ? u.telefono : '—'}" /></small></div></div>
        <div class="config-row"><div><b>Rol</b><small>Administrador</small></div></div>
      </article>

      <article class="panel">
        <div class="panel-head"><span class="panel-title">Reglas de inasistencias</span></div>
        <div class="config-row"><div><b>Faltas para vetar automaticamente</b><small>Al alcanzar este numero el cliente queda vetado</small></div><span class="tag tag-neutral">3</span></div>
        <div class="config-row"><div><b>Clientes vetados</b><small>Actualmente sin poder agendar</small></div><span class="tag tag-danger">${not empty ruleBanned ? ruleBanned : 0}</span></div>
      </article>

      <article class="panel">
        <div class="panel-head"><span class="panel-title">Resumen del sistema</span></div>
        <div class="config-row"><div><b>Clientes registrados</b></div><span>${sumClients}</span></div>
        <div class="config-row"><div><b>Especialistas</b></div><span>${sumSpecialists}</span></div>
        <div class="config-row"><div><b>Servicios en catalogo</b></div><span>${sumServices}</span></div>
        <div class="config-row"><div><b>Promociones</b></div><span>${sumPromos}</span></div>
        <div class="config-row"><div><b>Citas totales</b></div><span>${sumAppointments}</span></div>
      </article>

      <article class="panel">
        <div class="panel-head"><span class="panel-title">Accesos rapidos</span></div>
        <div class="config-row"><div><b>Horario de atencion</b><small>Define los dias y horas del negocio</small></div><a class="btn-ghost" href="${ctx}/admin/horarios">Abrir</a></div>
        <div class="config-row"><div><b>Catalogo de servicios</b><small>Lo que ven los clientes al agendar</small></div><a class="btn-ghost" href="${ctx}/admin/servicios">Abrir</a></div>
        <div class="config-row"><div><b>Reportes</b><small>Rendimiento e ingresos</small></div><a class="btn-ghost" href="${ctx}/admin/reportes">Abrir</a></div>
      </article>
    </section>
  </div>
</body>
</html>
