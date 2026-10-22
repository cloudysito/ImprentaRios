package imprenta.sistema.imprentabackend.inventario.service;

import imprenta.sistema.imprentabackend.inventario.model.Material;

import java.util.List;

public interface IMaterialService {
    Material obtenerMaterialPorId(String id);
    List<Material> obtenerMateriales();
}
