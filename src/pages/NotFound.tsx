import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}