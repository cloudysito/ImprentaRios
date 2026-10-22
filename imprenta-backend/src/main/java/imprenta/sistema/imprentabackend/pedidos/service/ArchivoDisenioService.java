package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.pedidos.model.ArchivoDisenio;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import org.springframework.stereotype.Service;

@Service
public class ArchivoDisenioService {
    private final PedidoRepository pedidoRepository;

    public ArchivoDisenioService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public ArchivoDisenio registrarArchivoDisenio(ArchivoDisenio archivo, Pedido pedido) {
       if(archivo.getRutaArchivo() == null || archivo.getRutaArchivo().trim().isEmpty()){
           throw new IllegalArgumentException("ERROR: La ruta del archivo no existe o está vacía.");
       }

       return archivo;
    }
}
