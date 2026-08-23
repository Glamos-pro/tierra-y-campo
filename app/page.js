"use client";

import { useState, useEffect, useRef } from 'react';
import { useCart } from './CartContext';
import ContactForm from './ContactForm';
import { PRODUCTOS, DESCUENTOS } from './productos';

const WHATSAPP_NUMBER = '529611176006';

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80',
    titulo: 'PRODUCTOS FRESCOS',
    subtitulo: 'Del campo a tu mesa',
  },
  {
    img: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=800&q=80',
    titulo: 'GARANTÍA EN TU PEDIDO',
    subtitulo: 'Entregas oportunas',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=80',
    titulo: 'SIN INTERMEDIARIOS',
    subtitulo: 'Precio justo siempre',
  },
];

// ─── POPUP HOGAR ───────────────────────────────────────────────────────
function PopupHogar({ product, descuento, onAdd, onClose }) {
  const [opcion, setOpcion] = useState('kg');
  const [kilos, setKilos]   = useState(0.5);
  const [piezas, setPiezas] = useState(1);

  const precioKg    = Math.round(product.price_kg * descuento);
  const precioPieza = product.price_pieza ? Math.round(product.price_pieza * descuento) : null;
  const getTotal    = () => opcion === 'kg' ? Math.round(precioKg * kilos) : precioPieza * piezas;

  const cambiarKilos = (delta) => setKilos(prev => {
    const nuevo = Math.round((prev + delta) * 10) / 10;
    return nuevo < 0.5 ? 0.5 : nuevo;
  });

  const handleAdd = () => {
    onAdd({
      id: `${product.id}-${opcion}-${Date.now()}`,
      name: product.name,
      detalle: opcion === 'kg' ? `${kilos} kg` : `${piezas} pieza${piezas > 1 ? 's' : ''}`,
      emoji: product.emoji,
      price: getTotal(),
      unit: opcion,
      quantity: 1,
    });
    onClose();
  };

  return (
    <div className="popup-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="popup-box">
        <button className="popup-close" onClick={onClose}>✕</button>
        <div className="popup-img">{product.emoji}</div>
        <div className="popup-cat">{product.categoria}</div>
        <div className="popup-name">{product.name}</div>
        <div className="popup-desc">{product.description}</div>
        <div className="popup-section-label">Elige una opción</div>
        <div className={`popup-opciones ${!precioPieza ? 'solo-kg' : ''}`}>
          <button className={`popup-opcion-btn ${opcion === 'kg' ? 'active' : ''}`} onClick={() => setOpcion('kg')}>
            <span className="popup-opcion-icon">⚖️</span>
            <span className="popup-opcion-label">Kilo</span>
            <span className="popup-opcion-precio">${precioKg} / kg</span>
          </button>
          {precioPieza && (
            <button className={`popup-opcion-btn ${opcion === 'pieza' ? 'active' : ''}`} onClick={() => setOpcion('pieza')}>
              <span className="popup-opcion-icon">🔢</span>
              <span className="popup-opcion-label">Pieza</span>
              <span className="popup-opcion-precio">${precioPieza} / pza</span>
            </button>
          )}
        </div>
        {opcion === 'kg' && (
          <div className="popup-kg-section">
            <div className="popup-section-label">¿Cuántos kilos?</div>
            <div className="popup-cantidad-row">
              <button className="popup-qty-btn" onClick={() => cambiarKilos(-0.5)}>−</button>
              <input className="popup-kg-input" type="number" min="0.5" step="0.5" value={kilos}
                onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v) && v > 0) setKilos(v); }}
                onBlur={() => { if (!kilos || kilos < 0.5) setKilos(0.5); }} />
              <span className="popup-kg-unit">kg</span>
              <button className="popup-qty-btn" onClick={() => cambiarKilos(0.5)}>+</button>
            </div>
            <div className="popup-kg-hint">Sube de 0.5 en 0.5 kg o escribe la cantidad</div>
          </div>
        )}
        {opcion === 'pieza' && precioPieza && (
          <div className="popup-pieza-section">
            <div className="popup-section-label">¿Cuántas piezas?</div>
            <div className="popup-cantidad-row">
              <button className="popup-qty-btn" onClick={() => setPiezas(Math.max(1, piezas - 1))}>−</button>
              <span className="popup-qty-num">{piezas} pieza{piezas > 1 ? 's' : ''}</span>
              <button className="popup-qty-btn" onClick={() => setPiezas(piezas + 1)}>+</button>
            </div>
          </div>
        )}
        <div className="popup-footer">
          <div className="popup-total">
            <span className="popup-total-label">Total</span>
            <span className="popup-total-precio">${getTotal()}</span>
          </div>
          <button className="popup-add-btn" onClick={handleAdd}>Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
}

