package imprenta.sistema.imprentabackend.pedidos.service.impl;

import imprenta.sistema.imprentabackend.pedidos.model.ArchivoDisenio;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.IArchivoDisenioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ArchivoDisenioService implements IArchivoDisenioService {
    private final PedidoRepository pedidoRepository;


    @Override
    public ArchivoDisenio registrarArchivoDisenio(ArchivoDisenio archivo, Pedido pedido) {
       if(archivo.getRutaArchivo() == null || archivo.getRutaArchivo().trim().isEmpty()){
           throw new IllegalArgumentException("ERROR: La ruta del archivo no existe o está vacía.");
       }

       return archivo;
    }
}
