import { useEffect, useMemo, useState } from "react";
import { pedidosService } from "../services/pedidosService";
import type { EstadoPedido, FiltroEstado, PedidoResumen } from "../types/pedido";

export function usePedidos() {
  const [pedidos, setPedidos] = useState<PedidoResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<FiltroEstado>("TODOS");
  const [idElegido, setIdElegido] = useState<string | null>(null);

  // 1. Cargar la lista una sola vez, al entrar a la página
  useEffect(() => {
    let cancelado = false;
    pedidosService
      .listar()
      .then((data) => {
        if (!cancelado) setPedidos(data);
      })
      .catch(() => {
        if (!cancelado) setError("No se pudieron cargar los pedidos");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  // 2. Cuántos pedidos hay de cada estatus (para las pestañas)
  const conteos = useMemo(() => {
    const resultado: Partial<Record<FiltroEstado, number>> = { TODOS: pedidos.length };
    for (const p of pedidos) {
      resultado[p.estado] = (resultado[p.estado] ?? 0) + 1;
    }
    return resultado;
  }, [pedidos]);

  // 3. Los pedidos que se ven, después de aplicar filtro y búsqueda
  const pedidosVisibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return pedidos.filter((p) => {
      const pasaFiltro = filtro === "TODOS" || p.estado === filtro;
      const pasaBusqueda =
        texto === "" ||
        p.folio.toLowerCase().includes(texto) ||
        p.clienteNombre.toLowerCase().includes(texto);
      return pasaFiltro && pasaBusqueda;
    });
  }, [pedidos, busqueda, filtro]);

  // 4. Si nadie ha elegido un folio, se selecciona el primero visible
  const seleccionadoId = idElegido ?? pedidosVisibles[0]?.id ?? null;

  // 5. Actualiza una fila sin volver a pedir toda la lista
  const actualizarEstado = (id: string, estado: EstadoPedido) => {
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado } : p)));
  };

  return {
    pedidosVisibles,
    conteos,
    cargando,
    error,
    busqueda,
    setBusqueda,
    filtro,
    setFiltro,
    seleccionadoId,
    seleccionar: setIdElegido,
    actualizarEstado,
  };
}
