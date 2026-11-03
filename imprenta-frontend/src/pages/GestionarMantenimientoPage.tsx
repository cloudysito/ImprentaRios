import { useState } from "react";
import MaquinaCard from "../components/mantenimiento/MaquinaCard";
import MaquinaEncabezado from "../components/mantenimiento/MaquinaEncabezado";
import RegistrarServicioForm from "../components/mantenimiento/RegistrarServicioForm";
import HistorialTecnico from "../components/mantenimiento/HistorialTecnico";
import NuevaMaquinaModal from "../components/mantenimiento/NuevaMaquinaModal";
import ProgramarAlertaModal from "../components/mantenimiento/ProgramarAlertaModal";
import { useMantenimiento } from "../hooks/useMantenimiento";
import "../styles/UI.css";
import "../styles/Mantenimiento.css";

const GestionarMantenimientoPage = () => {
  const mant = useMantenimiento();
  const [anio] = useState(() => new Date().getFullYear());
  const [modal, setModal] = useState<"maquina" | "alerta" | null>(null);
  const cerrarModal = () => setModal(null);
  const d = mant.detalle;

  return (
    <div className="mantenimiento">
      <section className="mantenimiento__lista">
        <button type="button" className="ui-btn ui-btn--primario ui-btn--ancho" onClick={() => setModal("maquina")}>
          Nueva máquina
        </button>
        <span className="ui-eyebrow mantenimiento__titulo-lista">Maquinaria registrada</span>

        {mant.cargando ? (
          <p className="ui-vacio">Cargando maquinaria…</p>
        ) : mant.error ? (
          <p className="ui-error">{mant.error}</p>
        ) : mant.maquinas.length === 0 ? (
          <p className="ui-card ui-vacio">Todavía no hay máquinas registradas.</p>
        ) : (
          mant.maquinas.map((m) => (
            <MaquinaCard
              key={m.id}
              maquina={m}
              seleccionada={m.id === mant.seleccionadoId}
              onSeleccionar={() => mant.seleccionar(m.id)}
            />
          ))
        )}
      </section>

      <section className="mantenimiento__detalle">
        {d ? (
          <>
            <MaquinaEncabezado maquina={d} anio={anio} onProgramarAlerta={() => setModal("alerta")} />
            <div className="mantenimiento__columnas">
              <RegistrarServicioForm key={d.id} responsable={d.responsable} onGuardar={mant.registrarServicio} />
              <HistorialTecnico servicios={d.historial} />
            </div>
          </>
        ) : mant.errorDetalle ? (
          <p className="ui-error">{mant.errorDetalle}</p>
        ) : mant.cargandoDetalle ? (
          <p className="ui-card ui-vacio">Cargando máquina…</p>
        ) : (
          !mant.cargando && <p className="ui-card ui-vacio">Registra una máquina para llevar su historial de servicios.</p>
        )}
      </section>

      {modal === "maquina" && <NuevaMaquinaModal onCerrar={cerrarModal} onCrear={mant.crearMaquina} />}
      {modal === "alerta" && d && (
        <ProgramarAlertaModal maquina={d.nombre} onCerrar={cerrarModal} onProgramar={mant.programarAlerta} />
      )}
    </div>
  );
};
export default GestionarMantenimientoPage;
