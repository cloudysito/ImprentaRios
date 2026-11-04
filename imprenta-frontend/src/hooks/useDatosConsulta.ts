import { useEffect, useState } from "react";
import { actividadService } from "../services/actividadService";
import { pedidosService } from "../services/pedidosService";
import { mantenimientoService } from "../services/mantenimientoService";
import { tallerService } from "../services/tallerService";
import { mensajeDeError } from "../utils/errores";
import type { ActividadResponse } from "../types/actividad";
import type { MaquinaResumen } from "../types/mantenimiento";
import type { PedidoResumen } from "../types/pedido";
import type { Asignacion } from "../types/taller";

interface DatosConsulta {
    actividades: ActividadResponse[];
    pedidos: PedidoResumen[];
    maquinas: MaquinaResumen[];
    asignaciones: Asignacion[];
}

const VACIO: DatosConsulta = { actividades: [], pedidos: [], maquinas: [], asignaciones: [] };

/**
 * Carga lo que necesitan las dos pantallas de consulta.
 * Actividades y pedidos son obligatorios. Máquinas y asignaciones son opcionales:
 * si el rol no tiene permiso (403) simplemente no aparecen.
 */
export function useDatosConsulta(incluirAsignaciones = false) {
    const [datos, setDatos] = useState<DatosConsulta>(VACIO);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelado = false;

        Promise.allSettled([
            actividadService.listar(),
            pedidosService.listar(),
            mantenimientoService.listar(),
            incluirAsignaciones ? tallerService.misAsignaciones() : Promise.resolve<Asignacion[]>([]),
        ])
            .then(([actividades, pedidos, maquinas, asignaciones]) => {
                if (cancelado) return;
                if (actividades.status === "rejected") {
                    setError(mensajeDeError(actividades.reason, "No se pudieron cargar las actividades"));
                } else if (pedidos.status === "rejected") {
                    setError(mensajeDeError(pedidos.reason, "No se pudieron cargar los pedidos"));
                } else {
                    setDatos({
                        actividades: actividades.value,
                        pedidos: pedidos.value,
                        maquinas: maquinas.status === "fulfilled" ? maquinas.value : [],
                        asignaciones: asignaciones.status === "fulfilled" ? asignaciones.value : [],
                    });
                }
            })
            .finally(() => {
                if (!cancelado) setCargando(false);
            });

        return () => {
            cancelado = true;
        };
    }, [incluirAsignaciones]);

    return { ...datos, cargando, error };
}
