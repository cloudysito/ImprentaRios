package imprenta.sistema.imprentabackend.mantenimiento.service;

import imprenta.sistema.imprentabackend.mantenimiento.dtos.AlertaRequestDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.MaquinaDetalleDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.MaquinaRequestDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.MaquinaResumenDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.ServicioRequestDTO;

import java.util.List;

public interface IMantenimientoService {
    List<MaquinaResumenDTO> listarMaquinas();
    MaquinaDetalleDTO obtenerMaquina(String id);
    MaquinaDetalleDTO registrarMaquina(MaquinaRequestDTO dto);
    MaquinaDetalleDTO actualizarMaquina(String id, MaquinaRequestDTO dto);
    void eliminarMaquina(String id);
    MaquinaDetalleDTO registrarServicio(String maquinaId, ServicioRequestDTO dto);
    MaquinaDetalleDTO programarAlerta(String maquinaId, AlertaRequestDTO dto);
}
