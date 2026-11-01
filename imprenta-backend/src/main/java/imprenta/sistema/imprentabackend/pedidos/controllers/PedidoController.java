package imprenta.sistema.imprentabackend.pedidos.controllers;

import imprenta.sistema.imprentabackend.pedidos.dtos.CambioEstadoDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoDetalleDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoResumenDTO;
import imprenta.sistema.imprentabackend.pedidos.service.IPedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {
    private final IPedidoService pedidoService;

    @GetMapping
    public ResponseEntity<List<PedidoResumenDTO>> listar() {
        return ResponseEntity.ok(pedidoService.listarPedidos());
    }

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> agregar(@Valid @RequestBody PedidoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.capturarPedido(dto));
    }

    @PutMapping({ "/{id}"})
    public ResponseEntity<PedidoResponseDTO> actualizar(@Valid @RequestBody PedidoRequestDTO dto, @PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(pedidoService.actualizarPedido(id, dto));
    }

    @GetMapping({ "/{id}"})
    public ResponseEntity<PedidoResponseDTO> buscarPedido(@PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(pedidoService.buscarPedido(id));
    }

    @GetMapping("/{id}/detalle")
    public ResponseEntity<PedidoDetalleDTO> detalle(@PathVariable String id) {
        return ResponseEntity.ok(pedidoService.obtenerDetalle(id));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<PedidoDetalleDTO> cambiarEstado(@PathVariable String id,
                                                          @Valid @RequestBody CambioEstadoDTO dto) {
        return ResponseEntity.ok(pedidoService.cambiarEstado(id, dto.estado()));
    }

    @DeleteMapping({ "/{id}"})
    public void eliminar(@PathVariable String id) {
        pedidoService.eliminarPedido(id);
    }
}
