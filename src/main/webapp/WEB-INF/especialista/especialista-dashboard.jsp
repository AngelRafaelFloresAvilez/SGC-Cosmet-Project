<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="avatar" value="${not empty sessionScope.usuarioSesion.fotoPerfil ? sessionScope.usuarioSesion.fotoPerfil : 'https://www.gravatar.com/avatar/?d=mp&s=150'}" />
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panel del especialista - SGC Cosmetic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesSpecialistDashboard.css">
</head>
<body>
  <div class="menu-overlay" id="menuOverlay"></div>
  <aside class="sidebar-menu" id="sidebarMenu">
    <div class="sidebar-user-box">
      <div class="sidebar-user-avatar" id="sidebarUserAvatar"><img src="${avatar}" alt="Especialista" style="width:100%;height:100%;border-radius:50%;object-fit:cover"></div>
      <div class="sidebar-user-meta">
        <span class="sidebar-user-name" id="sidebarUserName"><c:out value="${empleado.nombreCompleto}" /></span>
        <span class="sidebar-user-role" id="sidebarUserRole">Especialista</span>
      </div>
    </div>
    <div class="sidebar-header"><hr class="sidebar-divider"></div>
    <div class="sidebar-section-label">General</div>
    <nav class="sidebar-nav">
      <a href="${ctx}/especialista/dashboard" class="active"><i class="fa-solid fa-house"></i> Inicio</a>
      <a href="${ctx}/especialista/agenda"><i class="fa-regular fa-calendar"></i> Agenda</a>
      <hr class="sidebar-divider">
      <a href="${ctx}/especialista/perfil" class="nav-profile-link"><i class="fa-regular fa-user"></i> Perfil</a>
    </nav>
    <button class="sidebar-logout" type="button" onclick="window.location.href='${ctx}/logout'"><i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión</button>
    <hr class="sidebar-divider">
    <div class="sidebar-brand">SGC COSMETICS</div>
  </aside>
  <div class="main-wrapper">
    <header class="topbar">
      <button class="menu-trigger" type="button" aria-label="Abrir menú"><i class="fa-solid fa-bars"></i></button>
      <div class="topbar-actions">
        <div class="specialist-notification-wrap"><button class="notification-trigger" type="button" aria-label="Notificaciones" data-notification-toggle><i class="fa-regular fa-bell"></i><span class="notification-badge"></span></button><div class="notification-panel" id="notificationPanel"><div id="notificationList">Sin notificaciones nuevas</div></div></div>
        <a class="specialist-chip" href="${ctx}/especialista/perfil" aria-label="Abrir perfil del especialista">
          <img class="chip-avatar" id="specialistAvatar" src="${avatar}" alt="Especialista">
          <span><strong id="specialistName"><c:out value="${empleado.nombreCompleto}" /></strong><small id="specialistRole">Especialista</small></span>
        </a>
      </div>
    </header>

    <main class="specialist-dashboard">
      <section class="welcome-block">
        <h1>Hola de nuevo, <span id="welcomeName"><c:out value="${empleado.nombreCompleto}" /></span></h1>
        <p id="todayLabel"><c:out value="${fechaHoyTexto}" /></p>
      </section>

      <section class="stats">
        <div class="stat stat-calendar"><i class="fa-regular fa-calendar"></i><span><strong id="todayCount">${not empty totalCitasHoy ? totalCitasHoy : 0}</strong><small>Citas hoy</small></span></div>
        <div class="stat stat-clock"><i class="fa-regular fa-clock"></i><span><strong id="upcomingCount">${not empty pendientesHoy ? pendientesHoy : 0}</strong><small>Pendiente</small></span></div>
        <div class="stat stat-check"><i class="fa-regular fa-circle-check"></i><span><strong id="completedCount">${not empty completadasHoy ? completadasHoy : 0}</strong><small>Citas completadas</small></span></div>
        <div class="stat stat-star"><i class="fa-regular fa-star"></i><span><strong id="averageRating">${not empty empleado.calificacionPromedio ? empleado.calificacionPromedio : '0'}</strong><small>Calificación promedio</small></span></div>
      </section>

      <section class="dashboard-columns">
        <div class="dashboard-panel agenda-panel" id="agenda">
          <div class="section-title">Agenda hoy</div>
          <div class="filters">
            <span class="filter-btn active">Día</span>
            <a class="filter-btn" href="${ctx}/especialista/agenda?vista=semana">Semana</a>
            <a class="filter-btn" href="${ctx}/especialista/agenda?vista=mes">Mes</a>
          </div>
          <div class="appointment-list" id="appointmentList">
            <c:choose>
              <c:when test="${not empty agendaHoy}">
                <c:forEach var="cita" items="${agendaHoy}">
                  <a class="appointment-item" href="${ctx}/especialista/cita?id=${cita.idCita}" data-id="${cita.idCita}">
                    <i class="appointment-avatar fa-regular fa-user" aria-hidden="true"></i>
                    <div style="flex:1;text-align:left">
                      <strong class="appointment-client-name"><c:out value="${cita.cliente.nombreCompleto}" /></strong>
                      <strong class="appointment-service-title"><c:out value="${cita.servicio}" /></strong>
                      <div class="meta appointment-date-line"><time><c:out value="${cita.horaInicioFormateada}" /></time></div>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px">
                      <span class="pill"><c:out value="${cita.etiquetaEstado}" /></span>
                    </div>
                  </a>
                </c:forEach>
              </c:when>
              <c:otherwise>
                <p class="empty-agenda">No hay citas para hoy.</p>
              </c:otherwise>
            </c:choose>
          </div>
          <div class="dashboard-pager" id="agendaPager" aria-label="Paginación de agenda"></div>
        </div>

        <div class="dashboard-panel upcoming-panel">
          <div class="section-title">Próximas citas</div>
          <div id="upcomingAppointmentsList" class="upcoming-list">
            <c:choose>
              <c:when test="${not empty proximasCitas}">
                <c:forEach var="cita" items="${proximasCitas}">
                  <a class="upcoming-item" href="${ctx}/especialista/cita?id=${cita.idCita}">
                    <i class="upcoming-avatar fa-regular fa-user" aria-hidden="true"></i>
                    <div>
                      <strong class="upcoming-service-title"><c:out value="${cita.servicio}" /></strong>
                      <small><c:out value="${cita.fechaFormateadaCorta}" /> · <c:out value="${cita.horaInicioFormateada}" /></small>
                      <small><c:out value="${cita.cliente.nombreCompleto}" /></small>
                    </div>
                  </a>
                </c:forEach>
              </c:when>
              <c:otherwise>
                <p class="empty-agenda">No tienes próximas citas.</p>
              </c:otherwise>
            </c:choose>
          </div>
          <div class="dashboard-pager" id="upcomingPager" aria-label="Paginación de próximas citas"></div>
        </div>

        <div class="dashboard-panel reminders-panel">
          <div class="section-title">Recordatorios</div>
          <div id="remindersList" class="reminder-list">
            <div class="reminder-item"><i class="fa-regular fa-calendar"></i><span>Tienes ${not empty pendientesHoy ? pendientesHoy : 0} citas pendientes por confirmar</span></div>
            <div class="reminder-item"><i class="fa-regular fa-circle-check"></i><span>${not empty completadasHoy ? completadasHoy : 0} citas completadas hoy</span></div>
            <div class="reminder-item"><i class="fa-regular fa-star"></i><span>Recuerda revisar tu agenda de la semana</span></div>
          </div>
        </div>
      </section>
    </main>
  </div>

  <script>
    (function () {
      function toggle(open) {
        document.getElementById('sidebarMenu')?.classList.toggle('active', open);
        document.getElementById('menuOverlay')?.classList.toggle('active', open);
      }
      document.querySelector('.menu-trigger')?.addEventListener('click', () => toggle(true));
      document.getElementById('menuOverlay')?.addEventListener('click', () => toggle(false));
      document.querySelector('[data-notification-toggle]')?.addEventListener('click', () => {
        document.getElementById('notificationPanel')?.classList.toggle('active');
      });
    })();
  </script>
</body>
</html>
