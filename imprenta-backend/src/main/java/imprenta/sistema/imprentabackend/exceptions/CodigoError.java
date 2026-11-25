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
    PEDIDO_ENTREGADO_NO_SE_PUEDE_CANCELAR(HttpStatus.CONFLICT, "Un pedido entregado no se puede cancelar"),
    PEDIDO_CON_HISTORIAL_NO_SE_PUEDE_ELIMINAR(HttpStatus.CONFLICT, "Solo se pueden eliminar pedidos sin historial"),
    EMPLEADO_NO_ENCONTRADO(HttpStatus.NOT_FOUND, "Empleado no encontrado"),
    USUARIO_YA_REGISTRADO(HttpStatus.CONFLICT, "El nombre de usuario ya está registrado"),
    PASSWORD_REQUERIDA(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria"),
    CREDENCIALES_INVALIDAS(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos"),
    EMPLEADO_INACTIVO(HttpStatus.FORBIDDEN, "El usuario está inactivo"),
    ACTIVIDAD_NO_ASIGNADA(HttpStatus.FORBIDDEN, "Esta actividad está asignada a otro empleado"),
    ACTIVIDAD_YA_TERMINADA(HttpStatus.CONFLICT, "Esta actividad ya se marcó como terminada"),
    PIEZAS_EXCEDEN_TOTAL(HttpStatus.BAD_REQUEST, "Las piezas terminadas no pueden superar el total del pedido"),
    PEDIDO_NO_EDITABLE(HttpStatus.CONFLICT, "Solo se pueden editar pedidos que no estén terminados, entregados o cancelados"),
    MAQUINA_NO_ENCONTRADA(HttpStatus.NOT_FOUND, "Máquina no encontrada"),
    DEMASIADOS_INTENTOS(HttpStatus.TOO_MANY_REQUESTS, "Demasiados intentos de inicio de sesión. Intenta nuevamente más tarde"),
    NO_PUEDES_ELIMINARTE(HttpStatus.CONFLICT, "No puedes eliminar tu propia cuenta"),
    NO_PUEDES_DESACTIVARTE(HttpStatus.CONFLICT, "No puedes desactivar tu propia cuenta"),
    ULTIMO_DUENO(HttpStatus.CONFLICT, "Debe quedar al menos un dueño activo en el sistema"),
    CLIENTE_EN_USO(HttpStatus.CONFLICT, "No se puede eliminar el cliente porque tiene pedidos asociados"),
    MATERIAL_EN_USO(HttpStatus.CONFLICT, "No se puede eliminar el material porque está usado en pedidos"),
    ARCHIVO_DE_DISENIO_EN_USO(HttpStatus.CONFLICT, "No se puede eliminar el archivo porque está asociado a un pedido"),
    TIPO_PRODUCTO_EN_USO(HttpStatus.CONFLICT, "No se puede eliminar el tipo de producto porque está usado en pedidos"),
    INSUMO_EN_USO(HttpStatus.CONFLICT, "No se puede eliminar el insumo porque está usado en materiales o movimientos");

    private final HttpStatus status;
    private final String mensaje;
}
