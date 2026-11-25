package imprenta.sistema.imprentabackend.pedidos.service.impl;

import imprenta.sistema.imprentabackend.auth.UsuarioActual;
import imprenta.sistema.imprentabackend.calendarizacion.model.Actividad;
import imprenta.sistema.imprentabackend.calendarizacion.repository.ActividadRepository;
import imprenta.sistema.imprentabackend.exceptions.CodigoError;
import imprenta.sistema.imprentabackend.exceptions.NegocioException;
import imprenta.sistema.imprentabackend.pedidos.dtos.EventoBitacoraDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoDetalleDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoResumenDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ProductoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.model.CambioEstadoPedido;
import imprenta.sistema.imprentabackend.inventario.dtos.FaltanteInsumoDTO;
import imprenta.sistema.imprentabackend.inventario.model.ConsumoInsumo;
import imprenta.sistema.imprentabackend.inventario.model.InventarioReabastecidoEvent;
import imprenta.sistema.imprentabackend.inventario.model.PoliticaFaltante;
import imprenta.sistema.imprentabackend.inventario.service.IMaterialService;
import imprenta.sistema.imprentabackend.inventario.service.IReservaInventarioService;
import imprenta.sistema.imprentabackend.inventario.service.PoliticaInventario;
import imprenta.sistema.imprentabackend.pedidos.mappers.PedidoMapper;
import imprenta.sistema.imprentabackend.pedidos.model.EstadoPedido;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;
import imprenta.sistema.imprentabackend.pedidos.model.Producto;
import imprenta.sistema.imprentabackend.pedidos.repository.ArchivoDisenioRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.ClienteRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.PedidoRepository;
import imprenta.sistema.imprentabackend.pedidos.repository.TipoProductoRepository;
import imprenta.sistema.imprentabackend.pedidos.service.IPedidoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import imprenta.sistema.imprentabackend.usuarios.repository.EmpleadoRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;


@Slf4j
@Service
@RequiredArgsConstructor
public class PedidoService implements IPedidoService {
    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final TipoProductoRepository tipoProductoRepository;
    private final IMaterialService materialService;
    private final ActividadRepository actividadRepository;
    private final ArchivoDisenioRepository archivoDisenioRepository;
    private final EmpleadoRepository empleadoRepository;
    private final IReservaInventarioService reservaInventario;
    private final PoliticaInventario politicaInventario;

    @Override
    public PedidoResponseDTO capturarPedido(PedidoRequestDTO dto, String empleadoId) {
        validarReferencias(dto);

        Pedido pedido = PedidoMapper.toEntity(dto);
        pedido.setFolio(generarFolio());
        pedido.setFechaRegistro(LocalDateTime.now());
        pedido.setEstado(EstadoPedido.REGISTRADO);
        pedido.setEmpleadoId(empleadoId);
        pedido.setHistorialEstados(new ArrayList<>(List.of(
                nuevoEventoEstado(EstadoPedido.REGISTRADO, empleadoId, pedido.getFechaRegistro())
        )));

        // Regla de inventario: hay material para todo -> se descuenta ahora (queda apartado para este pedido).
        // Si falta algo: según la política de la imprenta el pedido queda pendiente de material o se rechaza.
        List<String> avisos = aplicarInventarioAlCapturar(pedido, empleadoId);

        try {
            return PedidoMapper.toResponse(pedidoRepository.save(pedido), avisos);
        } catch (RuntimeException e) {
            // Si el pedido no se pudo guardar, el material descontado vuelve al inventario
            devolverMaterial(pedido, empleadoId, "no se pudo registrar el pedido");
            throw e;
        }
    }

    private List<String> aplicarInventarioAlCapturar(Pedido pedido, String empleadoId) {
        List<ConsumoInsumo> requeridos = reservaInventario.calcularRequerimiento(productosDe(pedido));
        List<FaltanteInsumoDTO> faltantes = reservaInventario.detectarFaltantes(requeridos);

        if (faltantes.isEmpty()) {
            reservaInventario.descontar(requeridos, pedido.getFolio(), empleadoId);
            pedido.setConsumosInventario(new ArrayList<>(requeridos));
            return List.of();
        }

        if (politicaInventario.faltante() == PoliticaFaltante.RECHAZAR) {
            throw new NegocioException(CodigoError.INVENTARIO_INSUFICIENTE, mensajeInsuficiente(faltantes));
        }

        // Nada se descuenta a medias: el pedido espera hasta que alcance para todo
        cambiarEstadoYRegistrar(pedido, EstadoPedido.PENDIENTE_DE_MATERIAL, empleadoId);
        return faltantes.stream().map(FaltanteInsumoDTO::mensaje).toList();
    }

