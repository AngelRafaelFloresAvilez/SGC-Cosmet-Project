package com.proyecto.sgccosmetproject;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestConexion {
    public static void main(String[] args) {
        //Leer variables de entorno (NO TOCAR O SE TRUENAN LA CONEXION)
        String dbUser = System.getenv("DB_USER");
        String dbPassword = System.getenv("DB_PASSWORD");
        String tnsAlias = System.getenv("DB_TNS_ALIAS");

        String walletPath = System.getenv("DB_WALLET_PATH");
        if (walletPath == null || walletPath.isEmpty()) {
            walletPath = System.getProperty("user.dir") + "/Wallet_DB";
        }

        // Si les sale esto, significa que no han configurado las variables e entorno
        if (dbUser == null || dbPassword == null || tnsAlias == null) {
            System.out.println("ERROR: Faltan variables de entorno por configurar");
            System.out.println(dbUser + dbPassword + tnsAlias);
            return;
        }

        // Ruta por si es windows (porque tenemos usuarios de mac...)
        walletPath = walletPath.replace("\\", "/");

        System.setProperty("oracle.net.tns_admin", walletPath);
        System.setProperty("oracle.net.wallet_location", "(SOURCE=(METHOD=file)(METHOD_DATA=(DIRECTORY=" + walletPath + ")))");

        String jdbcUrl = "jdbc:oracle:thin:@" + tnsAlias;

        System.out.println("Intentando conectar a la base de datos de Oracle Cloud...");
        System.out.println("Usuario: " + dbUser);
        System.out.println("Ruta de la Wallet: " + walletPath);

        // Prueba de conexion (IMPORTANTE TESTEAR EN TU PC)
        try {
            Connection conexion = DriverManager.getConnection(jdbcUrl, dbUser, dbPassword);
            System.out.println("Conexion exitosa con variables de entorno :P");
            conexion.close();
        } catch (SQLException e) {
            System.out.println("\nError al conectar:");
            e.printStackTrace();
        }
    }
}