import { api } from "./api";
import type { ActividadResponse } from "../types/actividad";

export const actividadService = {
    listar: async () => {
        const { data } = await api.get<ActividadResponse[]>("/actividad");
        return data;
    },
    obtener: async (id: string) => {
        const { data } = await api.get<ActividadResponse>(`/actividad/${id}`);
        return data;
    },
};