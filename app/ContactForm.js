"use client";

import { useState, useEffect } from 'react';

const WHATSAPP_NUMBER = '529611176006';
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
  return manana.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const cargarDatosGuardados = () => {
  try {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? JSON.parse(datos) : null;
  } catch { return null; }
};

const guardarDatos = (form) => {
  try {
    // Guardamos todo excepto la forma de pago
    const { formaPago, ...resto } = form;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resto));
  } catch {}
};

export default function ContactForm({ cart, totalPrice, onClose }) {
  const [form, setForm] = useState({
    cumpleanos: '',
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    cp: '',
    referencias: '',
    formaPago: '',
  });
  const [errores, setErrores]         = useState({});
  const [enviado, setEnviado]         = useState(false);
  const [loading, setLoading]         = useState(false);
  const [datosGuardados, setDatosGuardados] = useState(false);

  const fechaEntrega = getFechaManana();

  // Cargar datos guardados al abrir el formulario
  useEffect(() => {
    const saved = cargarDatosGuardados();
    if (saved && saved.nombre) {
      setForm(prev => ({ ...prev, ...saved }));
      setDatosGuardados(true);
    }
  }, []);

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!form.telefono.trim()) e.telefono = 'El teléfono es obligatorio';
    else if (!/^\d{10}$/.test(form.telefono.replace(/\s/g, ''))) e.telefono = 'Escribe 10 dígitos';
    if (!form.direccion.trim()) e.direccion = 'La dirección es obligatoria';
    if (!form.ciudad.trim()) e.ciudad = 'La ciudad es obligatoria';
    if (!form.cp.trim()) e.cp = 'El C.P. es obligatorio';
    if (!form.formaPago) e.formaPago = 'Elige una forma de pago';
    return e;
  };

  const handleChange = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores(prev => ({ ...prev, [campo]: null }));
  };

  const limpiarDatos = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setForm({ cumpleanos: '', nombre: '', telefono: '', email: '', direccion: '', ciudad: '', cp: '', referencias: '', formaPago: '' });
    setDatosGuardados(false);
  };

  const resumenProductos = cart.map(item =>
    `• ${item.emoji} ${item.name} (${item.detalle || item.unit}) — $${item.price}`
  ).join('\n');

  const mensajeWhatsApp = () => {
    const textoTransferencia = form.formaPago === 'Transferencia'
      ? `\n💳 *Datos para transferencia:*\nBanco: ${DATOS_TRANSFERENCIA.banco}\nTitular: ${DATOS_TRANSFERENCIA.titular}\nCuenta: ${DATOS_TRANSFERENCIA.cuenta}\nCLABE: ${DATOS_TRANSFERENCIA.clabe}\n\n📸 *Envía tu comprobante por WhatsApp con tu nombre completo.*`
      : '';
    const texto = `🌾 *NUEVO PEDIDO — Tierra & Campo*\n─────────────────────\n👤 *Cliente:* ${form.nombre}\n📱 *Teléfono:* ${form.telefono}${form.email ? `\n📧 *Email:* ${form.email}` : ''}${form.cumpleanos ? `\n🎂 *Cumpleaños:* ${form.cumpleanos}` : ''}\n📍 *Dirección:* ${form.direccion}\n🏙️ *Ciudad:* ${form.ciudad} | *C.P.:* ${form.cp}${form.referencias ? `\n🗺️ *Referencias:* ${form.referencias}` : ''}\n📅 *Entrega:* ${fechaEntrega}\n💳 *Pago:* ${form.formaPago}\n─────────────────────\n🛒 *Productos:*\n${resumenProductos}\n─────────────────────\n💰 *TOTAL: $${totalPrice.toFixed(2)}*${textoTransferencia}`;
    return encodeURIComponent(texto);
  };

  const handleEnviar = () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrores(e); return; }
    setLoading(true);
    guardarDatos(form); // Guardamos los datos para la próxima vez
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
          .cf-box{background:white;border-radius:24px;width:100%;max-width:460px;padding:40px;text-align:center;}
          .cf-success-icon{font-size:64px;margin-bottom:16px;}
          .cf-success-title{font-family:'Fraunces',serif;font-size:28px;font-weight:300;color:#085041;margin-bottom:12px;}
          .cf-success-desc{font-size:15px;color:#666;line-height:1.6;margin-bottom:28px;}
          .cf-transferencia-box{margin-top:16px;background:#E1F5EE;border-radius:12px;padding:16px;text-align:left;}
          .cf-transferencia-title{color:#085041;font-weight:600;display:block;margin-bottom:8px;font-size:14px;}
          .cf-transferencia-datos{font-size:13px;color:#444;line-height:1.8;}
          .cf-comprobante-nota{margin-top:12px;background:#FFF8E1;border-radius:10px;padding:12px;font-size:13px;color:#856404;line-height:1.5;}
          .cf-success-btn{background:#085041;color:white;border:none;padding:14px 32px;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;}
          .cf-success-btn:hover{background:#1D9E75;}
        `}</style>
        <div className="cf-overlay">
          <div className="cf-box">
            <div className="cf-success-icon">🎉</div>
            <div className="cf-success-title">¡Pedido enviado!</div>
            <div className="cf-success-desc">
              Tu pedido fue enviado. Nos pondremos en contacto contigo para confirmar tu entrega del día siguiente.
              {form.cumpleanos && (
                <div style={{marginTop:'12px',background:'#FFF0F5',borderRadius:'10px',padding:'12px',fontSize:'13px',color:'#C2185B'}}>
                  🎂 ¡Gracias por compartir tu fecha de cumpleaños! Te sorprenderemos ese día especial.
                </div>
              )}
              {form.formaPago === 'Transferencia' && (
                <div className="cf-transferencia-box">
                  <span className="cf-transferencia-title">🏦 Datos para transferencia:</span>
                  <div className="cf-transferencia-datos">
                    Banco: <strong>{DATOS_TRANSFERENCIA.banco}</strong><br/>
                    Titular: <strong>{DATOS_TRANSFERENCIA.titular}</strong><br/>
                    Cuenta: <strong>{DATOS_TRANSFERENCIA.cuenta}</strong><br/>
                    CLABE: <strong>{DATOS_TRANSFERENCIA.clabe}</strong>
                  </div>
                  <div className="cf-comprobante-nota">
                    📸 Envía tu comprobante por WhatsApp al {WHATSAPP_NUMBER.replace('52', '')} con tu nombre completo.
                  </div>
                </div>
              )}
            </div>
            <button className="cf-success-btn" onClick={onClose}>Volver a la tienda</button>
          </div>
        </div>
      </>
    );
  }

  // ─── FORMULARIO ─────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap');
        .cf-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:400;display:flex;align-items:center;justify-content:center;padding:20px;font-family:'DM Sans',sans-serif;}
        .cf-box{background:white;border-radius:24px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;position:relative;}
        .cf-header{padding:28px 28px 0;display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
        .cf-title{font-family:'Fraunces',serif;font-size:24px;font-weight:300;color:#085041;}
        .cf-close{background:#f0f0f0;border:none;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#555;}
        .cf-close:hover{background:#ddd;}
        .cf-body{padding:0 28px 28px;}

        /* Banner datos guardados */
        .cf-saved-banner{background:#E1F5EE;border:1.5px solid #9FE1CB;border-radius:12px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:10px;}
        .cf-saved-text{font-size:13px;color:#085041;}
        .cf-saved-btn{font-size:12px;color:#E53E3E;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;text-decoration:underline;white-space:nowrap;}

        .cf-cumple-box{background:linear-gradient(135deg,#FFF0F5,#FFE4F0);border:1.5px solid #F48FB1;border-radius:16px;padding:20px;margin-bottom:20px;text-align:center;}
        .cf-cumple-icon{font-size:36px;margin-bottom:8px;}
        .cf-cumple-title{font-family:'Fraunces',serif;font-size:18px;font-weight:300;color:#C2185B;margin-bottom:4px;}
        .cf-cumple-desc{font-size:12px;color:#888;margin-bottom:14px;line-height:1.5;}
        .cf-cumple-input{width:100%;border:1.5px solid #F48FB1;border-radius:12px;padding:11px 14px;font-family:'DM Sans',sans-serif;font-size:15px;color:#1C1C1A;outline:none;box-sizing:border-box;background:white;}
        .cf-cumple-input:focus{border-color:#C2185B;}
        .cf-divider{border:none;border-top:1px solid #f0f0f0;margin:4px 0 20px;}
        .cf-section{margin-bottom:18px;}
        .cf-label{font-size:12px;font-weight:600;color:#555;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;display:block;}
        .cf-input{width:100%;border:1.5px solid rgba(0,0,0,0.12);border-radius:12px;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:15px;color:#1C1C1A;outline:none;transition:border-color 0.2s;box-sizing:border-box;}
        .cf-input:focus{border-color:#1D9E75;}
        .cf-input.error{border-color:#E53E3E;}
        .cf-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .cf-textarea{width:100%;border:1.5px solid rgba(0,0,0,0.12);border-radius:12px;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:15px;color:#1C1C1A;outline:none;transition:border-color 0.2s;resize:none;box-sizing:border-box;}
        .cf-textarea:focus{border-color:#1D9E75;}
        .cf-error{font-size:12px;color:#E53E3E;margin-top:4px;}
        .cf-fecha-box{background:#E1F5EE;border:1.5px solid #9FE1CB;border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:10px;}
        .cf-fecha-texto{font-size:14px;color:#085041;font-weight:500;}
        .cf-fecha-sub{font-size:12px;color:#1D9E75;margin-top:2px;}
        .cf-pago-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .cf-pago-btn{border:2px solid rgba(0,0,0,0.1);border-radius:14px;padding:16px 12px;text-align:center;cursor:pointer;background:white;transition:all 0.2s;font-family:'DM Sans',sans-serif;}
        .cf-pago-btn:hover{border-color:#1D9E75;}
        .cf-pago-btn.active{border-color:#085041;background:#E1F5EE;}
        .cf-pago-icon{font-size:24px;display:block;margin-bottom:6px;}
        .cf-pago-label{font-size:14px;font-weight:600;color:#1C1C1A;display:block;}
        .cf-pago-desc{font-size:11px;color:#888;display:block;margin-top:2px;}
        .cf-resumen{background:#F7F6F2;border-radius:12px;padding:16px;margin-bottom:20px;}
        .cf-resumen-title{font-size:12px;font-weight:600;color:#555;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;}
        .cf-resumen-item{display:flex;justify-content:space-between;align-items:flex-start;font-size:14px;color:#444;padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.06);}
        .cf-resumen-item:last-child{border-bottom:none;}
        .cf-resumen-item-det{font-size:12px;color:#888;}
        .cf-resumen-item-price{font-weight:600;color:#085041;flex-shrink:0;margin-left:8px;}
        .cf-resumen-total{display:flex;justify-content:space-between;align-items:baseline;margin-top:12px;padding-top:12px;border-top:2px solid #085041;}
        .cf-resumen-total-label{font-size:14px;color:#888;}
        .cf-resumen-total-price{font-family:'Fraunces',serif;font-size:26px;font-weight:300;color:#085041;}
        .cf-enviar-btn{width:100%;background:#085041;color:white;border:none;padding:16px;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;transition:background 0.2s;}
        .cf-enviar-btn:hover:not(:disabled){background:#1D9E75;}
        .cf-enviar-btn:disabled{background:#ccc;cursor:not-allowed;}
        .cf-nota{font-size:11px;color:#aaa;text-align:center;margin-top:10px;line-height:1.5;}
        @media(max-width:600px){
          .cf-box{border-radius:20px 20px 0 0;position:fixed;bottom:0;left:0;right:0;max-height:95vh;}
          .cf-overlay{align-items:flex-end;padding:0;}
          .cf-grid2{grid-template-columns:1fr;}
        }
      `}</style>

      <div className="cf-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="cf-box">
          <div className="cf-header">
            <div className="cf-title">Finalizar pedido</div>
            <button className="cf-close" onClick={onClose}>✕</button>
          </div>

          <div className="cf-body">

            {/* Banner datos guardados */}
            {datosGuardados && (
              <div className="cf-saved-banner">
                <span className="cf-saved-text">✅ Tus datos fueron cargados automáticamente</span>
                <button className="cf-saved-btn" onClick={limpiarDatos}>Usar otros datos</button>
              </div>
            )}

            {/* Fecha de cumpleaños */}
            <div className="cf-cumple-box">
              <div className="cf-cumple-icon">🎂</div>
              <div className="cf-cumple-title">¿Cuándo es tu cumpleaños?</div>
              <div className="cf-cumple-desc">Opcional — Te sorprenderemos ese día con un regalo especial 🎁</div>
              <input className="cf-cumple-input" type="date" value={form.cumpleanos} onChange={(e) => handleChange('cumpleanos', e.target.value)} />
            </div>

            <hr className="cf-divider" />

            <div className="cf-section">
              <label className="cf-label">Nombre completo *</label>
              <input className={`cf-input ${errores.nombre ? 'error' : ''}`} type="text" placeholder="Tu nombre completo" value={form.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />
              {errores.nombre && <div className="cf-error">{errores.nombre}</div>}
            </div>

            <div className="cf-section">
              <label className="cf-label">Teléfono *</label>
              <input className={`cf-input ${errores.telefono ? 'error' : ''}`} type="tel" placeholder="10 dígitos" value={form.telefono} onChange={(e) => handleChange('telefono', e.target.value)} />
              {errores.telefono && <div className="cf-error">{errores.telefono}</div>}
            </div>

            <div className="cf-section">
              <label className="cf-label">Correo electrónico <span style={{color:'#aaa',fontWeight:400,textTransform:'none'}}>(opcional)</span></label>
              <input className="cf-input" type="email" placeholder="tucorreo@ejemplo.com" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
            </div>

            <div className="cf-section">
              <label className="cf-label">Dirección de entrega *</label>
              <input className={`cf-input ${errores.direccion ? 'error' : ''}`} type="text" placeholder="Calle, número, colonia" value={form.direccion} onChange={(e) => handleChange('direccion', e.target.value)} />
              {errores.direccion && <div className="cf-error">{errores.direccion}</div>}
            </div>

            <div className="cf-section">
              <div className="cf-grid2">
                <div>
                  <label className="cf-label">Ciudad *</label>
                  <input className={`cf-input ${errores.ciudad ? 'error' : ''}`} type="text" placeholder="Tuxtla Gutiérrez" value={form.ciudad} onChange={(e) => handleChange('ciudad', e.target.value)} />
                  {errores.ciudad && <div className="cf-error">{errores.ciudad}</div>}
                </div>
                <div>
                  <label className="cf-label">C.P. *</label>
                  <input className={`cf-input ${errores.cp ? 'error' : ''}`} type="text" placeholder="29000" value={form.cp} onChange={(e) => handleChange('cp', e.target.value)} />
                  {errores.cp && <div className="cf-error">{errores.cp}</div>}
                </div>
              </div>
            </div>

            <div className="cf-section">
              <label className="cf-label">Referencias <span style={{color:'#aaa',fontWeight:400,textTransform:'none'}}>(opcional)</span></label>
              <textarea className="cf-textarea" rows={3} placeholder="Entre calles, color de fachada, señas particulares..." value={form.referencias} onChange={(e) => handleChange('referencias', e.target.value)} />
            </div>

            <div className="cf-section">
              <label className="cf-label">Fecha de entrega</label>
              <div className="cf-fecha-box">
                <span style={{fontSize:'20px'}}>📅</span>
                <div>
                  <div className="cf-fecha-texto">{fechaEntrega}</div>
                  <div className="cf-fecha-sub">Entrega día siguiente — pedidos antes de las 9pm</div>
                </div>
              </div>
            </div>

            <div className="cf-section">
              <label className="cf-label">Forma de pago *</label>
              <div className="cf-pago-grid">
                <button className={`cf-pago-btn ${form.formaPago === 'Efectivo' ? 'active' : ''}`} onClick={() => handleChange('formaPago', 'Efectivo')}>
                  <span className="cf-pago-icon">💵</span>
                  <span className="cf-pago-label">Efectivo</span>
                  <span className="cf-pago-desc">Al momento de la entrega</span>
                </button>
                <button className={`cf-pago-btn ${form.formaPago === 'Transferencia' ? 'active' : ''}`} onClick={() => handleChange('formaPago', 'Transferencia')}>
                  <span className="cf-pago-icon">🏦</span>
                  <span className="cf-pago-label">Transferencia</span>
                  <span className="cf-pago-desc">Te enviamos los datos</span>
                </button>
              </div>
              {errores.formaPago && <div className="cf-error">{errores.formaPago}</div>}
            </div>

            <div className="cf-resumen">
              <div className="cf-resumen-title">Tu pedido</div>
              {cart.map(item => (
                <div key={item.id} className="cf-resumen-item">
                  <div>
                    <div>{item.emoji} {item.name}</div>
                    <div className="cf-resumen-item-det">{item.detalle || item.unit}</div>
                  </div>
                  <div className="cf-resumen-item-price">${item.price}</div>
                </div>
              ))}
              <div className="cf-resumen-total">
                <span className="cf-resumen-total-label">Total</span>
                <span className="cf-resumen-total-price">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div style={{marginBottom:'16px'}}>
  <label style={{display:'flex', alignItems:'flex-start', gap:'10px', cursor:'pointer', fontSize:'13px', color:'#555'}}>
    <input
      type="checkbox"
      checked={form.aceptaTerminos || false}
      onChange={(e) => handleChange('aceptaTerminos', e.target.checked)}
      style={{marginTop:'2px', flexShrink:0, width:'16px', height:'16px', accentColor:'#085041'}}
    />
    <span>
      He leído y acepto los{' '}
      <a href="/terminos" target="_blank" style={{color:'#085041', fontWeight:'500'}}>Términos y Condiciones</a>
      {' '}y el{' '}
      <a href="/privacidad" target="_blank" style={{color:'#085041', fontWeight:'500'}}>Aviso de Privacidad</a>
    </span>
  </label>
</div>

<button className="cf-enviar-btn" onClick={handleEnviar} disabled={loading || !form.formaPago || !form.aceptaTerminos}>
  {loading ? 'Enviando...' : !form.formaPago ? 'Elige una forma de pago' : !form.aceptaTerminos ? 'Acepta los términos para continuar' : '📲 Confirmar pedido'}
</button>
            <div className="cf-nota">Al confirmar se procesará tu pedido.<br/>Te contactaremos para confirmar la entrega.</div>

          </div>
        </div>
      </div>
    </>
  );
}
