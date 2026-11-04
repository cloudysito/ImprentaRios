// Descarga un CSV en el navegador (con BOM para que Excel respete los acentos)
export function descargarCsv(nombreArchivo: string, filas: string[][]) {
    const escapar = (valor: string) => `"${valor.replace(/"/g, '""')}"`;
    const contenido = "\uFEFF" + filas.map((fila) => fila.map(escapar).join(",")).join("\r\n");
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombreArchivo;
    enlace.click();
    URL.revokeObjectURL(url);
}
