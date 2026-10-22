package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.inventario.service.InsumoService;
import imprenta.sistema.imprentabackend.pedidos.model.Cliente;
import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import imprenta.sistema.imprentabackend.pedidos.repository.ClienteRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Service
public class PedidoService {
    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final InsumoService insumoService;

    public PedidoService(PedidoRepository pedidoRepository, ClienteRepository clienteRepository, InsumoService insumoService) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.insumoService = insumoService;

    }

    //Metodo principal para capturar pedido
    @Transactional
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

}
