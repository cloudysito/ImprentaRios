package imprenta.sistema.imprentabackend.exceptions;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CodigoError {
    ACTIVIDAD_NO_ENCONTRADA(HttpStatus.NOT_FOUND, "Actividad no encontrada"),
    EMPLEADO_OCUPADO(HttpStatus.CONFLICT, "El empleado ya tiene una actividad asignada en ese horario"),
    PEDIDO_NO_ENCONTRADO(HttpStatus.NOT_FOUND, "Pedido no encontrado"),
    ARCHIVO_DE_DISENIO_NO_ENCONTRADO(HttpStatus.NOT_FOUND,  "Archivo no encontrado"),
    CLIENTE_NO_ENCONTRADO(HttpStatus.NOT_FOUND, "Cliente no encontrado"),
    PRODUCTO_NO_ENCONTRADO(HttpStatus.NOT_FOUND, "Producto no encontrado"),
    TIPO_PRODUCTO_NO_ENCONTRADO(HttpStatus.NOT_FOUND, "Tipo producto no encontrado"),
    MATERIAL_NO_ENCONTRADO(HttpStatus.NOT_FOUND, "Material no encontrado"),
    INSUMO_NO_ENCONTRADO(HttpStatus.NOT_FOUND, "Insumo no encontrado"),
    INVENTARIO_INSUFICIENTE(HttpStatus.CONFLICT, "Inventario insuficiente");

    private final HttpStatus status;
    private final String mensaje;
}
