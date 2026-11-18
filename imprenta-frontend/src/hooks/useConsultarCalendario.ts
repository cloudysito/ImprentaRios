import { useMemo, useState } from "react";
import { useDatosConsulta } from "./useDatosConsulta";
import { aFecha, diaMes } from "../utils/fechas";
import { formatNumero } from "../utils/formato";
import { construirEventos, tipoDeActividad } from "../utils/consulta";
import {
    cubreDia,
    etiquetaHoras,
    etiquetaRango,
    folioCorto,
    hoyInicio,
    lunesDeLaSemana,
    mismoDia,
    rangoDeDias,
    sumarDias,
} from "../utils/calendario";
import type {
    ColumnaDia,
    EntregaProxima,
    FiltrosCalendario,
    TareaHoy,
    TipoEvento,
    VistaCalendario,
} from "../types/consulta";

const MAX_PROXIMAS_ENTREGAS = 4;

export function useConsultarCalendario() {
    const { actividades, pedidos, maquinas, asignaciones, cargando, error } = useDatosConsulta(true);

    const hoy = useMemo(() => hoyInicio(), []);
    const [vista, setVista] = useState<VistaCalendario>("SEMANA");
    const [ancla, setAncla] = useState<Date>(hoy);
    const [filtros, setFiltros] = useState<FiltrosCalendario>({
        PRODUCCION: true,
        ENTREGA: true,
        MANTENIMIENTO: true,
    });

    const eventos = useMemo(
        () => construirEventos(actividades, pedidos, maquinas),
        [actividades, pedidos, maquinas],
    );

    // Semana de lunes a sábado, o un solo día
    const dias = useMemo(
        () => (vista === "SEMANA" ? rangoDeDias(lunesDeLaSemana(ancla), 6) : [ancla]),
        [vista, ancla],
    );

    const columnas = useMemo<ColumnaDia[]>(
        () =>
            dias.map((dia) => ({
                dia,
                esHoy: mismoDia(dia, hoy),
                eventos: eventos.filter((e) => filtros[e.tipo] && cubreDia(e.inicio, e.fin, dia)),
            })),
        [dias, eventos, filtros, hoy],
    );

    const tareasHoy = useMemo<TareaHoy[]>(
        () =>
            asignaciones
                .filter((a) => cubreDia(aFecha(a.fechaHoraInicio), aFecha(a.fechaHoraFin), hoy))
                .map((a) => ({
                    id: a.actividadId,
                    titulo: `${a.nombreActividad} ${a.folio}`,
                    detalle: `${etiquetaHoras(aFecha(a.fechaHoraInicio), aFecha(a.fechaHoraFin))} · ${a.producto} · ${formatNumero(a.piezas)} piezas`,
                    tipo: tipoDeActividad(a.nombreActividad),
                })),
        [asignaciones, hoy],
    );

    const proximasEntregas = useMemo<EntregaProxima[]>(
        () =>
            pedidos
                .filter((p) => p.estado !== "ENTREGADO" && p.estado !== "CANCELADO")
                .filter((p) => aFecha(p.fechaEntrega).getTime() >= hoy.getTime())
                .sort((a, b) => aFecha(a.fechaEntrega).getTime() - aFecha(b.fechaEntrega).getTime())
                .slice(0, MAX_PROXIMAS_ENTREGAS)
                .map((p) => ({
                    id: p.id,
                    folio: p.folio,
                    cliente: p.clienteNombre,
                    fecha: diaMes(p.fechaEntrega),
                })),
        [pedidos, hoy],
    );

    const navegar = (direccion: -1 | 1) =>
        setAncla((prev) => sumarDias(prev, direccion * (vista === "SEMANA" ? 7 : 1)));

    const cambiarFiltro = (tipo: TipoEvento, valor: boolean) =>
        setFiltros((prev) => ({ ...prev, [tipo]: valor }));

    return {
        vista,
        setVista,
        etiquetaPeriodo: etiquetaRango(dias),
        navegar,
        filtros,
        cambiarFiltro,
        columnas,
        tareasHoy,
        proximasEntregas,
        cargando,
        error,
        folioCorto,
    };
}
