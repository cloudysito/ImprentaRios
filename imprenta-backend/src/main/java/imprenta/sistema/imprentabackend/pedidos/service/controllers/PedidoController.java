package imprenta.sistema.imprentabackend.pedidos.service.controllers;

import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.PedidoResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.service.IPedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pedido")
@RequiredArgsConstructor
public class PedidoController {
    private final IPedidoService pedidoService;

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

    @DeleteMapping({ "/{id}"})
    public void eliminar(@PathVariable String id) {
        pedidoService.eliminarPedido(id);
    }
}
