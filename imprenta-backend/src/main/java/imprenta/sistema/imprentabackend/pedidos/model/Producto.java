package imprenta.sistema.imprentabackend.pedidos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "productos")
public class Producto {
    @Id
    private String id;
    private int cantidad;
    private String medidas;
    private TipoTinta tinta;
    private TipoAcabado tipoAcabado;
    private Prioridad prioridad;
    private String observaciones;
}
