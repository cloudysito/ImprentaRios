package imprenta.sistema.imprentabackend.pedidos.repository;

import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends MongoRepository<Pedido, String> {
    Optional<Pedido> findByFolio(String folio);

    boolean existsByClienteId(String clienteId);
    boolean existsByArchivoDisenioId(String archivoDeDisenioId);
    boolean existsByArchivosDisenioIdsContaining(String archivoDeDisenioId);
    boolean existsByProductosMaterialId(String materialId);
    boolean existsByProductosTipoProductoId(String tipoProductoId);
    boolean existsByEmpleadoId(String empleadoId);

    // Pedidos que esperan material, el más antiguo primero
    List<Pedido> findByEstadoOrderByFechaRegistroAsc(EstadoPedido estado);
}
