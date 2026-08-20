<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.proyecto.sgccosmetproject.model.Usuario" %>
<%
    Usuario usuarioActivo = (Usuario) session.getAttribute("usuarioSesion");
    if (usuarioActivo == null) {
        response.sendRedirect(request.getContextPath() + "/login");
        return;
    }

    String estadoRaw = usuarioActivo.getEstadoVeto();
    String estadoTexto = "Activo";
    if (estadoRaw != null && ("false".equalsIgnoreCase(estadoRaw) || "0".equals(estadoRaw) || "Inactivo".equalsIgnoreCase(estadoRaw))) {
        estadoTexto = "Inactivo";
    }

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
<div class="main-wrapper">
    <div class="menu-overlay" id="menuOverlay"></div>

    <aside class="sidebar-menu" id="sidebarMenu">
        <div class="sidebar-user-box">
            <div class="sidebar-user-avatar" id="sidebarUserAvatar">
                <img id="sidebarProfileImg" src="<%= fotoSrc %>" alt="Avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">
            </div>
            <div class="sidebar-user-meta">
                <span class="sidebar-user-name profile-name-display"><%= usuarioActivo.getNombreCompleto() %></span>
                <span class="sidebar-user-role">Rol ID: <%= usuarioActivo.getIdRol() %></span>
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
                    <div id="notificationList">Sin notificaciones nuevas</div>
                </div>
            </div>

            <div class="user-profile">
                <div class="user-avatar" aria-label="Avatar del cliente">
                    <i class="fa-solid fa-circle-user"></i>
                </div>
                <div class="user-meta">
                    <span class="user-name profile-name-display"><%= usuarioActivo.getNombreCompleto() %></span>
                    <span class="user-role">Rol ID: <%= usuarioActivo.getIdRol() %></span>
                </div>
            </div>
        </div>
    </header>

    <main class="profile-shell">
        <section class="profile-hero">
            <div class="hero-card">
                <div class="profile-top">
                    <div style="position:relative; width:100px; height:100px;">
                        <img id="profileAvatarImg" class="profile-avatar" src="<%= fotoSrc %>" alt="<%= usuarioActivo.getNombreCompleto() %>" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">
                        <label for="profileAvatarInput" id="avatarBadgeLabel" style="position:absolute; right:0; bottom:0; background:#526B4A; color:#fff; width:32px; height:32px; border-radius:50%; display:none; align-items:center; justify-content:center; cursor:pointer; z-index:15; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
                            <i class="fa-solid fa-camera" style="font-size:14px;"></i>
                        </label>
                        <input id="profileAvatarInput" type="file" accept="image/*" style="display:none;">
                    </div>
                    <div class="profile-meta" style="flex:1;">
                        <h2 id="profileNameHeading" class="profile-name"><%= usuarioActivo.getNombreCompleto() %></h2>
                        <input id="inputNombre" type="text" value="<%= usuarioActivo.getNombreCompleto() %>" style="display:none; font-size:1.1rem; margin-bottom:8px; padding:6px 10px; border-radius:6px; border:1px solid #526B4A; width:100%; max-width:320px; box-sizing:border-box; background:#ffffff; color:#333333; position:relative; z-index:20;">
                        <p class="profile-role">Rol ID: <%= usuarioActivo.getIdRol() %></p>

                        <div class="profile-status-pill <%= "Inactivo".equalsIgnoreCase(estadoTexto) ? "alert" : "" %>">
                            <i class="fa-solid <%= "Activo".equalsIgnoreCase(estadoTexto) ? "fa-circle-check" : "fa-circle-exclamation" %>"></i>
                            <span class="profile-status"><%= estadoTexto %></span>
                        </div>
                    </div>
                </div>
                <p class="profile-status-message">Tu acceso sigue activo y puedes seguir disfrutando de tratamientos y promociones.</p>

                <div class="profile-grid">
                    <div class="info-box">
                        <label>Correo</label>
                        <span class="profile-text-val" id="textCorreo"><%= correo.isEmpty() ? "Sin registro" : correo %></span>
                        <input id="inputCorreo" type="email" class="profile-edit-input" value="<%= correo %>" style="display:none; width:100%; padding:6px 10px; border-radius:6px; border:1px solid #ccc; margin-top:4px; box-sizing:border-box;">
                    </div>
                    <div class="info-box">
                        <label>Teléfono</label>
                        <span class="profile-text-val" id="textTelefono"><%= telefono.isEmpty() ? "Sin registro" : telefono %></span>
                        <input id="inputTelefono" type="tel" class="profile-edit-input" value="<%= telefono %>" style="display:none; width:100%; padding:6px 10px; border-radius:6px; border:1px solid #ccc; margin-top:4px; box-sizing:border-box;">
                    </div>
                    <div class="info-box">
                        <label>Fecha de nacimiento</label>
                        <span class="profile-text-val" id="textFechaNac"><%= fechaNac.isEmpty() ? "Sin registro" : fechaNac %></span>
                        <input id="inputFechaNac" type="date" class="profile-edit-input" value="<%= fechaNac %>" style="display:none; width:100%; padding:6px 10px; border-radius:6px; border:1px solid #ccc; margin-top:4px; box-sizing:border-box;">
                    </div>
                    <div class="info-box">
                        <label>Estado de la Cuenta</label>
                        <span class="profile-member"><%= estadoTexto %></span>
                    </div>
                </div>

                <div class="profile-summary">
                    <div>
                        <strong>Próxima cita</strong>
                        <p id="profileNextAppointment">Cargando...</p>
                    </div>
                    <div class="mini-pill"><i class="fa-regular fa-calendar-check"></i> Estado activo</div>
                </div>

                <div style="margin-top:16px; display:flex; gap:10px;">
                    <button id="editProfileBtn" class="btn-profile-action btn-profile-edit" type="button">
                        <i class="fa-solid fa-pen-to-square"></i> Editar perfil
                    </button>
                    <button id="saveProfileBtn" class="btn-profile-action btn-profile-save" type="button" style="display:none;">
                        <i class="fa-solid fa-check"></i> Guardar cambios
                    </button>
                    <button id="cancelProfileBtn" class="btn-profile-action btn-profile-cancel" type="button" style="display:none;">
                        <i class="fa-solid fa-xmark"></i> Cancelar
                    </button>
                </div>
            </div>

            <div class="side-card">
                <h3>Resumen de tu experiencia</h3>
                <div class="stat-card" id="cancelledSummaryCard">
                    <span>Cancelaciones acumuladas</span>
                    <strong id="profileCancelledCount">0</strong>
                </div>
                <div class="stat-card">
                    <span>Próxima reserva</span>
                    <strong id="profileNextAppointmentCompact">Cargando...</strong>
                </div>
                <div class="stat-card">
                    <span>Estado de cuenta</span>
                    <div id="activePromotionBox" style="margin-top: 8px; font-size: 14px; color: #526B4A; font-weight: 600;"><%= estadoTexto %></div>
                </div>
            </div>
        </section>

        <section class="profile-hero" style="margin-top: 24px;">
            <div class="hero-card">
                <h3 style="margin-bottom: 14px;">Historial de citas</h3>
                <div id="historyList">
                    <p style="color: #777;">Cargando historial...</p>
                </div>
            </div>
            <div class="side-card">
                <h3>Pagos realizados</h3>
                <div id="paymentsList" style="margin-bottom: 18px;">
                    <p style="color: #777;">Cargando pagos...</p>
                </div>
            </div>
        </section>
    </main>

    <!-- Modal Detalle Cita -->
    <div id="citaDetailModal" class="modal-backdrop" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:10000; align-items:center; justify-content:center;">
        <div style="background:#fff; padding:24px; border-radius:16px; max-width:400px; width:90%; position:relative;">
            <h3 id="modalServicioNombre" style="margin-top:0;">Detalle de la Cita</h3>
            <p><strong>Fecha:</strong> <span id="modalCitaFecha"></span></p>
            <p><strong>Hora:</strong> <span id="modalCitaHora"></span></p>
            <p><strong>Especialista:</strong> <span id="modalCitaEmpleado"></span></p>
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
            <button type="button" id="customAlertCloseBtn" class="btn-profile-action btn-profile-edit" style="width: 100%; justify-content: center;">
                Aceptar
            </button>
        </div>
    </div>

</div>
</body>
</html>