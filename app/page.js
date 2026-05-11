"use client";

import { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import ContactForm from './ContactForm';
import { PRODUCTOS, DESCUENTOS, PERFILES } from './productos';

const CATEGORIAS = ['Todos', 'Frutas', 'Chiles', 'Verduras'];

// Perfiles que usan popup de restaurante (kilos mínimo 2kg + bulto/reja)
const PERFILES_NEGOCIO = ['restaurante', 'bar', 'verduleria', 'negocio'];

// ─── POPUP HOGAR ───────────────────────────────────────────────────────
function PopupHogar({ product, descuento, onAdd, onClose }) {
  const [opcion, setOpcion] = useState('kg');
  const [kilos, setKilos]   = useState(0.5);
  const [piezas, setPiezas] = useState(1);

  const precioKg    = Math.round(product.price_kg * descuento);
  const precioPieza = product.price_pieza ? Math.round(product.price_pieza * descuento) : null;

  const getTotal = () => {
    if (opcion === 'kg') return Math.round(precioKg * kilos);
    return precioPieza * piezas;
  };

  const cambiarKilos = (delta) => {
    setKilos(prev => {
      const nuevo = Math.round((prev + delta) * 10) / 10;
      return nuevo < 0.5 ? 0.5 : nuevo;
    });
  };

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
              <input
                className="popup-kg-input"
                type="number" min="0.5" step="0.5"
                value={kilos}
                onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v) && v > 0) setKilos(v); }}
                onBlur={() => { if (!kilos || kilos < 0.5) setKilos(0.5); }}
              />
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

