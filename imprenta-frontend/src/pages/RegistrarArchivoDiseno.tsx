import React, { useState } from 'react';
import '../styles/RegistrarArchivoDiseno.css';
import { registrarArchivoDisenio } from '../services/archivoDisenioService';

const RegistrarDisenio: React.FC = () => {
    const [archivo, setArchivo] = useState<File | null>(null);
    const [mensaje, setMensaje] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [formulario, setFormulario] = useState({
        fechaRecepcion: '2026-09-21',
        fechaEntrega: '2026-09-28',
        resolucion: 300,
        modoColor: 'CMYK',
        sangrado: 3,
        medidaArchivo: '22.1 x 14.6 cm',
        caras: 2,
        prensa: 'Offset',
    });

    const actualizar = (campo: keyof typeof formulario, valor: string) => {
        setFormulario((actual) => ({
            ...actual,
            [campo]: ['resolucion', 'sangrado', 'caras'].includes(campo)
                ? Number(valor)
                : valor,
        }));
    };

    const registrar = async () => {
        if (!archivo) {
            setMensaje('Selecciona un archivo antes de registrar el diseño.');
            return;
        }

        setGuardando(true);
        setMensaje('');
        try {
            await registrarArchivoDisenio({
                ...formulario,
                nombreArchivo: archivo.name,
                version: 1,
            });
            setMensaje('Diseño registrado correctamente.');
        } catch {
            setMensaje('No se pudo registrar el diseño.');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="registrar-disenio-container">
            <div className="content-grid">
                <div className="main-column">
                    <section className="form-card">
                        <div className="section-header">
                            <h2>RECEPCIÓN Y ENTREGA</h2>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Fecha de recepción</label>
                                <input type="date" name="fechaRecepcion" value={formulario.fechaRecepcion} onChange={(e) => actualizar('fechaRecepcion', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Fecha de entrega estimada</label>
                                <input type="date" name="fechaEntrega" value={formulario.fechaEntrega} onChange={(e) => actualizar('fechaEntrega', e.target.value)} />
                            </div>
                        </div>
                    </section>
                    <section className="form-card">
                        <div className="section-header">
                            <h2>ARCHIVO DEFINITIVO</h2>
                        </div>
                        <div className="upload-zone">
                            <div className="upload-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                            </div>
                            <div className="upload-text">
                                <strong>Arrastra el archivo o selecciónalo desde tu equipo</strong>
                                <p>Formatos aceptados PDF, AI, TIFF y EPS · Tamaño máximo 200 MB</p>
                            </div>
                            <input id="archivo-disenio" hidden type="file" accept=".pdf,.ai,.tiff,.eps" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
                            <button className="btn-secondary outline" type="button" onClick={() => document.getElementById('archivo-disenio')?.click()}>
                                Seleccionar archivo
                            </button>
                        </div>
                        <div className="uploaded-file">
                            <div className="file-icon-box pdf">PDF</div>
                            <div className="file-info">
                                <strong>{archivo?.name ?? 'Ningún archivo seleccionado'}</strong>
                                <span>{archivo ? `${(archivo.size / 1024 / 1024).toFixed(1)} MB · Versión 1` : 'Selecciona el archivo definitivo'}</span>
                            </div>
                            <div className="file-status">
                                <span className="status-dot green"></span> Listo para validar
                            </div>
                        </div>
                    </section>
                    <section className="form-card">
                        <div className="section-header">
                            <h2>REQUERIMIENTOS TÉCNICOS DE IMPRESIÓN</h2>
                        </div>

                        <div className="form-row three-cols">
                            <div className="form-group">
                                <label>Resolución</label>
                                <select name="resolucion" value={formulario.resolucion} onChange={(e) => actualizar('resolucion', e.target.value)}>
                                    <option value="300">300 dpi</option>
                                    <option value="150">150 dpi</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Modo de color</label>
                                <select name="modoColor" value={formulario.modoColor} onChange={(e) => actualizar('modoColor', e.target.value)}>
                                    <option value="CMYK">CMYK</option>
                                    <option value="RGB">RGB</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Sangrado (mm)</label>
                                <input type="number" name="sangrado" value={formulario.sangrado} onChange={(e) => actualizar('sangrado', e.target.value)} />
                            </div>
                        </div>

                        <div className="form-row three-cols">
                            <div className="form-group">
                                <label>Medida del archivo</label>
                                <input type="text" name="medidaArchivo" value={formulario.medidaArchivo} onChange={(e) => actualizar('medidaArchivo', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Caras a imprimir</label>
                                <select name="caras" value={formulario.caras} onChange={(e) => actualizar('caras', e.target.value)}>
                                    <option value="1">1 cara</option>
                                    <option value="2">2 caras</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Prensa destino</label>
                                <select name="prensa" value={formulario.prensa} onChange={(e) => actualizar('prensa', e.target.value)}>
                                    <option value="Offset">Offset Heidelberg GTO</option>
                                    <option value="Digital">Digital Konica Minolta</option>
                                </select>
                            </div>
                        </div>
                    </section>
                </div>
                <aside className="summary-sidebar">
                    <div className="summary-card">
                        <h3>VISTA PREVIA</h3>
                        <div className="preview-box">
                            <p>Aquí verás la primera cara de tu archivo</p>
                        </div>
                    </div>
                    <div className="summary-card">
                        <h3>VALIDACIÓN AUTOMÁTICA</h3>
                        <ul className="validation-list">
                            <li className="valid">
                                <span className="icon check">✓</span> Resolución mínima de 300 dpi
                            </li>
                            <li className="valid">
                                <span className="icon check">✓</span> Perfil de color CMYK
                            </li>
                            <li className="valid">
                                <span className="icon check">✓</span> Tipografías incrustadas
                            </li>
                            <li className="warning">
                                <span className="icon alert">!</span> Sangrado detectado de 3 mm en tres lados
                            </li>
                        </ul>
                    </div>
                    <div className="summary-card">
                        <h3>HISTORIAL DE VERSIONES</h3>
                        <ul className="history-list">
                            <li><strong>v3</strong> · hoy 11:42 · corrección de sangrado</li>
                            <li><strong>v2</strong> · 19 sep · cambio de tipografía</li>
                            <li><strong>v1</strong> · 18 sep · propuesta inicial</li>
                        </ul>
                    </div>
                    <div className="action-buttons">
                        <button className="btn-primary" type="button" onClick={registrar} disabled={guardando}>
                            {guardando ? 'Registrando...' : 'Registrar diseño'}
                        </button>
                        {mensaje && <p className="helper-text-centered">{mensaje}</p>}
                        <p className="helper-text-centered">Revisa el aviso de sangrado antes de registrar</p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default RegistrarDisenio;