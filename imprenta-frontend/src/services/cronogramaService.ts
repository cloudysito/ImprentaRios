import { api } from "./api";
import { pedidosService } from "./pedidosService";
import { calcularEtapas } from "../utils/calcularEtapas";
import type { PedidoDetalle, PedidoResumen } from "../types/pedido";
import type {
    Actividad,
    ActividadRequest,
    CronogramaDetalle,
    CronogramaResumen,
} from "../types/cronograma";

const listarActividades = async (pedidoId?: string) => {
    const { data } = await api.get<Actividad[]>("/actividad", {
        params: pedidoId ? { pedidoId } : undefined,
    });
    return data;
};

const crearActividad = async (dto: ActividadRequest) => {
    const { data } = await api.post<Actividad>("/actividad", dto);
    return data;
};

const eliminarActividad = async (id: string) => {
    await api.delete(`/actividad/${id}`);
};

const armarDetalle = (pedido: PedidoDetalle, actividades: Actividad[]): CronogramaDetalle => ({
    ...pedido,
    actividades,
    estadoCronograma: actividades.length > 0 ? "GENERADO" : "SIN_GENERAR",
});

export const cronogramaService = {
    // Pedidos y saber cuáles ya tienen actividades
    listar: async (): Promise<CronogramaResumen[]> => {
        const [pedidos, actividades]: [PedidoResumen[], Actividad[]] = await Promise.all([
            pedidosService.listar(),
            listarActividades(),
        ]);
        const conCronograma = new Set(actividades.map((a) => a.pedidoId));
        return pedidos.map((p) => ({
            ...p,
            estadoCronograma: conCronograma.has(p.id) ? "GENERADO" : "SIN_GENERAR",
        }));
    },

    obtener: async (id: string): Promise<CronogramaDetalle> => {
        const [pedido, actividades]: [PedidoDetalle, Actividad[]] = await Promise.all([
            pedidosService.obtener(id),
            listarActividades(id),
        ]);
        return armarDetalle(pedido, actividades);
    },

    // Borra lo anterior (si es que había algo) y crea una actividad por etapa
    generar: async (id: string, empleadoId: string): Promise<CronogramaDetalle> => {
        const idEmpleado = empleadoId.trim();
        if (!idEmpleado) throw new Error("Falta el empleado");

        const pedido = await pedidosService.obtener(id);

        const previas = await listarActividades(id);
        for (const a of previas) await eliminarActividad(a.id);

        const creadas: Actividad[] = [];
        for (const etapa of calcularEtapas(pedido.fechaEntrega)) {
            creadas.push(
                await crearActividad({
                    nombreActividad: etapa.nombre,
                    descripcion: `${etapa.nombre} del folio ${pedido.folio}`,
                    fechaHoraInicio: etapa.fechaHoraInicio,
                    fechaHoraFin: etapa.fechaHoraFin,
                    pedidoId: id,
                    empleadoId: idEmpleado,
                }),
            );
        }
        return armarDetalle(pedido, creadas);
    },

    // Borra todas las actividades del pedido
    eliminar: async (id: string): Promise<CronogramaDetalle> => {
        const [pedido, actividades]: [PedidoDetalle, Actividad[]] = await Promise.all([
            pedidosService.obtener(id),
            listarActividades(id),
        ]);
        for (const a of actividades) await eliminarActividad(a.id);
        return armarDetalle(pedido, []);
    },
};