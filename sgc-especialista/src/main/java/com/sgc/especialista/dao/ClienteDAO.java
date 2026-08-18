package com.sgc.especialista.dao;

import com.sgc.especialista.modelo.Cliente;
import com.sgc.especialista.modelo.Resena;

import java.util.ArrayList;
import java.util.List;

public class ClienteDAO {

    public Cliente buscarPorId(String idCliente) {
        return AlmacenDatos.getCliente(idCliente);
    }

    /** Historial de resenas del cliente, de la mas reciente a la mas antigua. */
    public List<Resena> historialResenas(String idCliente) {
        List<Resena> resultado = new ArrayList<>(AlmacenDatos.getResenasPorCliente(idCliente));

        // Ordenamiento por burbuja, de fecha mas reciente a mas antigua.
        for (int i = 0; i < resultado.size() - 1; i++) {
            for (int j = 0; j < resultado.size() - 1 - i; j++) {
                if (resultado.get(j).getFecha().isBefore(resultado.get(j + 1).getFecha())) {
                    Resena temp = resultado.get(j);
                    resultado.set(j, resultado.get(j + 1));
                    resultado.set(j + 1, temp);
                }
            }
        }
        return resultado;
    }
}
