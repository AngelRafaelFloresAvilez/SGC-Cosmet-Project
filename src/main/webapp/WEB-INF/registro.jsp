<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Registrar Usuario</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .formulario { width: 300px; margin: 40px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; }
        .formulario input, .formulario select { width: 100%; margin-bottom: 10px; padding: 8px; }
        .formulario button { width: 100%; padding: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
    </style>
</head>
<body>

<h2 style="text-align: center;">Nuevo Usuario - SGC Cosmet</h2>

<div class="formulario">
    <form action="${pageContext.request.contextPath}/guardar-usuario" method="post">

        <label>Nombre Completo:</label>
        <input type="text" name="nombre" required>

        <label>Correo Electrónico:</label>
        <input type="email" name="correo" required>

        <label>Teléfono:</label>
        <input type="text" name="telefono" required>

        <label>Fecha de Nacimiento:</label>
        <input type="date" name="fechaNacimiento" required>

        <label>Contraseña:</label>
        <input type="password" name="contrasena" required>

        <label>Rol:</label>
        <select name="idRol">
            <option value="1">Administrador</option>
            <option value="2">Empleado</option>
        </select>

        <button type="submit">Registrar Usuario</button>
    </form>
</div>

</body>
</html>