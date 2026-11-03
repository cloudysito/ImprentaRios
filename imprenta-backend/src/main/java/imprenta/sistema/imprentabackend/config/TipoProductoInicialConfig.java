package imprenta.sistema.imprentabackend.config;

import imprenta.sistema.imprentabackend.pedidos.model.TipoProducto;
import imprenta.sistema.imprentabackend.pedidos.repository.TipoProductoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

// Llena el catálogo de tipos de producto al arrancar, solo si la colección está vacía.
// Así no se duplican ni se pisan los cambios que haga la imprenta después.
@Configuration
public class TipoProductoInicialConfig {

    private static final Logger log = LoggerFactory.getLogger(TipoProductoInicialConfig.class);

    private static List<TipoProducto> tiposIniciales() {
        return List.of(
                new TipoProducto(null, "Volantes", "Hojas sueltas de promoción, una o dos caras"),
                new TipoProducto(null, "Tarjetas de presentación", "Tarjetas en cartulina, tamaño estándar"),
                new TipoProducto(null, "Trípticos", "Folleto con dos dobleces"),
                new TipoProducto(null, "Dípticos", "Folleto con un doblez"),
                new TipoProducto(null, "Carteles", "Pósters para pared o aparador"),
                new TipoProducto(null, "Lonas", "Impresión en gran formato sobre lona"),
                new TipoProducto(null, "Etiquetas", "Etiquetas y stickers en papel adhesivo"),
                new TipoProducto(null, "Hojas membretadas", "Papelería corporativa con logotipo"),
                new TipoProducto(null, "Sobres", "Sobres impresos con datos de la empresa"),
                new TipoProducto(null, "Invitaciones", "Invitaciones para eventos"),
                new TipoProducto(null, "Calendarios", "Calendarios de pared o escritorio"),
                new TipoProducto(null, "Catálogos", "Revistas o catálogos engrapados o encuadernados"),
                new TipoProducto(null, "Libretas", "Libretas y blocks con portada impresa")
        );
    }

    @Bean
    public CommandLineRunner crearTiposProductoIniciales(TipoProductoRepository tipoProductoRepository) {
        return args -> {
            if (tipoProductoRepository.count() > 0) {
                return;
            }
            List<TipoProducto> tipos = tipoProductoRepository.saveAll(tiposIniciales());
            log.info("Se crearon {} tipos de producto iniciales", tipos.size());
        };
    }
}
