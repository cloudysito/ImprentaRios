import axios from "axios";
import { api } from "./api";

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

/**
 * Llama a POST /api/empleados/login?usuario=...&password=...
 * (el backend recibe los datos como @RequestParam).
 */
export async function login(usuario: string, password: string): Promise<Empleado> {
  try {
    const { data } = await api.post<Empleado>("/empleados/login", null, {
      params: { usuario, password },
    });

    // Solo guardamos lo necesario, nunca la contraseña
    return {
      id: data.id,
      nombre: data.nombre,
      usuario: data.usuario,
      rol: data.rol,
      activo: data.activo,
    };
  } catch (err) {
    // Si hubo respuesta, el backend rechazó los datos. Si no, no hubo conexión
    if (axios.isAxiosError(err) && err.response) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    throw new Error("No se pudo conectar con el servidor");
  }
}
