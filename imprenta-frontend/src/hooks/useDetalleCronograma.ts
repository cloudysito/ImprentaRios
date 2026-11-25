import { useEffect, useState } from "react";
import { cronogramaService } from "../services/cronogramaService";
import type { CronogramaDetalle } from "../types/cronograma";
import { mensajeDeError } from "../utils/errores";

interface Resultado {
    id: string;
    detalle: CronogramaDetalle | null;
    error: string | null;
}

export function useDetalleCronograma(id: string | null) {
    const [resultado, setResultado] = useState<Resultado | null>(null);
    const [guardando, setGuardando] = useState(false);
    const [intentoCarga, setIntentoCarga] = useState(0);

    useEffect(() => {
        if (!id) return;

        let cancelado = false;
        cronogramaService
            .obtener(id)
            .then((data) => {
                if (!cancelado) setResultado({ id, detalle: data, error: null });
            })
            .catch((err) => {
                if (!cancelado) {
                    setResultado({
                        id,
                        detalle: null,
                        error: mensajeDeError(err, "No se pudo cargar el folio"),
                    });
                }
            });

        return () => {
            cancelado = true;
        };
    }, [id, intentoCarga]);

    const vigente = resultado && resultado.id === id ? resultado : null;
    const cargando = id !== null && vigente === null;
    const detalle = vigente?.detalle ?? null;
    const error = vigente?.error ?? null;
    const reintentar = () => {
        setResultado(null);
        setIntentoCarga((intento) => intento + 1);
    };

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
        } catch (err) {
            setResultado((prev) =>
                prev && prev.id === id
                    ? { ...prev, error: mensajeDeError(err, mensajeError) }
                    : prev,
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

    return { detalle, cargando, guardando, error, generar, eliminar, reintentar };
}