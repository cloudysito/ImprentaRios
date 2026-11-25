import { consultaDatosService, type DatosConsulta } from "./consultaDatosService";
import { aFecha, diaMes } from "../utils/fechas";
import { formatNumero } from "../utils/formato";
import { construirEventos, tipoDeActividad } from "../utils/consulta";
import {
    cubreDia,
    diasDelMes,
    etiquetaHoras,
    etiquetaMes,
    etiquetaRango,
    folioCorto,
    hoyInicio,
    lunesDeLaSemana,
    mismoDia,
    rangoDeDias,
    sumarDias,
    sumarMeses,
} from "../utils/calendario";
import type { PedidoResumen } from "../types/pedido";
import type { Asignacion } from "../types/taller";
import type {
    ColumnaDia,
    EntregaProxima,
    EntregaVencida,
    EventoCalendario,
    FiltrosCalendario,
    TareaHoy,
    VistaCalendario,
} from "../types/consulta";

const MAX_PROXIMAS_ENTREGAS = 4;
const MAX_ENTREGAS_VENCIDAS = 5;

const conFecha = (p: PedidoResumen) => p && typeof p.fechaEntrega === "string";

/**
 * Reglas de la pantalla "Consultar calendario".
 * El hook solo guarda el estado de la pantalla (vista, día elegido, filtros) y le pide todo lo demás a este servicio.
 */
export const calendarioConsultaService = {
    // ---------- datos ----------
    cargarDatos: (): Promise<DatosConsulta> => consultaDatosService.cargar(true),

    // ---------- estado inicial y navegación ----------
    hoy: (): Date => hoyInicio(),

    filtrosIniciales: (): FiltrosCalendario => ({ PRODUCCION: true, ENTREGA: true, MANTENIMIENTO: true }),

    // Mes completo, semana de lunes a sábado, o un solo día
    diasDeLaVista: (vista: VistaCalendario, ancla: Date): Date[] => {
        if (vista === "MES") return diasDelMes(ancla);
        return vista === "SEMANA" ? rangoDeDias(lunesDeLaSemana(ancla), 6) : [ancla];
    },

    // En la vista mensual, al volver al mes actual el ancla regresa a hoy
    moverAncla: (ancla: Date, vista: VistaCalendario, direccion: -1 | 1, hoy: Date): Date => {
        if (vista === "MES") {
            const siguiente = sumarMeses(ancla, direccion);
            return siguiente.getFullYear() === hoy.getFullYear() && siguiente.getMonth() === hoy.getMonth()
                ? hoy
                : siguiente;
        }
        return sumarDias(ancla, direccion * (vista === "SEMANA" ? 7 : 1));
    },

    etiquetaPeriodo: (dias: Date[], vista: VistaCalendario, ancla: Date): string =>
        vista === "MES" ? etiquetaMes(ancla) : etiquetaRango(dias),

    folioCorto: (folio: string): string => folioCorto(folio),

    // ---------- armado de lo que se muestra ----------
    construirEventos: (datos: Pick<DatosConsulta, "actividades" | "pedidos" | "maquinas">): EventoCalendario[] =>
        construirEventos(datos.actividades, datos.pedidos, datos.maquinas),

    columnas: (
        dias: Date[],
        eventos: EventoCalendario[],
        filtros: FiltrosCalendario,
        hoy: Date,
        vista: VistaCalendario,
        ancla: Date,
    ): ColumnaDia[] =>
        dias.map((dia) => ({
            dia,
            esHoy: mismoDia(dia, hoy),
            fueraDeMes: vista === "MES" && dia.getMonth() !== ancla.getMonth(),
            eventos: eventos.filter((e) => filtros[e.tipo] && cubreDia(e.inicio, e.fin, dia)),
        })),

    tareasDeHoy: (asignaciones: Asignacion[], hoy: Date): TareaHoy[] =>
        asignaciones
            .filter((a) => cubreDia(aFecha(a.fechaHoraInicio), aFecha(a.fechaHoraFin), hoy))
            .map((a) => ({
                id: a.actividadId,
                titulo: `${a.nombreActividad} ${a.folio}`,
                detalle: `${etiquetaHoras(aFecha(a.fechaHoraInicio), aFecha(a.fechaHoraFin))} · ${a.producto} · ${formatNumero(a.piezas)} piezas`,
                tipo: tipoDeActividad(a.nombreActividad),
            })),

    proximasEntregas: (pedidos: PedidoResumen[], hoy: Date): EntregaProxima[] =>
        pedidos
            .filter(conFecha)
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

    // Alerta de atraso: pedidos con la entrega pasada que siguen sin terminar. El más atrasado primero
    entregasVencidas: (pedidos: PedidoResumen[]): EntregaVencida[] =>
        pedidos
            .filter((p) => p && p.vencido === true)
            .sort((a, b) => b.diasAtraso - a.diasAtraso)
            .slice(0, MAX_ENTREGAS_VENCIDAS)
            .map((p) => ({ id: p.id, folio: p.folio, cliente: p.clienteNombre, diasAtraso: p.diasAtraso })),

    totalVencidas: (pedidos: PedidoResumen[]): number => pedidos.filter((p) => p && p.vencido === true).length,
};
