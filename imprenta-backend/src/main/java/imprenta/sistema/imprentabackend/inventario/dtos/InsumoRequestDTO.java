package imprenta.sistema.imprentabackend.inventario.dtos;

import imprenta.sistema.imprentabackend.inventario.model.TipoInsumo;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record InsumoRequestDTO (
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
    String nombre,
    @NotNull(message = "El tipo de insumo es obligatorio")
    TipoInsumo tipoInsumo,
    @NotBlank(message = "La unidad es obligatoria")
    @Size(max = 30, message = "La unidad no puede superar los 30 caracteres")
    String unidad,
    @Min(value = 0, message = "La cantidad no puede ser negativa")
    int cantidadDisponible,
    @Min(value = 0, message = "El punto de reorden no puede ser negativo")
    int puntoReorden
) {
}
