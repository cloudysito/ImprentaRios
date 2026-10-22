package imprenta.sistema.imprentabackend.pedidos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "pedidos")
public class Pedido {
    @Id
    private String id;
    @Indexed(unique = true)
    private String folio;

    private LocalDateTime fechaRegistro;
    private LocalDateTime fechaEntrega;
    private EstadoPedido estado;
    private String nombreProyecto;
    private List<Producto> productos;
    private String clienteId;
    private String empleadoId;
}
