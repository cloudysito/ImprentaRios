package imprenta.sistema.imprentabackend.pedidos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {
    private int cantidad;
    private String medidas;
    private TipoTinta tinta;
    private TipoAcabado tipoAcabado;
    private Prioridad prioridad;
    private String observaciones;
    private String tipoProductoId;
    private String materialId;
    private List<ArchivoDisenio> archivosDisenio;
}
