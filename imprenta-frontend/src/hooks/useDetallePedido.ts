import { useEffect, useState } from "react";
import { pedidosService } from "../services/pedidosService";
import type { EstadoPedido, PedidoDetalle } from "../types/pedido";

// Guardamos a qué id pertenece cada respuesta para saber si sigue vigente
interface Resultado {
  id: string;
  detalle: PedidoDetalle | null;
  error: string | null;
}

export function useDetallePedido(id: string | null) {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Cada vez que cambia el id seleccionado, se pide su detalle
  useEffect(() => {
    if (!id) return;

    let cancelado = false; // evita mostrar un folio viejo si cambias rápido de fila
    pedidosService
      .obtener(id)
      .then((data) => {
        if (!cancelado) setResultado({ id, detalle: data, error: null });
      })
      .catch(() => {
        if (!cancelado) setResultado({ id, detalle: null, error: "No se pudo cargar el folio" });
      });

    return () => {
      cancelado = true;
    };
  }, [id]);

  // Todo esto se calcula, no se guarda en estado
  const vigente = resultado && resultado.id === id ? resultado : null;
  const cargando = id !== null && vigente === null;
  const detalle = vigente?.detalle ?? null;
  const error = vigente?.error ?? null;

  const cambiarEstado = async (estado: EstadoPedido) => {
    if (!id) return null;
    setGuardando(true);
    try {
      const actualizado = await pedidosService.cambiarEstado(id, estado);
      setResultado({ id, detalle: actualizado, error: null });
      return actualizado;
    } catch {
      setResultado((prev) =>
        prev && prev.id === id ? { ...prev, error: "No se pudo actualizar el estatus" } : prev,
      );
      return null;
    } finally {
      setGuardando(false);
    }
  };

  return { detalle, cargando, guardando, error, cambiarEstado };
}
