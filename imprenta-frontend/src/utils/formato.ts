const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// "2026-09-22T00:00:00" -> "22 sep"
export const formatFechaCorta = (iso: string) => {
  const fecha = new Date(iso);
  return `${fecha.getDate()} ${MESES[fecha.getMonth()]}`;
};

// "2026-09-22T00:00:00" -> "22 sep 2026"
export const formatFechaLarga = (iso: string) =>
  `${formatFechaCorta(iso)} ${new Date(iso).getFullYear()}`;

// 1500 -> "1,500"
export const formatNumero = (n: number) => n.toLocaleString("es-MX");
