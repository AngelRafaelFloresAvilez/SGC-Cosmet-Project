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
  <title>Agenda - SGC Cosmetic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesSpecialistDashboard.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesAgenda.css">
</head>
<body>
  <div class="menu-overlay" id="menuOverlay"></div>
  <aside class="sidebar-menu" id="sidebarMenu">
    <div class="sidebar-user-box"><div class="sidebar-user-avatar"><img src="${avatar}" alt="Especialista" style="width:100%;height:100%;border-radius:50%;object-fit:cover"></div><div class="sidebar-user-meta"><span class="sidebar-user-name"><c:out value="${nombreEsp}" /></span><span class="sidebar-user-role">Especialista</span></div></div>
    <div class="sidebar-header"><hr class="sidebar-divider"></div>
    <div class="sidebar-section-label">General</div>
    <nav class="sidebar-nav"><a href="${ctx}/especialista/dashboard"><i class="fa-solid fa-house"></i> Inicio</a><a href="${ctx}/especialista/agenda" class="active"><i class="fa-regular fa-calendar"></i> Agenda</a><hr class="sidebar-divider"><a href="${ctx}/especialista/perfil"><i class="fa-regular fa-user"></i> Perfil</a></nav>
    <button class="sidebar-logout" type="button" onclick="window.location.href='${ctx}/logout'"><i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión</button><hr class="sidebar-divider"><div class="sidebar-brand">SGC COSMETICS</div>
  </aside>
  <div class="agenda-wrapper">
    <header class="topbar"><button class="menu-trigger" id="menuTrigger" type="button" aria-label="Abrir menú"><i class="fa-solid fa-bars"></i></button><div class="topbar-actions"><div class="specialist-notification-wrap"><button class="notification-trigger" type="button" aria-label="Notificaciones" data-notification-toggle><i class="fa-regular fa-bell"></i><span class="notification-badge"></span></button><div class="notification-panel" id="notificationPanel"><div id="notificationList">Sin notificaciones nuevas</div></div></div><a class="specialist-chip" href="${ctx}/especialista/perfil"><img class="chip-avatar" src="${avatar}" alt="Especialista"><span><strong><c:out value="${nombreEsp}" /></strong><small>Especialista</small></span></a></div></header>
    <main class="agenda-page">
      <section class="agenda-heading"><div><h1>Agenda</h1><p>Administra tus citas y horarios</p></div><a class="view-all-button" href="${ctx}/especialista/dashboard#agenda">Ver todas las citas <i class="fa-solid fa-arrow-right"></i></a></section>
      <section class="agenda-toolbar">
        <a class="today-button" href="${ctx}/especialista/agenda?vista=${vista}">Hoy</a>
        <div class="period-selector">
          <a href="${ctx}/especialista/agenda?vista=${vista}&fecha=${fechaAnterior}" aria-label="Periodo anterior">‹</a>
          <strong id="periodLabel">
            <c:choose>
              <c:when test="${vista eq 'semana'}"><c:out value="${inicioSemana}" /> - <c:out value="${finSemana}" /></c:when>
              <c:otherwise><c:out value="${fechaRef}" /></c:otherwise>
            </c:choose>
          </strong>
          <a href="${ctx}/especialista/agenda?vista=${vista}&fecha=${fechaSiguiente}" aria-label="Periodo siguiente">›</a>
        </div>
        <div class="range-selector">
          <a class="${vista eq 'dia' ? 'active' : ''}" href="${ctx}/especialista/agenda?vista=dia">Día</a>
          <a class="${vista eq 'semana' ? 'active' : ''}" href="${ctx}/especialista/agenda?vista=semana">Semana</a>
          <a class="${vista eq 'mes' ? 'active' : ''}" href="${ctx}/especialista/agenda?vista=mes">Mes</a>
        </div>
      </section>

      <section class="agenda-grid">
        <div class="calendar-panel">
          <c:choose>
            <%-- ===== Vista DÍA ===== --%>
            <c:when test="${vista eq 'dia'}">
              <div class="time-column" id="timeColumn"><span>08:00 A.M</span><span>10:00 A.M</span><span>12:00 P.M</span><span>02:00 P.M</span><span>04:00 P.M</span><span>06:00 P.M</span></div>
              <div class="schedule-grid" id="scheduleGrid">
                <c:choose>
                  <c:when test="${not empty citasDelDia}">
                    <c:forEach var="cita" items="${citasDelDia}" varStatus="st">
                      <a class="schedule-item" href="${ctx}/especialista/cita?id=${cita.idCita}" style="top:${st.index * 108}px">
                        <strong><c:out value="${cita.cliente.nombreCompleto}" /></strong>
                        <small><c:out value="${cita.servicio}" /></small>
                        <span class="schedule-time"><c:out value="${cita.horaInicioFormateada}" /></span>
                        <span class="status"><c:out value="${cita.etiquetaEstado}" /></span>
                      </a>
                    </c:forEach>
                  </c:when>
                  <c:otherwise><p class="meta">No hay citas para este día.</p></c:otherwise>
                </c:choose>
              </div>
            </c:when>

            <%-- ===== Vista SEMANA ===== --%>
            <c:when test="${vista eq 'semana'}">
              <div class="schedule-grid" style="position:static;min-height:auto;border:0;background:none;padding:8px">
                <c:forEach var="entry" items="${citasPorDia}">
                  <div style="margin-bottom:14px">
                    <strong style="display:block;color:var(--agenda-green,#4b613f);margin-bottom:8px"><c:out value="${entry.key}" /></strong>
                    <c:choose>
                      <c:when test="${not empty entry.value}">
                        <c:forEach var="cita" items="${entry.value}">
                          <a class="schedule-item" href="${ctx}/especialista/cita?id=${cita.idCita}" style="position:relative;left:auto;right:auto;top:auto;display:block;margin-bottom:10px">
                            <strong><c:out value="${cita.cliente.nombreCompleto}" /></strong>
                            <small><c:out value="${cita.servicio}" /></small>
                            <span class="schedule-time"><c:out value="${cita.horaInicioFormateada}" /></span>
                          </a>
                        </c:forEach>
                      </c:when>
                      <c:otherwise><p class="meta" style="margin:0 0 6px 4px">Sin citas.</p></c:otherwise>
                    </c:choose>
                  </div>
                </c:forEach>
              </div>
            </c:when>

            <%-- ===== Vista MES ===== --%>
            <c:otherwise>
              <div class="schedule-grid" style="position:static;min-height:auto;border:0;background:none;padding:8px;display:grid;grid-template-columns:repeat(7,1fr);gap:8px">
                <c:forEach var="dia" items="${diasCalendario}">
                  <a href="${ctx}/especialista/agenda?vista=dia&fecha=${dia}" style="display:block;min-height:70px;padding:8px;border:1px solid #e5e5e0;border-radius:10px;text-align:left;color:#3a3a3a;text-decoration:none;background:#fff">
                    <strong style="display:block">${dia.dayOfMonth}</strong>
                    <c:if test="${conteoPorDia[dia] > 0}">
                      <span class="status" style="position:static;display:inline-block;margin-top:6px">${conteoPorDia[dia]} cita(s)</span>
                    </c:if>
                  </a>
                </c:forEach>
              </div>
            </c:otherwise>
          </c:choose>
        </div>

        <aside class="agenda-summary">
          <article class="next-card">
            <h2>Próxima cita</h2>
            <div id="nextAppointment">
              <c:choose>
                <c:when test="${not empty proximaCita}">
                  <div class="next-appointment"><div><strong><c:out value="${proximaCita.cliente.nombreCompleto}" /></strong><strong><c:out value="${proximaCita.servicio}" /></strong><small><c:out value="${proximaCita.horaInicioFormateada}" /></small></div></div>
                </c:when>
                <c:otherwise><p class="meta">No hay próximas citas.</p></c:otherwise>
              </c:choose>
            </div>
          </article>
          <article class="day-summary">
            <h2>Resumen del día</h2>
            <div id="daySummary">
              <div class="summary-row"><i class="fa-regular fa-calendar"></i><strong>Citas programadas</strong><b>${not empty totalProgramadas ? totalProgramadas : 0}</b></div>
              <div class="summary-row"><i class="fa-regular fa-circle-check"></i><strong>Citas confirmadas</strong><b>${not empty totalConfirmadas ? totalConfirmadas : 0}</b></div>
              <div class="summary-row"><i class="fa-regular fa-clock"></i><strong>Citas pendientes</strong><b>${not empty totalPendientes ? totalPendientes : 0}</b></div>
              <div class="summary-row"><i class="fa-regular fa-ban"></i><strong>Citas canceladas</strong><b>${not empty totalCanceladas ? totalCanceladas : 0}</b></div>
            </div>
          </article>
        </aside>
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
