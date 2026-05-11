"use client";

import { useState } from 'react';

export default function ContactForm({ cart, totalPrice, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    colonia: '',
    referencias: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear mensaje de WhatsApp
    let mensaje = `*Nuevo Pedido - Tierra y Campo*%0A%0A`;
    mensaje += `*Cliente:* ${formData.nombre}%0A`;
    mensaje += `*Teléfono:* ${formData.telefono}%0A`;
    mensaje += `*Dirección:* ${formData.direccion}, ${formData.colonia}%0A`;
    mensaje += `*Referencias:* ${formData.referencias}%0A%0A`;
    mensaje += `*Pedido:*%0A`;
    
    cart.forEach(item => {
      mensaje += `- ${item.quantity} ${item.unit} de ${item.name}: $${(item.price * item.quantity).toFixed(2)}%0A`;
    });
    
    mensaje += `%0A*Total: $${totalPrice.toFixed(2)}*%0A`;
    mensaje += `%0A¡Gracias por tu compra! 🍋🍍`;

    // Abrir WhatsApp
    window.open(`https://wa.me/529611234567?text=${mensaje}`, '_blank');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{ color: '#2d5016', marginBottom: '20px', textAlign: 'center' }}>📋 Datos de Entrega</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>Nombre completo:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1em' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>Teléfono (WhatsApp):</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              placeholder="961-XXX-XXXX"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1em' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              placeholder="Calle, número"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1em' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>Colonia:</label>
            <input
              type="text"
              name="colonia"
              value={formData.colonia}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1em' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>Referencias (opcional):</label>
            <textarea
              name="referencias"
              value={formData.referencias}
              onChange={handleChange}
              placeholder="Casa verde, portón negro, etc."
              rows="3"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1em' }}
            />
          </div>

          <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
            <h3 style={{ color: '#2d5016', margin: '0 0 10px 0' }}>Resumen del pedido:</h3>
            {cart.map(item => (
              <p key={item.id} style={{ margin: '5px 0', color: '#666' }}>
                {item.quantity} {item.unit} de {item.name}: ${(item.price * item.quantity).toFixed(2)}
              </p>
            ))}
            <p style={{ fontWeight: 'bold', color: '#2d5016', fontSize: '1.2em', marginTop: '10px' }}>
              Total: ${totalPrice.toFixed(2)}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: '#25D366',
                color: 'white',
                border: 'none',
                padding: '15px',
                borderRadius: '5px',
                fontSize: '1.1em',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📱 Enviar por WhatsApp
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                padding: '15px',
                borderRadius: '5px',
                fontSize: '1.1em',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}