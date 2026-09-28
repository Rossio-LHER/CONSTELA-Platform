import { Genero, Raza, RarezaSkin, RolHeroe } from "../core/enums";
import { CuentaJugador } from "../models/CuentaJugador";
import { HeroFactory } from "../factories/HeroFactory";
import { Heroe } from "../models/Heroe";
import { Skin } from "../models/Skin";
import { AulaVirtual } from "../models/AulaVirtual";
import { PersistenciaLocal } from "../services/PersistenciaLocal";

export class ConstelaCore {
  public static crearCuentaYHeroe(
    username: string,
    raza: Raza,
    genero: Genero,
    rolHeroe: RolHeroe
  ): { cuenta: CuentaJugador; heroe: Heroe } {
    const cuenta = new CuentaJugador({
      id: `player-${Math.random().toString(36).slice(2, 10)}`,
      username,
      raza,
      genero,
      nombreHeroe: "Heroe Inicial",
      nivel: 1,
      experiencia: 0,
      monedas: 100,
      fuerzaTotal: 1,
    });

    const bono = cuenta.aplicarBonoRaza();
    const heroe = HeroFactory.createHero(rolHeroe, raza, genero);

    heroe.stats.poderDeResolucion += bono.poderDeResolucion;
    heroe.stats.resistenciaADistraccion += bono.resistenciaADistraccion;
    heroe.stats.velocidadDeEnfoque += bono.velocidadDeEnfoque;

    const progress = { cuenta: cuenta.toPlainObject(), heroe: heroe.toPlainObject() };
    PersistenciaLocal.savePlayerProgress(progress);

    return { cuenta, heroe };
  }

  public static crearSkinsBase(): Skin[] {
    return [
      new Skin({
        id: "skin-basica-astral",
        nombre: "Skin Astral Básica",
        rareza: RarezaSkin.Basico,
        descripcion: "Apariencia base con brillo mínimo.",
        visualPath: "assets/skins/basic/astral.png",
        vfxColor: "#88f7ff",
        animacion: "idle-astral",
        multiplicadorOro: 1,
        multiplicadorExp: 1,
        razaPermitida: Raza.Astrales,
      }),
      new Skin({
        id: "skin-epica-celid",
        nombre: "Skin Célida Épica",
        rareza: RarezaSkin.Epico,
        descripcion: "Potencia visual y efecto de estudio premium.",
        visualPath: "assets/skins/epic/celid.png",
        vfxColor: "#c1ff72",
        animacion: "idle-celid",
        multiplicadorOro: 1.25,
        multiplicadorExp: 1.2,
        razaPermitida: Raza.Celidos,
      }),
      new Skin({
        id: "skin-collector-nebula",
        nombre: "Skin Nebulosa Collector",
        rareza: RarezaSkin.Collector,
        descripcion: "Estética ultra rara con glow extremo.",
        visualPath: "assets/skins/collector/nebula.png",
        vfxColor: "#ff9bff",
        animacion: "idle-nebula",
        multiplicadorOro: 1.5,
        multiplicadorExp: 1.6,
        razaPermitida: Raza.Nebulanos,
      }),
    ];
  }

  public static equiparSkin(heroe: Heroe, skinId: string): Heroe {
    const skin = this.crearSkinsBase().find((s) => s.id === skinId);
    if (!skin) {
      throw new Error(`Skin no encontrada: ${skinId}`);
    }

    if (!skin.esCompatible(heroe.raza, heroe.genero)) {
      throw new Error("La skin no coincide con la raza o género del héroe.");
    }

    heroe.aplicarSkin({
      id: skin.id,
      nombre: skin.nombre,
      rareza: skin.rareza,
      descripcion: skin.descripcion,
      visualPath: skin.visualPath,
      vfxColor: skin.vfxColor,
      animacion: skin.animacion,
      multiplicadorOro: skin.multiplicadorOro,
      multiplicadorExp: skin.multiplicadorExp,
      razaPermitida: skin.razaPermitida,
      generoPermitido: skin.generoPermitido,
    });

    const currentProgress = PersistenciaLocal.loadPlayerProgress() as any;
    if (currentProgress) {
      currentProgress.heroe.skinEquipadaId = heroe.skinEquipadaId;
      currentProgress.heroe.visualPath = heroe.visualPath;
      currentProgress.heroe.vfxColor = heroe.vfxColor;
      currentProgress.heroe.animacion = heroe.animacion;
      PersistenciaLocal.savePlayerProgress(currentProgress);
    }

    return heroe;
  }

  public static crearAulaYConectarHeroes(): AulaVirtual {
    const aula = new AulaVirtual("aula-001", "Sala de Enfoque", 25 * 60 * 1000);
    const { heroe } = this.crearCuentaYHeroe(
      "Aurora",
      Raza.Astrales,
      Genero.Femenino,
      RolHeroe.EspecialistaAcademico
    );

    aula.agregarHeroe(heroe);
    return aula;
  }

  public static simularSesion(): {
    aula: AulaVirtual;
    recompensa: { monedasGanadas: number; experienciaGanada: number; heroesActualizados: Heroe[] };
  } {
    const aula = this.crearAulaYConectarHeroes();
    const heroe = aula.heroesConectados.values().next().value as Heroe;

    aula.aplicarHabilidadEnSala(heroe.id, "rayo-comprension");
    aula.tick(1000);

    const recompensa = aula.finalizarSesion();

    const currentProgress = PersistenciaLocal.loadPlayerProgress() as any;
    if (currentProgress) {
      currentProgress.cuenta.monedas += recompensa.monedasGanadas;
      currentProgress.cuenta.experiencia += recompensa.experienciaGanada;
      currentProgress.cuenta.nombreHeroe = heroe.nombre;
      currentProgress.cuenta.raza = heroe.raza;
      currentProgress.cuenta.genero = heroe.genero;
      currentProgress.cuenta.ultimaSesion = new Date().toISOString();

      currentProgress.heroe = heroe.toPlainObject();
      PersistenciaLocal.savePlayerProgress(currentProgress);
    }

    return { aula, recompensa };
  }
}
