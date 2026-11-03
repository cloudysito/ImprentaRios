package imprenta.sistema.imprentabackend.inventario.dtos;

import imprenta.sistema.imprentabackend.inventario.model.TipoInsumo;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record InsumoRequestDTO (
    @NotBlank(message = "El nombre es obligatorio")
    String nombre,
    @NotNull(message = "El tipo de insumo es obligatorio")
    TipoInsumo tipoInsumo,
    @NotBlank(message = "La unidad es obligatoria")
    String unidad,
    @Min(value = 0, message = "La cantidad no puede ser negativa")
    int cantidadDisponible,
    @Min(value = 0, message = "El punto de reorden no puede ser negativo")
    int puntoReorden
) {
}
