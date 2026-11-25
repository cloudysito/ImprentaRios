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

export interface LoginResponse {
  token: string;
  empleado: Empleado;
}

export const rolLabels: Record<Rol, string> = {
  DUENO: "Dueño",
  SECRETARIA: "Secretaria",
  DISENADOR: "Diseñador",
  MANUFACTURA: "Manufactura",
};

export async function login(
  usuario: string,
  password: string
): Promise<LoginResponse> {
  try {
    const { data } = await api.post<LoginResponse>(
      "/empleados/login",
      {
        usuario,
        password,
      }
    );

    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      // El bloqueo por demasiados intentos sí se avisa con el mensaje del servidor.
      // Para cualquier otro error se mantiene el mensaje genérico (no revela qué dato falló).
      const detalle = (err.response.data as { detail?: unknown } | undefined)?.detail;
      if (err.response.status === 429 && typeof detalle === "string" && detalle) {
        throw new Error(detalle);
      }
      throw new Error("Usuario o contraseña incorrectos");
    }

    throw new Error("No se pudo conectar con el servidor");
  }
}