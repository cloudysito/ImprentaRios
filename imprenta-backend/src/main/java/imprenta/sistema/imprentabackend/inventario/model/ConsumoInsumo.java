package imprenta.sistema.imprentabackend.inventario.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Cuánto material se descontó del inventario por un pedido.
// Se guarda dentro del pedido para poder devolverlo exacto si el pedido se cancela o se edita.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsumoInsumo {
    private String insumoId;
    private int cantidad;
}
