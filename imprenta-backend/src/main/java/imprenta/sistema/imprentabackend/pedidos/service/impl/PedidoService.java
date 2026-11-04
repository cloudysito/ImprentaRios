package imprenta.sistema.imprentabackend.pedidos.service.impl;

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
import imprenta.sistema.imprentabackend.inventario.service.IMaterialService;
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
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class PedidoService implements IPedidoService {
    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final TipoProductoRepository tipoProductoRepository;
    private final IMaterialService materialService;
    private final ActividadRepository actividadRepository;
    private final ArchivoDisenioRepository archivoDisenioRepository;

    @Override
    public PedidoResponseDTO capturarPedido(PedidoRequestDTO dto, String empleadoId) {
        if (!clienteRepository.existsById(dto.clienteId())) {
            throw new NegocioException(CodigoError.CLIENTE_NO_ENCONTRADO);
        }
        for (ProductoRequestDTO p : dto.productos()) {
            if (!tipoProductoRepository.existsById(p.tipoProductoId())) {
                throw new NegocioException(CodigoError.TIPO_PRODUCTO_NO_ENCONTRADO);
            }
            materialService.buscarMaterialPorId(p.materialId());
        }
        validarArchivoDisenio(dto.archivoDisenioId());
        // TODO: verificar existencias de insumo cuando la imprenta defina la respuesta.

        Pedido pedido = PedidoMapper.toEntity(dto);
        pedido.setFolio(generarFolio());
        pedido.setFechaRegistro(LocalDateTime.now());
        pedido.setEstado(EstadoPedido.REGISTRADO);
        pedido.setEmpleadoId(empleadoId);
        return PedidoMapper.toResponse(pedidoRepository.save(pedido));
    }

    private void validarArchivoDisenio(String archivoDisenioId) {
        if (archivoDisenioId != null && !archivoDisenioId.isBlank()
                && !archivoDisenioRepository.existsById(archivoDisenioId)) {
            throw new NegocioException(CodigoError.ARCHIVO_DE_DISENIO_NO_ENCONTRADO);
        }
    }

    private String generarFolio() {
        return "PED-" + LocalDate.now().getYear() + "-"
                + String.format("%04d", pedidoRepository.count() + 1);
    }

    @Override
    public void eliminarPedido(String id) {
        pedidoRepository.delete(obtenerPedido(id));
    }

    @Override
    public PedidoResponseDTO actualizarPedido(String id, PedidoRequestDTO dto) {
        Pedido pedido = obtenerPedido(id);
        validarArchivoDisenio(dto.archivoDisenioId());
        PedidoMapper.actualizarEntidad(pedido, dto);
        return PedidoMapper.toResponse(pedidoRepository.save(pedido));
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
    public PedidoDetalleDTO cambiarEstado(String id, EstadoPedido nuevoEstado) {
        Pedido pedido = obtenerPedido(id);

        if (nuevoEstado == EstadoPedido.ENTREGADO && pedido.getEstado() != EstadoPedido.TERMINADO) {
            throw new NegocioException(CodigoError.TRANSICION_ESTADO_INVALIDA);
        }

        pedido.setEstado(nuevoEstado);
        return aDetalle(pedidoRepository.save(pedido));
    }

    private PedidoResumenDTO aResumen(Pedido p, Map<String, String> clientes, Map<String, String> tipos) {
        List<Producto> productos = productosDe(p);

        String cliente = clientes.getOrDefault(p.getClienteId(), "Cliente no encontrado");

        String producto = productos.isEmpty() ? "" : tipos.getOrDefault(productos.get(0).getTipoProductoId(), "");
        if (productos.size() > 1) {
            producto += " y " + (productos.size() - 1) + " más";
        }

        int piezas = productos.stream().mapToInt(Producto::getCantidad).sum();

        return new PedidoResumenDTO(p.getId(), p.getFolio(), cliente, producto,
                piezas, p.getFechaEntrega(), p.getEstado());
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

        List<EventoBitacoraDTO> bitacora = p.getFechaRegistro() == null
                ? List.of()
                : List.of(new EventoBitacoraDTO(p.getFechaRegistro(), "Pedido registrado"));

        String versionDisenio = p.getArchivoDisenioId() == null ? null
                : archivoDisenioRepository.findById(p.getArchivoDisenioId())
                        .map(a -> "v" + Objects.requireNonNullElse(a.getVersion(), 1))
                        .orElse(null);

        return new PedidoDetalleDTO(r.id(), r.folio(), r.clienteNombre(), r.producto(), r.piezas(),
                r.fechaEntrega(), r.estado(), piezasTerminadas, versionDisenio, bitacora);
    }

    private List<Producto> productosDe(Pedido p) {
        return p.getProductos() != null ? p.getProductos() : List.of();
    }

    private Pedido obtenerPedido(String id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new NegocioException(CodigoError.PEDIDO_NO_ENCONTRADO));
    }
}
