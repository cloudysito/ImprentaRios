import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { rolLabels } from "../services/authService";
import type { Empleado } from "../services/authService";
import { crearEmpleado, listarEmpleados } from "../services/empleadoService";
import type { NuevoEmpleado } from "../services/empleadoService";
import { mensajeDeError } from "../utils/errores";
import "../styles/UI.css";
import "../styles/GestionarEmpleados.css";

const formularioInicial: NuevoEmpleado = {
  nombre: "",
  usuario: "",
  password: "",
  rol: "SECRETARIA",
};

const rolesAsignables: NuevoEmpleado["rol"][] = [
  "SECRETARIA",
  "DISENADOR",
  "MANUFACTURA",
];

function GestionarEmpleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [formulario, setFormulario] = useState<NuevoEmpleado>({ ...formularioInicial });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorListado, setErrorListado] = useState<string | null>(null);
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;

    async function cargar() {
      try {
        const datos = await listarEmpleados();
        if (vigente) setEmpleados(datos);
      } catch (err) {
        if (vigente) {
          setErrorListado(mensajeDeError(err, "No se pudieron cargar los empleados"));
        }
      } finally {
        if (vigente) setCargando(false);
      }
    }

    void cargar();
    return () => { vigente = false; };
  }, []);

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (guardando) return;

    setErrorFormulario(null);
    setExito(null);

    const nombre = formulario.nombre.trim();
    const usuario = formulario.usuario.trim();

    if (!nombre || usuario.length < 3) {
      setErrorFormulario("Escribe un nombre y un usuario de al menos 3 caracteres");
      return;
    }
    if (!formulario.password.trim() || formulario.password.length < 8) {
      setErrorFormulario("La contraseña debe tener al menos 8 caracteres y no ser solo espacios");
      return;
    }

    setGuardando(true);
    try {
      const nuevo = await crearEmpleado({ ...formulario, nombre, usuario });
      setEmpleados((actuales) => [...actuales, nuevo]);
      setFormulario({ ...formularioInicial });
      setExito(`Empleado ${nuevo.nombre} creado correctamente`);
    } catch (err) {
      setErrorFormulario(mensajeDeError(err, "No se pudo crear el empleado"));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="empleados">
      <section className="ui-card empleados__panel" aria-labelledby="nuevo-empleado-titulo">
        <h2 id="nuevo-empleado-titulo">Nuevo empleado</h2>
        <p className="empleados__descripcion">Crea su cuenta y selecciona el rol que tendrá en el sistema.</p>

        <form onSubmit={guardar} className="empleados__formulario">
          <fieldset disabled={guardando || cargando}>
            <legend className="empleados__leyenda">Datos de la cuenta</legend>
            <label className="ui-campo">
              <span>Nombre completo</span>
              <input
                className="ui-input"
                name="nombre"
                value={formulario.nombre}
                onChange={(event) => setFormulario({ ...formulario, nombre: event.target.value })}
                maxLength={100}
                autoComplete="name"
                required
              />
            </label>
            <label className="ui-campo">
              <span>Usuario</span>
              <input
                className="ui-input"
                name="usuario"
                value={formulario.usuario}
                onChange={(event) => setFormulario({ ...formulario, usuario: event.target.value })}
                minLength={3}
                maxLength={50}
                autoComplete="off"
                required
              />
            </label>
            <label className="ui-campo">
              <span>Contraseña</span>
              <input
                className="ui-input"
                name="password"
                type="password"
                value={formulario.password}
                onChange={(event) => setFormulario({ ...formulario, password: event.target.value })}
                minLength={8}
                maxLength={100}
                autoComplete="new-password"
                aria-describedby="empleado-password-ayuda"
                required
              />
              <small id="empleado-password-ayuda">Usa al menos 8 caracteres.</small>
            </label>
            <label className="ui-campo">
              <span>Rol</span>
              <select
                className="ui-input"
                name="rol"
                value={formulario.rol}
                onChange={(event) => {
                  const rol = rolesAsignables.find((opcion) => opcion === event.target.value);
                  if (rol) setFormulario({ ...formulario, rol });
                }}
              >
                {rolesAsignables.map((rol) => (
                  <option key={rol} value={rol}>{rolLabels[rol]}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="ui-btn ui-btn--primario">
              {guardando ? "Creando…" : "Crear empleado"}
            </button>
          </fieldset>
        </form>

        {errorFormulario && <p className="ui-error" role="alert">{errorFormulario}</p>}
        {exito && <p className="ui-exito" role="status">{exito}</p>}
      </section>

      <section className="ui-card empleados__panel" aria-labelledby="empleados-titulo">
        <h2 id="empleados-titulo">Empleados registrados</h2>
        {cargando ? (
          <p className="ui-vacio" role="status">Cargando empleados…</p>
        ) : errorListado ? (
          <p className="ui-error" role="alert">{errorListado}</p>
        ) : empleados.length === 0 ? (
          <p className="ui-vacio">No hay empleados registrados.</p>
        ) : (
          <div className="empleados__tabla" role="region" aria-label="Lista de empleados" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Usuario</th>
                  <th scope="col">Rol</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((empleado) => (
                  <tr key={empleado.id}>
                    <td>{empleado.nombre}</td>
                    <td>{empleado.usuario}</td>
                    <td>{rolLabels[empleado.rol]}</td>
                    <td>
                      <span className={`ui-badge ${empleado.activo ? "ui-badge--ok" : "ui-badge--peligro"}`}>
                        {empleado.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default function GestionarEmpleadosPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.rol !== "DUENO") return <Navigate to="/calendario" replace />;
  return <GestionarEmpleados key={user.id} />;
}
