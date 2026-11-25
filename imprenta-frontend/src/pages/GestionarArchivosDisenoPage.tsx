import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Modal from "../components/ui/Modal";
import ArchivoDisenioModal from "../components/archivosDiseno/ArchivoDisenioModal";
import { Cargando } from "../components/Cargando";
import { useArchivosDisenio } from "../hooks/useArchivosDisenio";
import { useAuth } from "../context/AuthContext";
import { mensajeDeError } from "../utils/errores";
import { formatFechaLarga } from "../utils/formato";
import type {
  ArchivoDisenio,
  ArchivoDisenioRequest,
} from "../types/archivoDisenio";
import "../styles/UI.css";
import "../styles/GestionarArchivosDiseno.css";

// Las fechas llegan como "2026-11-25"; sin la hora, Date las toma como UTC.
const fechaLarga = (fecha: string) =>
  formatFechaLarga(fecha.length === 10 ? `${fecha}T00:00:00` : fecha);

const GestionarArchivosDisenoPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const puedeEditar = user?.rol === "DUENO" || user?.rol === "DISENADOR";

  const lista = useArchivosDisenio();
  const [modal, setModal] = useState<{
    modo: "editar" | "nuevaVersion";
    archivo: ArchivoDisenio;
  } | null>(null);
  const [porEliminar, setPorEliminar] = useState<ArchivoDisenio | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  const version = lista.versionSeleccionada;
  const grupo = lista.grupoSeleccionado;
  const esVersionActual = Boolean(
    version && grupo && version.id === grupo.actual.id,
  );
  const grupoPorEliminar = porEliminar
    ? (lista.grupos.find(
        (g) => g.id === (porEliminar.grupoId ?? porEliminar.id),
      ) ?? null)
    : null;

  const guardar = async (dto: ArchivoDisenioRequest) => {
    if (!modal) return;
    if (modal.modo === "editar") {
      await lista.actualizar(modal.archivo.id, dto);
    } else {
      await lista.crear(dto);
    }
    setModal(null);
  };

  const confirmarEliminacion = async () => {
    if (!porEliminar || eliminando) return;
    setEliminando(true);
    setErrorEliminar(null);
    try {
      await lista.eliminar(porEliminar.id);
      setPorEliminar(null);
    } catch (err) {
      setErrorEliminar(
        mensajeDeError(err, "No se pudo eliminar el archivo de diseño"),
      );
    } finally {
      setEliminando(false);
    }
  };

  const mensajeTabla =
    lista.error ??
    (lista.gruposVisibles.length === 0
      ? lista.busqueda
        ? "No hay archivos que coincidan con la búsqueda"
        : "Todavía no hay archivos de diseño registrados"
      : null);

  return (
    <div className="archivos-diseno">
      <section className="archivos-diseno__principal">
        <div className="archivos-diseno__toolbar">
          <input
            type="search"
            className="ui-input archivos-diseno__busqueda"
            placeholder="Buscar por nombre de archivo"
            value={lista.busqueda}
            onChange={(e) => lista.setBusqueda(e.target.value)}
            aria-label="Buscar archivos de diseño"
          />
          <button
            type="button"
            className="ui-btn ui-btn--primario"
            onClick={() => navigate("/archivos-de-diseno/registrar")}
          >
            Registrar archivo
          </button>
        </div>

        <div
          className="archivos-tabla"
          role="region"
          aria-label="Lista de archivos de diseño"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th>Archivo</th>
                <th>Versión</th>
                <th>Recepción</th>
                <th>Entrega</th>
                <th className="archivos-tabla__extra">Medida</th>
                <th className="archivos-tabla__extra">Prensa</th>
                {puedeEditar && <th aria-label="Acciones"></th>}
              </tr>
            </thead>
            <tbody>
              {lista.cargando ? (
                <tr>
                  <td colSpan={puedeEditar ? 7 : 6}>
                    <Cargando />
                  </td>
                </tr>
              ) : mensajeTabla ? (
                <tr>
                  <td
                    colSpan={puedeEditar ? 7 : 6}
                    className="archivos-tabla__mensaje"
                  >
                    {mensajeTabla}
                  </td>
                </tr>
              ) : (
                lista.gruposVisibles.map((g) => (
                  <tr
                    key={g.id}
                    className={
                      g.id === grupo?.id
                        ? "is-selected"
                        : ""
                    }
                    onClick={() => lista.seleccionar(g.actual.id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && lista.seleccionar(g.actual.id)
                    }
                    tabIndex={0}
                    aria-selected={g.id === grupo?.id}
                  >
                    <td className="archivos-tabla__nombre">
                      {g.nombreArchivo}
                    </td>
                    <td>
                      <span className="archivos-tabla__version">
                        v{g.actual.version}
                      </span>
                      {g.versiones.length > 1 && (
                        <small className="archivos-tabla__cuenta">
                          {g.versiones.length} versiones
                        </small>
                      )}
                    </td>
                    <td className="archivos-tabla__fecha">{fechaLarga(g.actual.fechaRecepcion)}</td>
                    <td className="archivos-tabla__fecha">{fechaLarga(g.actual.fechaEntrega)}</td>
                    <td className="archivos-tabla__extra">{g.actual.medidaArchivo}</td>
                    <td className="archivos-tabla__extra">{g.actual.prensa}</td>
                    {puedeEditar && (
                      <td>
                        <button
                          type="button"
                          className="ui-btn-x"
                          title="Eliminar versión"
                          aria-label={`Eliminar ${g.nombreArchivo} v${g.actual.version}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setErrorEliminar(null);
                            setPorEliminar(g.actual);
                          }}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <X size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="detalle-archivo">
        <span className="ui-eyebrow">Diseño seleccionado</span>

        {!version ? (
          <p className="detalle-archivo__vacio">
            Selecciona un archivo de diseño para ver su detalle y sus versiones.
          </p>
        ) : (
          <>
            <h2 className="detalle-archivo__titulo">{version.nombreArchivo}</h2>
            <p className="detalle-archivo__meta">
              <span className="archivos-tabla__version">v{version.version}</span>
              {esVersionActual && <span>Versión actual</span>}
            </p>

            <dl className="detalle-archivo__datos">
              <div>
                <dt>Recepción</dt>
                <dd>{fechaLarga(version.fechaRecepcion)}</dd>
              </div>
              <div>
                <dt>Entrega</dt>
                <dd>{fechaLarga(version.fechaEntrega)}</dd>
              </div>
              <div>
                <dt>Resolución</dt>
                <dd>{version.resolucion} dpi</dd>
              </div>
              <div>
                <dt>Color</dt>
                <dd>{version.modoColor}</dd>
              </div>
              <div>
                <dt>Sangrado</dt>
                <dd>{version.sangrado} mm</dd>
              </div>
              <div>
                <dt>Medida</dt>
                <dd>{version.medidaArchivo}</dd>
              </div>
              <div>
                <dt>Caras</dt>
                <dd>{version.caras}</dd>
              </div>
              <div>
                <dt>Prensa</dt>
                <dd>{version.prensa}</dd>
              </div>
            </dl>

            <span className="ui-eyebrow">Historial de versiones</span>
            <ul className="detalle-archivo__versiones">
              {grupo?.versiones.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    className={
                      v.id === version.id ? "is-activa" : ""
                    }
                    onClick={() => lista.seleccionar(v.id)}
                  >
                    <strong>v{v.version}</strong>
                    <span>{fechaLarga(v.fechaEntrega)}</span>
                    {v.id === grupo.actual.id && <em>actual</em>}
                  </button>
                </li>
              ))}
            </ul>

            {puedeEditar && (
              <div className="detalle-archivo__acciones">
                <button
                  type="button"
                  className="ui-btn ui-btn--contorno ui-btn--ancho"
                  onClick={() => setModal({ modo: "editar", archivo: version })}
                >
                  Editar esta versión
                </button>
                <button
                  type="button"
                  className="ui-btn ui-btn--primario ui-btn--ancho"
                  onClick={() =>
                    grupo &&
                    setModal({ modo: "nuevaVersion", archivo: grupo.actual })
                  }
                >
                  Crear nueva versión
                </button>
                <button
                  type="button"
                  className="detalle-archivo__eliminar"
                  onClick={() => {
                    setErrorEliminar(null);
                    setPorEliminar(version);
                  }}
                >
                  Eliminar esta versión
                </button>
              </div>
            )}
          </>
        )}
      </aside>

      {modal && (
        <ArchivoDisenioModal
          modo={modal.modo}
          archivo={modal.archivo}
          onCerrar={() => setModal(null)}
          onGuardar={guardar}
        />
      )}

      {porEliminar && (
        <Modal
          titulo="Eliminar archivo de diseño"
          onCerrar={() => {
            if (!eliminando) setPorEliminar(null);
          }}
        >
          <p>
            ¿Eliminar <strong>{porEliminar.nombreArchivo}</strong> (v
            {porEliminar.version})?
          </p>
          <p className="detalle-archivo__nota">
            {grupoPorEliminar && grupoPorEliminar.versiones.length > 1
              ? "El diseño conservará sus demás versiones."
              : "Es la única versión del diseño, así que se eliminará completo."}{" "}
            No se puede eliminar si está vinculado a un pedido.
          </p>
          {errorEliminar && (
            <p className="ui-error" role="alert">
              {errorEliminar}
            </p>
          )}
          <div className="ui-modal__acciones">
            <button
              type="button"
              className="ui-btn ui-btn--contorno"
              onClick={() => setPorEliminar(null)}
              disabled={eliminando}
            >
              Volver
            </button>
            <button
              type="button"
              className="ui-btn ui-btn--primario"
              onClick={() => void confirmarEliminacion()}
              disabled={eliminando}
            >
              {eliminando ? "Eliminando…" : "Sí, eliminar"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GestionarArchivosDisenoPage;
