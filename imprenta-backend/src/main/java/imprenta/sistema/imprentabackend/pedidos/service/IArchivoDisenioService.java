package imprenta.sistema.imprentabackend.pedidos.service;

import imprenta.sistema.imprentabackend.pedidos.model.ArchivoDisenio;
import imprenta.sistema.imprentabackend.pedidos.model.Pedido;

public interface IArchivoDisenioService {
    ArchivoDisenio registrarArchivoDisenio(ArchivoDisenio archivo, Pedido pedido);
}
