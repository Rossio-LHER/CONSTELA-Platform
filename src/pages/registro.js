const state = {
  raza: "Astrales",
  genero: "Masculino",
  rol: "GuardianDelEnfoque",
};

const razaCards = document.querySelectorAll(".raza-card");
const genderButtons = document.querySelectorAll(".btn-gender");
const roleSelect = document.getElementById("role-select");
const usernameInput = document.getElementById("username");
const iniciarBtn = document.getElementById("btn-iniciar");

const previewImagen = document.getElementById("preview-imagen");
const previewRaza = document.getElementById("preview-raza");
const previewGenero = document.getElementById("preview-genero");
const previewRol = document.getElementById("preview-rol");
const previewNombre = document.getElementById("preview-nombre");

const statPoder = document.getElementById("stat-poder");
const statResistencia = document.getElementById("stat-resistencia");
const statVelocidad = document.getElementById("stat-velocidad");

const statPoderValor = document.getElementById("stat-poder-valor");
const statResistenciaValor = document.getElementById("stat-resistencia-valor");
const statVelocidadValor = document.getElementById("stat-velocidad-valor");

const RAZA_STATS = {
  Astrales: { poder: 100, resistencia: 70, velocidad: 65 },
  "Célidos": { poder: 70, resistencia: 100, velocidad: 75 },
  Nebulanos: { poder: 75, resistencia: 68, velocidad: 100 },
};

const ROL_LABELS = {
  GuardianDelEnfoque: "Guardián del Enfoque",
  EspecialistaAcademico: "Especialista Académico",
  SoporteMotivacional: "Soporte Motivacional",
};

function calcularRutaImagen() {
  const generoKey = state.genero === "Masculino" ? "m" : "f";
  const razaKey = state.raza.toLowerCase();
  return `../assets/personajes/${razaKey}_${generoKey}_skin_base.png`;
}

function actualizarPreview() {
  previewRaza.textContent = state.raza;
  previewGenero.textContent = state.genero;
  previewRol.textContent = ROL_LABELS[state.rol] || "Rol";
  previewNombre.textContent = usernameInput.value.trim() || "Tu Héroe";

  const ruta = calcularRutaImagen();
  previewImagen.src = ruta;

  const stats = RAZA_STATS[state.raza] || { poder: 0, resistencia: 0, velocidad: 0 };
  statPoder.style.width = `${stats.poder}%`;
  statResistencia.style.width = `${stats.resistencia}%`;
  statVelocidad.style.width = `${stats.velocidad}%`;

  statPoderValor.textContent = stats.poder;
  statResistenciaValor.textContent = stats.resistencia;
  statVelocidadValor.textContent = stats.velocidad;
}

function setSelectedRaza(raza) {
  state.raza = raza;
  razaCards.forEach((card) => {
    card.classList.toggle("selected", card.dataset.raza === raza);
  });
  actualizarPreview();
}

function setSelectedGenero(genero) {
  state.genero = genero;
  genderButtons.forEach((button) => {
    button.classList.toggle("selected", button.dataset.gender === genero);
  });
  actualizarPreview();
}

function setSelectedRol(rol) {
  state.rol = rol;
  roleSelect.value = rol || "";
  actualizarPreview();
}

function crearHeroeDesdeFormulario() {
  const username = usernameInput.value.trim();
  if (!username || username.length < 3) {
    alert("El nombre de usuario debe tener al menos 3 caracteres.");
    return null;
  }

  if (!state.raza || !state.genero || !state.rol) {
    alert("Debes completar raza, género y rol antes de continuar.");
    return null;
  }

  return {
    username,
    raza: state.raza,
    genero: state.genero,
    rol: state.rol,
    visualPath: calcularRutaImagen(),
    nivel: 1,
    experiencia: 0,
    monedas: 120,
    createdAt: new Date().toISOString(),
  };
}

function guardarPersonaje() {
  const data = crearHeroeDesdeFormulario();
  if (!data) return;

  const baseProgress = JSON.parse(localStorage.getItem("constela.playerProgress") || "{}");
  const nextProgress = {
    ...baseProgress,
    cuenta: {
      ...(baseProgress.cuenta || {}),
      username: data.username,
      raza: data.raza,
      genero: data.genero,
      nombreHeroe: data.username,
      nivel: data.nivel,
      experiencia: data.experiencia,
      monedas: data.monedas,
      fuerzaTotal: 1,
      ultimaSesion: data.createdAt,
    },
    heroe: {
      ...(baseProgress.heroe || {}),
      id: `hero-${Date.now()}`,
      nombre: data.username,
      rol: data.rol,
      raza: data.raza,
      genero: data.genero,
      nivel: data.nivel,
      experiencia: data.experiencia,
      visualPath: data.visualPath,
      vfxColor: "#7a5cff",
      animacion: "anim-estudio",
      stats: {
        poderDeResolucion: RAZA_STATS[data.raza].poder,
        resistenciaADistraccion: RAZA_STATS[data.raza].resistencia,
        velocidadDeEnfoque: RAZA_STATS[data.raza].velocidad,
      },
      habilidades: [
        { id: "rayo-comprension", nombre: "Rayo de Comprensión", icono: "⚡", tipo: "buff", valor: 18 },
        { id: "mapa-de-conceptos", nombre: "Mapa de Conceptos", icono: "🧠", tipo: "bonusExp", valor: 12 },
        { id: "prueba-de-refuerzo", nombre: "Prueba de Refuerzo", icono: "✨", tipo: "bonusOro", valor: 15 },
      ],
    },
  };

  localStorage.setItem("constela.playerProgress", JSON.stringify(nextProgress));
  window.location.href = "./aula.html";
}

razaCards.forEach((card) => {
  card.addEventListener("click", () => setSelectedRaza(card.dataset.raza));
});

genderButtons.forEach((button) => {
  button.addEventListener("click", () => setSelectedGenero(button.dataset.gender));
});

roleSelect.addEventListener("change", (event) => {
  setSelectedRol(event.target.value);
});

usernameInput.addEventListener("input", actualizarPreview);
iniciarBtn.addEventListener("click", guardarPersonaje);

setSelectedRaza("Astrales");
setSelectedGenero("Masculino");
setSelectedRol("GuardianDelEnfoque");
actualizarPreview();
