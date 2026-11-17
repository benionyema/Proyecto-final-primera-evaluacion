// src/services/api.ts

const API_URL: string =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

/** Un error de un campo concreto, tal como lo envía el backend */
export interface ErrorCampo {
  campo: string;
  mensaje: string;
}

/** Error propio: lleva el código HTTP y los errores por campo (si los hay) */
export class ApiError extends Error {
  status: number;
  errores: ErrorCampo[];

  constructor(message: string, status: number, errores: ErrorCampo[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errores = errores;
  }
}

/** Devuelve true si el error es una cancelación voluntaria (AbortController) */
export function esAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface Opciones {
  method?: Metodo;
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
}

/** Resultado de una petición que además necesita cabeceras (listados) */
export interface RespuestaConCabeceras<T> {
  datos: T;
  total: number | null; // viene de la cabecera X-Total-Count
}

async function peticion(
  path: string,
  { method = 'GET', body, token, signal }: Opciones
): Promise<Response> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    // Cancelar a propósito no es un fallo: dejamos pasar el error original
    if (esAbortError(error)) throw error;
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }

  if (!response.ok) {
    let mensaje = `Error ${response.status}`;
    let errores: ErrorCampo[] = [];
    try {
      const data = await response.json();
      mensaje = data.msg ?? mensaje;
      if (Array.isArray(data.errores)) errores = data.errores;
    } catch {
      // la respuesta no era JSON; nos quedamos con el mensaje genérico
    }
    throw new ApiError(mensaje, response.status, errores);
  }

  return response;
}

/** Petición normal: devuelve directamente los datos */
export async function apiFetch<T>(
  path: string,
  opciones: Opciones = {}
): Promise<T> {
  const response = await peticion(path, opciones);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

/** Petición para listados: devuelve los datos y el total de elementos */
export async function apiFetchConTotal<T>(
  path: string,
  opciones: Opciones = {}
): Promise<RespuestaConCabeceras<T>> {
  const response = await peticion(path, opciones);
  const cabecera = response.headers.get('X-Total-Count');
  return {
    datos: (await response.json()) as T,
    total: cabecera !== null ? Number(cabecera) : null,
  };
}