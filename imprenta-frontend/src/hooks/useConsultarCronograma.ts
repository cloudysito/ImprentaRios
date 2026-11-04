import { useEffect, useMemo, useState } from "react";
import { pedidosService } from "../services/pedidosService";
import { useDatosConsulta } from "./useDatosConsulta";
import { aFecha } from "../utils/fechas";
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
import type { PedidoDetalle } from "../types/pedido";
import type {
    FilaCronograma,
    FiltroEstadoBarra,
    ResumenDelPeriodo,
    VistaCronograma,
} from "../types/consulta";

const MAX_DIAS = 62;

export function useConsultarCronograma() {
    const { actividades, pedidos, maquinas, cargando, error } = useDatosConsulta();

    const hoy = useMemo(() => hoyInicio(), []);
    const [vista, setVistaInterna] = useState<VistaCronograma>("DIEZ_DIAS");
    const [desde, setDesde] = useState(() => aInputFecha(hoy));
    const [hasta, setHasta] = useState(() => aInputFecha(sumarDias(hoy, 9)));
    const [estado, setEstado] = useState<FiltroEstadoBarra>("TODOS");
    const [idElegido, setIdElegido] = useState<string | null>(null);
    const [detalle, setDetalle] = useState<PedidoDetalle | null>(null);
    const [cargandoDetalle, setCargandoDetalle] = useState(false);

    const setVista = (nueva: VistaCronograma) => {
        setVistaInterna(nueva);
        if (nueva === "DIEZ_DIAS") {
            setDesde(aInputFecha(hoy));
            setHasta(aInputFecha(sumarDias(hoy, 9)));
        } else {
            setDesde(aInputFecha(primerDiaDelMes(hoy)));
            setHasta(aInputFecha(ultimoDiaDelMes(hoy)));
        }
    };

    // Columnas del diagrama
    const fechaDesde = desdeInputFecha(desde);
    const fechaHasta = desdeInputFecha(hasta);
    const rangoInvalido = !fechaDesde || !fechaHasta || diasEntre(fechaDesde, fechaHasta) < 0;
    const dias = useMemo(
        () =>
            rangoInvalido
                ? []
                : rangoDeDias(fechaDesde as Date, Math.min(diasEntre(fechaDesde as Date, fechaHasta as Date) + 1, MAX_DIAS)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [desde, hasta, rangoInvalido],
    );

    const todas = useMemo(() => construirFilas(actividades, pedidos, maquinas), [actividades, pedidos, maquinas]);

    // Filas que tocan el periodo elegido (sin aplicar el filtro de estatus)
    const delPeriodo = useMemo(() => {
        if (dias.length === 0) return [];
        const primero = dias[0];
        const ultimo = dias[dias.length - 1];
        return todas.filter((f) => diasEntre(f.inicio, ultimo) >= 0 && diasEntre(primero, f.fin) >= 0);
    }, [todas, dias]);

    const filtradas = useMemo(
        () => (estado === "TODOS" ? delPeriodo : delPeriodo.filter((f) => f.estado === estado)),
        [delPeriodo, estado],
    );

    const resumen = useMemo<ResumenDelPeriodo>(() => {
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
        };
    }, [delPeriodo, pedidos, hoy]);

    // Si nadie eligió fila se toma la primera de pedido
    const seleccionadoId =
        (idElegido && filtradas.some((f) => f.id === idElegido) ? idElegido : null) ??
        filtradas.find((f) => f.pedidoId !== null)?.id ??
        null;

    useEffect(() => {
        if (!seleccionadoId) {
            setDetalle(null);
            return;
        }
        let cancelado = false;
        setCargandoDetalle(true);
        pedidosService
            .obtener(seleccionadoId)
            .then((d) => {
                if (!cancelado) setDetalle(d);
            })
            .catch(() => {
                if (!cancelado) setDetalle(null);
            })
            .finally(() => {
                if (!cancelado) setCargandoDetalle(false);
            });
        return () => {
            cancelado = true;
        };
    }, [seleccionadoId]);

    // La fila seleccionada en producción muestra su avance: "En producción · 62 %"
    const filas = useMemo<FilaCronograma[]>(
        () =>
            filtradas.map((f) =>
                f.id === seleccionadoId && detalle && detalle.id === f.id && f.estado === "PRODUCCION" && detalle.piezas > 0
                    ? { ...f, etiqueta: `${f.etiqueta} · ${Math.round((detalle.piezasTerminadas / detalle.piezas) * 100)} %` }
                    : f,
            ),
        [filtradas, seleccionadoId, detalle],
    );

    const seleccionar = (fila: FilaCronograma) => {
        if (fila.pedidoId) setIdElegido(fila.id);
    };

    const exportar = () => {
        const fecha = (f: Date) => aInputFecha(f);
        descargarCsv(`cronograma_${desde}_${hasta}.csv`, [
            ["Folio / Equipo", "Descripción", "Estatus", "Inicio", "Fin"],
            ...filtradas.map((f) => [f.titulo, f.subtitulo, f.etiqueta, fecha(f.inicio), fecha(f.fin)]),
        ]);
    };

    return {
        vista,
        setVista,
        desde,
        setDesde,
        hasta,
        setHasta,
        estado,
        setEstado,
        dias,
        hoy,
        filas,
        resumen,
        seleccionadoId,
        seleccionar,
        detalle,
        cargandoDetalle,
        exportar,
        rangoInvalido,
        cargando,
        error,
    };
}
