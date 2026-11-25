import { consultaDatosService, type DatosConsulta } from "./consultaDatosService";
import { pedidosService } from "./pedidosService";
import { aFecha } from "../utils/fechas";
import { mensajeDeError } from "../utils/errores";
import { construirFilas } from "../utils/consulta";
import { descargarCsv } from "../utils/exportarCsv";
import {
    aInputFecha,
    cubreDia,
    desdeInputFecha,
    diasEntre,
    hoyInicio,
    lunesDeLaSemana,
    primerDiaDelMes,
    rangoDeDias,
    sumarDias,
    ultimoDiaDelMes,
} from "../utils/calendario";
import type { PedidoDetalle, PedidoResumen } from "../types/pedido";
import type {
    FilaCronograma,
    FiltroEstadoBarra,
    ResumenDelPeriodo,
    VistaCronograma,
} from "../types/consulta";

const MAX_DIAS = 62;

export interface RangoCronograma {
    desde: string; // formato de <input type="date">
    hasta: string;
}

/**
 * Reglas de la pantalla "Consultar cronograma".
 * El hook solo guarda el estado de la pantalla (vista, fechas, filtro, fila elegida) y le pide todo lo demás a este servicio.
 */
export const cronogramaConsultaService = {
    // ---------- datos ----------
    cargarDatos: (): Promise<DatosConsulta> => consultaDatosService.cargar(false),

    // Si falla, lanza un Error con un mensaje listo para mostrar en pantalla
    obtenerDetalle: async (pedidoId: string): Promise<PedidoDetalle> => {
        try {
            return await pedidosService.obtener(pedidoId);
        } catch (err) {
            throw new Error(mensajeDeError(err, "No se pudo cargar el detalle del pedido"));
        }
    },

    // ---------- rango de fechas ----------
    hoy: (): Date => hoyInicio(),

    // 10 días desde hoy, o el mes completo
    rangoDeVista: (vista: VistaCronograma, hoy: Date): RangoCronograma =>
        vista === "DIEZ_DIAS"
            ? { desde: aInputFecha(hoy), hasta: aInputFecha(sumarDias(hoy, 9)) }
            : { desde: aInputFecha(primerDiaDelMes(hoy)), hasta: aInputFecha(ultimoDiaDelMes(hoy)) },

    // Columnas del diagrama. Con un rango inválido no hay columnas
    calcularDias: (desde: string, hasta: string): { dias: Date[]; rangoInvalido: boolean } => {
        const inicio = desdeInputFecha(desde);
        const fin = desdeInputFecha(hasta);
        if (!inicio || !fin || diasEntre(inicio, fin) < 0) {
            return { dias: [], rangoInvalido: true };
        }
        return { dias: rangoDeDias(inicio, Math.min(diasEntre(inicio, fin) + 1, MAX_DIAS)), rangoInvalido: false };
    },

    // ---------- armado de lo que se muestra ----------
    construirFilas: (datos: Pick<DatosConsulta, "actividades" | "pedidos" | "maquinas">): FilaCronograma[] =>
        construirFilas(datos.actividades, datos.pedidos, datos.maquinas),

    // Filas que tocan el periodo elegido (sin aplicar el filtro de estatus)
    filasDelPeriodo: (todas: FilaCronograma[], dias: Date[]): FilaCronograma[] => {
        if (dias.length === 0) return [];
        const primero = dias[0];
        const ultimo = dias[dias.length - 1];
        return todas.filter((f) => diasEntre(f.inicio, ultimo) >= 0 && diasEntre(primero, f.fin) >= 0);
    },

    filtrarPorEstado: (filas: FilaCronograma[], estado: FiltroEstadoBarra): FilaCronograma[] =>
        estado === "TODOS" ? filas : filas.filter((f) => f.estado === estado),

    calcularResumen: (delPeriodo: FilaCronograma[], pedidos: PedidoResumen[], hoy: Date): ResumenDelPeriodo => {
        const soloPedidos = delPeriodo.filter((f) => f.pedidoId !== null);
        const lunes = lunesDeLaSemana(hoy);
        const domingo = sumarDias(lunes, 6);
        return {
            pedidosActivos: soloPedidos.filter((f) => f.estado !== "TERMINADO").length,
            enProduccion: soloPedidos.filter((f) => f.estado === "PRODUCCION").length,
            enDiseno: soloPedidos.filter((f) => f.estado === "DISENO").length,
            entregasSemana: pedidos.filter(
                (p) => p.estado !== "CANCELADO" && cubreDia(lunes, domingo, aFecha(p.fechaEntrega)),
            ).length,
            paros: delPeriodo.filter((f) => f.estado === "PARO").length,
            vencidos: soloPedidos.filter((f) => (f.diasAtraso ?? 0) > 0).length,
        };
    },

    // Si nadie eligió fila se toma la primera de pedido
    elegirSeleccion: (filtradas: FilaCronograma[], idElegido: string | null): string | null =>
        (idElegido && filtradas.some((f) => f.id === idElegido) ? idElegido : null) ??
        filtradas.find((f) => f.pedidoId !== null)?.id ??
        null,

    // La fila seleccionada en producción muestra su avance: "En producción · 62 %"
    conAvance: (
        filtradas: FilaCronograma[],
        seleccionadoId: string | null,
        detalle: PedidoDetalle | null,
    ): FilaCronograma[] =>
        filtradas.map((f) =>
            f.id === seleccionadoId && detalle && detalle.id === f.id && f.estado === "PRODUCCION" && detalle.piezas > 0
                ? { ...f, etiqueta: `${f.etiqueta} · ${Math.round((detalle.piezasTerminadas / detalle.piezas) * 100)} %` }
                : f,
        ),

    // ---------- exportar ----------
    exportarCsv: (filas: FilaCronograma[], desde: string, hasta: string): void => {
        const fecha = (f: Date) => aInputFecha(f);
        descargarCsv(`cronograma_${desde}_${hasta}.csv`, [
            ["Folio / Equipo", "Descripción", "Encargado", "Estatus", "Atraso (días)", "Inicio", "Fin"],
            ...filas.map((f) => [
                f.titulo,
                f.subtitulo,
                f.responsable ?? "",
                f.etiqueta,
                String(f.diasAtraso ?? 0),
                fecha(f.inicio),
                fecha(f.fin),
            ]),
        ]);
    },
};
