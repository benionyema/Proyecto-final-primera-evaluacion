// src/types/index.ts

export type ResultadoPelea = 'Victoria' | 'Derrota' | 'Empate';

export interface Pelea {
  _id: string;
  rival: string;
  resultado: ResultadoPelea;
  metodo: string;
  fecha: string; // ISO, ej: "2024-05-12T00:00:00.000Z"
}

export interface RecordLuchador {
  victorias: number;
  derrotas: number;
  empates: number;
  ko: number;
}

export interface Luchador {
  _id: string;
  nombre: string;
  apodo: string;
  activo: boolean;
  edad: number;
  categoria: string;
  pais: string;
  fecha_debut: string;
  estilos: string[];
  record: RecordLuchador;
  peleas: Pelea[];
  createdAt: string;
  updatedAt: string;
}

/** Lo que enviamos al crear/editar: sin _id ni fechas automáticas */
export type LuchadorInput = Omit<
  Luchador,
  '_id' | 'createdAt' | 'updatedAt' | 'peleas'
>;

/** Lo que enviamos al crear/editar una pelea */
export type PeleaInput = Omit<Pelea, '_id'>;

export interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  avatar?: string; // opcional: si no existe, usaremos uno por defecto
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}