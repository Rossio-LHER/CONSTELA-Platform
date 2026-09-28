import { Genero, Raza, RarezaSkin } from "../core/enums";
import { SkinConfig } from "../core/types";

export class Skin {
  public id: string;
  public nombre: string;
  public rareza: RarezaSkin;
  public descripcion: string;
  public visualPath: string;
  public vfxColor: string;
  public animacion: string;
  public multiplicadorOro: number;
  public multiplicadorExp: number;
  public razaPermitida?: Raza;
  public generoPermitido?: Genero;

  constructor(data: SkinConfig) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.rareza = data.rareza;
    this.descripcion = data.descripcion;
    this.visualPath = data.visualPath;
    this.vfxColor = data.vfxColor;
    this.animacion = data.animacion;
    this.multiplicadorOro = data.multiplicadorOro;
    this.multiplicadorExp = data.multiplicadorExp;
    this.razaPermitida = data.razaPermitida;
    this.generoPermitido = data.generoPermitido;
  }

  public esCompatible(raza: Raza, genero: Genero): boolean {
    if (this.razaPermitida && this.razaPermitida !== raza) return false;
    if (this.generoPermitido && this.generoPermitido !== genero) return false;
    return true;
  }

  public toPlainObject(): SkinConfig {
    return {
      id: this.id,
      nombre: this.nombre,
      rareza: this.rareza,
      descripcion: this.descripcion,
      visualPath: this.visualPath,
      vfxColor: this.vfxColor,
      animacion: this.animacion,
      multiplicadorOro: this.multiplicadorOro,
      multiplicadorExp: this.multiplicadorExp,
      razaPermitida: this.razaPermitida,
      generoPermitido: this.generoPermitido,
    };
  }
}
