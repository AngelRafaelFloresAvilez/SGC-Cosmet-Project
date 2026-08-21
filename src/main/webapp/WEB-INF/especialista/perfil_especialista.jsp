<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="avatar" value="${not empty sessionScope.usuarioSesion.fotoPerfil ? sessionScope.usuarioSesion.fotoPerfil : 'https://www.gravatar.com/avatar/?d=mp&s=150'}" />
<c:set var="vNombre" value="${not empty valoresEnviados.nombreCompleto ? valoresEnviados.nombreCompleto : empleado.nombreCompleto}" />
<c:set var="vCorreo" value="${not empty valoresEnviados.correo ? valoresEnviados.correo : empleado.correo}" />
<c:set var="vTel" value="${not empty valoresEnviados.telefono ? valoresEnviados.telefono : empleado.telefono}" />
<c:set var="vFecha" value="${not empty valoresEnviados.fechaNacimiento ? valoresEnviados.fechaNacimiento : empleado.fechaNacimientoIso}" />
<c:set var="vEsp" value="${not empty valoresEnviados.especialidad ? valoresEnviados.especialidad : empleado.especialidad}" />
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi perfil profesional - SGC Cosmetic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="${ctx}/assets/css/stylesSpecialistDashboard.css">
  <link rel="stylesheet" href="${ctx}/assets/css/StylesPerfilEspecialista.css">
  <link rel="stylesheet" href="${ctx}/assets/css/StylesPerfilEspecialistaOverrides.css">
  <link rel="stylesheet" href="${ctx}/assets/css/StylesPerfilEspecialistaLayoutFix.css">
  <link rel="stylesheet" href="${ctx}/assets/css/StylesPerfilEspecialistaViewport.css">
  <link rel="stylesheet" href="${ctx}/assets/css/StylesPerfilEspecialistaOrderFix.css">
  <link rel="stylesheet" href="${ctx}/assets/css/StylesPerfilEspecialistaServicesFix.css">
  <link rel="stylesheet" href="${ctx}/assets/css/StylesPerfilEspecialistaIdentityFill.css">
  <link rel="stylesheet" href="${ctx}/assets/css/StylesPerfilEspecialistaInfoFix.css">
