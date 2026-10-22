package imprenta.sistema.imprentabackend.inventario.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "insumos")
public class Insumo {
    @Id
    private String id;
    private String nombre;
    private TipoInsumo tipo;
    private String unidad;
    private int cantidadDisponible;
}
