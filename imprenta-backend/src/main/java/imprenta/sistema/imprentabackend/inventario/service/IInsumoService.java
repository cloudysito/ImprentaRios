package imprenta.sistema.imprentabackend.inventario.service;

import imprenta.sistema.imprentabackend.inventario.model.Insumo;

public interface IInsumoService {
    boolean verificaExistencias(String idInsumo, int cantidadRequerida);
     void descontarInventario(String idInsumo, int cantidadRequerida);
     Insumo agregarInsumo(Insumo insumo);
}
