import { useEffect, useMemo, useState } from "react";
import { capturaPedidoService } from "../services/capturaPedidoService";
import { mensajeDeError } from "../utils/errores";
import { aFecha } from "../utils/fechas";
import type { Insumo } from "../types/inventario";
import type {
  ArchivoDisenio,
  CampoPedido,
  ErroresPedido,
  FormularioPedido,
  Material,
  PedidoCreado,
  PedidoRequest,
  TipoProducto,
} from "../types/capturaPedido";

const CLAVE_BORRADOR = "imprenta.borradorPedido";

// El back pide fecha y hora. Se toma la hora de cierre del día elegido
const HORA_ENTREGA = "18:00:00";

const VACIO: FormularioPedido = {
  nombreCliente: "",
  telefono: "",
  correo: "",
  personaSolicita: "",
  nombreProyecto: "",
  fechaEntrega: "",
  prioridad: "MEDIA",
  tipoProductoId: "",
  cantidad: "",
  materialId: "",
  medidas: "",
  tinta: "",
  tipoAcabado: "NINGUNO",
  observaciones: "",
  archivoDisenioId: "",
  precioAcordado: "",
};

const leerBorrador = (): FormularioPedido | null => {
  try {
    const guardado = localStorage.getItem(CLAVE_BORRADOR);
    return guardado ? { ...VACIO, ...(JSON.parse(guardado) as Partial<FormularioPedido>) } : null;
  } catch {
    return null;
  }
};

const borrarBorrador = () => {
  try {
    localStorage.removeItem(CLAVE_BORRADOR);
  } catch {
    // sin almacenamiento no hay borrador que borrar
  }
};

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validar = (f: FormularioPedido, ahora: Date): ErroresPedido => {
  const e: ErroresPedido = {};

  if (!f.nombreCliente.trim()) e.nombreCliente = "Escribe el nombre del cliente";
  else if (f.nombreCliente.trim().length > 100) e.nombreCliente = "Máximo 100 caracteres";

  if (!f.telefono.trim()) e.telefono = "Escribe un teléfono de contacto";
  else if (f.telefono.trim().length > 15) e.telefono = "Máximo 15 caracteres";

  if (f.correo.trim() && !CORREO.test(f.correo.trim())) e.correo = "El correo no es válido";

  const proyecto = f.nombreProyecto.trim();
  if (proyecto.length < 3) e.nombreProyecto = "Escribe al menos 3 caracteres";
  else if (proyecto.length > 150) e.nombreProyecto = "Máximo 150 caracteres";

  if (!f.fechaEntrega) e.fechaEntrega = "Elige la fecha de entrega";
  else if (aFecha(`${f.fechaEntrega}T${HORA_ENTREGA}`) <= ahora) {
    e.fechaEntrega = "La entrega debe ser después de hoy a las 6 pm";
  }

  if (!f.tipoProductoId) e.tipoProductoId = "Elige el tipo de producto";

  const cantidad = Number(f.cantidad);
  if (!f.cantidad || !Number.isInteger(cantidad) || cantidad < 1) e.cantidad = "Escribe cuántas piezas son";

  if (!f.materialId) e.materialId = "Elige el material";

  if (!f.medidas.trim()) e.medidas = "Escribe la medida final";
  else if (f.medidas.trim().length > 30) e.medidas = "Máximo 30 caracteres";

  if (!f.tinta) e.tinta = "Elige las tintas";

  if (f.observaciones.length > 500) e.observaciones = "Máximo 500 caracteres";

  if (f.precioAcordado && !(Number(f.precioAcordado) >= 0)) e.precioAcordado = "Escribe un precio válido";

  return e;
};

const aPeticion = (f: FormularioPedido, clienteId: string): PedidoRequest => ({
  fechaEntrega: `${f.fechaEntrega}T${HORA_ENTREGA}`,
  nombreProyecto: f.nombreProyecto.trim(),
  clienteId,
  personaSolicita: f.personaSolicita.trim() || null,
  precioAcordado: f.precioAcordado ? Number(f.precioAcordado) : null,
  archivoDisenioId: f.archivoDisenioId || null,
  productos: [
    {
      cantidad: Number(f.cantidad),
      medidas: f.medidas.trim(),
      tinta: f.tinta || "CMYK",
      tipoAcabado: f.tipoAcabado,
      prioridad: f.prioridad,
      observaciones: f.observaciones.trim() || null,
      tipoProductoId: f.tipoProductoId,
      materialId: f.materialId,
    },
  ],
});

export type Disponibilidad =
  | { tipo: "sin-material" }
  | { tipo: "sin-insumo"; material: Material }
  | { tipo: "cargando"; material: Material }
  | { tipo: "error"; material: Material }
  | { tipo: "insumo"; material: Material; insumo: Insumo };

