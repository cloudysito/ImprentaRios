package imprenta.sistema.imprentabackend.reportes.controller;

import imprenta.sistema.imprentabackend.reportes.dtos.ReporteMermaDTO;
import imprenta.sistema.imprentabackend.reportes.service.IReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final IReporteService reporteService;

    // Sin fechas regresa el mes actual
    @GetMapping("/merma")
    public ResponseEntity<ReporteMermaDTO> merma(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(reporteService.reporteMerma(desde, hasta));
    }
}
