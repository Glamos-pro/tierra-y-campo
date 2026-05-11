"use client";

export default function Nosotros() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, backgroundColor: '#f8f9f5' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#2d5016', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '2.5em' }}>🌾 Tierra y Campo</h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '1.2em' }}>Enlaces con el Agro - Productos frescos de Chiapas</p>
      </header>

      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #2d5016 0%, #4a7c2a 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2.2em', marginBottom: '20px' }}>
          Del Campo a Tu Mesa,<br/>Sin Intermediarios, Sin Esperas
        </h2>
        <p style={{ fontSize: '1.2em', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          Nacimos con una idea simple: que las personas y negocios encuentren 
          productos frescos, de calidad y a precios justos, sin perder tiempo.
        </p>
      </section>

      {/* Nuestra Historia */}
      <section style={{ maxWidth: '1000px', margin: '50px auto', padding: '0 20px' }}>
        <h2 style={{ color: '#2d5016', fontSize: '2em', textAlign: 'center', marginBottom: '30px' }}>
          📖 Nuestra Historia
        </h2>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#444', lineHeight: '1.8', fontSize: '1.1em', marginBottom: '20px' }}>
            <strong>Tierra y Campo</strong> nació en Tuxtla Gutiérrez, Chiapas, con una misión clara: 
            <em>optimizar el tiempo de las personas y negocios</em> al momento de realizar sus compras de productos agrícolas.
          </p>
          <p style={{ color: '#444', lineHeight: '1.8', fontSize: '1.1em', marginBottom: '20px' }}>
            Sabemos que tu tiempo vale oro. Por eso creamos una plataforma donde puedes 
            encontrar <strong>productos frescos, de calidad y a precios competitivos</strong>, 
            todo desde tu celular o computadora, sin filas, sin tráfico, sin esperas.
          </p>
          <p style={{ color: '#444', lineHeight: '1.8', fontSize: '1.1em' }}>
            Hoy conectamos productores locales con familias y negocios que buscan 
            lo mejor del campo chiapaneco. Mañana, conectaremos todo México.
          </p>
        </div>
      </section>

      {/* Misión */}
      <section style={{ maxWidth: '1000px', margin: '50px auto', padding: '0 20px' }}>
        <h2 style={{ color: '#2d5016', fontSize: '2em', textAlign: 'center', marginBottom: '30px' }}>
          🎯 Nuestra Misión
        </h2>
        <div style={{ 
          backgroundColor: '#2d5016', 
          color: 'white', 
          padding: '40px', 
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '1.3em', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto' }}>
            <em>"Facilitar a las personas y negocios la compra de productos frescos y de calidad, 
            optimizando sus tiempos, garantizando precios competitivos y fortaleciendo 
            la economía local de los productores del campo."</em>
          </p>
        </div>
      </section>

      {/* Visión */}
      <section style={{ maxWidth: '1000px', margin: '50px auto', padding: '0 20px' }}>
        <h2 style={{ color: '#2d5016', fontSize: '2em', textAlign: 'center', marginBottom: '30px' }}>
          🔭 Nuestra Visión
        </h2>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#444', lineHeight: '1.8', fontSize: '1.1em', textAlign: 'center' }}>
            Ser la plataforma líder de productos agrícolas en México, presente en las 
            <strong>ciudades principales del país</strong>, ayudando a millones de personas 
            y negocios a realizar sus compras de manera <strong>más eficiente, rápida y confiable</strong>.
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px', 
            marginTop: '30px' 
          }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '3em' }}>🌎</div>
              <h4 style={{ color: '#2d5016' }}>Presencia Nacional</h4>
              <p style={{ color: '#666', fontSize: '0.9em' }}>En las principales ciudades de México</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '3em' }}>⚡</div>
              <h4 style={{ color: '#2d5016' }}>Eficiencia</h4>
              <p style={{ color: '#666', fontSize: '0.9em' }}>Compras rápidas sin filas ni tráfico</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '3em' }}>🤝</div>
              <h4 style={{ color: '#2d5016' }}>Impacto Social</h4>
              <p style={{ color: '#666', fontSize: '0.9em' }}>Apoyando a productores locales</p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section style={{ maxWidth: '1000px', margin: '50px auto', padding: '0 20px' }}>
        <h2 style={{ color: '#2d5016', fontSize: '2em', textAlign: 'center', marginBottom: '30px' }}>
          💚 Nuestros Valores
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          {[
            { emoji: '🌱', title: 'Frescura', desc: 'Productos recién cosechados, directos del campo' },
            { emoji: '💰', title: 'Precios Justos', desc: 'Competitivos para el cliente, justos para el productor' },
            { emoji: '⏱️', title: 'Tiempo', desc: 'Tu tiempo es valioso, lo optimizamos' },
            { emoji: '🤝', title: 'Confianza', desc: 'Transparencia en cada entrega' },
            { emoji: '🌎', title: 'Sostenibilidad', desc: 'Apoyamos la agricultura local responsable' },
            { emoji: '❤️', title: 'Servicio', desc: 'Atención personalizada en cada pedido' }
          ].map((valor, index) => (
            <div key={index} style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '10px', 
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>{valor.emoji}</div>
              <h3 style={{ color: '#2d5016', margin: '10px 0' }}>{valor.title}</h3>
              <p style={{ color: '#666', fontSize: '0.95em', lineHeight: '1.5' }}>{valor.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ¿Por qué elegirnos? */}
      <section style={{ maxWidth: '1000px', margin: '50px auto', padding: '0 20px' }}>
        <h2 style={{ color: '#2d5016', fontSize: '2em', textAlign: 'center', marginBottom: '30px' }}>
          ✨ ¿Por Qué Elegir Tierra y Campo?
        </h2>
        <div style={{ backgroundColor: '#ff6b35', color: 'white', padding: '40px', borderRadius: '15px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px' 
          }}>
            <div style={{ padding: '15px' }}>
              <h4 style={{ fontSize: '1.2em', marginBottom: '10px' }}>🚚 Entrega Rápida</h4>
              <p style={{ fontSize: '0.95em', lineHeight: '1.5' }}>24-48 horas en Tuxtla Gutiérrez y alrededores</p>
            </div>
            <div style={{ padding: '15px' }}>
              <h4 style={{ fontSize: '1.2em', marginBottom: '10px' }}>🥬 Frescura Garantizada</h4>
              <p style={{ fontSize: '0.95em', lineHeight: '1.5' }}>Productos seleccionados el mismo día de la entrega</p>
            </div>
            <div style={{ padding: '15px' }}>
              <h4 style={{ fontSize: '1.2em', marginBottom: '10px' }}>💳 Pagos Flexibles</h4>
              <p style={{ fontSize: '0.95em', lineHeight: '1.5' }}>Efectivo, transferencia o MercadoPago</p>
            </div>
            <div style={{ padding: '15px' }}>
              <h4 style={{ fontSize: '1.2em', marginBottom: '10px' }}>🏪 Para Negocios</h4>
              <p style={{ fontSize: '0.95em', lineHeight: '1.5' }}>Precios especiales para restaurantes y tiendas</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ color: '#2d5016', fontSize: '2em', marginBottom: '20px' }}>
          ¿Listo para optimizar tus compras?
        </h2>
        <p style={{ color: '#666', fontSize: '1.2em', marginBottom: '30px' }}>
          Únete a cientos de familias y negocios que ya confían en nosotros
        </p>
        <a href="/" style={{
          display: 'inline-block',
          backgroundColor: '#2d5016',
          color: 'white',
          padding: '15px 40px',
          borderRadius: '30px',
          textDecoration: 'none',
          fontSize: '1.2em',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(45,80,22,0.3)'
        }}>
          🛒 Ir a la Tienda
        </a>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#2d5016', color: 'white', textAlign: 'center', padding: '30px 20px' }}>
        <p style={{ fontSize: '1.1em', marginBottom: '10px' }}>🌾 Tierra y Campo - Enlaces con el Agro</p>
        <p style={{ fontSize: '0.9em', opacity: 0.9 }}>
          © 2026 Todos los derechos reservados | Hecho con ❤️ en Chiapas, México
        </p>
      </footer>
    </div>
  );
}