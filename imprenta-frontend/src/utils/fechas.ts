const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_LARGOS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const dos = (n: number) => n.toString().padStart(2, "0");

/**
 * Convierte lo que manda el backend a Date.
 * "2026-09-12" (LocalDate) se lee en hora local. new Date("2026-09-12") lo toma
 * como UTC y en Sonora mostraría el día anterior.
 */
export const aFecha = (iso: string): Date => {
  if (iso.length <= 10) {
    const [anio, mes, dia] = iso.split("-").map(Number);
    return new Date(anio, mes - 1, dia);
  }
  return new Date(iso);
};

const mismoDia = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const esHoy = (iso: string) => mismoDia(aFecha(iso), new Date());

export const esAyer = (iso: string) => {
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  return mismoDia(aFecha(iso), ayer);
};

// "2026-09-12" -> "12 sep"
export const diaMes = (iso: string) => {
  const f = aFecha(iso);
  return `${f.getDate()} ${MESES[f.getMonth()]}`;
};

// "2026-09-12" -> "12 sep 2026"
export const diaMesAnio = (iso: string) => `${diaMes(iso)} ${aFecha(iso).getFullYear()}`;

// "2026-09-12T08:00:00" -> "08"
export const hora = (iso: string) => dos(aFecha(iso).getHours());

// "2026-09-12T10:15:00" -> "10:15"
export const horaMinutos = (iso: string) => {
  const f = aFecha(iso);
  return `${dos(f.getHours())}:${dos(f.getMinutes())}`;
};

// "hoy 10:15", "ayer 18:30" o "12 sep 10:15"
export const cuando = (iso: string) => {
  const dia = esHoy(iso) ? "hoy" : esAyer(iso) ? "ayer" : diaMes(iso);
  return `${dia} ${horaMinutos(iso)}`;
};

// Fecha de hoy como "2026-11-02", el formato de <input type="date">
export const hoyISO = () => {
  const f = new Date();
  return `${f.getFullYear()}-${dos(f.getMonth() + 1)}-${dos(f.getDate())}`;
};

export const nombreMes = (fecha: Date) => MESES_LARGOS[fecha.getMonth()];