    private String mensajeInsuficiente(List<FaltanteInsumoDTO> faltantes) {
        return CodigoError.INVENTARIO_INSUFICIENTE.getMensaje() + ". "
                + String.join("; ", faltantes.stream().map(FaltanteInsumoDTO::mensaje).toList());
    }

    // Descuenta el material de un pedido que estaba esperando. true = ya quedó apartado
    private boolean reservarMaterial(Pedido pedido, String empleadoId) {
        List<ConsumoInsumo> requeridos = reservaInventario.calcularRequerimiento(productosDe(pedido));
        if (!reservaInventario.detectarFaltantes(requeridos).isEmpty()) {
            return false;
        }
        reservaInventario.descontar(requeridos, pedido.getFolio(), empleadoId);
        pedido.setConsumosInventario(new ArrayList<>(requeridos));
        return true;
    }

    private List<String> avisosDeFaltantes(Pedido pedido) {
        List<ConsumoInsumo> requeridos = reservaInventario.calcularRequerimiento(productosDe(pedido));
        return reservaInventario.detectarFaltantes(requeridos).stream().map(FaltanteInsumoDTO::mensaje).toList();
    }

    // Regresa al inventario lo que se había descontado. true = había algo que devolver
    private boolean devolverMaterial(Pedido pedido, String empleadoId, String motivo) {
        if (!tieneMaterialDescontado(pedido)) {
            return false;
        }
        reservaInventario.reintegrar(pedido.getConsumosInventario(), pedido.getFolio(), motivo, empleadoId);
        pedido.setConsumosInventario(new ArrayList<>());
        return true;
    }

    private boolean tieneMaterialDescontado(Pedido pedido) {
        return pedido.getConsumosInventario() != null && !pedido.getConsumosInventario().isEmpty();
    }

    // Al liberar material el pedido vuelve al punto del flujo donde se quedó
    private EstadoPedido estadoAlLiberarMaterial(Pedido pedido) {
        if (actividadRepository.findByPedidoId(pedido.getId()).isEmpty()) {
            return EstadoPedido.REGISTRADO;
        }
        return tieneArchivoDisenio(pedido) ? EstadoPedido.EN_PRODUCCION : EstadoPedido.EN_DISENIO;
    }

    @Override
    public int liberarPedidosPendientes(String empleadoId) {
        int liberados = 0;
        for (Pedido pendiente : pedidoRepository.findByEstadoOrderByFechaRegistroAsc(EstadoPedido.PENDIENTE_DE_MATERIAL)) {
            try {
                if (reservarMaterial(pendiente, empleadoId)) {
                    cambiarEstadoYRegistrar(pendiente, estadoAlLiberarMaterial(pendiente), empleadoId);
                    pedidoRepository.save(pendiente);
                    liberados++;
                }
            } catch (NegocioException e) {
                log.warn("No se pudo liberar el pedido {}: {}", pendiente.getFolio(), e.getMessage());
            }
        }
        return liberados;
    }

    // Cuando entra material al inventario se revisan los pedidos que lo esperaban
    @EventListener
    public void alReabastecerInventario(InventarioReabastecidoEvent evento) {
        try {
            int liberados = liberarPedidosPendientes(null);
            if (liberados > 0) {
                log.info("Entró material y se liberaron {} pedido(s) pendientes", liberados);
            }
        } catch (RuntimeException e) {
            // Registrar la entrada de material no debe fallar por los pedidos pendientes
            log.error("No se pudieron revisar los pedidos pendientes de material", e);
        }
    }

