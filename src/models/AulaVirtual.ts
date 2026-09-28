import { Genero, Raza, State } from "../core/enums";

export class AulaVirtual {
  public id: string;
  public nombre: string;
  public estado: EstadoAula;
  public tiempoRestanteMs: number;
  public duracionMs: number;
  public heroesConectados: Map<string, Heroe>;
  public efectosActivos: Map<string, number>;

  constructor(id: string, nombre: string, duracionMs: number) {
    this.id = id;
    this.nombre = nombre;
    this.estado = EstadoAula.Estudiando;
    this.duracionMs = duracionMs;
    this.tiempoRestanteMs = duracionMs;
    this.heroesConectados = new Map();
    this.efectosActivos = new Map();
  }

  public agregarHeroe(heroe: Heroe): void {
    this.heroesConectados.set(heroe.id, heroe);
  }

  public removerHeroe(heroeId: string): void {
    this.heroesConectados.delete(heroeId);
  }

  public iniciar(): void {
    this.estado = EstadoAula.Estudiando;
  }

  public pausar(): void {
    this.estado = EstadoAula.Descanso;
  }

  public tick(ms: number): void {
    if (this.tiempoRestanteMs <= 0) return;
    this.tiempoRestanteMs = Math.max(0, this.tiempoRestanteMs - ms);
    if (this.tiempoRestanteMs === 0) {
      this.finalizarSesion();
    }
  }

  public aplicarHabilidadEnSala(heroeId: string, habilidadId: string): void {
    const heroe = this.heroesConectados.get(heroeId);
    if (!heroe) return;

    const habilidad = heroe.getSkillById(habilidadId);
    if (!habilidad) return;

    switch (habilidad.tipo) {
      case "shield":
        this.efectosActivos.set(`shield:${heroeId}`, habilidad.valor);
        break;
      case "buff":
        this.efectosActivos.set(`buff:${heroeId}`, habilidad.valor);
        break;
      case "debuff":
        this.efectosActivos.set(`debuff:${heroeId}`, -habilidad.valor);
        break;
      case "curacion":
        this.efectosActivos.set(`curacion:${heroeId}`, habilidad.valor);
        break;
      case "bonusExp":
        this.efectosActivos.set(`bonusExp:${heroeId}`, habilidad.valor);
        break;
      case "bonusOro":
        this.efectosActivos.set(`bonusOro:${heroeId}`, habilidad.valor);
        break;
      case "global":
        this.heroesConectados.forEach((otroHeroe) => {
          this.efectosActivos.set(`global:${otroHeroe.id}`, habilidad.valor);
        });
        break;
    }
  }

  public finalizarSesion(): {
    monedasGanadas: number;
    experienciaGanada: number;
    heroesActualizados: Heroe[];
  } {
    const heroesActualizados: Heroe[] = [];
    let totalMonedas = 0;
    let totalExp = 0;

    this.heroesConectados.forEach((heroe) => {
      const baseMonedas = 30 + heroe.stats.poderDeResolucion * 0.3;
      const baseExp = 35 + heroe.stats.velocidadDeEnfoque * 0.25;

      const bonusOro = this.efectosActivos.get(`bonusOro:${heroe.id}`) ?? 0;
      const bonusExp = this.efectosActivos.get(`bonusExp:${heroe.id}`) ?? 0;
      const shield = this.efectosActivos.get(`shield:${heroe.id}`) ?? 0;
      const buff = this.efectosActivos.get(`buff:${heroe.id}`) ?? 0;
      const global = this.efectosActivos.get(`global:${heroe.id}`) ?? 0;

      const monedasConSkin = baseMonedas * heroe.skinMultiplicadorOro;
      const expConSkin = baseExp * heroe.skinMultiplicadorExp;

      const monedasFinales =
        monedasConSkin + bonusOro + shield * 0.5 + buff * 0.4 + global * 0.3;

      const expFinales =
        expConSkin + bonusExp + shield * 0.2 + buff * 0.2 + global * 0.25;

      totalMonedas += monedasFinales;
      totalExp += expFinales;

      heroe.gainExp(Math.round(expFinales));
      heroesActualizados.push(heroe);
    });

    this.estado = EstadoAula.Descanso;
    this.tiempoRestanteMs = 0;

    return {
      monedasGanadas: Math.round(totalMonedas),
      experienciaGanada: Math.round(totalExp),
      heroesActualizados,
    };
  }

  public toPlainObject() {
    return {
      id: this.id,
      nombre: this.nombre,
      estado: this.estado,
      tiempoRestanteMs: this.tiempoRestanteMs,
      duracionMs: this.duracionMs,
      heroesConectadosIds: Array.from(this.heroesConectados.keys()),
    };
  }
}
