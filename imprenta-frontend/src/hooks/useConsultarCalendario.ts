import { useEffect, useMemo, useState } from "react";
import { calendarioConsultaService as servicio } from "../services/calendarioConsultaService";
import type { DatosConsulta } from "../services/consultaDatosService";
import type { FiltrosCalendario, TipoEvento, VistaCalendario } from "../types/consulta";

const SIN_DATOS: DatosConsulta = { actividades: [], pedidos: [], maquinas: [], asignaciones: [] };

/**
 * Estado de la pantalla "Consultar calendario".
 * Aquí solo vive el estado de React; las reglas (eventos, columnas, tareas, entregas) las resuelve el servicio.
 */
export function useConsultarCalendario() {
    const [datos, setDatos] = useState<DatosConsulta>(SIN_DATOS);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const hoy = useMemo(() => servicio.hoy(), []);
    const [vista, setVista] = useState<VistaCalendario>("SEMANA");
    const [ancla, setAncla] = useState<Date>(hoy);
    const [filtros, setFiltros] = useState<FiltrosCalendario>(servicio.filtrosIniciales);

    useEffect(() => {
        let cancelado = false;
        servicio
            .cargarDatos()
            .then((cargados) => {
                if (!cancelado) setDatos(cargados);
            })
            .catch((err: unknown) => {
                if (!cancelado) setError(err instanceof Error ? err.message : "No se pudo cargar el calendario");
            })
            .finally(() => {
                if (!cancelado) setCargando(false);
            });
        return () => {
            cancelado = true;
        };
    }, []);

    const eventos = useMemo(() => servicio.construirEventos(datos), [datos]);
    const dias = useMemo(() => servicio.diasDeLaVista(vista, ancla), [vista, ancla]);
    const columnas = useMemo(
        () => servicio.columnas(dias, eventos, filtros, hoy, vista, ancla),
        [dias, eventos, filtros, hoy, vista, ancla],
    );
    const tareasHoy = useMemo(() => servicio.tareasDeHoy(datos.asignaciones, hoy), [datos.asignaciones, hoy]);
    const proximasEntregas = useMemo(() => servicio.proximasEntregas(datos.pedidos, hoy), [datos.pedidos, hoy]);
    const entregasVencidas = useMemo(() => servicio.entregasVencidas(datos.pedidos), [datos.pedidos]);
    const totalVencidas = useMemo(() => servicio.totalVencidas(datos.pedidos), [datos.pedidos]);

    const navegar = (direccion: -1 | 1) => setAncla((prev) => servicio.moverAncla(prev, vista, direccion, hoy));

    // Desde la vista mensual, un día lleva a su vista de día
    const seleccionarDia = (dia: Date) => {
        setAncla(dia);
        setVista("DIA");
    };

    const cambiarFiltro = (tipo: TipoEvento, valor: boolean) =>
        setFiltros((prev) => ({ ...prev, [tipo]: valor }));

    return {
        vista,
        setVista,
        etiquetaPeriodo: servicio.etiquetaPeriodo(dias, vista, ancla),
        navegar,
        seleccionarDia,
        filtros,
        cambiarFiltro,
        columnas,
        tareasHoy,
        proximasEntregas,
        entregasVencidas,
        totalVencidas,
        cargando,
        error,
        folioCorto: servicio.folioCorto,
    };
}
