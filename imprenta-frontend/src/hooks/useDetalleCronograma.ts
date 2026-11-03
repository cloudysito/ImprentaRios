import { useEffect, useState } from "react";
import { cronogramaService } from "../services/cronogramaService";
import type { CronogramaDetalle } from "../types/cronograma";

interface Resultado {
    id: string;
    detalle: CronogramaDetalle | null;
    error: string | null;
}

export function useDetalleCronograma(id: string | null) {
    const [resultado, setResultado] = useState<Resultado | null>(null);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (!id) return;

        let cancelado = false;
        cronogramaService
            .obtener(id)
            .then((data) => {
                if (!cancelado) setResultado({ id, detalle: data, error: null });
            })
            .catch(() => {
                if (!cancelado) setResultado({ id, detalle: null, error: "No se pudo cargar el folio" });
            });

        return () => {
            cancelado = true;
        };
    }, [id]);

    const vigente = resultado && resultado.id === id ? resultado : null;
    const cargando = id !== null && vigente === null;
    const detalle = vigente?.detalle ?? null;
    const error = vigente?.error ?? null;

    const ejecutar = async (
        accion: (id: string) => Promise<CronogramaDetalle>,
        mensajeError: string,
    ) => {
        if (!id) return null;
        setGuardando(true);
        try {
            const actualizado = await accion(id);
            setResultado({ id, detalle: actualizado, error: null });
            return actualizado;
        } catch {
            setResultado((prev) =>
                prev && prev.id === id ? { ...prev, error: mensajeError } : prev,
            );
            return null;
        } finally {
            setGuardando(false);
        }
    };

    const generar = (empleadoId: string) =>
        ejecutar((pid) => cronogramaService.generar(pid, empleadoId), "No se pudo generar el cronograma");

    const eliminar = () =>
        ejecutar(cronogramaService.eliminar, "No se pudo eliminar el cronograma");

    return { detalle, cargando, guardando, error, generar, eliminar };
}