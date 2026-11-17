import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../services/api';
import {
  Button, Card, Field, FieldError, FormError, Input, Label,
} from '../components/ui';

const Pagina = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.sidebar};
  padding: ${({ theme }) => theme.spacing.md};
`;

const Contenedor = styled(Card)`
  width: 100%;
  max-width: 400px;
`;

const Titulo = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

interface ErroresLogin {
  email?: string;
  password?: string;
}

// Validación en el cliente: es una función pura, no necesita useEffect
function validarLogin(email: string, password: string): ErroresLogin {
  const errores: ErroresLogin = {};
  if (!email.trim()) errores.email = 'El email es obligatorio';
  else if (!/^\S+@\S+\.\S+$/.test(email.trim())) errores.email = 'El email no es válido';
  if (!password) errores.password = 'La contraseña es obligatoria';
  return errores;
}

export default function Login() {
  const { login, estaAutenticado, comprobandoSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState<ErroresLogin>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const destino = (location.state as { from?: string } | null)?.from ?? '/';

  // Si ya hay sesión, no tiene sentido ver el login
  if (!comprobandoSesion && estaAutenticado) {
    return <Navigate to={destino} replace />;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando) return; // evita envíos duplicados

    const erroresCliente = validarLogin(email, password);
    setErrores(erroresCliente);
    setErrorGeneral(null);
    if (Object.keys(erroresCliente).length > 0) return;

    setEnviando(true);
    try {
      await login(email.trim(), password);
      navigate(destino, { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 400 && error.errores.length > 0) {
        // Errores de validación del servidor, cada uno bajo su campo
        const porCampo: ErroresLogin = {};
        for (const { campo, mensaje } of error.errores) {
          if (campo === 'email' || campo === 'password') porCampo[campo] = mensaje;
        }
        setErrores(porCampo);
      } else if (error instanceof ApiError) {
        setErrorGeneral(error.message); // 401, 429, sin conexión...
      } else {
        setErrorGeneral('Ha ocurrido un error inesperado');
      }
      setEnviando(false);
    }
  }

  return (
    <Pagina>
      <Contenedor>
        <Titulo>UFC App</Titulo>
        <form onSubmit={handleSubmit} noValidate>
          {errorGeneral && <FormError role="alert">{errorGeneral}</FormError>}

          <Field>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              $invalid={Boolean(errores.email)}
              autoComplete="email"
            />
            {errores.email && <FieldError>{errores.email}</FieldError>}
          </Field>

          <Field>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              $invalid={Boolean(errores.password)}
              autoComplete="current-password"
            />
            {errores.password && <FieldError>{errores.password}</FieldError>}
          </Field>

          <Button type="submit" disabled={enviando} style={{ width: '100%' }}>
            {enviando ? 'Entrando...' : 'Iniciar sesión'}
          </Button>
        </form>
      </Contenedor>
    </Pagina>
  );
}