    private void validarReferencias(PedidoRequestDTO dto) {
        if (!clienteRepository.existsById(dto.clienteId())) {
            throw new NegocioException(CodigoError.CLIENTE_NO_ENCONTRADO);
        }
        for (ProductoRequestDTO p : dto.productos()) {
            if (!tipoProductoRepository.existsById(p.tipoProductoId())) {
                throw new NegocioException(CodigoError.TIPO_PRODUCTO_NO_ENCONTRADO);
            }
            materialService.buscarMaterialPorId(p.materialId());
        }
        List<String> archivosPorProducto = dto.productos().stream()
                .flatMap(producto -> producto.archivosDisenioIds() == null
                        ? java.util.stream.Stream.empty()
                        : producto.archivosDisenioIds().stream())
                .toList();
        if (archivosPorProducto.stream().distinct().count() != archivosPorProducto.size()) {
            throw new NegocioException(CodigoError.ARCHIVO_DE_DISENIO_REPETIDO);
        }
        validarArchivosDisenio(java.util.stream.Stream.concat(
                dto.archivosDisenioIds() == null ? java.util.stream.Stream.empty() : dto.archivosDisenioIds().stream(),
                archivosPorProducto.stream()
        ).distinct().toList());
    }

    private void validarArchivosDisenio(List<String> ids) {
        if (ids == null) {
            return;
        }
        for (String archivoId : ids) {
            if (archivoId != null && !archivoId.isBlank()
                    && !archivoDisenioRepository.existsById(archivoId)) {
                throw new NegocioException(CodigoError.ARCHIVO_DE_DISENIO_NO_ENCONTRADO);
            }
        }
    }

    private String generarFolio() {
        String prefijo = "PED-" + LocalDate.now().getYear() + "-";
        long consecutivo = pedidoRepository.count() + 1;
        while (pedidoRepository.findByFolio(prefijo + String.format("%04d", consecutivo)).isPresent()) {
            consecutivo++;
        }
        return prefijo + String.format("%04d", consecutivo);
    }

    @Override
    public void eliminarPedido(String id) {
        Pedido pedido = obtenerPedido(id);
        EstadoPedido estado = pedido.getEstado();
        boolean tieneHistorial = (estado != null && estado != EstadoPedido.REGISTRADO)
                || !actividadRepository.findByPedidoId(id).isEmpty();
        if (tieneHistorial) {
            throw new NegocioException(CodigoError.PEDIDO_CON_HISTORIAL_NO_SE_PUEDE_ELIMINAR);
        }
        boolean devolvio = devolverMaterial(pedido, UsuarioActual.empleadoId(), "pedido eliminado");
        actividadRepository.deleteByPedidoId(id);
        pedidoRepository.delete(pedido);
        if (devolvio) {
            liberarPedidosPendientes(UsuarioActual.empleadoId());
        }
    }

    @Override
    public PedidoResponseDTO actualizarPedido(String id, PedidoRequestDTO dto, String empleadoId) {
        Pedido pedido = obtenerPedido(id);
        EstadoPedido estado = pedido.getEstado();
        if (estado == EstadoPedido.TERMINADO || estado == EstadoPedido.ENTREGADO
                || estado == EstadoPedido.CANCELADO) {
            throw new NegocioException(CodigoError.PEDIDO_NO_EDITABLE);
        }
        validarReferencias(dto);
        List<ConsumoInsumo> consumosPrevios = pedido.getConsumosInventario();
        PedidoMapper.actualizarEntidad(pedido, dto);
        List<String> avisos = ajustarInventarioAlEditar(pedido, consumosPrevios, empleadoId);
        // Si estaba esperando el diseño y ya tiene archivo, pasa a producción
        if (pedido.getEstado() == EstadoPedido.EN_DISENIO && tieneArchivoDisenio(pedido)) {
            cambiarEstadoYRegistrar(pedido, EstadoPedido.EN_PRODUCCION, empleadoId);
        }
        PedidoResponseDTO respuesta = PedidoMapper.toResponse(pedidoRepository.save(pedido), avisos);
        // Si la edición bajó el material que necesitaba, lo que sobra puede liberar a otros pedidos
        if (consumosPrevios != null && !consumosPrevios.isEmpty()) {
            liberarPedidosPendientes(empleadoId);
        }
        return respuesta;
    }

