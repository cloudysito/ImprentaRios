package imprenta.sistema.imprentabackend.config;

import imprenta.sistema.imprentabackend.inventario.model.Insumo;
import imprenta.sistema.imprentabackend.inventario.model.Material;
import imprenta.sistema.imprentabackend.inventario.model.TipoInsumo;
import imprenta.sistema.imprentabackend.inventario.repository.InsumoRepository;
import imprenta.sistema.imprentabackend.inventario.repository.MaterialRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Llena el catálogo de materiales al arrancar, solo si la colección está vacía.
// Cada material queda ligado a su insumo del inventario, que se crea si todavía no existe.
@Configuration
public class MaterialInicialConfig {

    private static final Logger log = LoggerFactory.getLogger(MaterialInicialConfig.class);

    private record MaterialInicial(String nombre, int gramaje, String insumo, String unidad,
                                   int existencia, int puntoReorden) {
    }

    private static List<MaterialInicial> materialesIniciales() {
        return List.of(
                new MaterialInicial("Couché brillante", 135, "Papel couché brillante 135 g", "hojas", 12000, 3000),
                new MaterialInicial("Couché mate", 150, "Papel couché mate 150 g", "hojas", 8000, 2000),
                new MaterialInicial("Bond", 90, "Papel bond 90 g", "hojas", 20000, 5000),
                new MaterialInicial("Cartulina sulfatada", 300, "Cartulina sulfatada 300 g", "hojas", 3000, 1000),
                new MaterialInicial("Opalina", 225, "Cartulina opalina 225 g", "hojas", 400, 500),
                new MaterialInicial("Papel adhesivo", 80, "Papel adhesivo 80 g", "hojas", 1200, 1000),
                new MaterialInicial("Kraft", 120, "Papel kraft 120 g", "hojas", 2500, 800),
                new MaterialInicial("Lona front", 440, "Lona front 13 oz", "m²", 150, 50)
        );
    }

    @Bean
    public CommandLineRunner crearMaterialesIniciales(MaterialRepository materialRepository,
                                                      InsumoRepository insumoRepository) {
        return args -> {
            if (materialRepository.count() > 0) {
                return;
            }

            // Si la imprenta ya registró alguno de estos insumos, se reutiliza en lugar de duplicarlo
            Map<String, String> insumosPorNombre = new HashMap<>();
            insumoRepository.findAll().forEach(i -> insumosPorNombre.put(i.getNombre(), i.getId()));

            List<MaterialInicial> lista = materialesIniciales();
            for (MaterialInicial m : lista) {
                String insumoId = insumosPorNombre.computeIfAbsent(m.insumo(), nombre -> {
                    Insumo insumo = new Insumo();
                    insumo.setNombre(nombre);
                    insumo.setTipo(TipoInsumo.SUSTRATO);
                    insumo.setUnidad(m.unidad());
                    insumo.setCantidadDisponible(m.existencia());
                    insumo.setPuntoReorden(m.puntoReorden());
                    insumo.setUltimaEntrada(LocalDate.now());
                    return insumoRepository.save(insumo).getId();
                });

                Material material = new Material();
                material.setNombre(m.nombre());
                material.setGramaje(m.gramaje());
                material.setInsumoId(insumoId);
                materialRepository.save(material);
            }

            log.info("Se crearon {} materiales iniciales ligados al inventario", lista.size());
        };
    }
}
