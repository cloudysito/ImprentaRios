import { useEffect, useState } from "react";
import { capturaService } from "../services/capturaService";
import { mensajeDeError } from "../utils/errores";
import type { Material, TipoProducto } from "../types/captura";

export function useCatalogosPedido() {
    const [tipos, setTipos] = useState<TipoProducto[]>([]);
    const [materiales, setMateriales] = useState<Material[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([capturaService.tiposProducto(), capturaService.materiales()])
            .then(([t, m]) => {
                setTipos(t);
                setMateriales(m);
            })
            .catch((err) => setError(mensajeDeError(err, "No se pudieron cargar los catálogos")))
            .finally(() => setCargando(false));
    }, []);

    return { tipos, materiales, cargando, error };
}