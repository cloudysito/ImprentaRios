export interface EtapaCalculada {
    nombre: string;
    fechaHoraInicio: string;
    fechaHoraFin: string;
}

const ETAPAS_BASE = [
    { nombre: "Diseño", dias: 2 },
    { nombre: "Impresión", dias: 3 },
    { nombre: "Acabado", dias: 2 },
    { nombre: "Entrega", dias: 1 },
];

const HORA_INICIO = "08:00:00";
const HORA_FIN = "17:00:00";

const dos = (n: number) => String(n).padStart(2, "0");

// Convertir fecha local a medianoche "2026-09-22T00:00:00"
const aFecha = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00`);

// Formato que entiende LocalDateTime en Java: "2026-09-22T08:00:00"
const aISO = (f: Date, hora: string) =>
    `${f.getFullYear()}-${dos(f.getMonth() + 1)}-${dos(f.getDate())}T${hora}`;

const sumarDias = (f: Date, dias: number) => {
    const r = new Date(f);
    r.setDate(r.getDate() + dias);
    return r;
};

// Se planea hacia atrás: la última etapa termina el día de entrega
export function calcularEtapas(fechaEntrega: string): EtapaCalculada[] {
    let fin = aFecha(fechaEntrega);
    const etapas: EtapaCalculada[] = [];

    for (let i = ETAPAS_BASE.length - 1; i >= 0; i--) {
        const { nombre, dias } = ETAPAS_BASE[i];
        const inicio = sumarDias(fin, -(dias - 1));
        etapas.unshift({
            nombre,
            fechaHoraInicio: aISO(inicio, HORA_INICIO),
            fechaHoraFin: aISO(fin, HORA_FIN),
        });
        fin = sumarDias(inicio, -1);
    }
    return etapas;
}