# CONSTELA Platform

Plataforma web de estudio gamificado basada en salas de enfoque Pomodoro, con personajes, skins, aulas virtuales y persistencia de datos en `localStorage`.

## Stack

- TypeScript
- Programación orientada a objetos (POO)
- localStorage para persistencia local
- Arquitectura modular preparada para migración futura a backend cloud

## Estructura principal

- `src/core`: enums y tipos compartidos
- `src/models`: entidades del dominio (`CuentaJugador`, `Heroe`, `Skin`, `AulaVirtual`)
- `src/factories`: creación de héroes por rol
- `src/services`: almacenamiento local
- `src/app`: orquestador principal del sistema
- `src/index.ts`: demo y uso básico

## Instalación

```bash
npm install
npm run build
```

## Uso rápido

```ts
import { ConstelaCore } from "./src/app/ConstelaCore";

const { cuenta, heroe } = ConstelaCore.crearCuentaYHeroe(
  "Astra",
  "Astrales",
  "Femenino",
  "EspecialistaAcademico"
);

const skins = ConstelaCore.crearSkinsBase();
ConstelaCore.equiparSkin(heroe, "skin-epica-celid");

const result = ConstelaCore.simularSesion();
console.log(result);
```

## Persistencia

El progreso del jugador se guarda automáticamente en `localStorage` con la clave:

```ts
constela.playerProgress
```

Esto facilita la migración posterior a una base de datos en la nube sin romper la lógica del sistema.
