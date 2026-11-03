package imprenta.sistema.imprentabackend.inventario.service;

import imprenta.sistema.imprentabackend.inventario.dtos.InsumoRequestDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.InsumoResponseDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.MovimientoRequestDTO;
import imprenta.sistema.imprentabackend.inventario.dtos.MovimientoResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface IInsumoService {
     InsumoResponseDTO agregarInsumo(InsumoRequestDTO insumo);
     List<InsumoResponseDTO> listarInsumos();
     InsumoResponseDTO buscarInsumoPorId(String idInsumo);
     InsumoResponseDTO actualizarInsumo(String idInsumo, InsumoRequestDTO insumo);
     void eliminarInsumoPorId(String idInsumo);

     InsumoResponseDTO registrarMovimiento(String idInsumo, MovimientoRequestDTO dto, String empleadoId);
     List<MovimientoResponseDTO> listarMovimientos(LocalDate desde, LocalDate hasta);
}
