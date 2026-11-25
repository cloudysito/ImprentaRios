package imprenta.sistema.imprentabackend.inventario.service.impl;

import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.inventario.dtos.FaltanteInsumoDTO;
import imprenta.sistema.imprentabackend.inventario.model.ConsumoInsumo;
import imprenta.sistema.imprentabackend.inventario.model.Insumo;
import imprenta.sistema.imprentabackend.inventario.model.Material;
import imprenta.sistema.imprentabackend.inventario.model.MovimientoInventario;
import imprenta.sistema.imprentabackend.inventario.model.TipoMovimiento;
import imprenta.sistema.imprentabackend.inventario.repository.InsumoRepository;
import imprenta.sistema.imprentabackend.inventario.repository.MaterialRepository;
import imprenta.sistema.imprentabackend.inventario.repository.MovimientoInventarioRepository;
import imprenta.sistema.imprentabackend.inventario.service.IReservaInventarioService;
import imprenta.sistema.imprentabackend.inventario.service.PoliticaInventario;
import imprenta.sistema.imprentabackend.pedidos.model.Producto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReservaInventarioService implements IReservaInventarioService {

    private static final int MAX_MOTIVO = 150; // mismo límite que MovimientoRequestDTO

    private final InsumoRepository insumoRepository;
    private final MaterialRepository materialRepository;
    private final MovimientoInventarioRepository movimientoRepository;
    private final PoliticaInventario politica;

    @Override
    public List<ConsumoInsumo> calcularRequerimiento(List<Producto> productos) {
        if (productos == null || productos.isEmpty()) {
            return List.of();
        }
        // Dos productos pueden usar el mismo papel: se suman para verificar una sola vez
        Map<String, Integer> porInsumo = new LinkedHashMap<>();
        for (Producto producto : productos) {
            Material material = materialRepository.findById(producto.getMaterialId())
                    .orElseThrow(() -> new NegocioException(CodigoError.MATERIAL_NO_ENCONTRADO));
            porInsumo.merge(material.getInsumoId(),
                    politica.unidadesRequeridas(producto.getCantidad()), Integer::sum);
        }
        return porInsumo.entrySet().stream()
                .map(e -> new ConsumoInsumo(e.getKey(), e.getValue()))
                .toList();
    }

    @Override
    public List<FaltanteInsumoDTO> detectarFaltantes(List<ConsumoInsumo> requeridos) {
        List<FaltanteInsumoDTO> faltantes = new ArrayList<>();
        if (requeridos == null) {
            return faltantes;
        }
        for (ConsumoInsumo requerido : requeridos) {
            Insumo insumo = obtenerInsumo(requerido.getInsumoId());
            if (insumo.getCantidadDisponible() < requerido.getCantidad()) {
                faltantes.add(aFaltante(insumo, requerido.getCantidad()));
            }
        }
        return faltantes;
    }

    @Override
    public void descontar(List<ConsumoInsumo> consumos, String folio, String empleadoId) {
        if (consumos == null || consumos.isEmpty()) {
            return;
        }
        // Primero se verifica todo, así nunca queda un pedido a medias descontado
        List<FaltanteInsumoDTO> faltantes = detectarFaltantes(consumos);
        if (!faltantes.isEmpty()) {
            throw insuficiente(faltantes);
        }
        String motivo = "Consumo en producción · " + folio;
        for (ConsumoInsumo consumo : consumos) {
            mover(obtenerInsumo(consumo.getInsumoId()), TipoMovimiento.SALIDA,
                    consumo.getCantidad(), motivo, empleadoId);
        }
    }

    @Override
    public void reintegrar(List<ConsumoInsumo> consumos, String folio, String motivo, String empleadoId) {
        if (consumos == null) {
            return;
        }
        String texto = "Devolución de producción · " + folio
                + (motivo == null || motivo.isBlank() ? "" : " · " + motivo);
        for (ConsumoInsumo consumo : consumos) {
            // Si el insumo se eliminó ya no hay a dónde devolver el material
            insumoRepository.findById(consumo.getInsumoId())
                    .ifPresent(insumo -> mover(insumo, TipoMovimiento.ENTRADA,
                            consumo.getCantidad(), texto, empleadoId));
        }
    }

    @Override
    public void ajustar(List<ConsumoInsumo> anteriores, List<ConsumoInsumo> nuevos,
                        String folio, String empleadoId) {
        // Diferencia por insumo: positivo = hay que descontar más, negativo = hay que devolver
        Map<String, Integer> diferencia = new LinkedHashMap<>();
        if (nuevos != null) {
            nuevos.forEach(c -> diferencia.merge(c.getInsumoId(), c.getCantidad(), Integer::sum));
        }
        if (anteriores != null) {
            anteriores.forEach(c -> diferencia.merge(c.getInsumoId(), -c.getCantidad(), Integer::sum));
        }

        List<FaltanteInsumoDTO> faltantes = new ArrayList<>();
        for (Map.Entry<String, Integer> e : diferencia.entrySet()) {
            if (e.getValue() > 0) {
                Insumo insumo = obtenerInsumo(e.getKey());
                if (insumo.getCantidadDisponible() < e.getValue()) {
                    faltantes.add(aFaltante(insumo, e.getValue()));
                }
            }
        }
        if (!faltantes.isEmpty()) {
            throw insuficiente(faltantes);
        }

        for (Map.Entry<String, Integer> e : diferencia.entrySet()) {
            int cantidad = e.getValue();
            if (cantidad > 0) {
                mover(obtenerInsumo(e.getKey()), TipoMovimiento.SALIDA, cantidad,
                        "Consumo en producción · " + folio + " (ajuste por edición)", empleadoId);
            } else if (cantidad < 0) {
                insumoRepository.findById(e.getKey())
                        .ifPresent(insumo -> mover(insumo, TipoMovimiento.ENTRADA, -cantidad,
                                "Devolución de producción · " + folio + " (ajuste por edición)", empleadoId));
            }
        }
    }

    private void mover(Insumo insumo, TipoMovimiento tipo, int cantidad, String motivo, String empleadoId) {
        if (cantidad <= 0) {
            return;
        }
        int signo = tipo == TipoMovimiento.SALIDA ? -1 : 1;
        insumo.setCantidadDisponible(insumo.getCantidadDisponible() + signo * cantidad);
        insumoRepository.save(insumo);
        movimientoRepository.save(new MovimientoInventario(
                null, insumo.getId(), tipo, cantidad, LocalDate.now(),
                recortar(motivo), empleadoId, LocalDateTime.now()));
    }

    private Insumo obtenerInsumo(String insumoId) {
        return insumoRepository.findById(insumoId)
                .orElseThrow(() -> new NegocioException(CodigoError.INSUMO_NO_ENCONTRADO));
    }

    private FaltanteInsumoDTO aFaltante(Insumo insumo, int requerido) {
        return new FaltanteInsumoDTO(insumo.getId(), insumo.getNombre(), insumo.getUnidad(),
                requerido, insumo.getCantidadDisponible());
    }

    private NegocioException insuficiente(List<FaltanteInsumoDTO> faltantes) {
        String detalle = faltantes.stream().map(FaltanteInsumoDTO::mensaje).reduce((a, b) -> a + "; " + b).orElse("");
        return new NegocioException(CodigoError.INVENTARIO_INSUFICIENTE,
                CodigoError.INVENTARIO_INSUFICIENTE.getMensaje() + ". " + detalle);
    }

    private String recortar(String texto) {
        return texto.length() <= MAX_MOTIVO ? texto : texto.substring(0, MAX_MOTIVO);
    }
}