</head>
<body>
  <div class="menu-overlay" id="menuOverlay"></div>
  <aside class="sidebar-menu" id="sidebarMenu"><div class="sidebar-user-box"><div class="sidebar-user-avatar"><img src="${avatar}" alt="Especialista" style="width:100%;height:100%;border-radius:50%;object-fit:cover"></div><div class="sidebar-user-meta"><span class="sidebar-user-name"><c:out value="${vNombre}" /></span><span class="sidebar-user-role">Especialista</span></div></div><div class="sidebar-header"><hr class="sidebar-divider"></div><div class="sidebar-section-label">General</div><nav class="sidebar-nav"><a href="${ctx}/especialista/dashboard"><i class="fa-solid fa-house"></i> Inicio</a><a href="${ctx}/especialista/agenda"><i class="fa-regular fa-calendar"></i> Agenda</a><hr class="sidebar-divider"><a href="${ctx}/especialista/perfil" class="active"><i class="fa-regular fa-user"></i> Perfil</a></nav><button class="sidebar-logout" type="button" onclick="window.location.href='${ctx}/logout'"><i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión</button><hr class="sidebar-divider"><div class="sidebar-brand">SGC COSMETICS</div></aside>
  <div class="professional-profile-wrapper">
    <header class="topbar"><button class="menu-trigger" id="menuTrigger" type="button" aria-label="Abrir menú"><i class="fa-solid fa-bars"></i></button><div class="topbar-actions"><div class="specialist-notification-wrap"><button class="notification-trigger" type="button" aria-label="Notificaciones" data-notification-toggle><i class="fa-regular fa-bell"></i><span class="notification-badge"></span></button><div class="notification-panel" id="notificationPanel"><div id="notificationList">Sin notificaciones nuevas</div></div></div><div class="specialist-chip"><img class="chip-avatar" src="${avatar}" alt="Especialista"><span><strong><c:out value="${vNombre}" /></strong><small>Especialista</small></span></div></div></header>
    <main class="professional-profile">
      <div class="profile-heading"><div><h1>Mi perfil profesional</h1><p>Gestiona tu información personal y laboral</p></div><span class="info-tab">Información</span></div>

      <c:if test="${not empty sessionScope.mensajeExito}">
        <div style="background:#e7f3e2;border:1px solid #b6d6a8;color:#2f5d1f;padding:10px 14px;border-radius:10px;margin-bottom:12px"><i class="fa-solid fa-circle-check"></i> <c:out value="${sessionScope.mensajeExito}" /></div>
        <c:remove var="mensajeExito" scope="session" />
      </c:if>
      <c:if test="${not empty sessionScope.mensajeError}">
        <div style="background:#f7e4e4;border:1px solid #e0a8a8;color:#7a2020;padding:10px 14px;border-radius:10px;margin-bottom:12px"><i class="fa-solid fa-triangle-exclamation"></i> <c:out value="${sessionScope.mensajeError}" /></div>
        <c:remove var="mensajeError" scope="session" />
      </c:if>

      <section class="professional-grid">
        <article class="professional-identity" id="identityCard">
          <div class="identity-avatar"><img src="${avatar}" alt="<c:out value='${vNombre}'/>"></div>
          <form action="${ctx}/especialista/perfil/foto" method="post" enctype="multipart/form-data" id="photoForm">
            <label class="change-photo" for="photoInput">Cambiar foto</label>
            <input id="photoInput" name="foto" class="photo-input" type="file" accept="image/*" onchange="document.getElementById('photoForm').submit()">
          </form>
          <h2><c:out value="${vNombre}" /></h2>
          <p class="identity-role">Especialista</p>
          <div class="identity-contact">
            <div><i class="fa-solid fa-phone"></i><c:out value="${not empty vTel ? vTel : 'Teléfono no registrado'}" /></div>
            <div><i class="fa-solid fa-envelope"></i><c:out value="${not empty vCorreo ? vCorreo : 'Correo no registrado'}" /></div>
            <div><i class="fa-regular fa-id-card"></i>ID empleado: <c:out value="${not empty empleado.idEmpleado ? empleado.idEmpleado : '—'}" /></div>
          </div>
        </article>

        <form class="professional-info" method="post" action="${ctx}/especialista/perfil">
          <h2>Información personal</h2>
          <c:if test="${not empty errores}">
            <div style="background:#f7e4e4;border:1px solid #e0a8a8;color:#7a2020;padding:8px 12px;border-radius:8px;margin-bottom:8px">
              <c:forEach var="err" items="${errores}"><div><c:out value="${err.value}" /></div></c:forEach>
            </div>
          </c:if>
          <label>Nombre completo<input id="nameInput" name="nombreCompleto" type="text" value="<c:out value='${vNombre}'/>" disabled></label>
          <label>Especialidad<input id="specInput" name="especialidad" type="text" value="<c:out value='${vEsp}'/>" disabled></label>
          <label>Fecha de nacimiento<input id="birthInput" name="fechaNacimiento" type="date" value="<c:out value='${vFecha}'/>" disabled></label>
          <label>Correo electrónico<input id="emailInput" name="correo" type="email" value="<c:out value='${vCorreo}'/>" disabled></label>
          <label>Teléfono<input id="phoneInput" name="telefono" type="tel" value="<c:out value='${vTel}'/>" disabled></label>
          <div class="profile-form-actions">
            <button class="save-profile" id="editProfile" type="button">Editar</button>
            <button class="save-profile" id="saveProfile" type="submit" hidden>Guardar cambios</button>
            <button class="cancel-profile" id="cancelProfile" type="button" hidden onclick="window.location.href='${ctx}/especialista/perfil'">Cancelar</button>
          </div>
        </form>

        <aside class="professional-side">
          <article class="services-card">
            <h2>Servicios</h2>
            <div id="servicesList">
              <div class="service-profile-row"><i class="fa-regular fa-circle-check"></i><span><c:out value="${not empty vEsp ? vEsp : 'General'}" /></span></div>
            </div>
          </article>
          <article class="hours-card">
            <h2>Horario laboral</h2>
            <div class="hours-list" id="hoursList">
              <c:forEach var="dia" items="${empleado.horario}">
                <div class="hour-row ${empty dia.value ? 'off' : ''}"><strong><c:out value="${dia.key}" /></strong><span class="hour-line"></span><span class="hour-time"><c:out value="${empty dia.value ? 'No trabaja' : dia.value}" /></span></div>
              </c:forEach>
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

      const inputs = ['nameInput', 'specInput', 'birthInput', 'emailInput', 'phoneInput'].map(id => document.getElementById(id));
      const editBtn = document.getElementById('editProfile');
      const saveBtn = document.getElementById('saveProfile');
      const cancelBtn = document.getElementById('cancelProfile');
      editBtn?.addEventListener('click', () => {
        inputs.forEach(i => { if (i) i.disabled = false; });
        editBtn.hidden = true; saveBtn.hidden = false; cancelBtn.hidden = false;
        inputs[0]?.focus();
      });
    })();
  </script>
</body>
</html>
