package imprenta.sistema.imprentabackend.inventario.service;

import imprenta.sistema.imprentabackend.inventario.dtos.InsumoRequestDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.InsumoResponseDTO;

import java.util.List;

public interface IInsumoService {
     InsumoResponseDTO agregarInsumo(InsumoRequestDTO insumo);
     List<InsumoResponseDTO> listarInsumos();
     InsumoResponseDTO buscarInsumoPorId(String idInsumo);
     InsumoResponseDTO actualizarInsumo(String idInsumo, InsumoRequestDTO insumo);
     void eliminarInsumoPorId(String idInsumo);
}