// ─── POPUP NEGOCIOS ────────────────────────────────────────────────────
function PopupNegocios({ product, descuento, onAdd, onClose }) {
  const [opcion, setOpcion] = useState('kg');
  const [kilos, setKilos]   = useState(2);
  const [bultos, setBultos] = useState(1);

  const precioKg    = Math.round(product.price_kg * descuento);
  const precioBulto = product.price_bulto ? Math.round(product.price_bulto * descuento) : null;
  const kgBulto     = product.bulto_kg || 0;
  const getTotal    = () => opcion === 'kg' ? Math.round(precioKg * kilos) : precioBulto * bultos;

  const cambiarKilos = (delta) => setKilos(prev => {
    const nuevo = Math.round((prev + delta) * 10) / 10;
    return nuevo < 2 ? 2 : nuevo;
  });

  const handleAdd = () => {
    onAdd({
      id: `${product.id}-${opcion}-${Date.now()}`,
      name: product.name,
      detalle: opcion === 'kg' ? `${kilos} kg` : `${bultos} Bulto/Reja (${bultos * kgBulto} kg aprox.)`,
      emoji: product.emoji,
      price: getTotal(),
      unit: opcion,
      quantity: 1,
    });
    onClose();
  };

  return (
    <div className="popup-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="popup-box">
        <button className="popup-close" onClick={onClose}>✕</button>
        <div className="popup-img">{product.emoji}</div>
        <div className="popup-cat">{product.categoria}</div>
        <div className="popup-name">{product.name}</div>
        <div className="popup-desc">{product.description}</div>
        <div className="popup-negocio-badge">🎉 Precio mayoreo — {Math.round((1 - descuento) * 100)}% de descuento</div>
        <div className="popup-section-label">Elige una opción</div>
        <div className={`popup-opciones ${!precioBulto ? 'solo-kg' : ''}`}>
          <button className={`popup-opcion-btn ${opcion === 'kg' ? 'active' : ''}`} onClick={() => setOpcion('kg')}>
            <span className="popup-opcion-icon">⚖️</span>
            <span className="popup-opcion-label">Kilo</span>
            <span className="popup-opcion-precio">${precioKg} / kg</span>
            <span className="popup-opcion-min">Mínimo 2 kg</span>
          </button>
          {precioBulto && (
            <button className={`popup-opcion-btn ${opcion === 'bulto' ? 'active' : ''}`} onClick={() => setOpcion('bulto')}>
              <span className="popup-opcion-icon">📦</span>
              <span className="popup-opcion-label">Bulto / Reja</span>
              <span className="popup-opcion-precio">${precioBulto} / bulto</span>
              <span className="popup-opcion-min">~{kgBulto} kg por bulto</span>
            </button>
          )}
        </div>
        {opcion === 'kg' && (
          <div className="popup-kg-section">
            <div className="popup-section-label">¿Cuántos kilos? (mínimo 2 kg)</div>
            <div className="popup-cantidad-row">
              <button className="popup-qty-btn" onClick={() => cambiarKilos(-0.5)}>−</button>
              <input className="popup-kg-input" type="number" min="2" step="0.5" value={kilos}
                onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= 2) setKilos(v); }}
                onBlur={() => { if (!kilos || kilos < 2) setKilos(2); }} />
              <span className="popup-kg-unit">kg</span>
              <button className="popup-qty-btn" onClick={() => cambiarKilos(0.5)}>+</button>
            </div>
          </div>
        )}
        {opcion === 'bulto' && precioBulto && (
          <div className="popup-pieza-section">
            <div className="popup-section-label">¿Cuántos necesitas?</div>
            <div className="popup-cantidad-row">
              <button className="popup-qty-btn" onClick={() => setBultos(Math.max(1, bultos - 1))}>−</button>
              <span className="popup-qty-num">{bultos} Bulto/Reja<span style={{display:'block',fontSize:'11px',color:'#888'}}>≈ {bultos * kgBulto} kg</span></span>
              <button className="popup-qty-btn" onClick={() => setBultos(bultos + 1)}>+</button>
            </div>
          </div>
        )}
        <div className="popup-footer">
          <div className="popup-total">
            <span className="popup-total-label">Total</span>
            <span className="popup-total-precio">${getTotal()}</span>
          </div>
          <button className="popup-add-btn" onClick={handleAdd}>Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
}

const FAQS = [
  { pregunta: '¿Cuál es el horario de entregas?', respuesta: 'Realizamos entregas de lunes a sábado de 10:30am a 5pm en Tuxtla Gutiérrez, Chiapas.' },
  { pregunta: '¿Cuándo recibiré mi pedido?', respuesta: 'Todos los pedidos realizados antes de las 9pm se entregan al día siguiente hábil.' },
  { pregunta: '¿Hay mínimo de compra?', respuesta: 'No, no hay mínimo de compra. Puedes pedir desde un solo producto.' },
  { pregunta: '¿Cuándo es el envío gratis?', respuesta: 'El envío es gratis en compras de $700 o más. Los jueves es gratis a partir de $500.' },
  { pregunta: '¿Cómo puedo pagar?', respuesta: 'Aceptamos efectivo al momento de la entrega y transferencia bancaria. Te enviamos los datos al confirmar tu pedido.' },
  { pregunta: '¿A qué zonas entregan?', respuesta: 'Por el momento entregamos en Tuxtla Gutiérrez, Chiapas y zonas cercanas. Contáctanos por WhatsApp si tienes dudas sobre tu colonia.' },
  { pregunta: '¿Puedo cancelar mi pedido?', respuesta: 'Sí, puedes cancelar hasta 2 horas antes de tu entrega notificándonos por WhatsApp al 961 117 6006.' },
  { pregunta: '¿Los precios son exactos?', respuesta: 'Los precios mostrados son aproximados. El cobro final se ajusta al peso real del producto al momento de la entrega. Te confirmamos el precio exacto antes de surtir tu pedido.' },
];

