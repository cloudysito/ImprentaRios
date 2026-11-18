import { api } from "./api";
import type { Empleado, Rol } from "./authService";

export interface NuevoEmpleado {
  nombre: string;
  usuario: string;
  password: string;
  rol: Exclude<Rol, "DUENO">;
}

export async function listarEmpleados(): Promise<Empleado[]> {
  const { data } = await api.get<Empleado[]>("/empleados");
  return data;
}

export async function crearEmpleado(empleado: NuevoEmpleado): Promise<Empleado> {
  const { data } = await api.post<Empleado>("/empleados", empleado);
  return data;
}
