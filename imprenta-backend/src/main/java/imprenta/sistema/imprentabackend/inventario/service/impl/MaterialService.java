package imprenta.sistema.imprentabackend.inventario.service.impl;

import imprenta.sistema.imprentabackend.inventario.model.Material;
import imprenta.sistema.imprentabackend.inventario.repository.MaterialRepository;
import imprenta.sistema.imprentabackend.inventario.service.IMaterialService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService implements IMaterialService {
    private final MaterialRepository materialRepository;

    public MaterialService(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    //Lista de materiales
    @Override
    public List<Material> obtenerMateriales() {
        return materialRepository.findAll();
    }

    @Override
    public Material obtenerMaterialPorId(String id) {
        return materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ERROR: Material seleccionado no encontrado"));
    }
}
