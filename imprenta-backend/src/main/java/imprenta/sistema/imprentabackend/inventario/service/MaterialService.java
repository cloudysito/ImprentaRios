package imprenta.sistema.imprentabackend.inventario.service;

import imprenta.sistema.imprentabackend.inventario.model.Material;
import imprenta.sistema.imprentabackend.inventario.repository.MaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService {
    private final MaterialRepository materialRepository;

    public MaterialService(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    //Lista de materiales
    public List<Material> obtenerMateriales() {
        return materialRepository.findAll();
    }

    public Material obtenerMaterialPorId(String id) {
        return materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ERROR: Material seleccionado no encontrado"));
    }
}
