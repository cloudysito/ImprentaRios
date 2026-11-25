import { actividadService } from "./actividadService";
import { pedidosService } from "./pedidosService";
import { mantenimientoService } from "./mantenimientoService";
import { tallerService } from "./tallerService";
import { mensajeDeError } from "../utils/errores";
import type { ActividadResponse } from "../types/actividad";
import type { MaquinaResumen } from "../types/mantenimiento";
import type { PedidoResumen } from "../types/pedido";
import type { Asignacion } from "../types/taller";

export interface DatosConsulta {
    actividades: ActividadResponse[];
    pedidos: PedidoResumen[];
    maquinas: MaquinaResumen[];
    asignaciones: Asignacion[];
}

const lista = <T>(valor: T[] | undefined): T[] => (Array.isArray(valor) ? valor : []);

/**
 * Junta lo que necesitan las dos pantallas de consulta.
 * Actividades y pedidos son obligatorios: si fallan, se lanza un Error con el mensaje para la pantalla.
 * Máquinas y asignaciones son opcionales: si el rol no tiene permiso (403) simplemente no aparecen.
 */
export const consultaDatosService = {
    cargar: async (incluirAsignaciones: boolean): Promise<DatosConsulta> => {
        const [actividades, pedidos, maquinas, asignaciones] = await Promise.allSettled([
            actividadService.listar(),
            pedidosService.listar(),
            mantenimientoService.listar(),
            incluirAsignaciones ? tallerService.misAsignaciones() : Promise.resolve<Asignacion[]>([]),
        ]);

        if (actividades.status === "rejected") {
            throw new Error(mensajeDeError(actividades.reason, "No se pudieron cargar las actividades"));
        }
        if (pedidos.status === "rejected") {
            throw new Error(mensajeDeError(pedidos.reason, "No se pudieron cargar los pedidos"));
        }

        return {
            actividades: lista(actividades.value),
            pedidos: lista(pedidos.value),
            maquinas: maquinas.status === "fulfilled" ? lista(maquinas.value) : [],
            asignaciones: asignaciones.status === "fulfilled" ? lista(asignaciones.value) : [],
        };
    },
};
