package imprenta.sistema.imprentabackend.pedidos.mappers;

import imprenta.sistema.imprentabackend.pedidos.dtos.ProductoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.model.Producto;

public final class ProductoMapper {
    private ProductoMapper() {}

    public static Producto toEntity(ProductoRequestDTO dto) {
        Producto producto = new Producto();
        actualizarEntidad(producto, dto);
        return producto;
    }

    public static void actualizarEntidad(Producto producto, ProductoRequestDTO dto) {
        producto.setCantidad(dto.cantidad());
        producto.setTipoProductoId(dto.tipoProductoId());
        producto.setMedidas(dto.medidas());
        producto.setTinta(dto.tinta());
        producto.setObservaciones(dto.observaciones());
        producto.setMaterialId(dto.materialId());
        producto.setTipoAcabado(dto.tipoAcabado());
        producto.setPrioridad(dto.prioridad());
    }

}
