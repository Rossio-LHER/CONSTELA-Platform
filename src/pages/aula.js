const STORAGE_KEY = "constela.playerProgress";
const FOCUS_SECONDS = 25 * 60;

class PersistenciaConstela {
  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error("Error leyendo progreso:", error);
      return null;
    }
  }

  static save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error guardando progreso:", error);
      return false;
    }
  }

  static ensureDefault() {
    const actual = this.load();
    if (actual) return actual;

    const demo = {
      cuenta: {
        username: "Astra",
        raza: "Astrales",
        genero: "Femenino",
        nombreHeroe: "Astra",
        nivel: 1,
        experiencia: 0,
        monedas: 120,
        fuerzaTotal: 1,
      },
      heroe: {
        id: "demo-hero",
        nombre: "Astra",
        rol: "EspecialistaAcademico",
        raza: "Astrales",
        genero: "Femenino",
        nivel: 1,
        experiencia: 0,
        visualPath: "../assets/personajes/default.svg",
        vfxColor: "#7a5cff",
        animacion: "anim-estudio",
        stats: {
          poderDeResolucion: 88,
          resistenciaADistraccion: 73,
          velocidadDeEnfoque: 81,
        },
        habilidades: [
          {
            id: "rayo-comprension",
            nombre: "Rayo de Comprensión",
            descripcion: "Claridad total sobre el tema.",
            tipo: "buff",
            valor: 18,
            icono: "⚡",
          },
          {
            id: "mapa-de-conceptos",
            nombre: "Mapa de Conceptos",
            descripcion: "Conecta ideas de forma rápida.",
            tipo: "bonusExp",
            valor: 12,
            icono: "🧠",
          },
          {
            id: "prueba-de-refuerzo",
            nombre: "Prueba de Refuerzo",
            descripcion: "Fortalece la memoria y da recompensas.",
            tipo: "bonusOro",
            valor: 15,
            icono: "✨",
          },
        ],
      },
    };

    this.save(demo);
    return demo;
  }
}

class HeroeConstela {
  constructor(data) {
    this.id = data.id || crypto.randomUUID();
    this.nombre = data.nombre || "Heroe";
    this.rol = data.rol || "EspecialistaAcademico";
    this.raza = data.raza || "Astrales";
    this.genero = data.genero || "Femenino";
    this.nivel = data.nivel || 1;
    this.experiencia = data.experiencia || 0;
    this.rutaImagen = data.visualPath || this.generarRutaImagen();
    this.animacionEstudio = data.animacion || "anim-estudio";
    this.vfxColor = data.vfxColor || "#7a5cff";
    this.stats = {
      poderDeResolucion: data.stats?.poderDeResolucion || 60,
      resistenciaADistraccion: data.stats?.resistenciaADistraccion || 60,
      velocidadDeEnfoque: data.stats?.velocidadDeEnfoque || 60,
    };
    this.habilidades = data.habilidades || [];
  }

  generarRutaImagen() {
    const generoKey = this.genero === "Masculino" ? "m" : "f";
    const razaKey = this.raza.toLowerCase();
    return `../assets/personajes/${razaKey}_${generoKey}_skin_base.png`;
  }

  experienciaNecesaria() {
    return 100 + this.nivel * 55;
  }

  aplicarHabilidadEnSala(habilidadId) {
    const habilidad = this.habilidades.find((h) => h.id === habilidadId);
    if (!habilidad) return null;

    const result = {
      nombre: habilidad.nombre,
      descripcion: habilidad.descripcion,
      tipo: habilidad.tipo,
      valor: habilidad.valor,
    };

    this.ultimoEfecto = result;
    this.renderSkillOverlay(result);
    return result;
  }

  finalizarBloqueEstudio() {
    const experienciaBase = 50 + this.stats.velocidadDeEnfoque * 1.2;
    const monedasBase = 30 + this.stats.poderDeResolucion * 0.5;

    const experienciaGanada = Math.round(experienciaBase);
    const monedasGanadas = Math.round(monedasBase);

    this.experiencia += experienciaGanada;
    this.monedas = (this.monedas || 0) + monedasGanadas;

    while (this.experiencia >= this.experienciaNecesaria()) {
      this.experiencia -= this.experienciaNecesaria();
      this.nivel += 1;
    }

    return {
      experienciaGanada,
      monedasGanadas,
      nivel: this.nivel,
    };
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      rol: this.rol,
      raza: this.raza,
      genero: this.genero,
      nivel: this.nivel,
      experiencia: this.experiencia,
      visualPath: this.rutaImagen,
      vfxColor: this.vfxColor,
      animacion: this.animacionEstudio,
      stats: this.stats,
      habilidades: this.habilidades,
    };
  }
}

const state = {
  hero: null,
  squad: [],
  timerSeconds: FOCUS_SECONDS,
  isRunning: false,
  intervalId: null,
};

