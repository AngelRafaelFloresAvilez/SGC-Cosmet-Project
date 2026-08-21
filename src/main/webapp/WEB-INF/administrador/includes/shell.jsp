<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>
<%-- Chrome común del panel admin (diseño de copia). Requiere en request: paginaActiva --%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="adminNombre" value="${not empty sessionScope.usuarioSesion.nombreCompleto ? sessionScope.usuarioSesion.nombreCompleto : 'Administrador'}" />
<c:set var="adminInicial" value="${fn:toUpperCase(fn:substring(adminNombre,0,1))}" />

<div class="menu-overlay" id="adminOverlay"></div>

<aside class="sidebar-menu" id="adminDrawer">
  <div class="sidebar-user-box">
    <div class="sidebar-user-avatar">${adminInicial}</div>
    <div class="sidebar-user-meta">
      <span class="sidebar-user-name"><c:out value="${adminNombre}" /></span>
      <span class="sidebar-user-role">Administrador</span>
    </div>
  </div>
  <hr class="sidebar-divider">
  <div class="sidebar-section-label">General</div>
  <nav class="sidebar-nav">
    <a href="${ctx}/admin-dashboard" class="${paginaActiva == 'dashboard' ? 'active' : ''}"><i class="fa-solid fa-house"></i> Dashboard</a>
    <a href="${ctx}/admin/citas" class="${paginaActiva == 'citas' ? 'active' : ''}"><i class="fa-solid fa-book"></i> Gestión de citas</a>
    <a href="${ctx}/admin/servicios" class="${paginaActiva == 'servicios' ? 'active' : ''}"><i class="fa-regular fa-calendar"></i> Servicios</a>
    <a href="${ctx}/admin/empleados" class="${paginaActiva == 'empleados' ? 'active' : ''}"><i class="fa-solid fa-users"></i> Empleados</a>
    <a href="${ctx}/admin/clientes" class="${paginaActiva == 'clientes' ? 'active' : ''}"><i class="fa-regular fa-user"></i> Clientes</a>
    <a href="${ctx}/admin/promociones" class="${paginaActiva == 'promociones' ? 'active' : ''}"><i class="fa-solid fa-tag"></i> Promociones</a>
    <a href="${ctx}/admin/reportes" class="${paginaActiva == 'reportes' ? 'active' : ''}"><i class="fa-regular fa-clipboard"></i> Reportes</a>
    <a href="${ctx}/admin/horarios" class="${paginaActiva == 'horarios' ? 'active' : ''}"><i class="fa-regular fa-clock"></i> Horarios</a>
    <hr class="sidebar-divider">
    <a href="${ctx}/admin/configuracion" class="${paginaActiva == 'configuracion' ? 'active' : ''}"><i class="fa-solid fa-gear"></i> Configuracion</a>
  </nav>
  <button class="sidebar-logout" type="button" onclick="window.location.href='${ctx}/logout'"><i class="fa-solid fa-right-from-bracket"></i> Cerrar sesion</button>
  <hr class="sidebar-divider">
  <div class="sidebar-brand">SGC COSMETIC</div>
</aside>

<header class="topbar is-hidden" id="adminTopbar">
  <button class="menu-trigger" type="button" aria-label="Abrir menú"><i class="fa-solid fa-bars"></i></button>
  <div class="topbar-actions">
    <div class="notification-wrap">
      <button class="notification-trigger" type="button" aria-label="Notificaciones" aria-expanded="false"><i class="fa-regular fa-bell"></i><span class="notification-dot" data-notification-count></span></button>
      <div class="notification-panel" data-notification-panel>
        <div class="notification-head">Notificaciones</div>
        <div data-notification-list><p class="notification-empty">No hay nada que requiera tu atencion.</p></div>
      </div>
    </div>
    <div class="admin-chip">
      <span class="chip-avatar"><i class="fa-regular fa-circle-user"></i></span>
      <span><strong><c:out value="${adminNombre}" /></strong><small>Administrador</small></span>
    </div>
  </div>
</header>

<button class="admin-menu-launcher" type="button" aria-label="Abrir menú lateral"><i class="fa-solid fa-bars"></i></button>

<script src="${ctx}/js/adminShell.js" defer></script>
