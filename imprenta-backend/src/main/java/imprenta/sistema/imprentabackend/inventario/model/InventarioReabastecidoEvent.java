package imprenta.sistema.imprentabackend.inventario.model;

// Se publica cuando entra material al inventario. Los pedidos pendientes de material lo escuchan.
public record InventarioReabastecidoEvent(String insumoId) {
}
