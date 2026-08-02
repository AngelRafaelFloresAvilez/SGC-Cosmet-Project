<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido - Mi Aplicación JSP</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
            background: linear-gradient(135deg, #e0eafc, #cfdef3);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
        }
        .container {
            background-color: #ffffff;
            padding: 2.5rem;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        h1 {
            font-size: 2rem;
            color: #2c3e50;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        p {
            color: #7f8c8d;
            margin-bottom: 2rem;
            font-size: 1rem;
            line-height: 1.5;
        }
        .btn {
            display: inline-block;
            background-color: #3498db;
            color: #ffffff;
            padding: 0.8rem 2rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(52, 152, 219, 0.2);
        }
        .btn:hover {
            background-color: #2980b9;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(41, 128, 185, 0.3);
        }
    </style>
</head>
<body>
<div class="container">
    <h1><%= "¡Hola Compañeros!" %></h1>
    <p>El entorno de desarrollo, los JSP y los servlets están listos para chambear</p>
    <p> --- Version 1.4 --- (Omg espero no haber arruinado la conexion a la DB)
    <a href="hello-servlet" class="btn">Probar Servlet</a>
    <a href="probar-conexion" class="btn">Probar conexion a la base de datos</a>
    <a href="nuevo-usuario" class="btn">Formulario</a>
    <a href="usuarios" class="btn">Ver usuarios</a>
</div>
</body>
</html>
