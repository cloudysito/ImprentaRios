export type Rol = "DUENO" | "SECRETARIA" | "DISENADOR" | "MANUFACTURA";

export interface Empleado {
  id: string;
  nombre: string;
  usuario: string;
  rol: Rol;
  activo: boolean;
}

export const rolLabels: Record<Rol, string> = {
  DUENO: "Dueño",
  SECRETARIA: "Secretaria",
  DISENADOR: "Diseñador",
  MANUFACTURA: "Manufactura",
};


export async function login(usuario: string, password: string): Promise<Empleado> {
  const params = new URLSearchParams({ usuario, password });

  let res: Response;
  try {
    res = await fetch(`/api/empleados/login?${params}`, { method: "POST" });
  } catch {
    throw new Error("No se pudo conectar con el servidor");
  }

  if (!res.ok) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const data = await res.json();

  return {
    id: data.id,
    nombre: data.nombre,
    usuario: data.usuario,
    rol: data.rol,
    activo: data.activo,
  };
}
