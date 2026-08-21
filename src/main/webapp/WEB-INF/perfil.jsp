<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.proyecto.sgccosmetproject.model.Usuario" %>
<%
    Usuario usuarioActivo = (Usuario) session.getAttribute("usuarioSesion");
    if (usuarioActivo == null) {
        response.sendRedirect(request.getContextPath() + "/login");
        return;
    }

    String estadoRaw = usuarioActivo.getEstadoVeto();
    boolean estaVetado = estadoRaw != null && ("TRUE".equalsIgnoreCase(estadoRaw) || "1".equals(estadoRaw) || "true".equalsIgnoreCase(estadoRaw));
    String estadoTexto = estaVetado ? "Baneado" : "Normal";

    String nombre = usuarioActivo.getNombreCompleto() != null ? usuarioActivo.getNombreCompleto() : "";
    String correo = usuarioActivo.getCorreo() != null ? usuarioActivo.getCorreo() : "";
    String telefono = usuarioActivo.getTelefono() != null ? usuarioActivo.getTelefono() : "";
    String fechaNac = usuarioActivo.getFechaNacimiento() != null ? usuarioActivo.getFechaNacimiento().toString() : "";

    String fotoSrc = (usuarioActivo.getFotoPerfil() != null && !usuarioActivo.getFotoPerfil().isEmpty())
            ? usuarioActivo.getFotoPerfil()
            : "https://www.gravatar.com/avatar/?d=mp&s=150";
%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Perfil - SGC Cosmetic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/stylesPerfil.css">
  <script>
    window.contextPath = '${pageContext.request.contextPath}';
  </script>
  <script src="${pageContext.request.contextPath}/js/perfil.js" defer></script>
