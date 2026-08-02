<%@ page import="java.util.List" %>
<%@ page import="com.proyecto.sgccosmetproject.model.Usuario" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
  <title>Lista de Usuarios</title>
  <style>
    body { font-family: Arial, sans-serif; }
    table { border-collapse: collapse; width: 80%; margin: 20px auto; }
    th, td { border: 1px solid black; padding: 10px; text-align: left; }
    th { background-color: #f2f2f2; }
    .centro { text-align: center; }
    .btn { display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-bottom: 20px;}
  </style>
</head>
<body>

<h2 class="centro">Gestión de Usuarios - SGC Cosmet</h2>

<div class="centro">
  <a href="nuevo-usuario" class="btn">Registrar Nuevo Usuario</a>
</div>

<% String error = (String) request.getAttribute("mensajeError");
  if (error != null) { %>
<h3 style="color: red; text-align: center;"> X <%= error %></h3>
<% } %>

<table>
  <tr>
    <th>Nombre</th>
    <th>Correo</th>
    <th>Teléfono</th>
    <th>Nacimiento</th>
    <th>Rol</th>
    <th>Veto</th>
  </tr>

  <%
    List<Usuario> lista = (List<Usuario>) request.getAttribute("listaDeUsuarios");

    if (lista != null && !lista.isEmpty()) {
      for (Usuario u : lista) {
  %>
  <tr>
    <td><%= u.getNombreCompleto() %></td>
    <td><%= u.getCorreo() %></td>
    <td><%= u.getTelefono() %></td>
    <td><%= u.getFechaNacimiento() %></td>
    <td><%= u.getIdRol() %></td>
    <td><%= u.getEstadoVeto() %></td>
  </tr>
  <%
    }
  } else if (error == null) {
  %>
  <tr>
    <td colspan="6" class="centro">No hay usuarios registrados todavía</td>
  </tr>
  <% } %>

</table>

</body>
</html>