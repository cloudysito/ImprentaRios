package imprenta.sistema.imprentabackend.pedidos.service.impl;

import imprenta.sistema.imprentabackend.inventario.service.impl.InsumoService;
import imprenta.sistema.imprentabackend.pedidos.model.Cliente;
import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import imprenta.sistema.imprentabackend.pedidos.repository.ClienteRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.IPedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class PedidoService implements IPedidoService {
    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final InsumoService insumoService;

    //Metodo principal para capturar pedido
    @Override
    public Pedido capturarPedido(Pedido pedido, Cliente cliente, String insumoId, int cantidadDisponible) {

        if (cliente.getId() == null){
            cliente = clienteRepository.save(cliente); //Si no existe el cliente, se crea
        }

        pedido.setFolio(pedido.getFolio()); //Se asigna el folio
        pedido.setClienteId(cliente.getId()); //Se vincula el cliente al pedido con su id
        pedido.setFechaRegistro(LocalDateTime.now()); //Ponemos la fecha de registro a la fecha que se registra el pedido
        pedido.setEstado(EstadoPedido.REGISTRADO); //Estado inicial

        boolean hayMaterial = insumoService.verificaExistencias(insumoId,cantidadDisponible);//verifica existencias

        if (hayMaterial){
            throw new IllegalArgumentException("No hay material en stock");
        }

        return pedidoRepository.save(pedido);

    }

    @Override
    public Pedido actualizarPedido(Pedido pedido, String id) throws Exception {
        if (!pedidoRepository.existsById(String.valueOf(id))) {
            throw new Exception("Pedido no encontrado");
        }
        pedido.setFolio(pedido.getFolio());
        pedido.setFechaEntrega(LocalDateTime.now());
        pedido.setNombreProyecto(pedido.getNombreProyecto());
        return pedidoRepository.save(pedido);
    }


}
