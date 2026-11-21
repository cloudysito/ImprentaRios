import axios, { type AxiosResponse } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";
export const api = axios.create({
  baseURL: API_URL, // Vite manda todo lo que empieza con /api al backend (puerto 8080)
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interfaz para el payload de la respuesta
export interface paylod<T> {
  exito: boolean;
  datos: T;
  timestamp: string;
}

// Función para obtener los datos de la respuesta, manejando el caso de payload
export function obtenerDatos<T>(respuesta: AxiosResponse<T | paylod<T>>): T {
  const contenido = respuesta.data;

  if (contenido && typeof contenido === "object" && "exito" in contenido && "datos" in contenido) {
    return contenido.datos;
  }
  return contenido as T;
}

// Interceptor para agregar el token de autenticación a las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("imprenta.token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

}, (error) => {
  return Promise.reject(error);
}

);

//detecta si la respuesta es un error 401 y no es la ruta de login, entonces borra el token y lanza un evento de sesion-expirada
api.interceptors.response.use(
  (response) => {
    response.data = obtenerDatos(response);
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes("/empleados/login")) {
      localStorage.removeItem("imprenta.token");
      window.dispatchEvent(new Event("session-expired"));
    }
    return Promise.reject(error);
  }
);
