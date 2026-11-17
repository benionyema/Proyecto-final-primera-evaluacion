import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui';

export default function Inicio() {
  const { usuario, logout } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h1>Hola, {usuario?.nombre}</h1>
      <p>{usuario?.email}</p>
      <Button onClick={logout}>Cerrar sesión</Button>
    </div>
  );
}