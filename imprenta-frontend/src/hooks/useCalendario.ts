import { useEffect, useMemo, useState } from "react";
import { actividadService } from "../services/actividadService";
import type { ActividadResponse } from "../types/actividad";

export function useCalendario() {
    const [actividades, setActividades] = useState<ActividadResponse[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtroProduccion, setFiltroProduccion] = useState(true);
    const [filtroEntregas, setFiltroEntregas] = useState(true);
    const [filtroMantenimiento, setFiltroMantenimiento] = useState(true);

    useEffect(() => {
        let cancelado = false;
        actividadService
            .listar()
            .then((data) => {
                if (!cancelado) setActividades(data);
            })
            .catch(() => {
                if (!cancelado) setError("No se pudieron cargar las actividades");
            })
            .finally(() => {
                if (!cancelado) setCargando(false);
            });
        return () => {
            cancelado = true;
        };
    }, []);

    const actividadesVisibles = useMemo(() => {
        return actividades.filter((act) => {
            const nombre = act.nombreActividad.toLowerCase();
            const esMantenimiento = nombre.includes("mantenimiento");
            const esEntrega = nombre.includes("entrega");
            const esProduccion = !esMantenimiento && !esEntrega;

            if (esProduccion && !filtroProduccion) return false;
            if (esEntrega && !filtroEntregas) return false;
            if (esMantenimiento && !filtroMantenimiento) return false;

            return true;
        });
    }, [actividades, filtroProduccion, filtroEntregas, filtroMantenimiento]);

    return {
        actividadesVisibles,
        cargando,
        error,
        filtroProduccion,
        setFiltroProduccion,
        filtroEntregas,
        setFiltroEntregas,
        filtroMantenimiento,
        setFiltroMantenimiento,
    };
}