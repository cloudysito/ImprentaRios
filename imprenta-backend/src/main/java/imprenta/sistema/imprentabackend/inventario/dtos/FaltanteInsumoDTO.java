package imprenta.sistema.imprentabackend.inventario.dtos;

public record FaltanteInsumoDTO(
        String insumoId,
        String insumoNombre,
        String unidad,
        int requerido,
        int disponible
) {
    public int faltante() {
        return requerido - disponible;
    }

    // Ej. "Opalina 225 g: faltan 100 hojas (se requieren 500, hay 400)"
    public String mensaje() {
        String unidadTexto = unidad == null ? "" : " " + unidad.toLowerCase();
        return insumoNombre + ": faltan " + faltante() + unidadTexto
                + " (se requieren " + requerido + ", hay " + disponible + ")";
    }
}
