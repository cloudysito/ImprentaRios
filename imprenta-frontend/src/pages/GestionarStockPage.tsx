import { useState } from "react";
import StockKpis from "../components/inventario/StockKpis";
import StockTabla from "../components/inventario/StockTabla";
import MovimientoForm from "../components/inventario/MovimientoForm";
import AlertasDesabasto from "../components/inventario/AlertasDesabasto";
import NuevoInsumoModal from "../components/inventario/NuevoInsumoModal";
import { useStock } from "../hooks/useStock";
import { nombreMes } from "../utils/fechas";
import { mensajeDeError } from "../utils/errores";
import "../styles/UI.css";
import "../styles/GestionarStock.css";
import type {Insumo} from "../types/inventario.ts";
import Modal from "../components/ui/Modal.tsx";
import { useAuth } from "../context/AuthContext";

const GestionarStockPage = () => {
  const stock = useStock();
  const [mes] = useState(() => nombreMes(new Date()));
  const [nuevoAbierto, setNuevoAbierto] = useState(false);

  const [editando, setEditando] = useState(false);
  const [puntos, setPuntos] = useState<Record<string, string>>({});
  const [guardandoPuntos, setGuardandoPuntos] = useState(false);
  const [errorPuntos, setErrorPuntos] = useState<string | null>(null);

  const { user } = useAuth();
  const puedeEditar = user?.rol === "DUENO" || user?.rol === "MANUFACTURA";
  const puedeEliminar = user?.rol === "DUENO";
  const [insumoEditar, setInsumoEditar] = useState<Insumo | null>(null);
  const [insumoEliminar, setInsumoEliminar] = useState<Insumo | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  const iniciarEdicion = () => {
    setPuntos({});
    setErrorPuntos(null);
    setEditando(true);
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setPuntos({});
    setErrorPuntos(null);
  };

  const confirmarEliminacion = async () => {
    if (!insumoEliminar || eliminando) return;
    setEliminando(true);
    setErrorEliminar(null);
    try {
      await stock.eliminarInsumo(insumoEliminar.id);
      setInsumoEliminar(null);
    } catch (err) {
      setErrorEliminar(mensajeDeError(err, "No se pudo eliminar el material"));
    } finally {
      setEliminando(false);
    }
  };

  const guardarPuntos = async () => {
    const cambios: Record<string, number> = {};
    for (const [id, valor] of Object.entries(puntos)) {
      const n = Number(valor);
      if (valor.trim() === "" || !Number.isInteger(n) || n < 0) {
        setErrorPuntos(
          "Los puntos de reorden deben ser números enteros, 0 o mayores",
        );
        return;
      }
      const actual = stock.insumos.find((i) => i.id === id);
      if (actual && actual.puntoReorden !== n) cambios[id] = n;
    }

    setGuardandoPuntos(true);
    setErrorPuntos(null);
    try {
      await stock.guardarPuntos(cambios);
      setEditando(false);
      setPuntos({});
    } catch (err) {
      setErrorPuntos(
        mensajeDeError(err, "No se pudieron guardar los puntos de reorden"),
      );
    } finally {
      setGuardandoPuntos(false);
    }
  };

  return (
    <div className="stock">
      <section className="stock__principal">
        <div className="stock__toolbar">
          {editando ? (
            <div className="stock__toolbar-grupo">
              <button
                type="button"
                className="ui-btn ui-btn--oscuro"
                onClick={() => void guardarPuntos()}
                disabled={guardandoPuntos}
              >
                {guardandoPuntos ? "Guardando…" : "Guardar puntos de reorden"}
              </button>
              <button
                type="button"
                className="ui-btn ui-btn--contorno"
                onClick={cancelarEdicion}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="ui-btn ui-btn--contorno"
              onClick={iniciarEdicion}
              disabled={stock.insumos.length === 0}
            >
              Editar puntos de reorden
            </button>
          )}
          <button
            type="button"
            className="ui-btn ui-btn--primario"
            onClick={() => setNuevoAbierto(true)}
          >
            Nuevo material
          </button>
        </div>

        {errorPuntos && <p className="ui-error">{errorPuntos}</p>}

        <StockKpis
          activos={stock.insumos.length}
          bajoReorden={stock.conAlerta.length}
          movimientos={stock.movimientosMes}
          mes={mes}
        />

        <StockTabla
            insumos={stock.insumos}
            cargando={stock.cargando}
            error={stock.error}
            editando={editando}
            puntos={puntos}
            onPuntoChange={(id, valor) =>
                setPuntos((prev) => ({ ...prev, [id]: valor }))
            }
            onEditar={puedeEditar ? setInsumoEditar : undefined}
            onEliminar={puedeEliminar ? (insumo) => { setErrorEliminar(null); setInsumoEliminar(insumo); } : undefined}
        />
      </section>

      <aside className="stock__lateral">
        <MovimientoForm
          insumos={stock.insumos}
          folios={stock.folios}
          onGuardar={stock.registrarMovimiento}
        />
        <AlertasDesabasto insumos={stock.conAlerta} />
      </aside>

      {nuevoAbierto && (
        <NuevoInsumoModal
          onCerrar={() => setNuevoAbierto(false)}
          onCrear={stock.crearInsumo}
        />
      )}
      {insumoEditar && (
          <NuevoInsumoModal
              insumo={insumoEditar}
              onCerrar={() => setInsumoEditar(null)}
              onCrear={(dto) => stock.actualizarInsumo(insumoEditar.id, dto)}
          />
      )}
      {insumoEliminar && (
          <Modal titulo="Eliminar material" onCerrar={() => { if (!eliminando) setInsumoEliminar(null); }}>
            <p>¿Eliminar <strong>{insumoEliminar.nombre}</strong>? Solo se puede si no está ligado a un material de pedidos ni tiene movimientos registrados.</p>
            {errorEliminar && <p className="ui-error" role="alert">{errorEliminar}</p>}
            <div className="ui-modal__acciones">
              <button type="button" className="ui-btn ui-btn--contorno" onClick={() => setInsumoEliminar(null)} disabled={eliminando}>Volver</button>
              <button type="button" className="ui-btn ui-btn--primario" onClick={() => void confirmarEliminacion()} disabled={eliminando}>
                {eliminando ? "Eliminando…" : "Sí, eliminar"}
              </button>
            </div>
          </Modal>
      )}
    </div>
  );
};
export default GestionarStockPage;
