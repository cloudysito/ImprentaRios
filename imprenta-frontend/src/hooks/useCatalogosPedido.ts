import { useEffect, useState } from "react";
import { capturaService } from "../services/capturaService";
import { mensajeDeError } from "../utils/errores";
import type { ArchivoDisenio, Material, TipoProducto } from "../types/captura";

export function useCatalogosPedido() {
    const [tipos, setTipos] = useState<TipoProducto[]>([]);
    const [materiales, setMateriales] = useState<Material[]>([]);
    const [archivos, setArchivos] = useState<ArchivoDisenio[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([
            capturaService.tiposProducto(),
            capturaService.materiales(),
            capturaService.archivosDisenio(),
        ])
            .then(([t, m, a]) => {
                setTipos(t);
                setMateriales(m);
                setArchivos(a);
            })
            .catch((err) => setError(mensajeDeError(err, "No se pudieron cargar los catálogos")))
            .finally(() => setCargando(false));
    }, []);

    return { tipos, materiales, archivos, cargando, error };
}