package imprenta.sistema.imprentabackend.pedidos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "pedidos")
public class Pedido {
    @Id
    private String folio;
    private Date fechaRegistro;
    private Date fechaEntrega;
    private EstadoPedido estado;
    private String nombreProyecto;
}
