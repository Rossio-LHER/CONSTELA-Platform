import { Genero, Raza, RolHeroe } from "../core/enums";
import { Habilidad } from "../core/types";
import { Heroe } from "../models/Heroe";

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

class GuardianDelEnfoque extends Heroe {
  constructor(raza: Raza, genero: Genero) {
    super(
      createId("guardian"),
      "Guardián del Enfoque",
      RolHeroe.GuardianDelEnfoque,
      raza,
      genero,
      1,
      0,
      {
        poderDeResolucion: 26,
        resistenciaADistraccion: 34,
        velocidadDeEnfoque: 20,
      },
      [
        {
          id: "shield-voluntad",
          nombre: "Escudo de Voluntad",
          descripcion: "Crea un escudo protector para los compañeros de la sala.",
          efecto: "Reduce la procrastinación y bloquea interrupciones.",
          tipo: "shield",
          valor: 18,
        },
        {
          id: "muro-de-conexion",
          nombre: "Muro de Conexión",
          descripcion: "Estabiliza el ritmo del trabajo colectivo.",
          efecto: "Aumenta la resistencia a la distracción del grupo.",
          tipo: "buff",
          valor: 12,
        },
        {
          id: "respira-la-meta",
          nombre: "Respira la Meta",
          descripcion: "Reinicio de energía para el equipo.",
          efecto: "Recupera disciplina y reduce la fatiga de estudio.",
          tipo: "curacion",
          valor: 10,
        },
      ],
      "assets/heroes/guardian/default.png",
      "#4ecdc4",
      "guardia-stand"
    );
  }
}

class EspecialistaAcademico extends Heroe {
  constructor(raza: Raza, genero: Genero) {
    super(
      createId("academico"),
      "Especialista Académico",
      RolHeroe.EspecialistaAcademico,
      raza,
      genero,
      1,
      0,
      {
        poderDeResolucion: 35,
        resistenciaADistraccion: 20,
        velocidadDeEnfoque: 28,
      },
      [
        {
          id: "rayo-comprension",
          nombre: "Rayo de Comprensión",
          descripcion: "Ataque de claridad enfocada.",
          efecto: "Aumenta el poder de resolución de la sala y rompe bloqueo mental.",
          tipo: "buff",
          valor: 20,
        },
        {
          id: "mapa-de-conceptos",
          nombre: "Mapa de Conceptos",
          descripcion: "Visualiza el camino del estudio.",
          efecto: "Aumenta la velocidad de asimilación y genera bonus de experiencia.",
          tipo: "bonusExp",
          valor: 18,
        },
        {
          id: "prueba-de-refuerzo",
          nombre: "Prueba de Refuerzo",
          descripcion: "Ejercicio corto para reforzar memoria.",
          efecto: "Da bonus de oro y mejora la calidad del estudio.",
          tipo: "bonusOro",
          valor: 22,
        },
      ],
      "assets/heroes/academico/default.png",
      "#6c5ce7",
      "sabiduria-cast"
    );
  }
}

class SoporteMotivacional extends Heroe {
  constructor(raza: Raza, genero: Genero) {
    super(
      createId("soporte"),
      "Soporte Motivacional",
      RolHeroe.SoporteMotivacional,
      raza,
      genero,
      1,
      0,
      {
        poderDeResolucion: 22,
        resistenciaADistraccion: 28,
        velocidadDeEnfoque: 34,
      },
      [
        {
          id: "diana-aliento",
          nombre: "Diana de Aliento",
          descripcion: "Projecta ánimo a todos.",
          efecto: "Bono de motivación y protección emocional.",
          tipo: "curacion",
          valor: 16,
        },
        {
          id: "coro-confianza",
          nombre: "Coro de Confianza",
          descripcion: "Fuerza colectiva de apoyo.",
          efecto: "Aumenta el rendimiento del equipo y reduce procrastinación.",
          tipo: "buff",
          valor: 15,
        },
        {
          id: "ritmo-comunidad",
          nombre: "Ritmo de Comunidad",
          descripcion: "Sinergia social de estudio.",
          efecto: "Aumenta la velocidad de enfoque del grupo.",
          tipo: "global",
          valor: 14,
        },
      ],
      "assets/heroes/soporte/default.png",
      "#ffeaa7",
      "apoyo-dance"
    );
  }
}

export class HeroFactory {
  public static createHero(rol: RolHeroe, raza: Raza, genero: Genero): Heroe {
    switch (rol) {
      case RolHeroe.GuardianDelEnfoque:
        return new GuardianDelEnfoque(raza, genero);
      case RolHeroe.EspecialistaAcademico:
        return new EspecialistaAcademico(raza, genero);
      case RolHeroe.SoporteMotivacional:
        return new SoporteMotivacional(raza, genero);
      default:
        throw new Error(`Rol no soportado: ${rol}`);
    }
  }
}