const $ = (selector) => document.querySelector(selector);

const timerValue = document.getElementById("timer-value");
const timerRing = document.getElementById("timer-ring");
const focusBtn = document.getElementById("btn-focus");
const statusLabel = document.getElementById("status-label");
const squadGrid = document.getElementById("squad-grid");
const skillsContainer = document.getElementById("skills-container");
const skillHeroName = document.getElementById("skill-hero-name");
const rewardModal = document.getElementById("reward-modal");
const overlayEffect = document.getElementById("overlay-effect");
const rewardXp = document.getElementById("reward-xp");
const rewardCoins = document.getElementById("reward-coins");
const rewardLevel = document.getElementById("reward-level");

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateTimerVisual() {
  const progress = (state.timerSeconds / FOCUS_SECONDS) * 100;
  const angle = (progress / 100) * 360;
  timerRing.style.background = `conic-gradient(#8b5cf6 ${angle}deg, rgba(255,255,255,0.08) 0deg)`;
  timerValue.textContent = formatTime(state.timerSeconds);
}

function renderHeroSkills() {
  const hero = state.hero;
  if (!hero || !hero.habilidades.length) return;

  skillHeroName.textContent = hero.nombre;
  skillsContainer.innerHTML = hero.habilidades
    .map(
      (skill) => `
        <button class="skill-button" data-skill-id="${skill.id}" title="${skill.descripcion}">
          <span class="skill-icon">${skill.icono || "✦"}</span>
          <span class="skill-name">${skill.nombre}</span>
        </button>
      `
    )
    .join("");

  document.querySelectorAll(".skill-button").forEach((button) => {
    button.addEventListener("click", () => {
      const skillId = button.dataset.skillId;
      hero.aplicarHabilidadEnSala(skillId);
    });
  });
}

