package imprenta.sistema.imprentabackend.mantenimiento.controller;

import imprenta.sistema.imprentabackend.mantenimiento.dtos.AlertaRequestDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.MaquinaDetalleDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.MaquinaRequestDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.MaquinaResumenDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.ServicioRequestDTO;
import imprenta.sistema.imprentabackend.mantenimiento.service.IMantenimientoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maquinas")
@RequiredArgsConstructor
public class MantenimientoController {
    private final IMantenimientoService mantenimientoService;

    @GetMapping
    public ResponseEntity<List<MaquinaResumenDTO>> listar() {
        return ResponseEntity.ok(mantenimientoService.listarMaquinas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaquinaDetalleDTO> obtener(@PathVariable String id) {
        return ResponseEntity.ok(mantenimientoService.obtenerMaquina(id));
    }

    @PostMapping
    public ResponseEntity<MaquinaDetalleDTO> registrar(@Valid @RequestBody MaquinaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mantenimientoService.registrarMaquina(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaquinaDetalleDTO> actualizar(@PathVariable String id, @Valid @RequestBody MaquinaRequestDTO dto) {
        return ResponseEntity.ok(mantenimientoService.actualizarMaquina(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        mantenimientoService.eliminarMaquina(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/servicios")
    public ResponseEntity<MaquinaDetalleDTO> registrarServicio(@PathVariable String id, @Valid @RequestBody ServicioRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mantenimientoService.registrarServicio(id, dto));
    }

    @PutMapping("/{id}/alerta")
    public ResponseEntity<MaquinaDetalleDTO> programarAlerta(@PathVariable String id, @Valid @RequestBody AlertaRequestDTO dto) {
        return ResponseEntity.ok(mantenimientoService.programarAlerta(id, dto));
    }
}
