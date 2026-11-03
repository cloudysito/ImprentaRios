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
    CLIENTE_NO_ENCONTRADO(HttpStatus.NOT_FOUND, "Cliente no encontrado"),
    TIPO_PRODUCTO_NO_ENCONTRADO(HttpStatus.NOT_FOUND, "Tipo producto no encontrado"),
    MATERIAL_NO_ENCONTRADO(HttpStatus.NOT_FOUND, "Material no encontrado"),
    INSUMO_NO_ENCONTRADO(HttpStatus.NOT_FOUND, "Insumo no encontrado"),
    INVENTARIO_INSUFICIENTE(HttpStatus.CONFLICT, "Inventario insuficiente"),
    TRANSICION_ESTADO_INVALIDA(HttpStatus.CONFLICT, "Solo se puede entregar un pedido terminado"),
    EMPLEADO_NO_ENCONTRADO(HttpStatus.NOT_FOUND, "Empleado no encontrado"),
    USUARIO_YA_REGISTRADO(HttpStatus.CONFLICT, "El nombre de usuario ya está registrado"),
    PASSWORD_REQUERIDA(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria"),
    CREDENCIALES_INVALIDAS(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos"),
    EMPLEADO_INACTIVO(HttpStatus.FORBIDDEN, "El usuario está inactivo");

    private final HttpStatus status;
    private final String mensaje;
}
