package imprenta.sistema.imprentabackend.mantenimiento.mapper;

import imprenta.sistema.imprentabackend.mantenimiento.dtos.MaquinaRequestDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.ServicioRequestDTO;
import imprenta.sistema.imprentabackend.mantenimiento.dtos.ServicioResponseDTO;
import imprenta.sistema.imprentabackend.mantenimiento.model.Maquina;
import imprenta.sistema.imprentabackend.mantenimiento.model.ServicioMantenimiento;

public final class MantenimientoMapper {
    private MantenimientoMapper() {}

    public static void actualizarMaquina(Maquina maquina, MaquinaRequestDTO dto) {
        maquina.setNombre(dto.nombre().trim());
        maquina.setDescripcion(limpiar(dto.descripcion()));
        maquina.setNumeroSerie(limpiar(dto.numeroSerie()));
        maquina.setAnioOperacion(dto.anioOperacion());
        maquina.setResponsable(limpiar(dto.responsable()));
        maquina.setPeriodicidadDias(dto.periodicidadDias());
        maquina.setHorasUso(dto.horasUso());
    }

    public static ServicioMantenimiento toServicio(String maquinaId, ServicioRequestDTO dto) {
        return new ServicioMantenimiento(null, maquinaId, dto.tipo(), dto.fecha(), dto.tecnico().trim(),
                dto.paroEstimadoHoras(), limpiar(dto.refacciones()), limpiar(dto.notas()));
    }

    public static ServicioResponseDTO toResponse(ServicioMantenimiento s) {
        return new ServicioResponseDTO(s.getId(), s.getTipo(), s.getFecha(), s.getTecnico(),
                s.getParoEstimadoHoras(), s.getRefacciones(), s.getNotas());
    }

    private static String limpiar(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }
}
