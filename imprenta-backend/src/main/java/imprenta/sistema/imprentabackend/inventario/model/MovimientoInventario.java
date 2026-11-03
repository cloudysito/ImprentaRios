package imprenta.sistema.imprentabackend.inventario.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "movimientos_inventario")
public class MovimientoInventario {
    @Id
    private String id;
    private String insumoId;
    private TipoMovimiento tipo;
    private int cantidad;
    private LocalDate fecha;
    private String motivo;
    private String empleadoId;
    private LocalDateTime registradoEn;
}
