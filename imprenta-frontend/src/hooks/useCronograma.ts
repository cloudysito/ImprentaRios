import { useEffect, useMemo, useState } from "react";
import { cronogramaService } from "../services/cronogramaService";
import type {
    CronogramaResumen,
    EstadoCronograma,
    FiltroCronograma,
} from "../types/cronograma";

export function useCronograma() {
    const [items, setItems] = useState<CronogramaResumen[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [busqueda, setBusqueda] = useState("");
    const [filtro, setFiltro] = useState<FiltroCronograma>("TODOS");
    const [idElegido, setIdElegido] = useState<string | null>(null);

    useEffect(() => {
        let cancelado = false;
        cronogramaService
            .listar()
            .then((data) => {
                if (!cancelado) setItems(data);
            })
            .catch(() => {
                if (!cancelado) setError("No se pudieron cargar los pedidos");
            })
            .finally(() => {
                if (!cancelado) setCargando(false);
            });
        return () => {
            cancelado = true;
        };
    }, []);

    const conteos = useMemo(() => {
        const resultado: Partial<Record<FiltroCronograma, number>> = { TODOS: items.length };
        for (const p of items) {
            resultado[p.estadoCronograma] = (resultado[p.estadoCronograma] ?? 0) + 1;
        }
        return resultado;
    }, [items]);

    const itemsVisibles = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();
        return items.filter((p) => {
            const pasaFiltro = filtro === "TODOS" || p.estadoCronograma === filtro;
            const pasaBusqueda =
                texto === "" ||
                p.folio.toLowerCase().includes(texto) ||
                p.clienteNombre.toLowerCase().includes(texto);
            return pasaFiltro && pasaBusqueda;
        });
    }, [items, busqueda, filtro]);

    const seleccionadoId = idElegido ?? itemsVisibles[0]?.id ?? null;

    const actualizarEstado = (id: string, estadoCronograma: EstadoCronograma) => {
        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, estadoCronograma } : p)));
    };

    return {
        itemsVisibles,
        conteos,
        cargando,
        error,
        busqueda,
        setBusqueda,
        filtro,
        setFiltro,
        seleccionadoId,
        seleccionar: setIdElegido,
        actualizarEstado,
    };
}