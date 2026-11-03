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
    ARCHIVO_DE_DISENIO_NO_ENCONTRADO(HttpStatus.NOT_FOUND, "Archivo no encontrado"),
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
    EMPLEADO_INACTIVO(HttpStatus.FORBIDDEN, "El usuario está inactivo"),
    ACTIVIDAD_NO_ASIGNADA(HttpStatus.FORBIDDEN, "Esta actividad está asignada a otro empleado"),
    ACTIVIDAD_YA_TERMINADA(HttpStatus.CONFLICT, "Esta actividad ya se marcó como terminada"),
    PIEZAS_EXCEDEN_TOTAL(HttpStatus.BAD_REQUEST, "Las piezas terminadas no pueden superar el total del pedido"),
    MAQUINA_NO_ENCONTRADA(HttpStatus.NOT_FOUND, "Máquina no encontrada");

    private final HttpStatus status;
    private final String mensaje;
}
