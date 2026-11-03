package imprenta.sistema.imprentabackend.pedidos.dtos;

import imprenta.sistema.imprentabackend.pedidos.model.ArchivoDisenio;
import imprenta.sistema.imprentabackend.pedidos.model.Prioridad;
import imprenta.sistema.imprentabackend.pedidos.model.TipoAcabado;
import imprenta.sistema.imprentabackend.pedidos.model.TipoTinta;
import jakarta.validation.constraints.*;

import java.util.List;

public record ProductoRequestDTO(
        @Min(value = 1, message = "La cantidad a producir no debe ser 0")
        int cantidad,

        @NotBlank(message = "Las medidas son obligatorias")
        @Size(max = 10)
        String medidas,

        @NotNull(message = "El tipo de tinta es obligatorio")
        TipoTinta tinta,

        @NotNull(message = "El tipo de acabado es obligatorio")
        TipoAcabado tipoAcabado,

        @NotNull(message = "La prioridad del producto es obligatoria")
        Prioridad prioridad,

        @Size(max = 500)
        String observaciones,

        @NotBlank(message = "El tipo de producto es obligatorio")
        String tipoProductoId,

        @NotBlank(message = "El material es obligatorio")
        String materialId,

        @NotEmpty(message = "La lista de archivos de diseno no puede estar vacia")
        List<ArchivoDisenio> archivosDisenio
) {
}
