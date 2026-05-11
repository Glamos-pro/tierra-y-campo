import { CartProvider } from './CartContext';

export const metadata = {
  title: 'Tierra y Campo - Productos Frescos de Chiapas',
  description: 'Limones y piñas frescas de Chiapas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}