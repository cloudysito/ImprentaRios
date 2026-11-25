import { useEffect, useMemo, useState } from "react";
import { actividadService } from "../services/actividadService";
import type { ActividadResponse } from "../types/actividad";
import { finDeActividad, tipoDeActividad } from "../utils/consulta";
import { aFecha } from "../utils/fechas";
import {
    cubreDia,
    etiquetaRango,
    hoyInicio,
    lunesDeLaSemana,
    rangoDeDias,
    sumarDias,
} from "../utils/calendario";

export type VistaCalendarioGenerar = "DIA" | "SEMANA";

export function useCalendario() {
    const [actividades, setActividades] = useState<ActividadResponse[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtroProduccion, setFiltroProduccion] = useState(true);
    const [filtroEntregas, setFiltroEntregas] = useState(true);
    const [filtroMantenimiento, setFiltroMantenimiento] = useState(true);
    const hoy = useMemo(() => hoyInicio(), []);
    const [vista, setVista] = useState<VistaCalendarioGenerar>("SEMANA");
    const [ancla, setAncla] = useState<Date>(hoy);

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

    // Semana de lunes a sábado (igual que en consultar) o un solo día
    const dias = useMemo(
        () => (vista === "SEMANA" ? rangoDeDias(lunesDeLaSemana(ancla), 6) : [ancla]),
        [vista, ancla],
    );

    const actividadesVisibles = useMemo(() => {
        return actividades
            .filter((act) => {
                const tipo = tipoDeActividad(act.nombreActividad);
                if (tipo === "PRODUCCION" && !filtroProduccion) return false;
                if (tipo === "ENTREGA" && !filtroEntregas) return false;
                if (tipo === "MANTENIMIENTO" && !filtroMantenimiento) return false;
                return true;
            })
            .filter((act) => {
                const inicio = aFecha(act.fechaHoraInicio);
                const fin = aFecha(finDeActividad(act));
                // Una actividad de varios días aparece en cada día que cubre
                return dias.some((dia) => cubreDia(inicio, fin, dia));
            })
            .sort((a, b) => aFecha(a.fechaHoraInicio).getTime() - aFecha(b.fechaHoraInicio).getTime());
    }, [actividades, filtroProduccion, filtroEntregas, filtroMantenimiento, dias]);

    const navegar = (direccion: -1 | 1) =>
        setAncla((prev) => sumarDias(prev, direccion * (vista === "SEMANA" ? 7 : 1)));

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
        vista,
        setVista,
        etiquetaPeriodo: etiquetaRango(dias),
        navegar,
    };
}
