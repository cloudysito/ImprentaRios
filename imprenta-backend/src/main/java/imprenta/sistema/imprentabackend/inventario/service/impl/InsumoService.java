package imprenta.sistema.imprentabackend.inventario.service.impl;

import imprenta.sistema.imprentabackend.inventario.model.Insumo;
import imprenta.sistema.imprentabackend.inventario.repository.InsumoRepository;
import imprenta.sistema.imprentabackend.inventario.repository.MaterialRepository;
import imprenta.sistema.imprentabackend.inventario.service.IInsumoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
@RequiredArgsConstructor
public class InsumoService implements IInsumoService {
    private final InsumoRepository insumoRepository;
    private final MaterialRepository materialRepository;

    @Override
    public boolean verificaExistencias(String insumoId, int cantidadRequerida){

        //Verificar existencias
        Insumo insumo = insumoRepository.findById(insumoId)
                .orElseThrow(() -> new RuntimeException("ERROR: Insumo no encontrado"));

        return insumo.getCantidadDisponible()>=cantidadRequerida; //Checamos si tenemos la cantidad requerida en base al stock
    }

    //Metodo que actualiza el inventario
    @Override
    public void descontarInventario(String insumoId, int cantidadUsada){
        Insumo insumo = insumoRepository.findById(insumoId)
                .orElseThrow(() -> new RuntimeException("ERROR: Insumo no encontrado"));

        int nuevaCantidad = insumo.getCantidadDisponible() - cantidadUsada;

        //evitemos que el stock sea negativo vale
        if (nuevaCantidad<=0){
            throw new IllegalArgumentException("ERROR: Inventario INSUFICIENTE");
        }

        insumo.setCantidadDisponible(nuevaCantidad);

        //se actualiza
        insumoRepository.save(insumo);
    }
    @Override
    public Insumo agregarInsumo(Insumo insumo) {
        return insumoRepository.save(insumo);
    }
}
