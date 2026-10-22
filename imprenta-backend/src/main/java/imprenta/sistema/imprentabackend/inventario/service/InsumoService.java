package imprenta.sistema.imprentabackend.inventario.service;

import imprenta.sistema.imprentabackend.inventario.model.Insumo;
import imprenta.sistema.imprentabackend.inventario.repository.InsumoRepository;
import imprenta.sistema.imprentabackend.inventario.repository.MaterialRepository;
import org.springframework.stereotype.Service;

@Service
public class InsumoService {
    private final InsumoRepository insumoRepository;
    private final MaterialRepository materialRepository;

    public InsumoService(InsumoRepository insumoRepository, MaterialRepository materialRepository) {
        this.insumoRepository = insumoRepository;
        this.materialRepository = materialRepository;
    }

    public boolean verificaExistencias(String insumoId, int cantidadRequerida){

        //Verificar existencias
        Insumo insumo = insumoRepository.findById(insumoId)
                .orElseThrow(() -> new RuntimeException("ERROR: Insumo no encontrado"));

        return insumo.getCantidadDisponible()>=cantidadRequerida; //Checamos si tenemos la cantidad requerida en base al stock
    }

    //Metodo que actualiza el inventario
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
}
