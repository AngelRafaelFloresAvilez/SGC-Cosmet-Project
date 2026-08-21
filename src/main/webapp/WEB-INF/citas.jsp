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
  <title>SGC COSMETIC - Gestión de Citas</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/stylesCitas.css">
  <script>
    window.contextPath = '${pageContext.request.contextPath}';
  </script>
  <script src="${pageContext.request.contextPath}/js/citas.js" defer></script>
</head>
<body>
    <div class="menu-overlay" id="menuOverlay"></div>

    <aside class="sidebar-menu" id="sidebarMenu">
        <div class="sidebar-user-box">
            <div class="sidebar-user-avatar" id="sidebarUserAvatar">
                <img id="sidebarProfileImg" src="<%= fotoSrc %>" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover">
            </div>
            <div class="sidebar-user-meta">
                <span class="sidebar-user-name"><%= nombre %></span>
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
            <a href="${pageContext.request.contextPath}/CitasServlet" class="active"><i class="fa-regular fa-calendar-check"></i> Mis citas</a>
            <hr class="sidebar-divider">
            <a href="${pageContext.request.contextPath}/PerfilServlet" class="nav-profile-link"><i class="fa-regular fa-user"></i> Mi perfil</a>
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

            <div class="user-profile" onclick="window.location.href='${pageContext.request.contextPath}/PerfilServlet';" style="cursor:pointer;">
                <div class="user-avatar" aria-label="Avatar del cliente">
                    <img src="<%= fotoSrc %>" alt="Avatar del cliente" style="width:36px;height:36px;border-radius:50%;object-fit:cover">
                </div>
                <div class="user-meta">
                    <span class="user-name"><%= nombre %></span>
                    <span class="user-role">Cliente</span>
                </div>
            </div>
        </div>
    </header>

    <main class="appointments-page">
      <div class="appointments-heading">
        <h1>Gestión de citas.</h1>
        <p>Consulta, modifica o cancela tus citas<br>programadas.</p>
      </div>

      <div class="appointments-layout">
        <aside class="profile-card">
          <div class="profile-card-avatar"><img class="profile-avatar" src="<%= fotoSrc %>" alt="<%= nombre %>"></div>
          <h2 class="profile-card-name profile-name"><%= nombre %></h2>
          <span class="profile-card-role profile-role">Cliente</span>
          <div class="profile-facts">
            <div><i class="fa-regular fa-phone"></i><span class="profile-phone"><%= telefono.isEmpty() ? "Sin registro" : telefono %></span></div>
            <div><i class="fa-regular fa-envelope"></i><span class="profile-email"><%= correo.isEmpty() ? "Sin registro" : correo %></span></div>
            <div><i class="fa-regular fa-calendar"></i><span class="profile-birth"><%= fechaNac.isEmpty() ? "Sin registro" : fechaNac %></span></div>
          </div>
          <div class="absence-card">
            <div><strong>Ausencias<br>Consecutivas</strong><b class="profile-cancel-count">0</b><b>/3</b></div>
            <div class="absence-progress"><span class="profile-absence-progress"></span></div>
            <small><i class="fa-solid fa-circle"></i> Estado: <span class="profile-status"><%= estadoTexto %></span></small>
            <p><i class="fa-solid fa-circle-exclamation"></i> Nota: Por cada 3 ausencias resultará en baneo; el administrador tendrá que revisar tu caso.</p>
          </div>
        </aside>

        <section class="appointments-panel">
          <div class="appointments-panel-title">
            <h2>Mis citas programadas</h2>
            <div class="appointment-counts" aria-label="Resumen de citas">
              <span>Próximas <strong id="pendingCount">0</strong></span>
              <span>Completadas <strong id="previousCount">0</strong></span>
              <span>Canceladas <strong id="cancelledSummaryCount">0</strong></span>
            </div>
          </div>
          <div class="tabs">
            <button class="tab-btn active" data-status-tab="pending">Próximas</button>
            <button class="tab-btn" data-status-tab="previous">Completadas</button>
            <button class="tab-btn" data-status-tab="cancelled">Canceladas</button>
          </div>
          <div class="appointments-list-shell" id="appointmentsList"></div>
          <div class="appointment-pagination" id="appointmentPagination" aria-label="Paginación"></div>
          <div class="stat-card" id="cancelledSummaryCard" hidden><span>Cancelaciones acumuladas</span><strong id="cancelledCount">0</strong></div>
        </section>

        <aside class="appointments-aside">
          <section class="priority-card"><div class="priority-icon"><i class="fa-regular fa-calendar"></i></div><h2>Tu comodidad es nuestra prioridad</h2><p>Recuerda anotar cuando será tu próxima cita para evitar ser sancionado.</p></section>
          <section class="recommendations-card"><h2><i class="fa-regular fa-lightbulb"></i> Recomendaciones</h2><ul><li>Llega 10 min antes de cada cita.</li><li>Si necesitas reagendar hazlo con anticipación.</li><li>Cancela con al menos 12 hrs de anticipación para evitar sanciones.</li></ul></section>
        </aside>
      </div>
    </main>

  <div class="detail-panel" id="appointmentDetailPanel" aria-hidden="true">
    <div id="appointmentDetail"></div>
  </div>

  <div class="modal-backdrop rating-modal-backdrop" id="ratingModal" aria-hidden="true">
    <div class="modal-card rating-card">
      <button type="button" class="rating-close" aria-label="Cerrar">&times;</button>
      <div class="rating-icon"><i class="fa-solid fa-star"></i></div>
      <h3>Califica tu experiencia</h3>
      <p>Cuéntanos cómo fue tu experiencia con este servicio.</p>
      <div class="rating-stars" role="radiogroup" aria-label="Calificación">
        <button type="button" data-rating="1" aria-label="1 estrella"><i class="fa-solid fa-star"></i></button>
        <button type="button" data-rating="2" aria-label="2 estrellas"><i class="fa-solid fa-star"></i></button>
        <button type="button" data-rating="3" aria-label="3 estrellas"><i class="fa-solid fa-star"></i></button>
        <button type="button" data-rating="4" aria-label="4 estrellas"><i class="fa-solid fa-star"></i></button>
        <button type="button" data-rating="5" aria-label="5 estrellas"><i class="fa-solid fa-star"></i></button>
      </div>
      <textarea id="ratingComment" rows="3" placeholder="Escribe un comentario (opcional)"></textarea>
      <div class="modal-actions">
        <button type="button" class="btn-secondary rating-cancel-btn">Cancelar</button>
        <button type="button" class="btn-primary rating-submit-btn">Enviar calificación</button>
      </div>
    </div>
  </div>

  <div class="modal-backdrop" id="cancelAppointmentModal">
    <div class="modal-card cancel-appointment-card">
      <button type="button" class="cancel-modal-close" aria-label="Cerrar">&times;</button>
      <div class="cancel-modal-icon"><i class="fa-regular fa-trash-can"></i></div>
      <h3>¿Estas seguro de querer cancelar tu cita?</h3>
      <p>Si cancelas, tu cita será eliminada y el horario quedará disponible para otro cliente.</p>
      <label class="cancel-reason-label" for="cancelReason">¿Por qué deseas cancelar tu cita?</label>
      <select id="cancelReason" class="cancel-reason-select">
        <option value="">Seleccione el motivo</option>
        <option value="Problemas de salud">Problemas de salud</option>
        <option value="Ya no necesito el servicio">Ya no necesito el servicio</option>
        <option value="Otro">Otro</option>
      </select>
      <div class="modal-actions">
        <button class="btn-secondary cancel-cancel-btn">No, cancelar</button>
        <button class="btn-primary cancel-confirm-btn">Sí, cancelar cita</button>
      </div>
    </div>
  </div>

  <!-- Popup Alerta Personalizada -->
  <div id="customAlertModal" class="custom-alert-backdrop">
    <div class="custom-alert-card">
      <div id="customAlertIcon" class="custom-alert-icon success">
        <i id="customAlertIconI" class="fa-solid fa-check"></i>
      </div>
      <h3 id="customAlertTitle" class="custom-alert-title">¡Éxito!</h3>
      <p id="customAlertMessage" class="custom-alert-message">Operación realizada con éxito.</p>
      <button type="button" id="customAlertCloseBtn" class="btn-primary" style="width:100%; justify-content:center;">Aceptar</button>
    </div>
  </div>
</body>
</html>
