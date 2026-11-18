export interface ActividadResponse {
    id: string;
    nombreActividad: string;
    descripcion: string;
    fechaHoraInicio: string;
    fechaHoraFin: string;
    pedidoId: string;
    empleadoId: string;
    empleadoNombre: string | null; // lo resuelve el backend, el dueño ya no es el único que ve nombres
}