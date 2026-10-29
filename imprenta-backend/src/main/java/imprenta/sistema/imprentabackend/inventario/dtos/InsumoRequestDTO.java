package imprenta.sistema.imprentabackend.inventario.dtos;

import imprenta.sistema.imprentabackend.inventario.model.TipoInsumo;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record InsumoRequestDTO (
    @NotBlank
    String nombre,

    @NotNull
    TipoInsumo tipoInsumo,

    @NotBlank
    String unidad,

    @Min(0)
    int cantidadDisponible
) {
}