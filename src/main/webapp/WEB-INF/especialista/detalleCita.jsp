<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="avatar" value="${not empty sessionScope.usuarioSesion.fotoPerfil ? sessionScope.usuarioSesion.fotoPerfil : 'https://www.gravatar.com/avatar/?d=mp&s=150'}" />
<c:set var="nombreEsp" value="${sessionScope.usuarioSesion.nombreCompleto}" />
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Detalle de cita - SGC Cosmetic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesSpecialistDashboard.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesDetalleCita.css">
</head>
<body>
  <div class="menu-overlay" id="menuOverlay"></div>
  <aside class="sidebar-menu" id="sidebarMenu">
    <div class="sidebar-user-box"><div class="sidebar-user-avatar"><img src="${avatar}" alt="Especialista" style="width:100%;height:100%;border-radius:50%;object-fit:cover"></div><div class="sidebar-user-meta"><span class="sidebar-user-name"><c:out value="${nombreEsp}" /></span><span class="sidebar-user-role">Especialista</span></div></div>
    <div class="sidebar-header"><hr class="sidebar-divider"></div><div class="sidebar-section-label">General</div>
    <nav class="sidebar-nav"><a href="${ctx}/especialista/dashboard"><i class="fa-solid fa-house"></i> Inicio</a><a href="${ctx}/especialista/agenda"><i class="fa-regular fa-calendar"></i> Agenda</a><hr class="sidebar-divider"><a href="${ctx}/especialista/perfil"><i class="fa-regular fa-user"></i> Perfil</a></nav>
    <button class="sidebar-logout" type="button" onclick="window.location.href='${ctx}/logout'"><i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión</button><hr class="sidebar-divider"><div class="sidebar-brand">SGC COSMETICS</div>
  </aside>
  <div class="detail-wrapper">
    <header class="topbar"><button class="menu-trigger" id="menuTrigger" type="button" aria-label="Abrir menú"><i class="fa-solid fa-bars"></i></button><div class="topbar-actions"><div class="specialist-notification-wrap"><button class="notification-trigger" type="button" aria-label="Notificaciones" data-notification-toggle><i class="fa-regular fa-bell"></i><span class="notification-badge"></span></button><div class="notification-panel" id="notificationPanel"><div id="notificationList">Sin notificaciones nuevas</div></div></div><a class="specialist-chip" href="${ctx}/especialista/perfil"><img class="chip-avatar" src="${avatar}" alt="Especialista"><span><strong><c:out value="${nombreEsp}" /></strong><small>Especialista</small></span></a></div></header>
    <main class="detail-page">
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <h1 style="margin:0">Detalle cita</h1>
        <a href="${ctx}/especialista/agenda" class="view-all-button" style="text-decoration:none"><i class="fa-solid fa-arrow-left"></i> Volver a la agenda</a>
      </div>
      <section class="detail-cards">
        <article class="client-card" id="clientCard">
          <div class="client-avatar"><i class="fa-regular fa-user"></i></div>
          <h2><c:out value="${citaDetalle.clienteNombre}" /></h2>
          <p><c:out value="${not empty citaDetalle.clienteTelefono ? citaDetalle.clienteTelefono : 'Teléfono no registrado'}" /></p>
          <p><c:out value="${not empty citaDetalle.clienteCorreo ? citaDetalle.clienteCorreo : 'Correo no registrado'}" /></p>
          <p class="client-frequency">Cliente frecuente</p>
        </article>
        <article class="service-card" id="serviceCard">
          <dl>
            <dt>Servicio</dt><dd><c:out value="${citaDetalle.servicioNombre}" /></dd>
            <dt>Descripción</dt><dd><c:out value="${not empty citaDetalle.servicioDescripcion ? citaDetalle.servicioDescripcion : 'Sin descripción'}" /></dd>
            <dt>Fecha</dt><dd><c:out value="${citaDetalle.fecha}" /></dd>
            <dt>Hora</dt><dd><c:out value="${citaDetalle.hora}" /></dd>
            <dt>Duración</dt><dd><c:out value="${not empty citaDetalle.duracion ? citaDetalle.duracion : 'No registrada'}" /></dd>
            <dt>Precio</dt><dd>$<c:out value="${citaDetalle.costo}" /> MXN</dd>
            <dt>Estado</dt><dd><span class="status-pill"><c:out value="${not empty citaDetalle.estado ? citaDetalle.estado : 'Pendiente'}" /></span></dd>
          </dl>
        </article>
        <article class="history-card">
          <div class="history-heading"><h2>Historial del cliente</h2></div>
          <div id="clientHistory" class="client-history-list">
            <div class="history-entry"><i class="history-icon fa-regular fa-calendar-check" aria-hidden="true"></i><div><strong><c:out value="${citaDetalle.servicioNombre}" /></strong><small><c:out value="${citaDetalle.fecha}" /></small></div></div>
            <p class="meta" style="margin-top:8px">El historial completo del cliente estará disponible próximamente.</p>
          </div>
        </article>
      </section>
    </main>
  </div>
  <script>
    (function () {
      const sidebar = document.getElementById('sidebarMenu');
      const overlay = document.getElementById('menuOverlay');
      document.getElementById('menuTrigger')?.addEventListener('click', () => { sidebar.classList.toggle('active'); overlay.classList.toggle('active'); });
      overlay?.addEventListener('click', () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); });
      document.querySelector('[data-notification-toggle]')?.addEventListener('click', () => {
        document.getElementById('notificationPanel')?.classList.toggle('active');
      });
    })();
  </script>
</body>
</html>