</head>
<body>

  <div class="menu-overlay" id="menuOverlay"></div>
  <aside class="sidebar-menu" id="sidebarMenu">
    <div class="sidebar-user-box">
      <div class="sidebar-user-avatar" id="sidebarUserAvatar">
        <img id="sidebarProfileImg" src="<%= fotoSrc %>" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover">
      </div>
      <div class="sidebar-user-meta">
        <span class="sidebar-user-name profile-name-display"><%= nombre %></span>
        <span class="sidebar-user-role">Cliente</span>
      </div>
    </div>

    <div class="sidebar-header">
      <hr class="sidebar-divider">
    </div>

    <div class="sidebar-section-label">General</div>

    <nav class="sidebar-nav">
      <a href="${pageContext.request.contextPath}/dashboardServlet"><i class="fa-solid fa-house"></i> Inicio</a>
      <a href="${pageContext.request.contextPath}/catalogoServlet"><i class="fa-solid fa-border-all"></i> Catálogo</a>
      <a href="${pageContext.request.contextPath}/CitasServlet"><i class="fa-regular fa-calendar-check"></i> Mis citas</a>
      <hr class="sidebar-divider">
      <a href="${pageContext.request.contextPath}/PerfilServlet" class="nav-profile-link active"><i class="fa-regular fa-user"></i> Mi perfil</a>
    </nav>

    <button class="sidebar-logout" type="button" onclick="window.location.href='${pageContext.request.contextPath}/logout'">
      <i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión
    </button>

    <hr class="sidebar-divider">
    <div class="sidebar-brand">SGC COSMETICS</div>
  </aside>

  <header>
    <button class="menu-btn">
      <i class="fa-solid fa-bars"></i>
    </button>

    <div class="header-actions">
      <div style="position:relative;">
        <button class="btn-notification" type="button" data-notification-toggle>
          <i class="fa-regular fa-bell"></i>
          <span class="notification-badge"></span>
        </button>
        <div class="notification-panel" id="notificationPanel">
          <div id="notificationList"></div>
        </div>
      </div>

      <div class="user-profile">
        <div class="user-avatar" aria-label="Avatar del cliente">
          <img src="<%= fotoSrc %>" alt="Avatar del cliente" style="width:36px;height:36px;border-radius:50%;object-fit:cover">
        </div>
        <div class="user-meta">
          <span class="user-name profile-name-display"><%= nombre %></span>
          <span class="user-role">Cliente</span>
        </div>
      </div>
    </div>
  </header>
  <main class="profile-shell profile-dashboard">
    <div class="profile-welcome"><h1>Hola, bienvenido<br>a tu perfil</h1><p>edita tu perfil y consulta datos.</p></div>
    <section class="profile-dashboard-grid">
      <aside class="profile-card-dashboard">
        <div class="dashboard-profile-heading"><div class="dashboard-avatar-wrap"><div style="position:relative"><img id="profileAvatarImg" class="profile-avatar" src="<%= fotoSrc %>" alt="<%= nombre %>"><input id="profileAvatarInput" type="file" accept="image/*" title="Cambiar foto de perfil" style="position:absolute;right:0;bottom:0;opacity:0;width:40px;height:40px;cursor:pointer"></div></div><div class="profile-meta dashboard-profile-meta"><h2 class="profile-name profile-name-display"><%= nombre %></h2><p class="profile-role">Cliente</p><div class="profile-status-pill <%= estaVetado ? "alert" : "" %>"><i class="fa-solid <%= estaVetado ? "fa-circle-exclamation" : "fa-circle-check" %>"></i><span id="profileStatus" class="profile-status"><%= estadoTexto %></span></div></div></div>
        <div class="dashboard-profile-facts"><div><i class="fa-regular fa-phone"></i><span class="profile-phone"><%= telefono.isEmpty() ? "Sin registro" : telefono %></span></div><div><i class="fa-regular fa-envelope"></i><span class="profile-email"><%= correo.isEmpty() ? "Sin registro" : correo %></span></div><div><i class="fa-regular fa-calendar"></i><span class="profile-birth"><%= fechaNac.isEmpty() ? "Sin registro" : fechaNac %></span></div></div>
        <div class="dashboard-absence-card"><div class="absence-heading"><strong>Ausencias<br>Consecutivas</strong><span><b id="profileCancelledCount">0</b>/3</span></div><div class="absence-bar"><span></span></div><div class="absence-status"><i class="fa-solid fa-circle"></i> Estado: <span class="profile-status"><%= estadoTexto %></span></div><p id="profileStatusMessage"><i class="fa-solid fa-circle-exclamation"></i> Nota: Por cada 3 ausencias resultará en baneo; el administrador tendrá que revisar tu caso.</p></div>
        <div class="profile-edit-actions"><button id="editProfileBtn" class="btn-primary">Editar perfil</button><button id="saveProfileBtn" class="btn-primary" style="display:none">Guardar</button><button id="cancelProfileBtn" class="btn-register" style="display:none">Cancelar</button></div>
      </aside>
      <section class="dashboard-center-column"><article class="dashboard-panel history-dashboard-panel"><div class="dashboard-panel-heading"><h2>Historial de Citas</h2></div><div id="historyList"></div><div class="profile-history-pagination" id="profileHistoryPagination" aria-label="Paginación del historial"></div></article><article class="dashboard-panel payments-dashboard-panel"><div class="dashboard-panel-heading"><h2>Historial de pagos</h2></div><div id="paymentsList"></div><div class="profile-payments-pagination" id="profilePaymentsPagination" aria-label="Paginación del historial de pagos"></div></article></section>
      <aside class="dashboard-right-column"><article class="dashboard-panel promotions-dashboard-panel"><div class="promotion-cover"></div><div class="dashboard-panel-body"><h2>Promociones</h2><div id="promotionsList"></div><div id="activePromotionBox" hidden></div></div></article></aside>
    </section>
    <div id="profileNextAppointment" hidden>Sin citas próximas</div><div id="profileNextAppointmentCompact" hidden>Sin reservas</div><div id="cancelledSummaryCard" hidden></div><button id="restoreAccessBtn" hidden type="button">Restaurar acceso</button>
  </main>

  <!-- Modal Detalle Cita -->
  <div id="citaDetailModal" class="modal-backdrop" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:10000; align-items:center; justify-content:center;">
    <div style="background:#fff; padding:24px; border-radius:16px; max-width:400px; width:90%; position:relative;">
      <h3 id="modalServicioNombre" style="margin-top:0;">Detalle de la Cita</h3>
      <p><strong>Fecha:</strong> <span id="modalCitaFecha"></span></p>
      <p><strong>Hora:</strong> <span id="modalCitaHora"></span></p>
      <p><strong>Costo:</strong> <span id="modalCitaCosto"></span></p>
      <p><strong>Estado:</strong> <span id="modalCitaEstado"></span></p>
      <button type="button" id="closeDetailModal" style="margin-top:16px; width:100%; padding:10px; background:#526B4A; color:#fff; border:none; border-radius:8px; cursor:pointer;">Cerrar</button>
    </div>
  </div>

  <!-- Popup Personalizado de Notificación -->
  <div id="customAlertModal" class="custom-alert-backdrop">
    <div class="custom-alert-card">
      <div id="customAlertIcon" class="custom-alert-icon success">
        <i id="customAlertIconI" class="fa-solid fa-check"></i>
      </div>
      <h3 id="customAlertTitle" class="custom-alert-title">¡Éxito!</h3>
      <p id="customAlertMessage" class="custom-alert-message">Operación realizada con éxito.</p>
      <button type="button" id="customAlertCloseBtn" class="btn-primary" style="width: 100%; justify-content: center;">
        Aceptar
      </button>
    </div>
  </div>
</body>
</html>