function FaqSection() {
  const [abierto, setAbierto] = useState(null);
  return (
    <div className="tyc-faq">
      <div className="tyc-faq-inner">
        <h2 className="tyc-faq-title">Preguntas frecuentes</h2>
        <p className="tyc-faq-sub">Todo lo que necesitas saber antes de hacer tu primer pedido</p>
        <div className="tyc-faq-list">
          {FAQS.map((faq, i) => (
            <div key={i} className={`tyc-faq-item ${abierto === i ? 'open' : ''}`} onClick={() => setAbierto(abierto === i ? null : i)}>
              <div className="tyc-faq-pregunta">
                <span>{faq.pregunta}</span>
                <span className="tyc-faq-icon">{abierto === i ? '−' : '+'}</span>
              </div>
              {abierto === i && <div className="tyc-faq-respuesta">{faq.respuesta}</div>}
            </div>
          ))}
        </div>
        <div className="tyc-faq-contacto">
          ¿Tienes otra pregunta? Escríbenos por WhatsApp al <strong>961 117 6006</strong> 💬
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { cart, addToCart, getTotalItems, getTotalPrice } = useCart();
  const [showForm, setShowForm]             = useState(false);
  const [showCart, setShowCart]             = useState(false);
  const [perfil, setPerfil]                 = useState('hogar');
  const [categoriaActiva, setCat]           = useState('Todos');
  const [productoSeleccionado, setProducto] = useState(null);
  const [busqueda, setBusqueda]             = useState('');
  const [slideIndex, setSlideIndex]         = useState(0);
  const [catIndex, setCatIndex]             = useState(0);
  const [mounted, setMounted]               = useState(false);

  const CATS_SCROLL = ['🍊 Frutas', '🥦 Verduras', '🌶️ Chiles y Semillas', '🌾 Granos', '✨ Ofertas del día'];

  useEffect(() => {
    setMounted(true);
    const slideTimer = setInterval(() => setSlideIndex(i => (i + 1) % SLIDES.length), 3000);
    const catTimer   = setInterval(() => setCatIndex(i => (i + 1) % CATS_SCROLL.length), 2500);
    return () => { clearInterval(slideTimer); clearInterval(catTimer); };
  }, []);

  if (!mounted) return null;

  const esNegocio = perfil === 'negocio';
  const descuento = esNegocio ? DESCUENTOS.restaurante : DESCUENTOS.hogar;

  const productos = PRODUCTOS.filter(p => p.activo);
  const productosFiltrados = productos.filter(p => {
    const matchCat  = categoriaActiva === 'Todos' || p.categoria === categoriaActiva;
    const matchBusq = busqueda === '' || p.name.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchBusq;
  });

  const handleAdd = (item) => addToCart({ ...item, quantity: 1 });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F7F6F2; }
        .tyc-root { font-family: 'DM Sans', sans-serif; color: #1C1C1A; min-height: 100vh; }

        /* ── BARRA SUPERIOR FIJA ── */
        .tyc-topbar { background: #085041; color: white; padding: 9px 20px; font-size: 13px; font-weight: 500; text-align: center; white-space: nowrap; overflow: hidden; }
        .tyc-topbar-content { display: inline-flex; gap: 32px; align-items: center; }
        .tyc-topbar-sep { opacity: 0.4; }

        /* ── NAVBAR ── */
        .tyc-nav { position: sticky; top: 0; z-index: 100; background: white; border-bottom: 1px solid rgba(0,0,0,0.08); }
        .tyc-nav-top { display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 68px; gap: 16px; }
        .tyc-logo { font-family: 'Fraunces', serif; font-weight: 600; font-size: 22px; color: #085041; white-space: nowrap; text-decoration: none; }
        .tyc-logo span { font-style: italic; color: #1D9E75; }
        .tyc-nav-center { flex: 1; max-width: 400px; position: relative; }
        .tyc-search-input { width: 100%; border: 1.5px solid rgba(0,0,0,0.12); border-radius: 100px; padding: 9px 16px 9px 40px; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; background: #F7F6F2; }
        .tyc-search-input:focus { border-color: #1D9E75; background: white; }
        .tyc-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 15px; color: #aaa; }
        .tyc-nav-right { display: flex; align-items: center; gap: 8px; }
        .tyc-perfil-toggle { display: flex; background: #F0FBF6; border-radius: 100px; overflow: hidden; border: 1.5px solid #9FE1CB; }
        .tyc-perfil-opt { padding: 7px 14px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; background: transparent; font-family: 'DM Sans', sans-serif; color: #085041; transition: all 0.2s; white-space: nowrap; }
        .tyc-perfil-opt.active { background: #085041; color: white; border-radius: 100px; }
        .tyc-cart-btn { display: flex; align-items: center; gap: 8px; background: #085041; color: white; border: none; padding: 8px 18px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
        .tyc-cart-btn:hover { background: #1D9E75; }
        .tyc-cart-badge { background: #E8F5EF; color: #085041; border-radius: 100px; padding: 1px 7px; font-size: 12px; font-weight: 600; }

        /* ── BARRA CATEGORÍAS DINÁMICA ── */
        .tyc-catbar { background: #1D9E75; overflow: hidden; height: 44px; display: flex; align-items: center; }
        .tyc-catbar-track { display: flex; gap: 0; animation: scrollCats 20s linear infinite; white-space: nowrap; }
        .tyc-catbar-track:hover { animation-play-state: paused; }
        @keyframes scrollCats { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .tyc-catbar-item { padding: 0 32px; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85); cursor: pointer; letter-spacing: 0.05em; text-transform: uppercase; transition: color 0.2s; border-right: 1px solid rgba(255,255,255,0.2); white-space: nowrap; }
        .tyc-catbar-item:hover { color: white; }
        .tyc-catbar-item.active { color: white; }

        /* ── HERO ── */
        .tyc-hero { background: #F7F6F2; min-height: 480px; display: grid; grid-template-columns: 1fr 1fr; align-items: center; max-width: 100%; overflow: hidden; }
        .tyc-hero-left { padding: 60px 40px 60px 60px; }
        .tyc-hero-tag { display: inline-block; font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #1D9E75; background: #E1F5EE; padding: 4px 12px; border-radius: 100px; margin-bottom: 20px; }
        .tyc-hero h1 { font-family: 'Fraunces', serif; font-weight: 300; font-size: 48px; line-height: 1.1; color: #085041; letter-spacing: -1px; margin-bottom: 16px; }
        .tyc-hero h1 em { font-style: italic; color: #1D9E75; }
        .tyc-hero-desc { font-size: 16px; color: #666; line-height: 1.7; margin-bottom: 32px; }
        .tyc-hero-cta { background: #085041; color: white; padding: 14px 32px; border-radius: 100px; font-size: 15px; font-weight: 600; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .tyc-hero-cta:hover { background: #1D9E75; transform: translateY(-1px); }

        /* CARRUSEL */
        .tyc-hero-right { position: relative; height: 480px; overflow: hidden; }
        .tyc-slide { position: absolute; inset: 0; transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.8s ease; }
        .tyc-slide.current { transform: translateX(0); opacity: 1; z-index: 2; }
        .tyc-slide.next { transform: translateX(100%); opacity: 0; z-index: 1; }
        .tyc-slide.prev { transform: translateX(-100%); opacity: 0; z-index: 1; }
        .tyc-slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .tyc-slide-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,80,65,0.75) 0%, rgba(8,80,65,0.1) 60%); }
        .tyc-slide-text { position: absolute; bottom: 32px; left: 28px; right: 28px; color: white; }
        .tyc-slide-titulo { font-size: 22px; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 4px; text-shadow: 0 2px 8px rgba(0,0,0,0.3); }
        .tyc-slide-subtitulo { font-size: 14px; color: rgba(255,255,255,0.85); font-weight: 400; }
        .tyc-slide-dots { position: absolute; bottom: 12px; right: 20px; display: flex; gap: 6px; z-index: 3; }
        .tyc-slide-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); cursor: pointer; transition: background 0.2s; border: none; }
        .tyc-slide-dot.active { background: white; }

        /* ── STATS ── */
        .tyc-stats { background: white; border-bottom: 1px solid rgba(0,0,0,0.06); }
        .tyc-stats-inner { max-width: 1100px; margin: 0 auto; padding: 24px 40px; display: grid; grid-template-columns: repeat(3, 1fr); }
        .tyc-stat { text-align: center; padding: 16px; border-right: 1px solid rgba(0,0,0,0.06); }
        .tyc-stat:last-child { border-right: none; }
        .tyc-stat-num { font-family: 'Fraunces', serif; font-size: 36px; font-weight: 300; color: #085041; line-height: 1; }
        .tyc-stat-label { font-size: 12px; color: #888; margin-top: 4px; }

        /* ── BENEFICIOS ── */
        .tyc-beneficios { background: #F7F6F2; padding: 48px 40px; }
        .tyc-beneficios-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
        .tyc-ben-card { background: white; border-radius: 20px; padding: 28px 24px; text-align: center; border: 1px solid rgba(0,0,0,0.06); transition: transform 0.2s, box-shadow 0.2s; }
        .tyc-ben-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .tyc-ben-icon { font-size: 44px; margin-bottom: 14px; }
        .tyc-ben-title { font-weight: 600; font-size: 15px; color: #085041; margin-bottom: 6px; }
        .tyc-ben-desc { font-size: 13px; color: #888; line-height: 1.5; }

        /* ── PRODUCTOS ── */
        .tyc-products { max-width: 1100px; margin: 0 auto; padding: 56px 40px; }
        .tyc-products-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .tyc-section-title { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 300; color: #085041; }
        .tyc-filter-row { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
        .tyc-filter-btn { padding: 7px 18px; border-radius: 100px; border: 1px solid rgba(0,0,0,0.12); background: transparent; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #555; cursor: pointer; transition: all 0.2s; }
        .tyc-filter-btn:hover { border-color: #1D9E75; color: #085041; }
        .tyc-filter-btn.active { background: #085041; color: white; border-color: #085041; }
        .tyc-negocio-banner { background: #E1F5EE; border: 1px solid #9FE1CB; border-radius: 12px; padding: 12px 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #085041; }
        .tyc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
        .tyc-card { background: white; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); overflow: hidden; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .tyc-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .tyc-card-img { background: #F0FBF6; height: 140px; display: flex; align-items: center; justify-content: center; font-size: 60px; }
        .tyc-card-body { padding: 16px; }
        .tyc-card-cat { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #1D9E75; font-weight: 500; margin-bottom: 4px; }
        .tyc-card-name { font-weight: 600; font-size: 15px; color: #1C1C1A; margin-bottom: 4px; }
        .tyc-card-desc { font-size: 12px; color: #888; line-height: 1.5; margin-bottom: 14px; }
        .tyc-card-precios { display: flex; gap: 8px; flex-wrap: wrap; }
        .tyc-card-precio-item { background: #F5F5F0; border-radius: 8px; padding: 5px 10px; font-size: 12px; color: #555; }
        .tyc-card-precio-item strong { color: #085041; }
        .tyc-card-ver { margin-top: 12px; width: 100%; background: #085041; color: white; border: none; padding: 10px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
        .tyc-card-ver:hover { background: #1D9E75; }

        /* ── NOSOTROS ── */
        .tyc-nosotros { background: white; border-top: 1px solid rgba(0,0,0,0.06); padding: 60px 40px; }
        .tyc-nosotros-inner { max-width: 1100px; margin: 0 auto; }
        .tyc-nosotros-title { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 300; color: #085041; text-align: center; margin-bottom: 40px; }
        .tyc-nosotros-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .tyc-nosotros-card { background: #F7F6F2; border-radius: 16px; padding: 28px; }
        .tyc-nosotros-card-icon { font-size: 32px; margin-bottom: 12px; }
        .tyc-nosotros-card-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 300; color: #085041; margin-bottom: 12px; }
        .tyc-nosotros-card-text { font-size: 14px; color: #666; line-height: 1.7; }

        /* ── FAQ ── */
        .tyc-faq { background: #F7F6F2; padding: 60px 40px; }
        .tyc-faq-inner { max-width: 780px; margin: 0 auto; }
        .tyc-faq-title { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 300; color: #085041; text-align: center; margin-bottom: 8px; }
        .tyc-faq-sub { font-size: 15px; color: #888; text-align: center; margin-bottom: 40px; }
        .tyc-faq-list { display: flex; flex-direction: column; gap: 12px; }
        .tyc-faq-item { background: white; border-radius: 14px; border: 1.5px solid rgba(0,0,0,0.07); padding: 20px 24px; cursor: pointer; transition: border-color 0.2s; }
        .tyc-faq-item:hover { border-color: #1D9E75; }
        .tyc-faq-item.open { border-color: #085041; }
        .tyc-faq-pregunta { display: flex; align-items: center; justify-content: space-between; gap: 16px; font-weight: 600; font-size: 15px; color: #1C1C1A; }
        .tyc-faq-icon { font-size: 22px; color: #085041; flex-shrink: 0; font-weight: 300; }
        .tyc-faq-respuesta { font-size: 14px; color: #666; line-height: 1.7; margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f0f0; }
        .tyc-faq-contacto { margin-top: 32px; text-align: center; font-size: 14px; color: #888; background: white; border-radius: 14px; padding: 20px; border: 1.5px solid rgba(0,0,0,0.07); }
        .tyc-faq-contacto strong { color: #085041; }

        /* ── QR ── */
        .tyc-qr { background: #085041; padding: 60px 40px; }
        .tyc-qr-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .tyc-qr-title { font-family: 'Fraunces', serif; font-size: 32px; font-weight: 300; color: white; margin-bottom: 16px; }
        .tyc-qr-desc { font-size: 15px; color: rgba(255,255,255,0.75); line-height: 1.7; margin-bottom: 28px; }
        .tyc-qr-pasos { display: flex; flex-direction: column; gap: 12px; }
        .tyc-qr-paso { display: flex; align-items: center; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.85); }
        .tyc-qr-num { width: 28px; height: 28px; border-radius: 50%; background: #1D9E75; color: white; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tyc-qr-card { background: white; border-radius: 20px; padding: 28px; text-align: center; max-width: 280px; margin: 0 auto; }
        .tyc-qr-tag { font-size: 12px; font-weight: 600; color: #1D9E75; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
        .tyc-qr-scan { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 300; color: #085041; margin-bottom: 4px; }
        .tyc-qr-sub { font-size: 12px; color: #888; margin-bottom: 16px; }
        .tyc-qr-code { display: flex; justify-content: center; margin-bottom: 16px; }
        .tyc-qr-url { font-size: 11px; color: #aaa; margin-bottom: 4px; }
        .tyc-qr-fresh { font-size: 11px; color: #1D9E75; }

        /* ── FOOTER ── */
        .tyc-footer { background: #1C1C1A; color: rgba(255,255,255,0.6); padding: 48px 40px 28px; }
        .tyc-footer-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; margin-bottom: 40px; }
        .tyc-footer-logo { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; color: white; margin-bottom: 12px; }
        .tyc-footer-logo span { font-style: italic; color: #1D9E75; }
        .tyc-footer-desc { font-size: 13px; line-height: 1.7; margin-bottom: 20px; }
        .tyc-footer-social { display: flex; gap: 12px; }
        .tyc-footer-social-btn { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 16px; text-decoration: none; transition: background 0.2s; }
        .tyc-footer-social-btn:hover { background: #1D9E75; }
        .tyc-footer-col-title { font-size: 13px; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; }
        .tyc-footer-links { display: flex; flex-direction: column; gap: 8px; }
        .tyc-footer-link { font-size: 13px; color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.2s; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; text-align: left; }
        .tyc-footer-link:hover { color: #1D9E75; }
        .tyc-footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; max-width: 1100px; margin: 0 auto; }
        .tyc-footer-legal { display: flex; gap: 20px; }

        /* ── POPUP ── */
        .popup-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .popup-box { background: white; border-radius: 24px; width: 100%; max-width: 420px; padding: 32px; position: relative; max-height: 90vh; overflow-y: auto; }
        .popup-close { position: absolute; top: 16px; right: 16px; background: #f0f0f0; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #555; }
        .popup-img { font-size: 72px; text-align: center; margin-bottom: 12px; }
        .popup-cat { font-size: 11px; text-transform: uppercase; color: #1D9E75; font-weight: 500; text-align: center; margin-bottom: 4px; }
        .popup-name { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 300; color: #085041; text-align: center; margin-bottom: 6px; }
        .popup-desc { font-size: 12px; color: #888; text-align: center; line-height: 1.5; margin-bottom: 16px; }
        .popup-negocio-badge { background: #E1F5EE; color: #085041; font-size: 12px; font-weight: 500; padding: 8px 12px; border-radius: 10px; text-align: center; margin-bottom: 16px; }
        .popup-section-label { font-size: 11px; text-transform: uppercase; color: #aaa; font-weight: 600; margin-bottom: 10px; }
        .popup-opciones { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .popup-opciones.solo-kg { grid-template-columns: 1fr; }
        .popup-opcion-btn { border: 2px solid rgba(0,0,0,0.08); border-radius: 14px; padding: 14px 10px; text-align: center; cursor: pointer; background: white; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .popup-opcion-btn.active { border-color: #085041; background: #E1F5EE; }
        .popup-opcion-icon { display: block; font-size: 22px; margin-bottom: 6px; }
        .popup-opcion-label { display: block; font-weight: 600; font-size: 14px; color: #1C1C1A; margin-bottom: 2px; }
        .popup-opcion-precio { display: block; font-size: 12px; color: #085041; font-weight: 500; }
        .popup-opcion-min { display: block; font-size: 10px; color: #aaa; margin-top: 2px; }
        .popup-kg-section, .popup-pieza-section { margin-bottom: 20px; }
        .popup-cantidad-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .popup-qty-btn { width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid #ddd; background: white; cursor: pointer; font-size: 22px; display: flex; align-items: center; justify-content: center; color: #085041; flex-shrink: 0; }
        .popup-qty-btn:hover { background: #E1F5EE; border-color: #1D9E75; }
        .popup-kg-input { flex: 1; border: 2px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 20px; font-weight: 600; color: #085041; outline: none; text-align: center; -moz-appearance: textfield; width: 80px; }
        .popup-kg-input::-webkit-outer-spin-button, .popup-kg-input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .popup-kg-unit { font-size: 15px; font-weight: 600; color: #085041; }
        .popup-kg-hint { font-size: 11px; color: #bbb; text-align: center; }
        .popup-qty-num { font-size: 15px; font-weight: 600; color: #1C1C1A; flex: 1; text-align: center; line-height: 1.3; }
        .popup-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 16px; border-top: 1px solid #f0f0f0; margin-top: 8px; }
        .popup-total { display: flex; flex-direction: column; }
        .popup-total-label { font-size: 11px; color: #aaa; text-transform: uppercase; }
        .popup-total-precio { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 300; color: #085041; line-height: 1; }
        .popup-add-btn { background: #085041; color: white; border: none; padding: 14px 20px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; }
        .popup-add-btn:hover { background: #1D9E75; }

        /* ── CARRITO ── */
        .tyc-cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 200; display: flex; justify-content: flex-end; }
        .tyc-cart-panel { background: white; width: 400px; height: 100%; overflow-y: auto; display: flex; flex-direction: column; padding: 32px; }
        .tyc-cart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .tyc-cart-title { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 300; color: #085041; }
        .tyc-cart-close { background: none; border: none; font-size: 22px; cursor: pointer; color: #888; }
        .tyc-cart-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
        .tyc-cart-emoji { font-size: 28px; }
        .tyc-cart-item-info { flex: 1; }
        .tyc-cart-item-name { font-weight: 500; font-size: 14px; color: #1C1C1A; }
        .tyc-cart-item-detalle { font-size: 12px; color: #888; margin-top: 2px; }
        .tyc-cart-item-price { font-family: 'Fraunces', serif; font-size: 16px; color: #085041; font-weight: 300; }
        .tyc-cart-total { margin-top: 24px; padding-top: 20px; border-top: 2px solid #085041; }
        .tyc-total-final { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px; }
        .tyc-total-label { font-size: 14px; color: #888; }
        .tyc-total-price { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 300; color: #085041; }
        .tyc-checkout-btn { width: 100%; background: #085041; color: white; border: none; padding: 16px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; }
        .tyc-checkout-btn:hover { background: #1D9E75; }
        .tyc-empty-cart { text-align: center; color: #aaa; font-size: 14px; margin-top: 60px; }

        /* ── WA FLOAT ── */
        .wa-float { position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 150; text-decoration: none; transition: transform 0.2s; }
        .wa-float:hover { transform: scale(1.1); }

        @media (max-width: 768px) {
          .tyc-nav-top { padding: 0 16px; gap: 8px; }
          .tyc-nav-center { display: none; }
          .tyc-hero { grid-template-columns: 1fr; }
          .tyc-hero-left { padding: 40px 20px; }
          .tyc-hero h1 { font-size: 34px; }
          .tyc-hero-right { height: 280px; }
          .tyc-stats-inner { grid-template-columns: 1fr; padding: 20px; }
          .tyc-stat { border-right: none; border-bottom: 1px solid rgba(0,0,0,0.06); }
          .tyc-stat:last-child { border-bottom: none; }
          .tyc-beneficios, .tyc-products, .tyc-nosotros, .tyc-qr { padding: 36px 20px; }
          .tyc-qr-inner { grid-template-columns: 1fr; gap: 32px; }
          .tyc-footer-inner { grid-template-columns: 1fr; gap: 32px; }
          .tyc-footer { padding: 40px 20px 24px; }
          .tyc-cart-panel { width: 100%; }
          .popup-box { padding: 24px; }
          .tyc-footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>

      <div className="tyc-root">

        {/* BARRA SUPERIOR FIJA */}
        <div className="tyc-topbar">
          <div className="tyc-topbar-content">
            <span>🛒 Sin mínimo de compra</span>
            <span className="tyc-topbar-sep">/</span>
            <span>🚚 Envío GRATIS en compras de $700</span>
            <span className="tyc-topbar-sep">/</span>
            <span>🗓️ Jueves de Ofertas</span>
            <span className="tyc-topbar-sep">/</span>
            <span>⏰ Entregas de 10:30am a 5pm</span>
          </div>
        </div>

        {/* NAVBAR */}
        <nav className="tyc-nav">
          <div className="tyc-nav-top">
            <div className="tyc-logo">Tierra <span>&</span> Campo</div>
            <div className="tyc-nav-center">
              <span className="tyc-search-icon">🔍</span>
              <input
                className="tyc-search-input"
                type="text"
                placeholder="Buscar productos frescos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="tyc-nav-right">
              <div className="tyc-perfil-toggle">
                <button className={`tyc-perfil-opt ${perfil === 'hogar' ? 'active' : ''}`} onClick={() => setPerfil('hogar')}>🏠 Hogar</button>
                <button className={`tyc-perfil-opt ${perfil === 'negocio' ? 'active' : ''}`} onClick={() => setPerfil('negocio')}>🏪 Negocios</button>
              </div>
              <button className="tyc-cart-btn" onClick={() => setShowCart(true)}>
                🛒 Carrito
                {getTotalItems() > 0 && <span className="tyc-cart-badge">{getTotalItems()}</span>}
              </button>
            </div>
          </div>

          {/* BARRA CATEGORÍAS DINÁMICA */}
          <div className="tyc-catbar">
            <div className="tyc-catbar-track">
              {[...CATS_SCROLL, ...CATS_SCROLL].map((cat, i) => (
                <span key={i} className="tyc-catbar-item" onClick={() => {
                  const catName = cat.replace(/^[^\s]+ /, '');
                  setCat(catName === 'del día' ? 'Todos' : catName);
                  document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
                }}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="tyc-hero">
          <div className="tyc-hero-left">
            <span className="tyc-hero-tag">Tuxtla Gutiérrez, Chiapas</span>
            <h1>Tu tiempo vale.<br/><em>Tu despensa</em> también.</h1>
            <p className="tyc-hero-desc">Productos frescos del campo chiapaneco, directo a tu puerta. Sin filas, sin tráfico, sin esperas.</p>
            <button className="tyc-hero-cta" onClick={() => document.getElementById('productos').scrollIntoView({ behavior: 'smooth' })}>
              Ver productos →
            </button>
          </div>

          {/* CARRUSEL */}
          <div className="tyc-hero-right">
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                className={`tyc-slide ${i === slideIndex ? 'current' : i === (slideIndex + 1) % SLIDES.length ? 'next' : 'prev'}`}
              >
                <img src={slide.img} alt={slide.titulo} />
                <div className="tyc-slide-overlay" />
                <div className="tyc-slide-text">
                  <div className="tyc-slide-titulo">{slide.titulo}</div>
                  <div className="tyc-slide-subtitulo">{slide.subtitulo}</div>
                </div>
              </div>
            ))}
            <div className="tyc-slide-dots">
              {SLIDES.map((_, i) => (
                <button key={i} className={`tyc-slide-dot ${i === slideIndex ? 'active' : ''}`} onClick={() => setSlideIndex(i)} />
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="tyc-stats">
          <div className="tyc-stats-inner">
            <div className="tyc-stat"><div className="tyc-stat-num">24h</div><div className="tyc-stat-label">Entrega día siguiente</div></div>
            <div className="tyc-stat"><div className="tyc-stat-num">100%</div><div className="tyc-stat-label">Productos frescos garantizados</div></div>
            <div className="tyc-stat"><div className="tyc-stat-num">0</div><div className="tyc-stat-label">Intermediarios. Precio directo.</div></div>
          </div>
        </div>

        {/* BENEFICIOS */}
        <div className="tyc-beneficios">
          <div className="tyc-beneficios-inner">
            <div className="tyc-ben-card">
              <div className="tyc-ben-icon">🏍️</div>
              <div className="tyc-ben-title">Entregas Lunes a Sábado</div>
              <div className="tyc-ben-desc">Horario de entrega de 10:30am a 5pm en Tuxtla Gutiérrez</div>
            </div>
            <div className="tyc-ben-card">
              <div className="tyc-ben-icon">📦</div>
              <div className="tyc-ben-title">Envío Gratis desde $700</div>
              <div className="tyc-ben-desc">Sin mínimo de compra. Envío gratis en pedidos de $700 o más</div>
            </div>
            <div className="tyc-ben-card">
              <div className="tyc-ben-icon">🗓️</div>
              <div className="tyc-ben-title">Jueves de Ofertas</div>
              <div className="tyc-ben-desc">Todos los jueves descuentos especiales en productos seleccionados</div>
            </div>
            <div className="tyc-ben-card">
              <div className="tyc-ben-icon">🚚</div>
              <div className="tyc-ben-title">Precio Especial Negocios</div>
              <div className="tyc-ben-desc">Restaurantes, bares y verdulerías con precios de mayoreo</div>
            </div>
          </div>
        </div>

        {/* PRODUCTOS */}
        <section className="tyc-products" id="productos">
          <div className="tyc-products-header">
            <h2 className="tyc-section-title">Productos frescos</h2>
          </div>
          {esNegocio && (
            <div className="tyc-negocio-banner">
              <span>🎉</span>
              <span>Estás viendo <strong>precios de mayoreo</strong> — {Math.round((1 - DESCUENTOS.restaurante) * 100)}% de descuento aplicado</span>
            </div>
          )}
          <div className="tyc-filter-row">
            {['Todos', 'Frutas', 'Verduras', 'Chiles y Semillas', 'Granos'].map(cat => (
              <button key={cat} className={`tyc-filter-btn ${categoriaActiva === cat ? 'active' : ''}`} onClick={() => setCat(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <div className="tyc-grid">
            {productosFiltrados.map(product => {
              const precioKg    = Math.round(product.price_kg * descuento);
              const precioPza   = product.price_pieza ? Math.round(product.price_pieza * descuento) : null;
              const precioBulto = product.price_bulto ? Math.round(product.price_bulto * descuento) : null;
              return (
                <div key={product.id} className="tyc-card" onClick={() => setProducto(product)}>
                  <div className="tyc-card-img">{product.emoji}</div>
                  <div className="tyc-card-body">
                    <div className="tyc-card-cat">{product.categoria}</div>
                    <div className="tyc-card-name">{product.name}</div>
                    <div className="tyc-card-desc">{product.description}</div>
                    <div className="tyc-card-precios">
                      <div className="tyc-card-precio-item"><strong>${precioKg}</strong> / kg</div>
                      {!esNegocio && precioPza && <div className="tyc-card-precio-item"><strong>${precioPza}</strong> / pza</div>}
                      {esNegocio && precioBulto && <div className="tyc-card-precio-item"><strong>${precioBulto}</strong> / bulto</div>}
                    </div>
                    <button className="tyc-card-ver">Ver opciones →</button>
                  </div>
                </div>
              );
            })}
            {productosFiltrados.length === 0 && (
              <div style={{gridColumn:'1/-1',textAlign:'center',padding:'40px',color:'#888',fontSize:'15px'}}>
                No encontramos productos para "{busqueda}" 😕
              </div>
            )}
          </div>
        </section>

        {/* NOSOTROS */}
        <div className="tyc-nosotros">
          <div className="tyc-nosotros-inner">
            <h2 className="tyc-nosotros-title">Quiénes somos</h2>
            <div className="tyc-nosotros-grid">
              <div className="tyc-nosotros-card">
                <div className="tyc-nosotros-card-icon">🌾</div>
                <div className="tyc-nosotros-card-title">Nuestra historia</div>
                <div className="tyc-nosotros-card-text">Tierra y Campo nació en Tuxtla Gutiérrez, Chiapas, con una misión clara: optimizar el tiempo de las personas y negocios al momento de realizar sus compras de productos agrícolas.</div>
              </div>
              <div className="tyc-nosotros-card">
                <div className="tyc-nosotros-card-icon">🎯</div>
                <div className="tyc-nosotros-card-title">Nuestra misión</div>
                <div className="tyc-nosotros-card-text">Facilitar a las personas y negocios la compra de productos frescos y de calidad, optimizando sus tiempos y garantizando precios competitivos.</div>
              </div>
              <div className="tyc-nosotros-card">
                <div className="tyc-nosotros-card-icon">🔭</div>
                <div className="tyc-nosotros-card-title">Nuestra visión</div>
                <div className="tyc-nosotros-card-text">Ser la plataforma líder de productos agrícolas en México, presente en las ciudades principales del país.</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <FaqSection />

        {/* QR */}
        <div className="tyc-qr">
          <div className="tyc-qr-inner">
            <div>
              <h2 className="tyc-qr-title">¿Tienes nuestro QR?</h2>
              <p className="tyc-qr-desc">Pégalo en tu refrigerador y la próxima vez que necesites productos frescos, solo escanéalo y haz tu pedido en segundos.</p>
              <div className="tyc-qr-pasos">
                <div className="tyc-qr-paso"><span className="tyc-qr-num">1</span><span>Escanea el código QR</span></div>
                <div className="tyc-qr-paso"><span className="tyc-qr-num">2</span><span>Elige tus productos</span></div>
                <div className="tyc-qr-paso"><span className="tyc-qr-num">3</span><span>Recibe al día siguiente</span></div>
              </div>
            </div>
            <div className="tyc-qr-card">
              <div className="tyc-qr-tag">Tierra & Campo</div>
              <div className="tyc-qr-scan">Escanéame</div>
              <div className="tyc-qr-sub">y haz tu pedido de productos frescos</div>
              <div className="tyc-qr-code">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Ftierra-y-campo.vercel.app&color=085041&bgcolor=ffffff" alt="QR" width="180" height="180" style={{borderRadius:'8px'}} />
              </div>
              <div className="tyc-qr-url">tierra-y-campo.vercel.app</div>
              <div className="tyc-qr-fresh">🌾 Productos frescos · Entrega día siguiente</div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="tyc-footer">
          <div className="tyc-footer-inner">
            <div>
              <div className="tyc-footer-logo">Tierra <span>&</span> Campo</div>
              <div className="tyc-footer-desc">Tu tiempo vale. Tu despensa también. Productos frescos del campo chiapaneco, directo a tu puerta.</div>
              <div className="tyc-footer-social">
                <a className="tyc-footer-social-btn" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">💬</a>
                <a className="tyc-footer-social-btn" href="#" title="Facebook">📘</a>
                <a className="tyc-footer-social-btn" href="#" title="Instagram">📸</a>
              </div>
            </div>
            <div>
              <div className="tyc-footer-col-title">Productos</div>
              <div className="tyc-footer-links">
                {['Frutas','Verduras','Chiles y Semillas','Granos'].map(cat => (
                  <button key={cat} className="tyc-footer-link" onClick={() => { setCat(cat); document.getElementById('productos').scrollIntoView({ behavior: 'smooth' }); }}>{cat}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="tyc-footer-col-title">Información</div>
              <div className="tyc-footer-links">
                <a href="/nosotros" className="tyc-footer-link">Quiénes somos</a>
                <a href="/terminos" className="tyc-footer-link">Términos y Condiciones</a>
                <a href="/privacidad" className="tyc-footer-link">Aviso de Privacidad</a>
                <span className="tyc-footer-link" style={{cursor:'default'}}>📞 961 117 6006</span>
                <span className="tyc-footer-link" style={{cursor:'default'}}>📍 Tuxtla Gutiérrez, Chiapas</span>
              </div>
            </div>
          </div>
          <div className="tyc-footer-bottom">
            <span>© 2026 Tierra & Campo · Hecho con ❤️ en Chiapas, México</span>
            <div className="tyc-footer-legal">
              <a href="/terminos" style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',textDecoration:'none'}}>Términos</a>
              <a href="/privacidad" style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',textDecoration:'none'}}>Privacidad</a>
            </div>
          </div>
        </footer>

        {/* POPUPS */}
        {productoSeleccionado && !esNegocio && (
          <PopupHogar product={productoSeleccionado} descuento={descuento} onAdd={handleAdd} onClose={() => setProducto(null)} />
        )}
        {productoSeleccionado && esNegocio && (
          <PopupNegocios product={productoSeleccionado} descuento={descuento} onAdd={handleAdd} onClose={() => setProducto(null)} />
        )}

        {/* CARRITO */}
        {showCart && (
          <div className="tyc-cart-overlay" onClick={(e) => e.target === e.currentTarget && setShowCart(false)}>
            <div className="tyc-cart-panel">
              <div className="tyc-cart-header">
                <div className="tyc-cart-title">Tu carrito</div>
                <button className="tyc-cart-close" onClick={() => setShowCart(false)}>✕</button>
              </div>
              {cart.length === 0 ? (
                <div className="tyc-empty-cart">
                  <div style={{fontSize:'48px',marginBottom:'12px'}}>🛒</div>
                  <p>Tu carrito está vacío.<br/>Agrega productos para empezar.</p>
                </div>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="tyc-cart-item">
                      <span className="tyc-cart-emoji">{item.emoji}</span>
                      <div className="tyc-cart-item-info">
                        <div className="tyc-cart-item-name">{item.name}</div>
                        <div className="tyc-cart-item-detalle">{item.detalle}</div>
                      </div>
                      <div className="tyc-cart-item-price">${item.price}</div>
                    </div>
                  ))}
                  <div className="tyc-cart-total">
                    <div className="tyc-total-final">
                      <span className="tyc-total-label">Total</span>
                      <span className="tyc-total-price">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <button className="tyc-checkout-btn" onClick={() => { setShowCart(false); setShowForm(true); }}>
                      Finalizar pedido →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {showForm && (
          <ContactForm cart={cart} totalPrice={getTotalPrice()} onClose={() => setShowForm(false)} />
        )}

        {/* BOTÓN WHATSAPP */}
        <a className="wa-float" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="35" height="35" />
        </a>

      </div>
    </>
  );
}
