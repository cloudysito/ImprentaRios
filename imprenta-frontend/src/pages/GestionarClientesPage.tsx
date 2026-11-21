import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { clienteService } from "../services/clienteService";
import type { Cliente } from "../types/captura";
import { mensajeDeError } from "../utils/errores";
import { Cargando } from "../components/Cargando";
import "../styles/GestionarClientes.css";

const GestionarClientesPage = () => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;
    const temporizador = window.setTimeout(() => {
      clienteService
        .listar(busqueda)
        .then((datos) => {
          if (vigente) setClientes(datos);
        })
        .catch((err) => {
          if (vigente) setError(mensajeDeError(err, "No se pudieron cargar los clientes"));
        })
        .finally(() => {
          if (vigente) setCargando(false);
        });
    }, busqueda.trim() ? 250 : 0);

    return () => {
      vigente = false;
      window.clearTimeout(temporizador);
    };
  }, [busqueda]);

  if (!user) return <Navigate to="/login" replace />;
  if (user.rol !== "DUENO" && user.rol !== "SECRETARIA") {
    return <Navigate to="/calendario" replace />;
  }

  return (
    <div className="clientes">
      <div className="clientes__toolbar">
        <label className="clientes__busqueda">
          <Search size={16} strokeWidth={1.75} />
          <input
            type="search"
            value={busqueda}
            onChange={(event) => {
              setCargando(true);
              setError(null);
              setBusqueda(event.target.value);
            }}
            aria-label="Buscar clientes por nombre, teléfono o correo"
            placeholder="Buscar nombre, teléfono o correo"
          />
        </label>
        <span className="clientes__conteo">
          {clientes.length} {clientes.length === 1 ? "cliente" : "clientes"}
        </span>
      </div>

      <div className="clientes__tabla" role="region" aria-label="Lista de clientes" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th scope="col">Nombre o razón social</th>
              <th scope="col">Teléfono</th>
              <th scope="col">Correo electrónico</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={3}><Cargando /></td></tr>
            ) : error ? (
              <tr><td colSpan={3} className="clientes__mensaje is-error" role="alert">{error}</td></tr>
            ) : clientes.length === 0 ? (
              <tr>
                <td colSpan={3} className="clientes__mensaje">
                  {busqueda.trim() ? "No se encontraron clientes con esa búsqueda." : "Aún no hay clientes registrados."}
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.correo || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionarClientesPage;
