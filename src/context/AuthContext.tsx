import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiFetch } from '../services/api';
import type { LoginResponse, Usuario } from '../types';

const TOKEN_KEY = 'ufc_token';

export interface AuthContextValue {
  usuario: Usuario | null;
  token: string | null;
  estaAutenticado: boolean;
  comprobandoSesion: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  // Si hay un token guardado, hay que comprobarlo antes de decidir nada
  const [comprobandoSesion, setComprobandoSesion] = useState<boolean>(
    () => localStorage.getItem(TOKEN_KEY) !== null
  );

  // Al cargar la app: si hay token guardado, pedimos el usuario al servidor
  useEffect(() => {
    const guardado = localStorage.getItem(TOKEN_KEY);
    if (!guardado) return;

    const controller = new AbortController();

    apiFetch<Usuario>('/auth/perfil', {
      token: guardado,
      signal: controller.signal,
    })
      .then((datos) => {
        setUsuario(datos);
        setComprobandoSesion(false);
      })
      .catch((error) => {
        if (controller.signal.aborted) return; // limpieza, no es un fallo real
        console.error('Sesión no válida:', error);
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setComprobandoSesion(false);
      });

    // Limpieza: si el componente se desmonta, cancelamos la petición
    return () => controller.abort();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const datos = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    localStorage.setItem(TOKEN_KEY, datos.token); // solo el token, nunca la contraseña
    setToken(datos.token);
    setUsuario(datos.usuario);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUsuario(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario,
      token,
      estaAutenticado: usuario !== null,
      comprobandoSesion,
      login,
      logout,
    }),
    [usuario, token, comprobandoSesion, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}