    // Edición de productos: se mueve solo la diferencia de material
    private List<String> ajustarInventarioAlEditar(Pedido pedido, List<ConsumoInsumo> previos, String empleadoId) {
        if (previos != null && !previos.isEmpty()) {
            List<ConsumoInsumo> nuevos = reservaInventario.calcularRequerimiento(productosDe(pedido));
            // Si ya había material apartado y ahora necesita más del que hay, la edición se rechaza
            reservaInventario.ajustar(previos, nuevos, pedido.getFolio(), empleadoId);
            pedido.setConsumosInventario(new ArrayList<>(nuevos));
            return List.of();
        }
        if (pedido.getEstado() == EstadoPedido.PENDIENTE_DE_MATERIAL) {
            // Quizá con los nuevos productos ya alcanza
            if (reservarMaterial(pedido, empleadoId)) {
                cambiarEstadoYRegistrar(pedido, estadoAlLiberarMaterial(pedido), empleadoId);
                return List.of();
            }
            return avisosDeFaltantes(pedido);
        }
        // Pedidos anteriores al control de inventario no tienen material descontado: no se tocan
        return List.of();
    }

    @Override
    public PedidoResponseDTO buscarPedido(String id) {
        return PedidoMapper.toResponse(obtenerPedido(id));
    }


    @Override
    public List<PedidoResumenDTO> listarPedidos() {
        Map<String, String> clientes = new HashMap<>();
        clienteRepository.findAll()
                .forEach(c -> clientes.put(c.getId(), Objects.requireNonNullElse(c.getNombre(), "")));

        Map<String, String> tipos = new HashMap<>();
        tipoProductoRepository.findAll()
                .forEach(t -> tipos.put(t.getId(), Objects.requireNonNullElse(t.getNombre(), "")));

        return pedidoRepository.findAll().stream()
                .map(p -> aResumen(p, clientes, tipos))
                .toList();
    }

    @Override
    public PedidoDetalleDTO obtenerDetalle(String id) {
        return aDetalle(obtenerPedido(id));
    }

    @Override
    public PedidoDetalleDTO cambiarEstado(String id, EstadoPedido nuevoEstado, String empleadoId) {
        Pedido pedido = obtenerPedido(id);
        EstadoPedido anterior = pedido.getEstado();

        if (nuevoEstado == EstadoPedido.ENTREGADO && anterior != EstadoPedido.TERMINADO) {
            throw new NegocioException(CodigoError.TRANSICION_ESTADO_INVALIDA);
        }
        if (nuevoEstado == EstadoPedido.CANCELADO && anterior == EstadoPedido.ENTREGADO) {
            throw new NegocioException(CodigoError.PEDIDO_ENTREGADO_NO_SE_PUEDE_CANCELAR);
        }

        // Un pedido sin material no puede avanzar al flujo normal hasta que alcance el inventario.
        // Terminar no se bloquea: si el taller ya lo trabajó, el material ya se usó.
        if (anterior == EstadoPedido.PENDIENTE_DE_MATERIAL && entraAlFlujoNormal(nuevoEstado)
                && !reservarMaterial(pedido, empleadoId)) {
            throw new NegocioException(CodigoError.INVENTARIO_INSUFICIENTE,
                    CodigoError.INVENTARIO_INSUFICIENTE.getMensaje() + ". "
                            + String.join("; ", avisosDeFaltantes(pedido)));
        }

        boolean devolvioMaterial = false;
        if (nuevoEstado == EstadoPedido.CANCELADO && anterior != EstadoPedido.EN_PRODUCCION
                && anterior != EstadoPedido.TERMINADO) {
            // Si se cancela antes de producir, el material vuelve al inventario.
            // Si ya estaba en producción o terminado, el material se da por consumido.
            devolvioMaterial = devolverMaterial(pedido, empleadoId, "pedido cancelado");
        } else if (nuevoEstado == EstadoPedido.PENDIENTE_DE_MATERIAL && anterior != nuevoEstado) {
            devolvioMaterial = devolverMaterial(pedido, empleadoId, "pedido regresó a pendiente de material");
        }

        cambiarEstadoYRegistrar(pedido, nuevoEstado, empleadoId);
        PedidoDetalleDTO detalle = aDetalle(pedidoRepository.save(pedido));

        // El material devuelto puede alcanzar para otro pedido que estaba esperando
        if (devolvioMaterial) {
            liberarPedidosPendientes(empleadoId);
        }
        return detalle;
    }

    private boolean entraAlFlujoNormal(EstadoPedido estado) {
        return estado == EstadoPedido.REGISTRADO
                || estado == EstadoPedido.EN_DISENIO
                || estado == EstadoPedido.EN_PRODUCCION;
    }

