package imprenta.sistema.imprentabackend.pedidos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CambioEstadoPedido {
    private EstadoPedido estado;
    private LocalDateTime fecha;
    private String empleadoId;
    private String empleadoNombre;
}
