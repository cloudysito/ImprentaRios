import { useEffect, useMemo, useState } from "react";
import { cronogramaConsultaService as servicio } from "../services/cronogramaConsultaService";
import type { DatosConsulta } from "../services/consultaDatosService";
import type { PedidoDetalle } from "../types/pedido";
import type { FilaCronograma, FiltroEstadoBarra, VistaCronograma } from "../types/consulta";

interface ResultadoDetalle {
    id: string;
    detalle: PedidoDetalle | null;
    error: string | null;
}

const SIN_DATOS: DatosConsulta = { actividades: [], pedidos: [], maquinas: [], asignaciones: [] };

/**
 * Estado de la pantalla "Consultar cronograma".
 * Aquí solo vive el estado de React; las reglas (rango, filas, filtros, resumen, exportar) las resuelve el servicio.
 */
export function useConsultarCronograma() {
    const [datos, setDatos] = useState<DatosConsulta>(SIN_DATOS);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const hoy = useMemo(() => servicio.hoy(), []);
    const [vista, setVistaInterna] = useState<VistaCronograma>("DIEZ_DIAS");
    const [rango, setRango] = useState(() => servicio.rangoDeVista("DIEZ_DIAS", hoy));
    const [estado, setEstado] = useState<FiltroEstadoBarra>("TODOS");
    const [idElegido, setIdElegido] = useState<string | null>(null);
    // Último detalle pedido. "Cargando" se deduce: hay fila elegida y todavía no llega su respuesta
    const [resultadoDetalle, setResultadoDetalle] = useState<ResultadoDetalle | null>(null);
    const [intentoCargaDetalle, setIntentoCargaDetalle] = useState(0);

    useEffect(() => {
        let cancelado = false;
        servicio
            .cargarDatos()
            .then((cargados) => {
                if (!cancelado) setDatos(cargados);
            })
            .catch((err: unknown) => {
                if (!cancelado) setError(err instanceof Error ? err.message : "No se pudo cargar el cronograma");
            })
            .finally(() => {
                if (!cancelado) setCargando(false);
            });
        return () => {
            cancelado = true;
        };
    }, []);

    const setVista = (nueva: VistaCronograma) => {
        setVistaInterna(nueva);
        setRango(servicio.rangoDeVista(nueva, hoy));
    };
    const setDesde = (desde: string) => setRango((prev) => ({ ...prev, desde }));
    const setHasta = (hasta: string) => setRango((prev) => ({ ...prev, hasta }));

    const { dias, rangoInvalido } = useMemo(
        () => servicio.calcularDias(rango.desde, rango.hasta),
        [rango.desde, rango.hasta],
    );

    const todas = useMemo(() => servicio.construirFilas(datos), [datos]);
    const delPeriodo = useMemo(() => servicio.filasDelPeriodo(todas, dias), [todas, dias]);
    const filtradas = useMemo(() => servicio.filtrarPorEstado(delPeriodo, estado), [delPeriodo, estado]);
    const resumen = useMemo(() => servicio.calcularResumen(delPeriodo, datos.pedidos, hoy), [delPeriodo, datos.pedidos, hoy]);
    const seleccionadoId = servicio.elegirSeleccion(filtradas, idElegido);

    useEffect(() => {
        if (!seleccionadoId) return;
        let cancelado = false;
        servicio
            .obtenerDetalle(seleccionadoId)
            .then((d) => {
                if (!cancelado) setResultadoDetalle({ id: seleccionadoId, detalle: d, error: null });
            })
            .catch((err: unknown) => {
                if (!cancelado) {
                    const mensaje = err instanceof Error ? err.message : "No se pudo cargar el detalle del pedido";
                    setResultadoDetalle({ id: seleccionadoId, detalle: null, error: mensaje });
                }
            });
        return () => {
            cancelado = true;
        };
    }, [seleccionadoId, intentoCargaDetalle]);

    // Vuelve a pedir el detalle de la fila elegida
    const reintentarDetalle = () => {
        setResultadoDetalle(null);
        setIntentoCargaDetalle((intento) => intento + 1);
    };

    // Sin fila elegida, o con un detalle que todavía es de otra fila, no hay detalle que mostrar
    const detalleVisible = resultadoDetalle && resultadoDetalle.id === seleccionadoId ? resultadoDetalle.detalle : null;
    const cargandoDetalle = seleccionadoId !== null && resultadoDetalle?.id !== seleccionadoId;
    const errorDetalle = resultadoDetalle && resultadoDetalle.id === seleccionadoId ? resultadoDetalle.error : null;

    const filas = useMemo(
        () => servicio.conAvance(filtradas, seleccionadoId, detalleVisible),
        [filtradas, seleccionadoId, detalleVisible],
    );

    const seleccionar = (fila: FilaCronograma) => {
        if (fila.pedidoId) setIdElegido(fila.id);
    };

    const exportar = () => servicio.exportarCsv(filtradas, rango.desde, rango.hasta);

    return {
        vista,
        setVista,
        desde: rango.desde,
        setDesde,
        hasta: rango.hasta,
        setHasta,
        estado,
        setEstado,
        dias,
        hoy,
        filas,
        resumen,
        seleccionadoId,
        seleccionar,
        detalle: detalleVisible,
        cargandoDetalle,
        errorDetalle,
        reintentarDetalle,
        exportar,
        rangoInvalido,
        cargando,
        error,
    };
}