    @Override
    public void alGenerarCronograma(String id, String empleadoId) {
        Pedido pedido = obtenerPedido(id);
        if (pedido.getEstado() == EstadoPedido.REGISTRADO) {
            cambiarEstadoYRegistrar(
                    pedido,
                    tieneArchivoDisenio(pedido) ? EstadoPedido.EN_PRODUCCION : EstadoPedido.EN_DISENIO,
                    empleadoId
            );
            pedidoRepository.save(pedido);
        }
    }

    @Override
    public void iniciarProduccion(String id, String empleadoId) {
        Pedido pedido = obtenerPedido(id);
        EstadoPedido estado = pedido.getEstado();
        if (estado == EstadoPedido.PENDIENTE_DE_MATERIAL && !reservarMaterial(pedido, empleadoId)) {
            // Sigue sin alcanzar el material: el reporte del taller se acepta pero el estado no cambia
            log.warn("El pedido {} reporta avance pero sigue pendiente de material", pedido.getFolio());
            return;
        }
        if (estado == EstadoPedido.REGISTRADO
                || estado == EstadoPedido.EN_DISENIO
                || estado == EstadoPedido.PENDIENTE_DE_MATERIAL) {
            cambiarEstadoYRegistrar(pedido, EstadoPedido.EN_PRODUCCION, empleadoId);
            pedidoRepository.save(pedido);
        }
    }

    private void cambiarEstadoYRegistrar(Pedido pedido, EstadoPedido nuevoEstado, String empleadoId) {
        if (pedido.getEstado() == nuevoEstado) {
            return;
        }

        if (pedido.getHistorialEstados() == null) {
            pedido.setHistorialEstados(new ArrayList<>());
        }
        if (pedido.getHistorialEstados().isEmpty() && pedido.getFechaRegistro() != null) {
            pedido.getHistorialEstados().add(nuevoEventoEstado(
                    EstadoPedido.REGISTRADO, pedido.getEmpleadoId(), pedido.getFechaRegistro()
            ));
        }

        pedido.setEstado(nuevoEstado);
        pedido.getHistorialEstados().add(nuevoEventoEstado(
                nuevoEstado, empleadoId, LocalDateTime.now()
        ));
    }

    private CambioEstadoPedido nuevoEventoEstado(
            EstadoPedido estado,
            String empleadoId,
            LocalDateTime fecha
    ) {
        return new CambioEstadoPedido(estado, fecha, empleadoId, nombreEmpleado(empleadoId));
    }

    private String nombreEmpleado(String empleadoId) {
        if (empleadoId == null || empleadoId.isBlank()) {
            return "Sistema";
        }
        return empleadoRepository.findById(empleadoId)
                .map(empleado -> Objects.requireNonNullElse(empleado.getNombre(), empleadoId))
                .orElse(empleadoId);
    }

    private String descripcionEstado(EstadoPedido estado) {
        return switch (estado) {
            case REGISTRADO -> "Pedido registrado";
            case PENDIENTE_DE_MATERIAL -> "Estado cambiado a pendiente de material";
            case EN_DISENIO -> "Estado cambiado a en diseño";
            case EN_PRODUCCION -> "Estado cambiado a en producción";
            case TERMINADO -> "Estado cambiado a terminado";
            case ENTREGADO -> "Estado cambiado a entregado";
            case CANCELADO -> "Estado cambiado a cancelado";
        };
    }

    private boolean tieneArchivoDisenio(Pedido pedido) {
        return !PedidoMapper.archivosDe(pedido).isEmpty();
    }

    private PedidoResumenDTO aResumen(Pedido p, Map<String, String> clientes, Map<String, String> tipos) {
        List<Producto> productos = productosDe(p);

        String cliente = clientes.getOrDefault(p.getClienteId(), "Cliente no encontrado");

        String producto = productos.isEmpty() ? "" : tipos.getOrDefault(productos.get(0).getTipoProductoId(), "");
        if (productos.size() > 1) {
            producto += " y " + (productos.size() - 1) + " más";
        }

        int piezas = productos.stream().mapToInt(Producto::getCantidad).sum();

        int diasAtraso = diasDeAtraso(p);
        return new PedidoResumenDTO(p.getId(), p.getFolio(), cliente, producto,
                piezas, p.getFechaEntrega(), p.getEstado(), diasAtraso > 0, diasAtraso);
    }

