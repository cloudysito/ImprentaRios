package imprenta.sistema.imprentabackend.pedidos.controller;

import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.service.IArchivoDisenioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/archivo_disenio")
@RequiredArgsConstructor
public class ArchivoDisenioController {
    private final IArchivoDisenioService archivoDisenioService;

    @GetMapping
    public ResponseEntity<List<ArchivoDisenioResponseDTO>> listar() {
        return ResponseEntity.ok(archivoDisenioService.listarArchivosDisenio());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArchivoDisenioResponseDTO> buscar(@PathVariable String id) {
        return ResponseEntity.ok(archivoDisenioService.buscarArchivoDisenio(id));
    }

    @PostMapping
    public ResponseEntity<ArchivoDisenioResponseDTO> registrar(
            @Valid @RequestBody ArchivoDisenioRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(archivoDisenioService.registrarArchivoDisenio(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArchivoDisenioResponseDTO> actualizar(
            @PathVariable String id,
            @Valid @RequestBody ArchivoDisenioRequestDTO dto) {
        return ResponseEntity.ok(archivoDisenioService.actualizarArchivoDisenio(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        archivoDisenioService.eliminarArchivoDisenio(id);
        return ResponseEntity.noContent().build();
    }
}
