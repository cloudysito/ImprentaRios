import { useCallback, useEffect, useMemo, useState } from "react";
import { archivoDisenioService } from "../services/archivoDisenioService";
import { mensajeDeError } from "../utils/errores";
import type {
  ArchivoDisenio,
  ArchivoDisenioRequest,
  GrupoArchivoDisenio,
} from "../types/archivoDisenio";

// Agrupa cada diseño con todas sus versiones (la primera es la más nueva).
function agrupar(archivos: ArchivoDisenio[]): GrupoArchivoDisenio[] {
  const mapa = new Map<string, ArchivoDisenio[]>();

  for (const archivo of archivos) {
    const grupoId = archivo.grupoId ?? archivo.id;
    const versiones = mapa.get(grupoId);
    if (versiones) versiones.push(archivo);
    else mapa.set(grupoId, [archivo]);
  }

  return [...mapa.entries()]
    .map(([id, versiones]) => {
      const orden = [...versiones].sort((a, b) => b.version - a.version);
      return {
        id,
        nombreArchivo: orden[0].nombreArchivo,
        actual: orden[0],
        versiones: orden,
      };
    })
    .sort((a, b) => a.nombreArchivo.localeCompare(b.nombreArchivo, "es"));
}

export function useArchivosDisenio() {
  const [archivos, setArchivos] = useState<ArchivoDisenio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setArchivos(await archivoDisenioService.listar());
    } catch (err) {
      setError(
        mensajeDeError(err, "No se pudieron cargar los archivos de diseño"),
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;

    archivoDisenioService
      .listar()
      .then((lista) => {
        if (!cancelado) setArchivos(lista);
      })
      .catch((err) => {
        if (!cancelado) {
          setError(
            mensajeDeError(err, "No se pudieron cargar los archivos de diseño"),
          );
        }
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const grupos = useMemo(() => agrupar(archivos), [archivos]);

  const gruposVisibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return grupos;
    return grupos.filter((g) =>
      g.nombreArchivo.toLowerCase().includes(texto),
    );
  }, [grupos, busqueda]);

  // Mantiene una selección válida sin efectos: si no hay o ya no existe,
  // se usa el primer diseño visible.
  const seleccionado = useMemo(() => {
    const existe =
      seleccionadoId !== null && archivos.some((a) => a.id === seleccionadoId);
    if (existe) return seleccionadoId;
    return gruposVisibles[0]?.actual.id ?? null;
  }, [archivos, gruposVisibles, seleccionadoId]);

  const versionSeleccionada = useMemo(
    () => archivos.find((a) => a.id === seleccionado) ?? null,
    [archivos, seleccionado],
  );

  const grupoSeleccionado = useMemo(() => {
    if (!versionSeleccionada) return null;
    const grupoId = versionSeleccionada.grupoId ?? versionSeleccionada.id;
    return grupos.find((g) => g.id === grupoId) ?? null;
  }, [grupos, versionSeleccionada]);

  const crear = async (dto: ArchivoDisenioRequest) => {
    const nuevo = await archivoDisenioService.crear(dto);
    await cargar();
    setSeleccionadoId(nuevo.id);
    return nuevo;
  };

  const actualizar = async (id: string, dto: ArchivoDisenioRequest) => {
    const actualizado = await archivoDisenioService.actualizar(id, dto);
    await cargar();
    return actualizado;
  };

  const eliminar = async (id: string) => {
    await archivoDisenioService.eliminar(id);
    await cargar();
  };

  return {
    archivos,
    grupos,
    gruposVisibles,
    cargando,
    error,
    busqueda,
    setBusqueda,
    seleccionadoId: seleccionado,
    seleccionar: setSeleccionadoId,
    versionSeleccionada,
    grupoSeleccionado,
    crear,
    actualizar,
    eliminar,
    recargar: cargar,
  };
}
