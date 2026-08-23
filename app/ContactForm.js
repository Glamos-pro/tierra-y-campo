"use client";

import { useState, useEffect } from 'react';

const WHATSAPP_NUMBER = '529616101049';
const STORAGE_KEY = 'tyc_cliente';
const DATOS_TRANSFERENCIA = {
  banco: 'BANAMEX',
  titular: 'Tierra y Campo',
  cuenta: '4879375',
  clabe: '002100702248793757',
};

const getFechaManana = () => {
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);
  return manana.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
};

const cargarDatos = () => {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
};

const guardarDatos = (form) => {
  try {
    const { formaPago, aceptaTerminos, ...resto } = form;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resto));
  } catch {}
};

export default function ContactForm({ cart, totalPrice, onClose }) {
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    formaPago: '',
    // Opcionales
    email: '',
    referencias: '',
    ciudad: 'Tuxtla Gutiérrez',
    cp: '',
    cumpleanos_dia: '',
    cumpleanos_mes: '',
    cumpleanos_anio: '',
    aceptaTerminos: false,
  });
  const [mostrarOpcionales, setMostrarOpcionales] = useState(false);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [datosGuardados, setDatosGuardados] = useState(false);

  useEffect(() => {
    const saved = cargarDatos();
    if (saved && saved.nombre) {
      setForm(prev => ({ ...prev, ...saved }));
      setDatosGuardados(true);
    }
  }, []);

  const fechaEntrega = getFechaManana();

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Escribe tu nombre';
    if (!form.telefono.trim()) e.telefono = 'Escribe tu teléfono';
    else if (!/^\d{10}$/.test(form.telefono.replace(/\s/g, ''))) e.telefono = 'Deben ser 10 dígitos';
    if (!form.direccion.trim()) e.direccion = 'Escribe tu dirección de entrega';
    if (!form.formaPago) e.formaPago = 'Elige cómo vas a pagar';
    if (!form.aceptaTerminos) e.aceptaTerminos = 'Acepta los términos para continuar';
    return e;
  };

  const handleChange = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores(prev => ({ ...prev, [campo]: null }));
  };

  const limpiarDatos = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setForm({ nombre: '', telefono: '', direccion: '', formaPago: '', email: '', referencias: '', ciudad: 'Tuxtla Gutiérrez', cp: '', cumpleanos_dia: '', cumpleanos_mes: '', cumpleanos_anio: '', aceptaTerminos: false });
    setDatosGuardados(false);
  };

  const tieneCumple = form.cumpleanos_dia && form.cumpleanos_mes && form.cumpleanos_anio;
  const cumpleTexto = tieneCumple ? `${form.cumpleanos_dia} de ${form.cumpleanos_mes} de ${form.cumpleanos_anio}` : '';

  const resumenProductos = cart.map(item =>
    `• ${item.emoji} ${item.name} (${item.detalle || item.unit}) — $${item.price}`
  ).join('\n');

  const mensajeWhatsApp = () => {
    const textoTransferencia = form.formaPago === 'Transferencia'
      ? `\n\n🏦 *Datos para transferencia:*\nBanco: ${DATOS_TRANSFERENCIA.banco}\nTitular: ${DATOS_TRANSFERENCIA.titular}\nCuenta: ${DATOS_TRANSFERENCIA.cuenta}\nCLABE: ${DATOS_TRANSFERENCIA.clabe}\n📸 Envía tu comprobante con tu nombre.`
      : '';
    const texto = `🌾 *NUEVO PEDIDO — Tierra & Campo*
─────────────────────
👤 *Cliente:* ${form.nombre}
📱 *Teléfono:* ${form.telefono}${form.email ? `\n📧 *Email:* ${form.email}` : ''}${cumpleTexto ? `\n🎂 *Cumpleaños:* ${cumpleTexto}` : ''}
📍 *Dirección:* ${form.direccion}${form.referencias ? `\n🗺️ *Referencias:* ${form.referencias}` : ''}
📅 *Entrega:* ${fechaEntrega}
💳 *Pago:* ${form.formaPago}
─────────────────────
🛒 *Productos:*
${resumenProductos}
─────────────────────
💰 *TOTAL: $${totalPrice.toFixed(2)}*${textoTransferencia}`;
    return encodeURIComponent(texto);
  };

  const handleEnviar = () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrores(e); return; }
    setLoading(true);
    guardarDatos(form);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeWhatsApp()}`, '_blank');
    setTimeout(() => { setLoading(false); setEnviado(true); }, 800);
  };

  // ─── PANTALLA DE ÉXITO ──────────────────────────────────────────────
  if (enviado) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap');
          .cf-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:400;display:flex;align-items:center;justify-content:center;padding:20px;font-family:'DM Sans',sans-serif;}
          .cf-success{background:white;border-radius:24px;width:100%;max-width:440px;padding:40px;text-align:center;}
          .cf-success-icon{font-size:64px;margin-bottom:16px;}
          .cf-success-title{font-family:'Fraunces',serif;font-size:26px;font-weight:300;color:#085041;margin-bottom:10px;}
          .cf-success-desc{font-size:14px;color:#666;line-height:1.6;margin-bottom:24px;}
          .cf-transferencia-box{background:#E1F5EE;border-radius:12px;padding:16px;text-align:left;margin-bottom:20px;}
          .cf-transferencia-title{color:#085041;font-weight:600;display:block;margin-bottom:8px;font-size:13px;}
          .cf-transferencia-datos{font-size:13px;color:#444;line-height:1.9;}
          .cf-success-btn{background:#085041;color:white;border:none;padding:14px 32px;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;}
          .cf-success-btn:hover{background:#1D9E75;}
        `}</style>
        <div className="cf-overlay">
          <div className="cf-success">
            <div className="cf-success-icon">🎉</div>
            <div className="cf-success-title">¡Pedido enviado!</div>
            <div className="cf-success-desc">
              Te contactaremos para confirmar tu entrega del <strong>{fechaEntrega}</strong>.
            </div>
            {form.formaPago === 'Transferencia' && (
              <div className="cf-transferencia-box">
                <span className="cf-transferencia-title">🏦 Realiza tu transferencia a:</span>
                <div className="cf-transferencia-datos">
                  Banco: <strong>{DATOS_TRANSFERENCIA.banco}</strong><br/>
                  Titular: <strong>{DATOS_TRANSFERENCIA.titular}</strong><br/>
                  Cuenta: <strong>{DATOS_TRANSFERENCIA.cuenta}</strong><br/>
                  CLABE: <strong>{DATOS_TRANSFERENCIA.clabe}</strong>
                </div>
              </div>
            )}
            <button className="cf-success-btn" onClick={onClose}>Volver a la tienda</button>
          </div>
        </div>
      </>
    );
  }

  // ─── FORMULARIO SIMPLIFICADO ─────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap');
        .cf-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:400;display:flex;align-items:center;justify-content:center;padding:20px;font-family:'DM Sans',sans-serif;}
        .cf-box{background:white;border-radius:24px;width:100%;max-width:500px;max-height:92vh;overflow-y:auto;position:relative;}
        .cf-header{padding:24px 24px 0;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
        .cf-title{font-family:'Fraunces',serif;font-size:22px;font-weight:300;color:#085041;}
        .cf-close{background:#f0f0f0;border:none;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#555;}
        .cf-close:hover{background:#ddd;}
        .cf-body{padding:0 24px 24px;}

        /* Banner datos guardados */
        .cf-saved{background:#E1F5EE;border:1px solid #9FE1CB;border-radius:10px;padding:10px 14px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;font-size:13px;color:#085041;}
        .cf-saved-btn{font-size:12px;color:#E53E3E;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;text-decoration:underline;}

        /* Resumen mini */
        .cf-resumen-mini{background:#F7F6F2;border-radius:12px;padding:14px;margin-bottom:20px;}
        .cf-resumen-mini-title{font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;}
        .cf-resumen-mini-item{display:flex;justify-content:space-between;font-size:13px;color:#555;padding:4px 0;}
        .cf-resumen-mini-total{display:flex;justify-content:space-between;align-items:baseline;margin-top:10px;padding-top:10px;border-top:1.5px solid #085041;}
        .cf-resumen-mini-total-label{font-size:13px;color:#888;}
        .cf-resumen-mini-total-price{font-family:'Fraunces',serif;font-size:24px;font-weight:300;color:#085041;}

        /* Campos */
        .cf-group{margin-bottom:14px;}
        .cf-label{font-size:12px;font-weight:600;color:#555;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:5px;display:block;}
        .cf-input{width:100%;border:1.5px solid rgba(0,0,0,0.12);border-radius:10px;padding:11px 14px;font-family:'DM Sans',sans-serif;font-size:15px;color:#1C1C1A;outline:none;transition:border-color 0.2s;box-sizing:border-box;}
        .cf-input:focus{border-color:#1D9E75;}
        .cf-input.error{border-color:#E53E3E;}
        .cf-error{font-size:12px;color:#E53E3E;margin-top:4px;}

        /* Entrega */
        .cf-entrega{background:#E1F5EE;border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:10px;margin-bottom:14px;}
        .cf-entrega-texto{font-size:13px;color:#085041;font-weight:500;}
        .cf-entrega-sub{font-size:11px;color:#1D9E75;margin-top:2px;}

        /* Pago */
        .cf-pago-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px;}
        .cf-pago-btn{border:2px solid rgba(0,0,0,0.1);border-radius:12px;padding:14px 10px;text-align:center;cursor:pointer;background:white;transition:all 0.2s;font-family:'DM Sans',sans-serif;}
        .cf-pago-btn:hover{border-color:#1D9E75;}
        .cf-pago-btn.active{border-color:#085041;background:#E1F5EE;}
        .cf-pago-icon{font-size:22px;display:block;margin-bottom:5px;}
        .cf-pago-label{font-size:13px;font-weight:600;color:#1C1C1A;display:block;}
        .cf-pago-desc{font-size:11px;color:#888;display:block;margin-top:2px;}

        /* Opcionales */
        .cf-opcionales-toggle{display:flex;align-items:center;gap:8px;font-size:13px;color:#1D9E75;font-weight:500;cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif;margin:16px 0 12px;padding:0;}
        .cf-opcionales-toggle:hover{color:#085041;}
        .cf-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .cf-cumple-grid{display:grid;grid-template-columns:80px 1fr 90px;gap:8px;}
        .cf-select{width:100%;border:1.5px solid rgba(0,0,0,0.12);border-radius:10px;padding:11px 14px;font-family:'DM Sans',sans-serif;font-size:15px;color:#1C1C1A;outline:none;background:white;box-sizing:border-box;}
        .cf-select:focus{border-color:#1D9E75;}

        /* Términos */
        .cf-terminos{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:#555;margin:16px 0;cursor:pointer;}
        .cf-terminos input{margin-top:2px;flex-shrink:0;width:16px;height:16px;accent-color:#085041;}
        .cf-terminos a{color:#085041;font-weight:500;}

        /* Botón */
        .cf-btn{width:100%;background:#085041;color:white;border:none;padding:15px;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:background 0.2s;}
        .cf-btn:hover:not(:disabled){background:#1D9E75;}
        .cf-btn:disabled{background:#ccc;cursor:not-allowed;}
        .cf-nota{font-size:11px;color:#aaa;text-align:center;margin-top:10px;line-height:1.5;}

        @media(max-width:600px){
          .cf-box{border-radius:20px 20px 0 0;position:fixed;bottom:0;left:0;right:0;max-height:95vh;}
          .cf-overlay{align-items:flex-end;padding:0;}
          .cf-grid2{grid-template-columns:1fr;}
          .cf-cumple-grid{grid-template-columns:1fr 1fr 1fr;}
        }
      `}</style>

      <div className="cf-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="cf-box">
          <div className="cf-header">
            <div className="cf-title">Tu pedido</div>
            <button className="cf-close" onClick={onClose}>✕</button>
          </div>

          <div className="cf-body">

            {/* Banner datos guardados */}
            {datosGuardados && (
              <div className="cf-saved">
                <span>✅ Datos cargados automáticamente</span>
                <button className="cf-saved-btn" onClick={limpiarDatos}>Cambiar datos</button>
              </div>
            )}

            {/* Resumen del pedido */}
            <div className="cf-resumen-mini">
              <div className="cf-resumen-mini-title">Resumen</div>
              {cart.map(item => (
                <div key={item.id} className="cf-resumen-mini-item">
                  <span>{item.emoji} {item.name} ({item.detalle || item.unit})</span>
                  <span style={{fontWeight:600, color:'#085041'}}>${item.price}</span>
                </div>
              ))}
              <div className="cf-resumen-mini-total">
                <span className="cf-resumen-mini-total-label">Total estimado</span>
                <span className="cf-resumen-mini-total-price">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Fecha de entrega */}
            <div className="cf-entrega">
              <span style={{fontSize:'20px'}}>📅</span>
              <div>
                <div className="cf-entrega-texto">Entrega: {fechaEntrega}</div>
                <div className="cf-entrega-sub">Pedidos antes de las 9pm · Horario 10:30am–5pm</div>
              </div>
            </div>

            {/* Campos obligatorios */}
            <div className="cf-group">
              <label className="cf-label">Nombre *</label>
              <input className={`cf-input ${errores.nombre ? 'error' : ''}`} type="text" placeholder="Tu nombre completo" value={form.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />
              {errores.nombre && <div className="cf-error">{errores.nombre}</div>}
            </div>

            <div className="cf-group">
              <label className="cf-label">Teléfono *</label>
              <input className={`cf-input ${errores.telefono ? 'error' : ''}`} type="tel" placeholder="10 dígitos" value={form.telefono} onChange={(e) => handleChange('telefono', e.target.value)} />
              {errores.telefono && <div className="cf-error">{errores.telefono}</div>}
            </div>

            <div className="cf-group">
              <label className="cf-label">Dirección de entrega *</label>
              <input className={`cf-input ${errores.direccion ? 'error' : ''}`} type="text" placeholder="Calle, número, colonia" value={form.direccion} onChange={(e) => handleChange('direccion', e.target.value)} />
              {errores.direccion && <div className="cf-error">{errores.direccion}</div>}
            </div>

            {/* Forma de pago */}
            <div className="cf-group">
              <label className="cf-label">Forma de pago *</label>
              <div className="cf-pago-grid">
                <button className={`cf-pago-btn ${form.formaPago === 'Efectivo' ? 'active' : ''}`} onClick={() => handleChange('formaPago', 'Efectivo')}>
                  <span className="cf-pago-icon">💵</span>
                  <span className="cf-pago-label">Efectivo</span>
                  <span className="cf-pago-desc">Al entregar</span>
                </button>
                <button className={`cf-pago-btn ${form.formaPago === 'Transferencia' ? 'active' : ''}`} onClick={() => handleChange('formaPago', 'Transferencia')}>
                  <span className="cf-pago-icon">🏦</span>
                  <span className="cf-pago-label">Transferencia</span>
                  <span className="cf-pago-desc">Te damos los datos</span>
                </button>
              </div>
              {errores.formaPago && <div className="cf-error">{errores.formaPago}</div>}
            </div>

            {/* Campos opcionales */}
            <button className="cf-opcionales-toggle" onClick={() => setMostrarOpcionales(!mostrarOpcionales)}>
              {mostrarOpcionales ? '▲' : '▼'} {mostrarOpcionales ? 'Ocultar' : 'Agregar'} datos adicionales (correo, referencias, cumpleaños)
            </button>

            {mostrarOpcionales && (
              <>
                <div className="cf-group">
                  <label className="cf-label">Correo electrónico</label>
                  <input className="cf-input" type="email" placeholder="tucorreo@ejemplo.com" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
                </div>

                <div className="cf-group">
                  <label className="cf-label">Referencias</label>
                  <input className="cf-input" type="text" placeholder="Entre calles, color de fachada..." value={form.referencias} onChange={(e) => handleChange('referencias', e.target.value)} />
                </div>

                <div className="cf-grid2" style={{marginBottom:'14px'}}>
                  <div>
                    <label className="cf-label">Ciudad</label>
                    <input className="cf-input" type="text" value={form.ciudad} onChange={(e) => handleChange('ciudad', e.target.value)} />
                  </div>
                  <div>
                    <label className="cf-label">C.P.</label>
                    <input className="cf-input" type="text" placeholder="29000" value={form.cp} onChange={(e) => handleChange('cp', e.target.value)} />
                  </div>
                </div>

                <div className="cf-group">
                  <label className="cf-label">🎂 Cumpleaños (opcional — te regalamos algo ese día)</label>
                  <div className="cf-cumple-grid">
                    <input className="cf-input" type="number" placeholder="Día" min="1" max="31" value={form.cumpleanos_dia} onChange={(e) => handleChange('cumpleanos_dia', e.target.value)} />
                    <select className="cf-select" value={form.cumpleanos_mes} onChange={(e) => handleChange('cumpleanos_mes', e.target.value)}>
                      <option value="">Mes</option>
                      {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'].map((m,i) => (
                        <option key={i} value={m}>{m}</option>
                      ))}
                    </select>
                    <input className="cf-input" type="number" placeholder="Año" min="1930" max="2010" value={form.cumpleanos_anio} onChange={(e) => handleChange('cumpleanos_anio', e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {/* Términos */}
            <label className="cf-terminos">
              <input type="checkbox" checked={form.aceptaTerminos} onChange={(e) => handleChange('aceptaTerminos', e.target.checked)} />
              <span>
                Acepto los{' '}
                <a href="/terminos" target="_blank">Términos y Condiciones</a>
                {' '}y el{' '}
                <a href="/privacidad" target="_blank">Aviso de Privacidad</a>
              </span>
            </label>
            {errores.aceptaTerminos && <div className="cf-error" style={{marginTop:'-8px',marginBottom:'12px'}}>{errores.aceptaTerminos}</div>}

            <button className="cf-btn" onClick={handleEnviar} disabled={loading || !form.formaPago || !form.aceptaTerminos}>
              {loading ? 'Enviando...' : !form.formaPago ? '← Elige forma de pago' : !form.aceptaTerminos ? '← Acepta los términos' : '📲 Confirmar pedido por WhatsApp'}
            </button>
            <div className="cf-nota">Al confirmar se abrirá WhatsApp con tu pedido listo para enviar.</div>

          </div>
        </div>
      </div>
    </>
  );
}
