package com.proyecto.sgccosmetproject;

import jakarta.servlet.ServletContext;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
// CLASE PARA REALIZAR LA CONEXION!!! (NO TOCAR Y MENOS SI ERES L"IA"N)
public class ConexionBD {
    public static Connection obtenerConexion(ServletContext context) throws SQLException {
        // Aqui se leen Variables de Entorno (INGRESAR EN INTELLIJ)
        String dbUser = System.getenv("DB_USER");
        String dbPassword = System.getenv("DB_PASSWORD");
        String tnsAlias = System.getenv("DB_TNS_ALIAS");
        // Encontrar la Wallet en el servidor (No tocar ruta o se rompe la wallet)
        String walletPath = context.getRealPath("/WEB-INF/Wallet_DB").replace("\\", "/");
        // Validacion rapida
        if (tnsAlias == null || dbUser == null) {
            throw new SQLException("Error crítico: Las variables de entorno de la base de datos no están configuradas en Tomcat");
        }
        // Registrar el Driver de Oracle (Importante para la conexion)
        try {
            oracle.jdbc.OracleDriver driver = new oracle.jdbc.OracleDriver();
            DriverManager.registerDriver(driver);
        } catch (SQLException e) {
            throw new SQLException("No se pudo registrar el driver de Oracle: " + e.getMessage());
        }
        // Configurar parametros para la proxima conexion (No mover)
        Properties props = new Properties();
        props.setProperty("user", dbUser);
        props.setProperty("password", dbPassword);
        props.setProperty("oracle.net.tns_admin", walletPath);
        props.setProperty("oracle.net.wallet_location", "(SOURCE=(METHOD=file)(METHOD_DATA=(DIRECTORY=" + walletPath + ")))");
        // Se fusiona todos los elementos en un solo link que se utilizara para realizar la conexion
        String jdbcUrl = "jdbc:oracle:thin:@" + tnsAlias;
        // Se conecta con la BD y si no hubo problemas se retorna un objeto del tipo Connection (Importante el tipo de objeto)
        return DriverManager.getConnection(jdbcUrl, props);
    }
}