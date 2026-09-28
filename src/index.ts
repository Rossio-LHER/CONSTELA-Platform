import { Genero, Raza, RolHeroe } from "./core/enums";
import { ConstelaCore } from "./app/ConstelaCore";

const { cuenta, heroe } = ConstelaCore.crearCuentaYHeroe(
  "Astra",
  Raza.Astrales,
  Genero.Femenino,
  RolHeroe.EspecialistaAcademico
);

const skins = ConstelaCore.crearSkinsBase();
ConstelaCore.equiparSkin(heroe, "skin-epica-celid");

const resultado = ConstelaCore.simularSesion();

console.log("Cuenta:", cuenta);
console.log("Héroe:", heroe);
console.log("Skins disponibles:", skins.map((s) => s.nombre));
console.log("Resultado de sesión:", resultado);

export { cuenta, heroe, resultado };
