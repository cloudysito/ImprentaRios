package imprenta.sistema.imprentabackend.pedidos.service.impl;

import imprenta.sistema.imprentabackend.inventario.model.Material;
import imprenta.sistema.imprentabackend.inventario.service.impl.InsumoService;
import imprenta.sistema.imprentabackend.inventario.service.impl.MaterialService;
import imprenta.sistema.imprentabackend.pedidos.model.Cliente;
import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import imprenta.sistema.imprentabackend.pedidos.model.Producto;
import imprenta.sistema.imprentabackend.pedidos.repository.ClienteRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.IPedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class PedidoService implements IPedidoService {
    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final InsumoService insumoService;
    private final MaterialService materialService;

    //Metodo principal para capturar pedido
    @Override
    public Pedido capturarPedido(Pedido pedido, Cliente cliente) {
        // Validaciones iniciales
        if (pedido == null) {
            throw new IllegalArgumentException("El pedido no puede ser nulo.");
        }

        if (cliente == null) {
            throw new IllegalArgumentException("El cliente no puede ser nulo.");
        }

        List<Producto> productos = pedido.getProductos();

        if (productos == null || productos.isEmpty()) {
            throw new IllegalArgumentException(
                    "El pedido debe contener al menos un producto."
            );
        }

        Map<String, Integer> requeridoPorInsumo = new HashMap<>();

        // Validar todos los productos antes de guardar cualquier información
        for (Producto producto : productos) {
            if (producto == null) {
                throw new IllegalArgumentException(
                        "El pedido contiene un producto inválido."
                );
            }

            if (producto.getMaterialId() == null
                    || producto.getMaterialId().isBlank()) {
                throw new IllegalArgumentException(
                        "Cada producto debe tener un materialId."
                );
            }

            Material material = materialService.obtenerMaterialPorId(
                    producto.getMaterialId()
            );

            String insumoId = material.getInsumoId();

            requeridoPorInsumo.merge(
                    insumoId,
                    producto.getCantidad(),
                    Integer::sum
            );
        }

        for (Map.Entry<String, Integer> entry : requeridoPorInsumo.entrySet()) {
            String insumoId = entry.getKey();
            int cantidadRequerida = entry.getValue();

            boolean hayStock = insumoService.verificaExistencias(
                    insumoId,
                    cantidadRequerida
            );

            if (!hayStock) {
                throw new IllegalArgumentException(
                        "No hay suficiente material en stock para el insumo: " + insumoId
                );
            }
        }

        // Crear el cliente únicamente después de validar los materiales
        if (cliente.getId() == null) {
            cliente = clienteRepository.save(cliente);
        }

        // Completar y guardar el pedido
        pedido.setFolio("PED-" + UUID.randomUUID());
        pedido.setClienteId(cliente.getId());
        pedido.setFechaRegistro(LocalDateTime.now());
        pedido.setEstado(EstadoPedido.REGISTRADO);

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
        pedido.setId(id);
        return pedidoRepository.save(pedido);
    }


}
