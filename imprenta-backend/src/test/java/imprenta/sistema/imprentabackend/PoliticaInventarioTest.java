package imprenta.sistema.imprentabackend;

import imprenta.sistema.imprentabackend.inventario.model.PoliticaFaltante;
import imprenta.sistema.imprentabackend.inventario.service.PoliticaInventario;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PoliticaInventarioTest {

    @Test
    void unidadesRequeridas_SumaElMargenDeMermaYRedondeaHaciaArriba() {
        PoliticaInventario politica = new PoliticaInventario(PoliticaFaltante.PENDIENTE, 0.05);

        // 100 * 1.05 = 105 exacto (sin errores de punto flotante)
        assertEquals(105, politica.unidadesRequeridas(100));
        // 10 * 1.05 = 10.5 -> 11
        assertEquals(11, politica.unidadesRequeridas(10));
        assertEquals(0, politica.unidadesRequeridas(0));
    }

    @Test
    void unidadesRequeridas_SinMargen_EsUnaUnidadPorPieza() {
        PoliticaInventario politica = new PoliticaInventario(PoliticaFaltante.RECHAZAR, 0);

        assertEquals(250, politica.unidadesRequeridas(250));
        assertEquals(PoliticaFaltante.RECHAZAR, politica.faltante());
    }

    @Test
    void margenNegativo_NoSePermite() {
        assertThrows(IllegalArgumentException.class,
                () -> new PoliticaInventario(PoliticaFaltante.PENDIENTE, -0.1));
    }
}
