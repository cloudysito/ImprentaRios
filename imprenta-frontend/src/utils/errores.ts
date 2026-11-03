import axios from "axios";

// Usa ProblemDetail.detail del backend o un mensaje por defecto
export const mensajeDeError = (err: unknown, porDefecto: string) => {
  if (axios.isAxiosError(err)) {
    if (!err.response) return "No se pudo conectar con el servidor";
    if (err.response.status === 403) return "Tu usuario no tiene permiso para hacer esto";
    const detalle = (err.response.data as { detail?: unknown } | undefined)?.detail;
    if (typeof detalle === "string" && detalle && detalle !== "Invalid request content.") {
      return detalle;
    }
  }
  return porDefecto;
};