export function useCapturaPedido() {
  const [form, setForm] = useState<FormularioPedido>(() => leerBorrador() ?? VACIO);
  const [errores, setErrores] = useState<ErroresPedido>({});

  const [tipos, setTipos] = useState<TipoProducto[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [archivos, setArchivos] = useState<ArchivoDisenio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [registrado, setRegistrado] = useState<PedidoCreado | null>(null);
  const [borradorGuardado, setBorradorGuardado] = useState(() => leerBorrador() !== null);

  // Si el pedido falla después de crear al cliente, el reintento usa ese mismo cliente
  const [clienteCreado, setClienteCreado] = useState<{ firma: string; id: string } | null>(null);

  const [existencia, setExistencia] = useState<{ insumoId: string; insumo: Insumo | null } | null>(null);

  useEffect(() => {
    let cancelado = false;

    Promise.all([
      capturaPedidoService.listarTiposProducto(),
      capturaPedidoService.listarMateriales(),
      capturaPedidoService.listarArchivosDisenio().catch((): ArchivoDisenio[] => []),
    ])
      .then(([listaTipos, listaMateriales, listaArchivos]) => {
        if (cancelado) return;
        setTipos(listaTipos);
        setMateriales(listaMateriales);
        setArchivos(listaArchivos);
      })
      .catch((err) => {
        if (!cancelado) setErrorCarga(mensajeDeError(err, "No se pudieron cargar los catálogos"));
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const material = materiales.find((m) => m.id === form.materialId) ?? null;
  const insumoId = material?.insumoId ?? null;

  useEffect(() => {
    if (!insumoId) return;
    let cancelado = false;

    capturaPedidoService
      .obtenerInsumo(insumoId)
      .then((insumo) => {
        if (!cancelado) setExistencia({ insumoId, insumo });
      })
      .catch(() => {
        if (!cancelado) setExistencia({ insumoId, insumo: null });
      });

    return () => {
      cancelado = true;
    };
  }, [insumoId]);

  const disponibilidad = useMemo<Disponibilidad>(() => {
    if (!material) return { tipo: "sin-material" };
    if (!insumoId) return { tipo: "sin-insumo", material };
    if (existencia?.insumoId !== insumoId) return { tipo: "cargando", material };
    if (!existencia.insumo) return { tipo: "error", material };
    return { tipo: "insumo", material, insumo: existencia.insumo };
  }, [material, insumoId, existencia]);

  const actualizar = <C extends CampoPedido>(campo: C, valor: FormularioPedido[C]) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
    setErrorEnvio(null);
    setBorradorGuardado(false);
  };

  const guardarBorrador = () => {
    try {
      localStorage.setItem(CLAVE_BORRADOR, JSON.stringify(form));
      setBorradorGuardado(true);
      setErrorEnvio(null);
    } catch {
      setErrorEnvio("Este navegador no permite guardar el borrador");
    }
  };

  const registrar = async () => {
    const encontrados = validar(form, new Date());
    setErrores(encontrados);
    if (Object.values(encontrados).some(Boolean)) {
      setErrorEnvio("Revisa los campos marcados");
      return;
    }

    setEnviando(true);
    setErrorEnvio(null);
    try {
      const cliente = {
        nombre: form.nombreCliente.trim(),
        telefono: form.telefono.trim(),
        correo: form.correo.trim() || null,
      };
      const firma = JSON.stringify(cliente);

      let clienteId = clienteCreado?.firma === firma ? clienteCreado.id : null;
      if (!clienteId) {
        clienteId = (await capturaPedidoService.crearCliente(cliente)).id;
        setClienteCreado({ firma, id: clienteId });
      }

      const pedido = await capturaPedidoService.crearPedido(aPeticion(form, clienteId));
      setRegistrado(pedido);
      borrarBorrador();
      setBorradorGuardado(false);
    } catch (err) {
      setErrorEnvio(mensajeDeError(err, "No se pudo registrar el pedido"));
    } finally {
      setEnviando(false);
    }
  };

  const nuevoPedido = () => {
    setForm(VACIO);
    setErrores({});
    setErrorEnvio(null);
    setRegistrado(null);
    setClienteCreado(null);
    setBorradorGuardado(false);
  };

  return {
    form,
    errores,
    actualizar,
    tipos,
    materiales,
    archivos,
    cargando,
    errorCarga,
    disponibilidad,
    enviando,
    errorEnvio,
    registrado,
    borradorGuardado,
    guardarBorrador,
    registrar,
    nuevoPedido,
  };
}
