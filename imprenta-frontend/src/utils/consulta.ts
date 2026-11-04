import type { ActividadResponse } from "../types/actividad";
import type { MaquinaResumen } from "../types/mantenimiento";
import { ESTADO_LABEL, type EstadoPedido, type PedidoResumen } from "../types/pedido";
import type { EstadoBarra, EventoCalendario, FilaCronograma, TipoEvento } from "../types/consulta";
import { aFecha } from "./fechas";
import { folioCorto, inicioDeDia, sumarDias } from "./calendario";

// El backend manda "fechaHoraFina" (typo en ActividadResponeDTO). Se acepta también "fechaHoraFin"
export const finDeActividad = (a: ActividadResponse) =>
    (a as ActividadResponse & { fechaHoraFin?: string }).fechaHoraFin ?? a.fechaHoraFina ?? a.fechaHoraInicio;

export const tipoDeActividad = (nombre: string): TipoEvento => {
    const n = nombre.toLowerCase();
    if (n.includes("mantenimiento")) return "MANTENIMIENTO";
    if (n.includes("entrega")) return "ENTREGA";
    return "PRODUCCION";
};

// ---------- Calendario ----------
export function construirEventos(
    actividades: ActividadResponse[],
    pedidos: PedidoResumen[],
    maquinas: MaquinaResumen[],
): EventoCalendario[] {
    const folios = new Map(pedidos.map((p) => [p.id, p.folio]));

    const deActividades = actividades.map<EventoCalendario>((a) => ({
        id: a.id,
        tipo: tipoDeActividad(a.nombreActividad),
        titulo: a.nombreActividad,
        referencia: folioCorto(folios.get(a.pedidoId) ?? "Sin folio"),
        inicio: aFecha(a.fechaHoraInicio),
        fin: aFecha(finDeActividad(a)),
    }));

    const deMantenimiento = maquinas
        .filter((m) => m.servicioProgramado && m.proximoServicio)
        .map<EventoCalendario>((m) => {
            const fecha = aFecha(m.proximoServicio as string);
            return {
                id: `maq-${m.id}`,
                tipo: "MANTENIMIENTO",
                titulo: "Mantenimiento",
                referencia: m.nombre,
                inicio: fecha,
                fin: fecha,
            };
        });

    return [...deActividades, ...deMantenimiento].sort((a, b) => a.inicio.getTime() - b.inicio.getTime());
}

// ---------- Cronograma ----------
const estadoDeBarra = (estado: EstadoPedido): EstadoBarra => {
    switch (estado) {
        case "EN_DISENIO":
            return "DISENO";
        case "EN_PRODUCCION":
            return "PRODUCCION";
        case "TERMINADO":
        case "ENTREGADO":
            return "TERMINADO";
        default:
            return "PENDIENTE";
    }
};

export function construirFilas(
    actividades: ActividadResponse[],
    pedidos: PedidoResumen[],
    maquinas: MaquinaResumen[],
): FilaCronograma[] {
    const porPedido = new Map<string, ActividadResponse[]>();
    for (const a of actividades) {
        porPedido.set(a.pedidoId, [...(porPedido.get(a.pedidoId) ?? []), a]);
    }

    const filas: FilaCronograma[] = [];

    for (const p of [...pedidos].sort((a, b) => a.folio.localeCompare(b.folio))) {
        if (p.estado === "CANCELADO") continue;
        const acts = porPedido.get(p.id) ?? [];
        const estado = estadoDeBarra(p.estado);

        if (acts.length > 0) {
            const inicios = acts.map((a) => inicioDeDia(aFecha(a.fechaHoraInicio)).getTime());
            const fines = acts.map((a) => inicioDeDia(aFecha(finDeActividad(a))).getTime());
            filas.push({
                id: p.id,
                pedidoId: p.id,
                titulo: p.folio,
                subtitulo: `${p.producto} · ${p.clienteNombre}`,
                estado,
                etiqueta: ESTADO_LABEL[p.estado],
                inicio: new Date(Math.min(...inicios)),
                fin: new Date(Math.max(...fines)),
            });
        } else if (estado !== "TERMINADO") {
            // Sin cronograma: se dibuja una barra estimada que termina el día de la entrega
            const entrega = inicioDeDia(aFecha(p.fechaEntrega));
            filas.push({
                id: p.id,
                pedidoId: p.id,
                titulo: p.folio,
                subtitulo: `${p.producto} · Sin programar`,
                estado: "ESTIMADO",
                etiqueta: "Estimado",
                inicio: sumarDias(entrega, -1),
                fin: entrega,
            });
        }
    }

    const paros = maquinas
        .filter((m) => m.servicioProgramado && m.proximoServicio)
        .map<FilaCronograma>((m) => {
            const dia = inicioDeDia(aFecha(m.proximoServicio as string));
            return {
                id: `maq-${m.id}`,
                pedidoId: null,
                titulo: m.nombre,
                subtitulo: "Mantenimiento",
                estado: "PARO",
                etiqueta: "Paro",
                inicio: dia,
                fin: dia,
            };
        })
        .sort((a, b) => a.inicio.getTime() - b.inicio.getTime());

    return [...filas, ...paros];
}