    // Días que pasaron desde la fecha de entrega. Un pedido no está vencido el mismo día de la entrega,
    // y los terminados, entregados o cancelados nunca se consideran atrasados.
    private int diasDeAtraso(Pedido p) {
        EstadoPedido estado = p.getEstado();
        if (p.getFechaEntrega() == null || estado == EstadoPedido.TERMINADO
                || estado == EstadoPedido.ENTREGADO || estado == EstadoPedido.CANCELADO) {
            return 0;
        }
        long dias = ChronoUnit.DAYS.between(p.getFechaEntrega().toLocalDate(), LocalDate.now());
        return (int) Math.max(dias, 0);
    }

    private PedidoDetalleDTO aDetalle(Pedido p) {
        List<Producto> productos = productosDe(p);

        Map<String, String> clientes = new HashMap<>();
        if (p.getClienteId() != null) {
            clienteRepository.findById(p.getClienteId())
                    .ifPresent(c -> clientes.put(c.getId(), Objects.requireNonNullElse(c.getNombre(), "")));
        }
        Map<String, String> tipos = new HashMap<>();
        List<String> tipoIds = productos.stream().map(Producto::getTipoProductoId).filter(Objects::nonNull).toList();
        tipoProductoRepository.findAllById(tipoIds)
                .forEach(t -> tipos.put(t.getId(), Objects.requireNonNullElse(t.getNombre(), "")));

        PedidoResumenDTO r = aResumen(p, clientes, tipos);

        // Avance real que reporta el taller. Si no hay reportes, se usa el estado del pedido
        boolean terminado = p.getEstado() == EstadoPedido.TERMINADO || p.getEstado() == EstadoPedido.ENTREGADO;
        int piezasTerminadas = terminado ? r.piezas() : actividadRepository.findByPedidoId(p.getId()).stream()
                .map(Actividad::getPiezasTerminadas)
                .filter(Objects::nonNull)
                .max(Integer::compare)
                .orElse(0);

        List<EventoBitacoraDTO> bitacora = p.getHistorialEstados() == null || p.getHistorialEstados().isEmpty()
                ? (p.getFechaRegistro() == null
                        ? List.of()
                        : List.of(new EventoBitacoraDTO(
                                p.getFechaRegistro(),
                                "Pedido registrado",
                                nombreEmpleado(p.getEmpleadoId())
                        )))
                : p.getHistorialEstados().stream()
                        .map(evento -> new EventoBitacoraDTO(
                                evento.getFecha(),
                                descripcionEstado(evento.getEstado()),
                                evento.getEmpleadoNombre()
                        ))
                        .toList();

        List<String> idsArchivos = PedidoMapper.archivosDe(p);
        String versionDisenio = null;
        if (idsArchivos.size() == 1) {
            versionDisenio = archivoDisenioRepository.findById(idsArchivos.get(0))
                    .map(a -> "v" + Objects.requireNonNullElse(a.getVersion(), 1))
                    .orElse(null);
        } else if (idsArchivos.size() > 1) {
            versionDisenio = idsArchivos.size() + " archivos";
        }

        List<String> asignados = actividadRepository.findByPedidoId(p.getId()).stream()
                .map(Actividad::getEmpleadoId)
                .filter(Objects::nonNull)
                .distinct()
                .map(eid -> empleadoRepository.findById(eid).map(e -> e.getNombre()).orElse(null))
                .filter(Objects::nonNull)
                .toList();
        String asignadoA = asignados.isEmpty() ? null : String.join(", ", asignados);

        return new PedidoDetalleDTO(r.id(), r.folio(), r.clienteNombre(), r.producto(), r.piezas(),
                r.fechaEntrega(), r.estado(), r.vencido(), r.diasAtraso(), tieneMaterialDescontado(p),
                piezasTerminadas, versionDisenio, asignadoA, bitacora);
    }

    private List<Producto> productosDe(Pedido p) {
        return p.getProductos() != null ? p.getProductos() : List.of();
    }

    private Pedido obtenerPedido(String id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new NegocioException(CodigoError.PEDIDO_NO_ENCONTRADO));
    }
}
