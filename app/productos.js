// ─────────────────────────────────────────────────────────────────────
// TIERRA Y CAMPO — CATÁLOGO DE PRODUCTOS
// ─────────────────────────────────────────────────────────────────────
// CAMPOS POR PRODUCTO:
//
//   price_kg      → precio por kilogramo (obligatorio)
//   price_pieza   → precio por pieza para HOGAR (null = no aplica)
//   bulto_nombre  → cómo se llama el bulto: 'Bulto', 'Reja', 'Costal', etc.
//   bulto_kg      → cuántos kg tiene un bulto/reja
//   price_bulto   → precio por bulto (ustedes lo calculan)
//                   null = no se vende por bulto
// ─────────────────────────────────────────────────────────────────────

export const PRODUCTOS = [

  // ── FRUTAS ──────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Limones Frescos',
    categoria: 'Frutas',
    description: 'Jugosos y aromáticos, cultivados en tierras chiapanecas.',
    emoji: '🍋',
    price_kg: 25,
    price_pieza: 2,
    bulto_nombre: 'Reja',     // ← así se llama para este producto
    bulto_kg: 20,             // ← una reja de limones pesa ~20 kg
    price_bulto: 450,         // ← precio por reja (calculado por ustedes)
    activo: true,
  },
  {
    id: 2,
    name: 'Piñas Dulces',
    categoria: 'Frutas',
    description: 'Maduras y dulces del Soconusco. Sabor tropical puro.',
    emoji: '🍍',
    price_kg: 35,
    price_pieza: 42,
    bulto_nombre: 'Bulto',
    bulto_kg: 18,
    price_bulto: 580,
    activo: true,
  },
  {
    id: 3,
    name: 'Plátanos Macho',
    categoria: 'Frutas',
    description: 'Grandes y maduros. Ideales para freír u hornear.',
    emoji: '🍌',
    price_kg: 20,
    price_pieza: 5,
    bulto_nombre: 'Bulto',
    bulto_kg: 25,
    price_bulto: 450,
    activo: true,
  },
  {
    id: 4,
    name: 'Aguacates Hass',
    categoria: 'Frutas',
    description: 'Cremosos y nutritivos. Perfectos para guacamole.',
    emoji: '🥑',
    price_kg: 45,
    price_pieza: 10,
    bulto_nombre: 'Reja',
    bulto_kg: 10,
    price_bulto: 400,
    activo: true,
  },

  // ── CHILES ──────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'Chiles Serranos',
    categoria: 'Chiles',
    description: 'Frescos y picosos. Dan el toque perfecto a tus platillos.',
    emoji: '🌶️',
    price_kg: 15,
    price_pieza: null,
    bulto_nombre: 'Bulto',
    bulto_kg: 10,
    price_bulto: 130,
    activo: true,
  },

  // ── VERDURAS ─────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Tomates Rojos',
    categoria: 'Verduras',
    description: 'Jugosos y dulces para salsas, ensaladas y guisos.',
    emoji: '🍅',
    price_kg: 18,
    price_pieza: 4,
    bulto_nombre: 'Reja',
    bulto_kg: 20,
    price_bulto: 320,
    activo: true,
  },

  // ── AGREGA MÁS PRODUCTOS AQUÍ ────────────────────────────────────────
  // { id: 7, name: 'Nombre', categoria: 'Verduras', description: '...', emoji: '🥕',
  //   price_kg: 20, price_pieza: 3,
  //   bulto_nombre: 'Bulto', bulto_kg: 15, price_bulto: 270,
  //   activo: true },

];

// ─────────────────────────────────────────────────────────────────────
// DESCUENTOS POR PERFIL
// ─────────────────────────────────────────────────────────────────────
export const DESCUENTOS = {
  hogar:       1.00,
  restaurante: 0.85,
  bar:         0.85,
  verduleria:  0.80,
  negocio:     0.82,
};

// ─────────────────────────────────────────────────────────────────────
// PERFILES DE COMPRADORES
// ─────────────────────────────────────────────────────────────────────
export const PERFILES = [
  { id: 'hogar',       emoji: '🏠', label: 'Hogar',       desc: 'Compras para tu familia y despensa personal' },
  { id: 'restaurante', emoji: '🍴', label: 'Restaurante',  desc: 'Abastecimiento para tu cocina profesional' },
  { id: 'bar',         emoji: '🍹', label: 'Bar & Palapa', desc: 'Frutas y vegetales para tus bebidas y platillos' },
  { id: 'verduleria',  emoji: '🥦', label: 'Verdulería',   desc: 'Compra al mayoreo para tu punto de venta' },
  { id: 'negocio',     emoji: '🏪', label: 'Otro Negocio', desc: 'Tiendas, hoteles, caterings y más' },
];
