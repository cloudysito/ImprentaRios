package imprenta.sistema.imprentabackend.reportes.service;

import imprenta.sistema.imprentabackend.reportes.dtos.ReporteMermaDTO;

import java.time.LocalDate;

public interface IReporteService {

    // Sin fechas regresa el mes actual, igual que los movimientos de inventario
    ReporteMermaDTO reporteMerma(LocalDate desde, LocalDate hasta);
}
