import { Genero, Raza, RarezaSkin, RolHeroe, EstadoAula } from "./enums";

export interface EstadisticasHeroe {
  poderDeResolucion: number;
  resistenciaADistraccion: number;
  velocidadDeEnfoque: number;
}

export interface Habilidad {
  id: string;
  nombre: string;
  descripcion: string;
  efecto: string;
  tipo: "buff" | "shield" | "debuff" | "curacion" | "bonusExp" | "bonusOro" | "global";
  valor: number;
}

export interface SkinConfig {
  id: string;
  nombre: string;
  rareza: RarezaSkin;
  descripcion: string;
  visualPath: string;
  vfxColor: string;
  animacion: string;
  multiplicadorOro: number;
  multiplicadorExp: number;
  razaPermitida?: Raza;
  generoPermitido?: Genero;
}

export interface DatosCuentaJugador {
  id: string;
  username: string;
  raza: Raza;
  genero: Genero;
  nombreHeroe: string;
  nivel: number;
  experiencia: number;
  monedas: number;
  fuerzaTotal: number;
  ultimaSesion?: string;
}

export interface HeroePersistido {
  id: string;
  nombre: string;
  rol: RolHeroe;
  raza: Raza;
  genero: Genero;
  nivel: number;
  experiencia: number;
  stats: EstadisticasHeroe;
  skinEquipadaId?: string;
  visualPath: string;
  vfxColor: string;
  animacion: string;
}

export interface AulaPersistida {
  id: string;
  nombre: string;
  estado: EstadoAula;
  tiempoRestanteMs: number;
  duracionMs: number;
  heroesConectadosIds: string[];
}
