// Utilidades de fechas para las pantallas de consulta (todo en hora local)
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DIAS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

const dos = (n: number) => String(n).padStart(2, "0");

export const inicioDeDia = (f: Date) => new Date(f.getFullYear(), f.getMonth(), f.getDate());
export const hoyInicio = () => inicioDeDia(new Date());
export const sumarDias = (f: Date, n: number) =>
    new Date(f.getFullYear(), f.getMonth(), f.getDate() + n);

export const mismoDia = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// Días de calendario entre a y b (b - a)
export const diasEntre = (a: Date, b: Date) =>
    Math.round((inicioDeDia(b).getTime() - inicioDeDia(a).getTime()) / 86_400_000);

// ¿El día cae dentro de [inicio, fin]? Compara solo fechas, no horas
export const cubreDia = (inicio: Date, fin: Date, dia: Date) =>
    diasEntre(inicio, dia) >= 0 && diasEntre(dia, fin) >= 0;

// Lunes de la semana laboral. Si es domingo se toma la semana que empieza mañana
export const lunesDeLaSemana = (f: Date) => {
    const dow = f.getDay();
    return sumarDias(inicioDeDia(f), dow === 0 ? 1 : 1 - dow);
};

export const rangoDeDias = (desde: Date, cantidad: number) =>
    Array.from({ length: cantidad }, (_, i) => sumarDias(desde, i));

export const primerDiaDelMes = (f: Date) => new Date(f.getFullYear(), f.getMonth(), 1);
export const ultimoDiaDelMes = (f: Date) => new Date(f.getFullYear(), f.getMonth() + 1, 0);

// Formato de <input type="date">: "2026-09-23"
export const aInputFecha = (f: Date) => `${f.getFullYear()}-${dos(f.getMonth() + 1)}-${dos(f.getDate())}`;

export const desdeInputFecha = (valor: string): Date | null => {
    const [anio, mes, dia] = valor.split("-").map(Number);
    if (!anio || !mes || !dia) return null;
    return new Date(anio, mes - 1, dia);
};

export const nombreDiaCorto = (f: Date) => DIAS[f.getDay()];
export const esDomingo = (f: Date) => f.getDay() === 0;
export const diaMesCorto = (f: Date) => `${f.getDate()} ${MESES[f.getMonth()]}`;

// "21 al 26 sep 2026", "28 sep al 3 oct 2026" o "23 sep 2026"
export const etiquetaRango = (dias: Date[]) => {
    if (dias.length === 0) return "";
    const a = dias[0];
    const b = dias[dias.length - 1];
    if (mismoDia(a, b)) return `${diaMesCorto(a)} ${a.getFullYear()}`;
    if (a.getMonth() === b.getMonth()) {
        return `${a.getDate()} al ${b.getDate()} ${MESES[b.getMonth()]} ${b.getFullYear()}`;
    }
    return `${diaMesCorto(a)} al ${diaMesCorto(b)} ${b.getFullYear()}`;
};

// "08-13 h" o "16 h"
export const etiquetaHoras = (inicio: Date, fin: Date) => {
    const h1 = inicio.getHours();
    const h2 = fin.getHours();
    return h1 === h2 ? `${dos(h1)} h` : `${dos(h1)}-${dos(h2)} h`;
};

// "IR-2026-0409" -> "IR-0409"
export const folioCorto = (folio: string) => folio.replace(/^([A-Za-z]+)-\d{4}-(\d+)$/, "$1-$2");
