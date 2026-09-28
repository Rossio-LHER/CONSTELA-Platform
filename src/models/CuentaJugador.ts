import { Genero, Raza } from "../core/enums";
import { DatosCuentaJugador } from "../core/types";

export class CuentaJugador {
  public id: string;
  public username: string;
  public raza: Raza;
  public genero: Genero;
  public nombreHeroe: string;
  public nivel: number;
  public experiencia: number;
  public monedas: number;
  public fuerzaTotal: number;
  public ultimaSesion?: string;

  constructor(data: DatosCuentaJugador) {
    this.id = data.id;
    this.username = data.username;
    this.raza = data.raza;
    this.genero = data.genero;
    this.nombreHeroe = data.nombreHeroe;
    this.nivel = data.nivel;
    this.experiencia = data.experiencia;
    this.monedas = data.monedas;
    this.fuerzaTotal = data.fuerzaTotal;
    this.ultimaSesion = data.ultimaSesion;
  }

  public aplicarBonoRaza(): Record<string, number> {
    const bonos: Record<string, number> = {
      Astrales: 8,
      "Célidos": 8,
      Nebulanos: 8,
    };

    const bonus = bonos[this.raza] ?? 0;

    return {
      poderDeResolucion: this.raza === Raza.Astrales ? bonus : 0,
      resistenciaADistraccion: this.raza === Raza.Celidos ? bonus : 0,
      velocidadDeEnfoque: this.raza === Raza.Nebulanos ? bonus : 0,
    };
  }

  public sumarExperiencia(cantidad: number): void {
    this.experiencia += cantidad;
    while (this.experiencia >= this.experienciaNecesaria()) {
      this.experiencia -= this.experienciaNecesaria();
      this.nivel += 1;
    }
  }

  public experienciaNecesaria(): number {
    return 100 + this.nivel * 45;
  }

  public toPlainObject(): DatosCuentaJugador {
    return {
      id: this.id,
      username: this.username,
      raza: this.raza,
      genero: this.genero,
      nombreHeroe: this.nombreHeroe,
      nivel: this.nivel,
      experiencia: this.experiencia,
      monedas: this.monedas,
      fuerzaTotal: this.fuerzaTotal,
      ultimaSesion: this.ultimaSesion,
    };
  }
}
