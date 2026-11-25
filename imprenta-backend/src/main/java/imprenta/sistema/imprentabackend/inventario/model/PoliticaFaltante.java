package imprenta.sistema.imprentabackend.inventario.model;

// Qué hace la imprenta cuando un pedido pide más material del que hay en existencia
public enum PoliticaFaltante {
    // El pedido se registra, pero queda "Pendiente de material" y no se descuenta nada
    PENDIENTE,
    // El pedido no se registra y se avisa qué material falta
    RECHAZAR
}
