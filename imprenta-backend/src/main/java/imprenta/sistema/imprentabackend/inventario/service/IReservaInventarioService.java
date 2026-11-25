package imprenta.sistema.imprentabackend.inventario.service;

import imprenta.sistema.imprentabackend.inventario.dtos.FaltanteInsumoDTO;
import imprenta.sistema.imprentabackend.inventario.model.ConsumoInsumo;
import imprenta.sistema.imprentabackend.pedidos.model.Producto;

import java.util.List;

// Conecta los pedidos con el inventario: calcula, verifica, descuenta y devuelve material
public interface IReservaInventarioService {

    // Material que necesitan los productos, sumado por insumo
    List<ConsumoInsumo> calcularRequerimiento(List<Producto> productos);

    // Lo que no alcanza. Lista vacía = hay existencias para todo
    List<FaltanteInsumoDTO> detectarFaltantes(List<ConsumoInsumo> requeridos);

    // Descuenta todo o nada: si algo no alcanza lanza INVENTARIO_INSUFICIENTE sin tocar el inventario
    void descontar(List<ConsumoInsumo> consumos, String folio, String empleadoId);

    // Regresa el material al inventario (cancelación, borrado del pedido)
    void reintegrar(List<ConsumoInsumo> consumos, String folio, String motivo, String empleadoId);

    // El pedido cambió de productos: solo se mueve la diferencia contra lo ya descontado
    void ajustar(List<ConsumoInsumo> anteriores, List<ConsumoInsumo> nuevos, String folio, String empleadoId);
}
