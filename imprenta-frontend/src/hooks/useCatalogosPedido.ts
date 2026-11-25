import { useEffect, useState } from "react";
import { capturaService } from "../services/capturaService";
import { mensajeDeError } from "../utils/errores";
import type { ArchivoDisenio, Material, TipoProducto } from "../types/captura";

export function useCatalogosPedido(pedidoActualId?: string) {
    const [tipos, setTipos] = useState<TipoProducto[]>([]);
    const [materiales, setMateriales] = useState<Material[]>([]);
    const [archivos, setArchivos] = useState<ArchivoDisenio[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelado = false;

        Promise.all([
            capturaService.tiposProducto(),
            capturaService.materiales(),
            capturaService.archivosDisenio(),
            capturaService.listarPedidos(),
        ])
            .then(async ([t, m, a, pedidos]) => {
                const pedidosExistentes = await Promise.all(
                    pedidos.map((pedido) => capturaService.obtenerPedido(pedido.id)),
                );
                if (cancelado) return;

                const archivosEnOtrosPedidos = new Set(
                    pedidosExistentes
                        .filter((pedido) => pedido.id !== pedidoActualId)
                        .flatMap((pedido) => pedido.archivosDisenioIds ?? []),
                );
                setTipos(Array.isArray(t) ? t : []);
                setMateriales(Array.isArray(m) ? m : []);
                setArchivos(
                    (Array.isArray(a) ? a : []).filter((archivo) => !archivosEnOtrosPedidos.has(archivo.id)),
                );
            })
            .catch((err) => {
                if (!cancelado) setError(mensajeDeError(err, "No se pudieron cargar los catálogos"));
            })
            .finally(() => {
                if (!cancelado) setCargando(false);
            });

        return () => {
            cancelado = true;
        };
    }, [pedidoActualId]);

    return { tipos, materiales, archivos, cargando, error };
}