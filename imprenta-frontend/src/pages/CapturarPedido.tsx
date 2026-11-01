import React from 'react';
import '../styles/CapturarPedido.css';

const CapturarPedido: React.FC = () => {
    return (
        <div className="capturar-pedido-container">
            <div className="content-grid">
                <section className="form-card">
                    <div className="section-header">
                        <h2>DATOS DEL CLIENTE</h2>
                        <span className="required-note">* Campos obligatorios</span>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Nombre o razón social <span>*</span></label>
                            <input type="text" name="nombreCliente" placeholder="Ej. Papelería El Trébol S.A. de C.V." />
                        </div>
                        <div className="form-group">
                            <label>Teléfono de contacto <span>*</span></label>
                            <input type="text" name="telefonoContacto" placeholder="Ej. 644 118 22 40" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Correo electrónico</label>
                            <input type="email" name="correoElectronico" placeholder="Ej. compras@eltrebol.mx" />
                        </div>
                        <div className="form-group">
                            <label>Persona que solicita</label>
                            <input type="text" name="personaSolicita" placeholder="Ej. Ing. Laura Beltrán" />
                        </div>
                    </div>

                    <h2 className="section-title mt-4">ESPECIFICACIONES DEL TRABAJO</h2>
                    <div className="form-row three-cols">
                        <div className="form-group">
                            <label>Tipo de producto <span>*</span></label>
                            <select name="tipoProductoId" defaultValue="">
                                <option value="" disabled>Seleccionar...</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Cantidad (piezas) <span>*</span></label>
                            <input type="number" name="cantidad" placeholder="0" />
                        </div>
                        <div className="form-group">
                            <label>Material <span>*</span></label>
                            <select name="materialId" defaultValue="">
                                <option value="" disabled>Seleccionar...</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row three-cols">
                        <div className="form-group">
                            <label>Medida final <span>*</span></label>
                            <input type="text" name="medidaFinal" placeholder="Ej. 21.5 x 14 cm" />
                        </div>
                        <div className="form-group">
                            <label>Tintas <span>*</span></label>
                            <select name="tintaId" defaultValue="">
                                <option value="" disabled>Seleccionar...</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Acabado</label>
                            <select name="acabadoId" defaultValue="">
                                <option value="" disabled>Seleccionar...</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group full-width mt-2">
                        <label>Observaciones para producción</label>
                        <textarea rows={2} name="observaciones" placeholder="Añade detalles o instrucciones específicas..."></textarea>
                    </div>

                    <h2 className="section-title mt-4">DISEÑO AL QUE SE VINCULA</h2>
                    <div className="form-group full-width">
                        <label>Archivo de diseño (opcional)</label>
                        <select name="archivoDisenioId" defaultValue="">
                            <option value="" disabled>Seleccionar archivo registrado...</option>
                        </select>
                    </div>
                </section>

                <aside className="summary-sidebar">
                    <div className="summary-card">
                        <h3>FOLIO</h3>
                        <h2 className="folio-number">IR-XXXX-XXXX</h2>
                        <span className="badge draft">Borrador sin registrar</span>

                        <div className="summary-details">
                            <div className="detail-row">
                                <span>Capturado por</span>
                                <strong>-</strong>
                            </div>
                            <div className="detail-row">
                                <span>Fecha de captura</span>
                                <strong>-</strong>
                            </div>
                        </div>
                    </div>

                    <div className="summary-card">
                        <h3>PRECIO ACORDADO</h3>
                        <div className="price-input">
                            <span className="currency-symbol">$</span>
                            <input type="number" name="precioAcordado" placeholder="0.00" />
                        </div>
                        <p className="warning-text">
                            <span className="icon">!</span> El costo puede variar o cambiar en el futuro.
                        </p>
                    </div>

                    <div className="info-card success">
                        <h4>Disponibilidad de material</h4>
                        <p>Estado de disponibilidad del material seleccionado.</p>
                    </div>

                    <div className="action-buttons">
                        <button className="btn-primary" type="button">
                            Registrar pedido
                        </button>
                        <button className="btn-secondary" type="button">
                            Guardar borrador
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CapturarPedido;