import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RutaPrivada() {
  const { estaAutenticado, comprobandoSesion } = useAuth();
  const location = useLocation();

  // Mientras comprobamos el token guardado NO decidimos nada todavía
  if (comprobandoSesion) {
    return <p style={{ padding: 24 }}>Comprobando sesión...</p>;
  }

  if (!estaAutenticado) {
    // "from" recuerda a dónde quería ir, para volver tras el login
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}