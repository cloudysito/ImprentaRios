package imprenta.sistema.imprentabackend.pedidos.service.controllers;

import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioRequestDTO;
import imprenta.sistema.imprentabackend.pedidos.dtos.ArchivoDisenioResponseDTO;
import imprenta.sistema.imprentabackend.pedidos.service.IArchivoDisenioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/archivo_disenio")
@RequiredArgsConstructor
public class ArchivoDisenioController {
    private final IArchivoDisenioService archivoDisenioService;

    @PostMapping
    public ResponseEntity<ArchivoDisenioResponseDTO> registrar(@Valid @RequestBody ArchivoDisenioRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(archivoDisenioService.registrarArchivoDisenio(dto));
    }

    @PutMapping({ "/{id}"})
    public ResponseEntity<ArchivoDisenioResponseDTO> actualizar(@Valid @RequestBody ArchivoDisenioRequestDTO dto, @PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(archivoDisenioService.actualizarArchivoDisenio(id,dto));
    }

    @GetMapping({ "/{id}"})
    public ResponseEntity<ArchivoDisenioResponseDTO> buscarArchivoDisenio(@PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(archivoDisenioService.buscarArchivoDisenio(id));
    }

    @DeleteMapping({ "/{id}"})
    public void eliminar(@PathVariable String id) { archivoDisenioService.eliminarArchivoDisenio(id); }
}
