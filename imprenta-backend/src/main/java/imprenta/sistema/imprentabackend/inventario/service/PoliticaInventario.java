package imprenta.sistema.imprentabackend.inventario.service;

import imprenta.sistema.imprentabackend.inventario.model.PoliticaFaltante;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Reglas de inventario de la imprenta. Se pueden cambiar en application.properties
 * sin tocar el código:
 *
 *   imprenta.inventario.politica-faltante = PENDIENTE | RECHAZAR
 *   imprenta.inventario.margen-merma      = 0.05   (5 % de hojas extra por ajustes y pruebas de impresión)
 */
@Component
public class PoliticaInventario {

    private final PoliticaFaltante faltante;
    private final BigDecimal margenMerma;

    public PoliticaInventario(
            @Value("${imprenta.inventario.politica-faltante:PENDIENTE}") PoliticaFaltante faltante,
            @Value("${imprenta.inventario.margen-merma:0.05}") double margenMerma) {
        if (margenMerma < 0) {
            throw new IllegalArgumentException("El margen de merma no puede ser negativo");
        }
        this.faltante = faltante;
        this.margenMerma = BigDecimal.valueOf(margenMerma);
    }

    public PoliticaFaltante faltante() {
        return faltante;
    }

    // Una unidad de insumo por pieza, más el margen de merma. Siempre se redondea hacia arriba.
    public int unidadesRequeridas(int piezas) {
        return BigDecimal.valueOf(piezas)
                .multiply(BigDecimal.ONE.add(margenMerma))
                .setScale(0, RoundingMode.CEILING)
                .intValueExact();
    }
}