// ─── POPUP RESTAURANTE ─────────────────────────────────────────────────
function PopupRestaurante({ product, descuento, onAdd, onClose }) {
  const [opcion, setOpcion]   = useState('kg');
  const [kilos, setKilos]     = useState(2);
  const [bultos, setBultos]   = useState(1);

  const precioKg    = Math.round(product.price_kg * descuento);
  const precioBulto = product.price_bulto ? Math.round(product.price_bulto * descuento) : null;
  const nombreBulto = 'Bulto / Reja';
  const kgBulto     = product.bulto_kg || 0;

  const getTotal = () => {
    if (opcion === 'kg') return Math.round(precioKg * kilos);
    return precioBulto * bultos;
  };

  const cambiarKilos = (delta) => {
    setKilos(prev => {
      const nuevo = Math.round((prev + delta) * 10) / 10;
      return nuevo < 2 ? 2 : nuevo;
    });
  };

  const handleAdd = () => {
    onAdd({
      id: `${product.id}-${opcion}-${Date.now()}`,
      name: product.name,
      detalle: opcion === 'kg'
        ? `${kilos} kg`
        : `${bultos} ${nombreBulto} (${bultos * kgBulto} kg aprox.)`,
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

        {/* Badge de precio especial */}
        <div className="popup-negocio-badge">
          🎉 Precio especial para negocios — {Math.round((1 - descuento) * 100)}% de descuento
        </div>

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
              <span className="popup-opcion-label">{nombreBulto}</span>
              <span className="popup-opcion-precio">${precioBulto} / {nombreBulto.toLowerCase()}</span>
              <span className="popup-opcion-min">~{kgBulto} kg por {nombreBulto.toLowerCase()}</span>
            </button>
          )}
        </div>

        {/* Kilos — mínimo 2kg */}
        {opcion === 'kg' && (
          <div className="popup-kg-section">
            <div className="popup-section-label">¿Cuántos kilos? (mínimo 2 kg)</div>
            <div className="popup-cantidad-row">
              <button className="popup-qty-btn" onClick={() => cambiarKilos(-0.5)}>−</button>
              <input
                className="popup-kg-input"
                type="number" min="2" step="0.5"
                value={kilos}
                onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= 2) setKilos(v); }}
                onBlur={() => { if (!kilos || kilos < 2) setKilos(2); }}
              />
              <span className="popup-kg-unit">kg</span>
              <button className="popup-qty-btn" onClick={() => cambiarKilos(0.5)}>+</button>
            </div>
            <div className="popup-kg-hint">Sube de 0.5 en 0.5 kg o escribe la cantidad</div>
          </div>
        )}

        {/* Bultos/Rejas — de 1 en 1 */}
        {opcion === 'bulto' && precioBulto && (
          <div className="popup-pieza-section">
            <div className="popup-section-label">¿Cuántos necesitas?</div>
            <div className="popup-cantidad-row">
              <button className="popup-qty-btn" onClick={() => setBultos(Math.max(1, bultos - 1))}>−</button>
              <span className="popup-qty-num">
                <>{bultos} {nombreBulto}</>
                <span style={{display:'block', fontSize:'12px', color:'#888', fontWeight:'400'}}>
                  ≈ {bultos * kgBulto} kg
                </span>
              </span>
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

export default function Home() {
  const { cart, addToCart, getTotalItems, getTotalPrice } = useCart();
  const [showForm, setShowForm]             = useState(false);
  const [showCart, setShowCart]             = useState(false);
  const [perfil, setPerfil]                 = useState(null);
  const [categoriaActiva, setCat]           = useState('Todos');
  const [productoSeleccionado, setProducto] = useState(null);
  const [mounted, setMounted]               = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const descuento = perfil ? DESCUENTOS[perfil.id] : 1;
  const esNegocio = perfil && PERFILES_NEGOCIO.includes(perfil.id);

  const productos = PRODUCTOS.filter(p => p.activo);
  const productosFiltrados = categoriaActiva === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva);

  const handleAdd = (item) => addToCart({ ...item, quantity: 1 });

  // ─── SELECTOR DE PERFIL ──────────────────────────────────────────────
  if (!perfil) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #F7F6F2; }
          .sel-root { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #F7F6F2; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; }
          .sel-logo { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; color: #085041; margin-bottom: 8px; }
          .sel-logo span { font-style: italic; color: #1D9E75; }
          .sel-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #1D9E75; background: #E1F5EE; padding: 4px 12px; border-radius: 100px; margin-bottom: 32px; }
          .sel-title { font-family: 'Fraunces', serif; font-size: 36px; font-weight: 300; color: #085041; text-align: center; margin-bottom: 10px; letter-spacing: -0.5px; }
          .sel-sub { font-size: 15px; color: #888; text-align: center; margin-bottom: 48px; line-height: 1.6; }
          .sel-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; width: 100%; max-width: 900px; }
          .sel-card { background: white; border: 1.5px solid rgba(0,0,0,0.07); border-radius: 18px; padding: 28px 20px; text-align: center; cursor: pointer; transition: all 0.2s; }
          .sel-card:hover { border-color: #1D9E75; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(29,158,117,0.12); }
          .sel-card-emoji { font-size: 44px; margin-bottom: 14px; }
          .sel-card-label { font-weight: 600; font-size: 16px; color: #085041; margin-bottom: 8px; }
          .sel-card-desc { font-size: 12px; color: #999; line-height: 1.5; }
          .sel-badge { display: inline-block; margin-top: 12px; font-size: 11px; font-weight: 500; color: #1D9E75; background: #E1F5EE; padding: 3px 10px; border-radius: 100px; }
          @media (max-width: 600px) { .sel-title { font-size: 26px; } .sel-grid { grid-template-columns: 1fr 1fr; } }
        `}</style>
        <div className="sel-root">
          <div className="sel-logo">Tierra <span>&</span> Campo</div>
          <div className="sel-tag">Tuxtla Gutiérrez, Chiapas</div>
          <h1 className="sel-title">¿Cómo vas a comprar hoy?</h1>
          <p className="sel-sub">Elige tu perfil y te mostramos<br/>los precios y opciones ideales para ti.</p>
          <div className="sel-grid">
            {PERFILES.map(p => (
              <div key={p.id} className="sel-card" onClick={() => setPerfil(p)}>
                <div className="sel-card-emoji">{p.emoji}</div>
                <div className="sel-card-label">{p.label}</div>
                <div className="sel-card-desc">{p.desc}</div>
                {p.id !== 'hogar' && <div className="sel-badge">Precio especial</div>}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // ─── TIENDA PRINCIPAL ────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F7F6F2; }
        .tyc-root { font-family: 'DM Sans', sans-serif; color: #1C1C1A; background: #F7F6F2; min-height: 100vh; }
        .tyc-nav { position: sticky; top: 0; z-index: 100; background: #F7F6F2; border-bottom: 1px solid rgba(0,0,0,0.08); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 64px; }
        .tyc-logo { font-family: 'Fraunces', serif; font-weight: 600; font-size: 20px; color: #085041; }
        .tyc-logo span { font-style: italic; color: #1D9E75; }
        .tyc-nav-right { display: flex; align-items: center; gap: 12px; }
        .tyc-perfil-chip { display: flex; align-items: center; gap: 6px; background: #E1F5EE; color: #085041; border: none; border-radius: 100px; padding: 6px 14px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
        .tyc-perfil-chip:hover { background: #9FE1CB; }
        .tyc-cart-btn { display: flex; align-items: center; gap: 8px; background: #085041; color: white; border: none; padding: 8px 18px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: background 0.2s; }
        .tyc-cart-btn:hover { background: #1D9E75; }
        .tyc-cart-badge { background: #E8F5EF; color: #085041; border-radius: 100px; padding: 1px 7px; font-size: 12px; font-weight: 600; }
        .tyc-hero { max-width: 1100px; margin: 0 auto; padding: 70px 40px 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .tyc-hero-tag { display: inline-block; font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #1D9E75; background: #E1F5EE; padding: 4px 12px; border-radius: 100px; margin-bottom: 20px; }
        .tyc-hero h1 { font-family: 'Fraunces', serif; font-weight: 300; font-size: 48px; line-height: 1.1; color: #085041; letter-spacing: -1px; margin-bottom: 16px; }
        .tyc-hero h1 em { font-style: italic; color: #1D9E75; }
        .tyc-hero p { font-size: 15px; color: #666; line-height: 1.7; margin-bottom: 28px; }
        .tyc-hero-cta { background: #085041; color: white; padding: 13px 30px; border-radius: 100px; font-size: 14px; font-weight: 500; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
        .tyc-hero-cta:hover { background: #1D9E75; }
        .tyc-hero-visual { background: #E1F5EE; border-radius: 24px; height: 280px; display: flex; align-items: center; justify-content: center; font-size: 60px; gap: 12px; flex-wrap: wrap; padding: 28px; }
        .tyc-stats { background: #085041; padding: 36px 40px; }
        .tyc-stats-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; text-align: center; }
        .tyc-stat-num { font-family: 'Fraunces', serif; font-size: 38px; font-weight: 300; color: #9FE1CB; line-height: 1; }
        .tyc-stat-label { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 6px; }
        .tyc-products { max-width: 1100px; margin: 0 auto; padding: 56px 40px; }
        .tyc-section-title { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 300; color: #085041; margin-bottom: 24px; }
        .tyc-descuento-banner { background: #E1F5EE; border: 1px solid #9FE1CB; border-radius: 12px; padding: 14px 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #085041; }
        .tyc-filter-row { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
        .tyc-filter-btn { padding: 7px 18px; border-radius: 100px; border: 1px solid rgba(0,0,0,0.12); background: transparent; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #555; cursor: pointer; transition: all 0.2s; }
        .tyc-filter-btn:hover { border-color: #1D9E75; color: #085041; }
        .tyc-filter-btn.active { background: #085041; color: white; border-color: #085041; }
        .tyc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px; }
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

        /* POPUP */
        .popup-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .popup-box { background: white; border-radius: 24px; width: 100%; max-width: 420px; padding: 32px; position: relative; max-height: 90vh; overflow-y: auto; }
        .popup-close { position: absolute; top: 16px; right: 16px; background: #f0f0f0; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #555; }
        .popup-close:hover { background: #ddd; }
        .popup-img { font-size: 72px; text-align: center; margin-bottom: 12px; }
        .popup-cat { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #1D9E75; font-weight: 500; text-align: center; margin-bottom: 4px; }
        .popup-name { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 300; color: #085041; text-align: center; margin-bottom: 6px; }
        .popup-desc { font-size: 12px; color: #888; text-align: center; line-height: 1.5; margin-bottom: 16px; }
        .popup-negocio-badge { background: #E1F5EE; color: #085041; font-size: 12px; font-weight: 500; padding: 8px 12px; border-radius: 10px; text-align: center; margin-bottom: 16px; }
        .popup-section-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #aaa; font-weight: 600; margin-bottom: 10px; }
        .popup-opciones { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .popup-opciones.solo-kg { grid-template-columns: 1fr; }
        .popup-opcion-btn { border: 2px solid rgba(0,0,0,0.08); border-radius: 14px; padding: 14px 10px; text-align: center; cursor: pointer; background: white; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .popup-opcion-btn:hover { border-color: #1D9E75; }
        .popup-opcion-btn.active { border-color: #085041; background: #E1F5EE; }
        .popup-opcion-icon { display: block; font-size: 22px; margin-bottom: 6px; }
        .popup-opcion-label { display: block; font-weight: 600; font-size: 14px; color: #1C1C1A; margin-bottom: 2px; }
        .popup-opcion-precio { display: block; font-size: 12px; color: #085041; font-weight: 500; }
        .popup-opcion-min { display: block; font-size: 10px; color: #aaa; margin-top: 2px; }
        .popup-kg-section { margin-bottom: 20px; }
        .popup-pieza-section { margin-bottom: 20px; }
        .popup-cantidad-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .popup-qty-btn { width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid #ddd; background: white; cursor: pointer; font-size: 22px; display: flex; align-items: center; justify-content: center; color: #085041; transition: all 0.15s; flex-shrink: 0; }
        .popup-qty-btn:hover { background: #E1F5EE; border-color: #1D9E75; }
        .popup-kg-input { flex: 1; border: 2px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 20px; font-weight: 600; color: #085041; outline: none; text-align: center; transition: border-color 0.2s; -moz-appearance: textfield; width: 80px; }
        .popup-kg-input::-webkit-outer-spin-button, .popup-kg-input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .popup-kg-input:focus { border-color: #1D9E75; }
        .popup-kg-unit { font-size: 15px; font-weight: 600; color: #085041; }
        .popup-kg-hint { font-size: 11px; color: #bbb; text-align: center; }
        .popup-qty-num { font-size: 15px; font-weight: 600; color: #1C1C1A; flex: 1; text-align: center; line-height: 1.3; }
        .popup-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 16px; border-top: 1px solid #f0f0f0; margin-top: 8px; }
        .popup-total { display: flex; flex-direction: column; }
        .popup-total-label { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 0.06em; }
        .popup-total-precio { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 300; color: #085041; line-height: 1; }
        .popup-add-btn { background: #085041; color: white; border: none; padding: 14px 20px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
        .popup-add-btn:hover { background: #1D9E75; }

        /* CARRITO */
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
        .tyc-checkout-btn { width: 100%; background: #085041; color: white; border: none; padding: 16px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
        .tyc-checkout-btn:hover { background: #1D9E75; }
        .tyc-empty-cart { text-align: center; color: #aaa; font-size: 14px; margin-top: 60px; }
        .tyc-envio { background: white; border-top: 1px solid rgba(0,0,0,0.06); }
        .tyc-envio-inner { max-width: 1100px; margin: 0 auto; padding: 44px 40px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 28px; }
        .tyc-envio-item { display: flex; align-items: flex-start; gap: 12px; }
        .tyc-envio-icon { font-size: 20px; background: #E1F5EE; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tyc-envio-label { font-weight: 500; font-size: 13px; color: #1C1C1A; margin-bottom: 3px; }
        .tyc-envio-desc { font-size: 12px; color: #888; line-height: 1.5; }
        .tyc-footer { background: #085041; color: rgba(255,255,255,0.7); text-align: center; padding: 28px 40px; font-size: 13px; line-height: 1.8; }
        .tyc-footer strong { color: white; font-size: 15px; }
        @media (max-width: 700px) {
          .tyc-nav { padding: 0 16px; }
          .tyc-hero { grid-template-columns: 1fr; padding: 36px 20px; gap: 28px; }
          .tyc-hero h1 { font-size: 34px; }
          .tyc-hero-visual { display: none; }
          .tyc-stats-inner { grid-template-columns: 1fr; gap: 20px; }
          .tyc-products { padding: 36px 20px; }
          .tyc-cart-panel { width: 100%; }
          .popup-box { padding: 24px; }
        }
      `}</style>

      <div className="tyc-root">
        <nav className="tyc-nav">
          <div className="tyc-logo">Tierra <span>&</span> Campo</div>
          <div className="tyc-nav-right">
            <button className="tyc-perfil-chip" onClick={() => setPerfil(null)}>
              {perfil.emoji} {perfil.label} ✕
            </button>
            <button className="tyc-cart-btn" onClick={() => setShowCart(true)}>
              🛒 Carrito
              {getTotalItems() > 0 && <span className="tyc-cart-badge">{getTotalItems()}</span>}
            </button>
          </div>
        </nav>

        <section className="tyc-hero">
          <div>
            <span className="tyc-hero-tag">Tuxtla Gutiérrez, Chiapas</span>
            <h1>Tu tiempo vale.<br/><em>Tu despensa</em> también.</h1>
            <p>Productos frescos del campo chiapaneco, directo a tu puerta. Sin filas, sin tráfico, sin esperas.</p>
            <button className="tyc-hero-cta" onClick={() => document.getElementById('productos').scrollIntoView({ behavior: 'smooth' })}>
              Ver productos →
            </button>
          </div>
          <div className="tyc-hero-visual">🥬 🍅 🍋 🥑 🍍 🌶️ 🍌 🥕</div>
        </section>

        <div className="tyc-stats">
          <div className="tyc-stats-inner">
            <div><div className="tyc-stat-num">24h</div><div className="tyc-stat-label">Entrega día siguiente</div></div>
            <div><div className="tyc-stat-num">100%</div><div className="tyc-stat-label">Productos frescos garantizados</div></div>
            <div><div className="tyc-stat-num">0</div><div className="tyc-stat-label">Intermediarios. Precio directo.</div></div>
          </div>
        </div>

        <section className="tyc-products" id="productos">
          <h2 className="tyc-section-title">Productos frescos</h2>
          {esNegocio && (
            <div className="tyc-descuento-banner">
              <span>🎉</span>
              <span>Precios especiales para <strong>{perfil.label}</strong> — {Math.round((1 - DESCUENTOS[perfil.id]) * 100)}% de descuento aplicado.</span>
            </div>
          )}
          <div className="tyc-filter-row">
            {CATEGORIAS.map(cat => (
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
                      {esNegocio && precioBulto && <div className="tyc-card-precio-item"><strong>${precioBulto}</strong> / bulto / reja</div>}
                    </div>
                    <button className="tyc-card-ver">Ver opciones →</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="tyc-envio">
          <div className="tyc-envio-inner">
            <div className="tyc-envio-item"><div className="tyc-envio-icon">🚚</div><div><div className="tyc-envio-label">Entrega día siguiente</div><div className="tyc-envio-desc">Pide antes de las 9pm</div></div></div>
            <div className="tyc-envio-item"><div className="tyc-envio-icon">🌱</div><div><div className="tyc-envio-label">Frescura garantizada</div><div className="tyc-envio-desc">Seleccionados el día de tu entrega</div></div></div>
            <div className="tyc-envio-item"><div className="tyc-envio-icon">💳</div><div><div className="tyc-envio-label">Pagos flexibles</div><div className="tyc-envio-desc">Efectivo, transferencia o MercadoPago</div></div></div>
            <div className="tyc-envio-item"><div className="tyc-envio-icon">🏪</div><div><div className="tyc-envio-label">Para negocios</div><div className="tyc-envio-desc">Precios especiales por volumen</div></div></div>
          </div>
        </div>

        <footer className="tyc-footer">
          <strong>Tierra & Campo</strong><br/>
          Tu tiempo vale. Tu despensa también.<br/>
          © 2026 · Hecho con ❤️ en Chiapas, México
        </footer>

        {/* Popup según perfil */}
        {productoSeleccionado && !esNegocio && (
          <PopupHogar product={productoSeleccionado} descuento={descuento} onAdd={handleAdd} onClose={() => setProducto(null)} />
        )}
        {productoSeleccionado && esNegocio && (
          <PopupRestaurante product={productoSeleccionado} descuento={descuento} onAdd={handleAdd} onClose={() => setProducto(null)} />
        )}

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
      </div>
    </>
  );
}
