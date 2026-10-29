package imprenta.sistema.imprentabackend.inventario.controller;

import imprenta.sistema.imprentabackend.inventario.dtos.MaterialRequestDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.MaterialResponseDTO;
import imprenta.sistema.imprentabackend.inventario.service.IMaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/material")
@RequiredArgsConstructor
public class MaterialController {
    private final IMaterialService materialService;

    @PostMapping
    public ResponseEntity<MaterialResponseDTO> agregarMaterial(
            @Valid @RequestBody MaterialRequestDTO material
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(materialService.agregarMaterial(material));
    }

    @GetMapping
    public ResponseEntity<List<MaterialResponseDTO>> listarMateriales() {
        return ResponseEntity.ok(materialService.listarMateriales());
    }

    @GetMapping("/{idMaterial}")
    public ResponseEntity<MaterialResponseDTO> buscarMaterialPorId(
            @PathVariable String idMaterial
    ) {
        return ResponseEntity.ok(materialService.buscarMaterialPorId(idMaterial));
    }

    @PutMapping("/{idMaterial}")
    public ResponseEntity<MaterialResponseDTO> actualizarMaterial(
            @PathVariable String idMaterial,
            @Valid @RequestBody MaterialRequestDTO material
    ) {
        return ResponseEntity.ok(
                materialService.actualizarMaterial(idMaterial, material)
        );
    }

    @DeleteMapping("/{idMaterial}")
    public ResponseEntity<Void> eliminarMaterialPorId(
            @PathVariable String idMaterial
    ) {
        materialService.eliminarMaterialPorId(idMaterial);
        return ResponseEntity.noContent().build();
    }
}
