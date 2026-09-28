import { Genero, Raza, RolHeroe } from "../core/enums";
import { EstadisticasHeroe, Habilidad, SkinConfig } from "../core/types";

export abstract class Heroe {
  public id: string;
  public nombre: string;
  public rol: RolHeroe;
  public raza: Raza;
  public genero: Genero;
  public nivel: number;
  public experiencia: number;
  public stats: EstadisticasHeroe;
  public habilidades: Habilidad[];
  public visualPath: string;
  public vfxColor: string;
  public animacion: string;
  public skinEquipadaId?: string;
  public skinMultiplicadorOro: number = 1;
  public skinMultiplicadorExp: number = 1;

  protected constructor(
    id: string,
    nombre: string,
    rol: RolHeroe,
    raza: Raza,
    genero: Genero,
    nivel: number,
    experiencia: number,
    statsBase: EstadisticasHeroe,
    habilidades: Habilidad[],
    visualPath: string,
    vfxColor: string,
    animacion: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.rol = rol;
    this.raza = raza;
    this.genero = genero;
    this.nivel = nivel;
    this.experiencia = experiencia;
    this.stats = { ...statsBase };
    this.habilidades = habilidades;
    this.visualPath = visualPath;
    this.vfxColor = vfxColor;
    this.animacion = animacion;
  }

  public gainExp(amount: number): void {
    this.experiencia += amount;
    while (this.experiencia >= this.experienciaNecesaria()) {
      this.experiencia -= this.experienciaNecesaria();
      this.nivel += 1;
      this.mejorarEstadisticasPorNivel();
    }
  }

  public experienciaNecesaria(): number {
    return 100 + this.nivel * 60;
  }

  protected mejorarEstadisticasPorNivel(): void {
    this.stats.poderDeResolucion += 4;
    this.stats.resistenciaADistraccion += 3;
    this.stats.velocidadDeEnfoque += 4;
  }

  public getSkillById(habilidadId: string): Habilidad | undefined {
    return this.habilidades.find((h) => h.id === habilidadId);
  }

  public aplicarSkin(skin: SkinConfig): void {
    this.skinEquipadaId = skin.id;
    this.visualPath = this.resolverRutaVisual(skin);
    this.vfxColor = skin.vfxColor;
    this.animacion = skin.animacion;
    this.skinMultiplicadorOro = skin.multiplicadorOro;
    this.skinMultiplicadorExp = skin.multiplicadorExp;
  }

  protected resolverRutaVisual(skin: SkinConfig): string {
    const generoSegmento = this.genero === Genero.Masculino ? "m" : "f";
    const razaSegmento = this.raza.toLowerCase();
    return `assets/heroes/${this.rol}/${razaSegmento}/${generoSegmento}/${skin.id}.png`;
  }

  public toPlainObject() {
    return {
      id: this.id,
      nombre: this.nombre,
      rol: this.rol,
      raza: this.raza,
      genero: this.genero,
      nivel: this.nivel,
      experiencia: this.experiencia,
      stats: this.stats,
      skinEquipadaId: this.skinEquipadaId,
      visualPath: this.visualPath,
      vfxColor: this.vfxColor,
      animacion: this.animacion,
    };
  }
}
