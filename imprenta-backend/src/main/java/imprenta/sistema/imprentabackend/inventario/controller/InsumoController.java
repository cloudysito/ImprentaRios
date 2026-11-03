package imprenta.sistema.imprentabackend.inventario.controller;

import imprenta.sistema.imprentabackend.auth.UsuarioActual;
import imprenta.sistema.imprentabackend.inventario.dtos.InsumoRequestDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.InsumoResponseDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.MovimientoRequestDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.MovimientoResponseDTO;
import imprenta.sistema.imprentabackend.inventario.service.IInsumoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/insumo")
@RequiredArgsConstructor
public class InsumoController {
    private final IInsumoService insumoService;

    @PostMapping
    public ResponseEntity<InsumoResponseDTO> agregarInsumo(@Valid @RequestBody InsumoRequestDTO insumo) {
        return ResponseEntity.status(HttpStatus.CREATED).body(insumoService.agregarInsumo(insumo));
    }

    @GetMapping
    public ResponseEntity<List<InsumoResponseDTO>> listarInsumos() {
        return ResponseEntity.ok(insumoService.listarInsumos());
    }

    // Sin fechas regresa los del mes actual
    @GetMapping("/movimientos")
    public ResponseEntity<List<MovimientoResponseDTO>> listarMovimientos(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(insumoService.listarMovimientos(desde, hasta));
    }

    @GetMapping("/{idInsumo}")
    public ResponseEntity<InsumoResponseDTO> buscarInsumoPorId(@PathVariable String idInsumo) {
        return ResponseEntity.ok(insumoService.buscarInsumoPorId(idInsumo));
    }

    @PutMapping("/{idInsumo}")
    public ResponseEntity<InsumoResponseDTO> actualizarInsumo(@PathVariable String idInsumo, @Valid @RequestBody InsumoRequestDTO insumo) {
        return ResponseEntity.ok(insumoService.actualizarInsumo(idInsumo, insumo));
    }

    @PostMapping("/{idInsumo}/movimientos")
    public ResponseEntity<InsumoResponseDTO> registrarMovimiento(@PathVariable String idInsumo,
                                                                 @Valid @RequestBody MovimientoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(insumoService.registrarMovimiento(idInsumo, dto, UsuarioActual.empleadoId()));
    }

    @DeleteMapping("/{idInsumo}")
    public ResponseEntity<Void> eliminarInsumoPorId(@PathVariable String idInsumo) {
        insumoService.eliminarInsumoPorId(idInsumo);
        return ResponseEntity.noContent().build();
    }
}