function renderSquad() {
  const arr = state.squad.length ? state.squad : [state.hero];
  const cards = arr
    .map(
      (student) => `
        <article class="squad-card ${student.animacionEstudio || "anim-estudio"}">
          <div class="avatar-wrap">
            <img
              src="${student.rutaImagen || "../assets/personajes/default.svg"}"
              alt="${student.nombre}"
              class="avatar-image ${student.id === state.hero.id ? "is-player" : ""}"
              onerror="this.onerror=null;this.src='../assets/personajes/default.svg';"
            />
          </div>
          <div class="avatar-meta">
            <div class="avatar-topline">
              <strong>${student.nombre}</strong>
              <span>Lv ${student.nivel}</span>
            </div>
            <div class="xp-bar">
              <div class="xp-fill" style="width: ${(student.experiencia / Math.max(student.experienciaNecesaria(), 1)) * 100}%"></div>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  squadGrid.innerHTML = cards;
}

function syncStudyAnimations() {
  const avatars = document.querySelectorAll(".avatar-image");
  avatars.forEach((img) => {
    if (state.isRunning) {
      img.classList.add("is-studying");
      img.parentElement.parentElement.classList.add("is-studying");
    } else {
      img.classList.remove("is-studying");
      img.parentElement.parentElement.classList.remove("is-studying");
    }
  });
}

function startTimer() {
  if (state.isRunning) return;
  state.isRunning = true;
  statusLabel.textContent = "Enfocado";
  focusBtn.textContent = "PAUSAR ENFOQUE";
  syncStudyAnimations();

  state.intervalId = setInterval(() => {
    if (state.timerSeconds > 0) {
      state.timerSeconds -= 1;
      updateTimerVisual();
      return;
    }

    clearInterval(state.intervalId);
    state.isRunning = false;
    state.intervalId = null;
    statusLabel.textContent = "Completado";
    focusBtn.textContent = "INICIAR ENFOQUE";
    syncStudyAnimations();
    finalizarBloqueEstudio();
  }, 1000);
}

function pausarTimer() {
  if (!state.isRunning) return;
  clearInterval(state.intervalId);
  state.isRunning = false;
  state.intervalId = null;
  statusLabel.textContent = "Pausado";
  focusBtn.textContent = "REANUDAR ENFOQUE";
  syncStudyAnimations();
}

function toggleTimer() {
  if (state.isRunning) {
    pausarTimer();
    return;
  }

  startTimer();
}

function renderReward(data) {
  rewardXp.textContent = `+${data.experienciaGanada}`;
  rewardCoins.textContent = `+${data.monedasGanadas}`;
  rewardLevel.textContent = data.nivel;
  rewardModal.classList.remove("hidden");
}

function hideReward() {
  rewardModal.classList.add("hidden");
}

function renderPlayerSummary() {
  const progress = PersistenciaConstela.ensureDefault();
  const hero = new HeroeConstela(progress.heroe);
  hero.monedas = progress.cuenta.monedas || hero.monedas || 0;
  state.hero = hero;

  const listaDemo = [
    hero,
    new HeroeConstela({
      id: "demo-2",
      nombre: "Nexa",
      rol: "GuardianDelEnfoque",
      raza: "Célidos",
      genero: "Masculino",
      visualPath: "../assets/personajes/default.svg",
      animacion: "anim-estudio",
      nivel: 3,
      experiencia: 80,
      stats: { poderDeResolucion: 76, resistenciaADistraccion: 92, velocidadDeEnfoque: 70 },
      habilidades: [
        { id: "shield-voluntad", nombre: "Escudo de Voluntad", tipo: "shield", valor: 14, icono: "🛡️" },
        { id: "muro-de-conexion", nombre: "Muro de Conexión", tipo: "buff", valor: 11, icono: "🧱" },
        { id: "respira-la-meta", nombre: "Respira la Meta", tipo: "curacion", valor: 9, icono: "🌬️" },
      ],
    }),
    new HeroeConstela({
      id: "demo-3",
      nombre: "Luna",
      rol: "SoporteMotivacional",
      raza: "Nebulanos",
      genero: "Femenino",
      visualPath: "../assets/personajes/default.svg",
      animacion: "anim-estudio",
      nivel: 5,
      experiencia: 120,
      stats: { poderDeResolucion: 70, resistenciaADistraccion: 80, velocidadDeEnfoque: 90 },
      habilidades: [
        { id: "diana-aliento", nombre: "Diana de Aliento", tipo: "curacion", valor: 16, icono: "💫" },
        { id: "coro-confianza", nombre: "Coro de Confianza", tipo: "buff", valor: 13, icono: "🎵" },
        { id: "ritmo-comunidad", nombre: "Ritmo de Comunidad", tipo: "global", valor: 10, icono: "🌌" },
      ],
    }),
    new HeroeConstela({
      id: "demo-4",
      nombre: "Milo",
      rol: "EspecialistaAcademico",
      raza: "Astrales",
      genero: "Masculino",
      visualPath: "../assets/personajes/default.svg",
      animacion: "anim-estudio",
      nivel: 2,
      experiencia: 60,
      stats: { poderDeResolucion: 82, resistenciaADistraccion: 65, velocidadDeEnfoque: 75 },
      habilidades: [
        { id: "rayo-comprension", nombre: "Rayo de Comprensión", tipo: "buff", valor: 18, icono: "⚡" },
        { id: "mapa-de-conceptos", nombre: "Mapa de Conceptos", tipo: "bonusExp", valor: 12, icono: "🧠" },
        { id: "prueba-de-refuerzo", nombre: "Prueba de Refuerzo", tipo: "bonusOro", valor: 15, icono: "✨" },
      ],
    }),
  ];

  state.squad = listaDemo;
}

function renderOverlay(skillResult) {
  overlayEffect.classList.add("active");
  overlayEffect.style.background = skillResult?.tipo === "bonusOro" ? "rgba(255,214,10,0.32)" : "rgba(122,92,246,0.28)";
  setTimeout(() => overlayEffect.classList.remove("active"), 600);
}

function finalizaGuardadoHeroe() {
  const progress = PersistenciaConstela.ensureDefault();
  progress.cuenta = {
    ...progress.cuenta,
    username: state.hero.nombre,
    raza: state.hero.raza,
    genero: state.hero.genero,
    nombreHeroe: state.hero.nombre,
    nivel: state.hero.nivel,
    experiencia: state.hero.experiencia,
    monedas: state.hero.monedas || progress.cuenta.monedas,
  };

  progress.heroe = state.hero.toJSON();
  PersistenciaConstela.save(progress);
}

function finalizarBloqueEstudio() {
  const recompensa = state.hero.finalizarBloqueEstudio();
  finalizaGuardadoHeroe();
  renderReward(recompensa);
}

function bindControls() {
  focusBtn.addEventListener("click", () => {
    toggleTimer();
  });

  document.getElementById("btn-continue").addEventListener("click", () => {
    hideReward();
    focusBtn.textContent = "INICIAR ENFOQUE";
    state.timerSeconds = FOCUS_SECONDS;
    updateTimerVisual();
  });
}

function renderInitialState() {
  renderPlayerSummary();
  updateTimerVisual();
  renderSquad();
  renderHeroSkills();
  syncStudyAnimations();
  bindControls();
}

window.addEventListener("DOMContentLoaded", renderInitialState);

window.addEventListener("squad:skill", (event) => {
  const { skill } = event.detail;
  renderOverlay(skill);
});

window.HeroeConstela = HeroeConstela;
window.PersistenciaConstela = PersistenciaConstela;

window.aplicarHabilidadEnSala = function (habilidadId) {
  const result = state.hero.aplicarHabilidadEnSala(habilidadId);
  if (result) {
    renderOverlay(result);
    finalizaGuardadoHeroe();
  }
};

