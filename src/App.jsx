import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "constela.playerProgress";
const FOCUS_SECONDS = 25 * 60;

const RAZA_STATS = {
  Astrales: { poder: 100, resistencia: 70, velocidad: 65 },
  "Célidos": { poder: 70, resistencia: 100, velocidad: 75 },
  Nebulanos: { poder: 75, resistencia: 68, velocidad: 100 },
};

const ROLE_LABELS = {
  GuardianDelEnfoque: "Guardián del Enfoque",
  EspecialistaAcademico: "Especialista Académico",
  SoporteMotivacional: "Soporte Motivacional",
};

const defaultForm = {
  username: "",
  raza: "Astrales",
  genero: "Masculino",
  rol: "GuardianDelEnfoque",
};

const defaultPortrait = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#120f2a"/>
      <stop offset="100%" stop-color="#1d1e40"/>
    </linearGradient>
    <linearGradient id="coat" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="32" fill="url(#bg)"/>
  <circle cx="256" cy="124" r="72" fill="#f59e0b" opacity=".9"/>
  <path d="M160 390c8-72 48-116 96-116s88 44 96 116v44H160v-44z" fill="url(#coat)"/>
  <circle cx="256" cy="184" r="68" fill="#f1d0b5"/>
  <path d="M196 176c10-54 42-82 60-82 30 0 54 28 60 82-18-18-38-24-60-24-22 0-42 8-60 24z" fill="#1f2937"/>
  <circle cx="232" cy="188" r="7" fill="#0f172a"/>
  <circle cx="280" cy="188" r="7" fill="#0f172a"/>
  <path d="M240 218c16 16 32 16 48 0" fill="none" stroke="#7c2d12" stroke-width="6" stroke-linecap="round"/>
  <path d="M200 284c20 28 38 42 54 42s34-14 54-42" fill="none" stroke="#e9d5ff" stroke-width="10" stroke-linecap="round"/>
</svg>
`)}`);

function getStoredProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function WelcomeScreen({ hasProgress, onCreate, onContinue }) {
  return (
    <div className="welcome-shell">
      <div className="stars-bg" />
      <header className="welcome-header">
        <div className="logo-section">
          <h1 className="logo-title">CONSTELA</h1>
          <p className="logo-subtitle">Academia de Estudio Gamificada • Edición Premium</p>
        </div>
      </header>

      <main className="welcome-content">
        <section className="hero-section">
          <h2>Bienvenido a tu Aventura Académica</h2>
          <p>
            Transforma tu estudio en una épica aventura. Crea un héroe, entra a aulas
            virtuales y domina el arte del enfoque con poderes académicos reales.
          </p>
        </section>

        <section className="features-grid">
          {[
            ["⏱️", "Pomodoro Premium", "Sesiones de 25 minutos con mecánicas gamificadas y recompensas reales."],
            ["🎭", "Crea tu Héroe", "Elige tu raza, género y rol. Tu personaje crece con cada sesión."],
            ["👥", "Squad Conectado", "Estudia en grupo y comparte tu progreso en la aula."],
            ["✨", "Habilidades Reales", "Desbloquea poderes que mejoran tu comprensión y retención."],
            ["🏆", "Recompensas", "Gana experiencia, monedas y niveles mientras estudias."],
            ["💾", "Progreso Persistente", "Tu avance se guarda automáticamente para continuar después."],
          ].map(([icon, title, text], index) => (
            <div key={index} className="feature-card">
              <span className="feature-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </section>

        <section className="cta-section">
          <button className="btn-moba btn-epic btn-xl" onClick={onCreate}>
            ⚡ CREAR MI HÉROE
          </button>
          {hasProgress && (
            <button className="btn-moba btn-collector btn-xl" onClick={onContinue}>
              🚀 CONTINUAR MI AVENTURA
            </button>
          )}
        </section>
      </main>

      <footer className="welcome-footer">
        <p>© 2026 CONSTELA Academy. Plataforma educativa gamificada • Versión 1.0</p>
      </footer>
    </div>
  );
}

function RegistroScreen({ form, setForm, onBack, onStart }) {
  const stats = RAZA_STATS[form.raza];

  return (
    <div className="registro-container">
      <header className="registro-header">
        <a href="#" className="back-link" onClick={onBack}>← ATRÁS</a>
        <h1 className="header-title">CONSTELA</h1>
        <p className="header-subtitle">Forja tu Identidad Académica</p>
      </header>

      <main className="registro-main">
        <div className="registro-grid">
          <section className="registro-form-section">
            <div className="card-moba glow-epic">
              <h2 className="form-title">🎭 Crea tu Héroe</h2>
              <p className="form-subtitle">
                Personaliza tu identidad y comienza tu aventura académica.
              </p>

              <div className="form-group">
                <label className="form-label">Nombre de Usuario</label>
                <input
                  className="form-input"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Tu nombre épico aquí..."
                  maxLength={20}
                />
                <small className="form-hint">3-20 caracteres</small>
              </div>

              <div className="form-group">
                <label className="form-label">⚡ Elige tu Raza</label>
                <div className="razas-container">
                  {Object.keys(RAZA_STATS).map((raza) => (
                    <div
                      key={raza}
                      className={`raza-card ${form.raza === raza ? "selected" : ""}`}
                      onClick={() => setForm({ ...form, raza })}
                    >
                      <div className="raza-icon">
                        {raza === "Astrales" ? "✦" : raza === "Célidos" ? "◉" : "◆"}
                      </div>
                      <h4 className="raza-name">{raza}</h4>
                      <p className="raza-description">
                        {raza === "Astrales"
                          ? "Poder de Resolución"
                          : raza === "Célidos"
                            ? "Resistencia a Distracción"
                            : "Velocidad de Enfoque"} +100
                      </p>
                      <div className="raza-stats">
                        <span className="stat-badge">
                          {raza === "Astrales"
                            ? "Lógica Celestial"
                            : raza === "Célidos"
                              ? "Enfoque Absoluto"
                              : "Rapidez Quantum"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">♂ ♀ Selecciona Género</label>
                <div className="gender-toggle-container">
                  {["Masculino", "Femenino"].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      className={`btn-gender ${form.genero === gender ? "selected" : ""}`}
                      onClick={() => setForm({ ...form, genero: gender })}
                    >
                      <span className="gender-icon">{gender === "Masculino" ? "♂" : "♀"}</span>
                      <span className="gender-label">{gender}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">🎯 Elige tu Rol</label>
                <select
                  className="form-select"
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                >
                  <option value="GuardianDelEnfoque">Guardián del Enfoque</option>
                  <option value="EspecialistaAcademico">Especialista Académico</option>
                  <option value="SoporteMotivacional">Soporte Motivacional</option>
                </select>
              </div>

              <button className="btn-moba btn-epic btn-lg btn-block" onClick={onStart}>
                🚀 INICIAR AVENTURA
              </button>
            </div>
          </section>

          <section className="registro-preview-section">
            <div className="preview-card card-moba glow-epic">
              <div className="preview-header">
                <h3 className="preview-nombre">{form.username || "Tu Héroe"}</h3>
                <span className="preview-rol badge badge-epic">
                  {ROLE_LABELS[form.rol] || "Rol"}
                </span>
              </div>

              <div className="preview-image-container">
                <img
                  src={defaultPortrait}
                  alt="Previsualización del personaje"
                  className="preview-imagen"
                />
                <div className="preview-shine" />
              </div>

              <div className="preview-stats">
                <div className="stat-row">
                  <span className="stat-label">Poder de Resolución</span>
                  <div className="stat-bar">
                    <div className="stat-fill stat-poder" style={{ width: `${stats.poder}%` }} />
                  </div>
                  <span className="stat-valor">{stats.poder}</span>
                </div>

                <div className="stat-row">
                  <span className="stat-label">Resistencia a Distracción</span>
                  <div className="stat-bar">
                    <div className="stat-fill stat-resistencia" style={{ width: `${stats.resistencia}%` }} />
                  </div>
                  <span className="stat-valor">{stats.resistencia}</span>
                </div>

                <div className="stat-row">
                  <span className="stat-label">Velocidad de Enfoque</span>
                  <div className="stat-bar">
                    <div className="stat-fill stat-velocidad" style={{ width: `${stats.velocidad}%` }} />
                  </div>
                  <span className="stat-valor">{stats.velocidad}</span>
                </div>
              </div>

              <div className="preview-info">
                <div className="info-item">
                  <span className="info-label">Raza</span>
                  <span className="info-value">{form.raza}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Género</span>
                  <span className="info-value">{form.genero}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function AulaScreen({ hero, onBack, onCloseReward }) {
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  const [status, setStatus] = useState("Listo");
  const [isRunning, setIsRunning] = useState(false);
  const [reward, setReward] = useState(null);

  const squad = useMemo(
    () => [
      { id: "me", nombre: hero.nombre, nivel: hero.nivel, experiencia: hero.experiencia, visual: hero.visualPath || defaultPortrait },
      { id: "nexa", nombre: "Nexa", nivel: 3, experiencia: 80, visual: defaultPortrait },
      { id: "luna", nombre: "Luna", nivel: 5, experiencia: 120, visual: defaultPortrait },
      { id: "milo", nombre: "Milo", nivel: 2, experiencia: 60, visual: defaultPortrait },
    ],
    [hero]
  );

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setStatus("Completado");

          const experienciaGanada = 50 + (hero.stats?.velocidadDeEnfoque || 60);
          const monedasGanadas = 25 + (hero.stats?.poderDeResolucion || 60) / 2;
          const nivelActual = Math.max(1, hero.nivel + 1);

          setReward({
            experienciaGanada: Math.round(experienciaGanada),
            monedasGanadas: Math.round(monedasGanadas),
            nivelActual,
          });

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hero, isRunning]);

  const progress = ((FOCUS_SECONDS - secondsLeft) / FOCUS_SECONDS) * 100;

  const handleContinue = () => {
    setReward(null);
    setSecondsLeft(FOCUS_SECONDS);
    setStatus("Listo");
    onCloseReward();
  };

  return (
    <div className="aula-shell">
      <header className="aula-header">
        <div className="header-left">
          <div className="room-badge">Aula Virtual</div>
          <h1>Sala de Enfoque Supremo</h1>
        </div>
        <div className="header-right">
          <div className="status-pill status-live">
            <span className="status-dot" />
            <span>En vivo</span>
          </div>
          <button className="header-link" onClick={onBack}>← Inicio</button>
        </div>
      </header>

      <main className="aula-layout">
        <section className="timer-panel card-moba glow-epic">
          <div className="panel-header">
            <span className="panel-tag">Modo Estudio</span>
            <span className="panel-state">{status}</span>
          </div>

          <div className="timer-wrap">
            <div
              className="timer-ring"
              style={{
                background: `conic-gradient(#8b5cf6 ${(progress / 100) * 360}deg, rgba(255,255,255,0.08) 0deg)`,
              }}
            >
              <div className="timer-inner">
                <div className="timer-meta">FOCUS</div>
                <div className="timer-value">{formatTime(secondsLeft)}</div>
                <div className="timer-submeta">Pomodoro</div>
              </div>
            </div>
          </div>

          <button
            className="btn-moba btn-collector btn-lg btn-block"
            onClick={() => setIsRunning((prev) => !prev)}
          >
            {isRunning ? "⏸ PAUSAR ENFOQUE" : "▶ INICIAR ENFOQUE"}
          </button>
        </section>

        <section className="squad-panel card-moba glow-collector">
          <div className="panel-header">
            <span className="panel-tag">Squad</span>
            <span className="panel-state">Conectados</span>
          </div>

          <div className="squad-grid">
            {squad.map((member) => (
              <article key={member.id} className="squad-card">
                <div className="avatar-wrap">
                  <img src={member.visual} alt={member.nombre} className="avatar-image" />
                </div>

                <div className="avatar-meta">
                  <div className="avatar-topline">
                    <strong>{member.nombre}</strong>
                    <span>Lv {member.nivel}</span>
                  </div>
                  <div className="xp-bar">
                    <div
                      className="xp-fill"
                      style={{ width: `${Math.min((member.experiencia / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <section className="skills-panel card-moba glow-academico">
        <div className="panel-header skill-header">
          <span className="panel-tag">✨ Habilidades</span>
          <span className="panel-state">{hero.nombre}</span>
        </div>

        <div className="skills-container">
          {(hero.habilidades || []).map((skill) => (
            <button key={skill.id} className="skill-button" type="button">
              <span className="skill-icon">{skill.icono}</span>
              <span className="skill-name">{skill.nombre}</span>
            </button>
          ))}
        </div>
      </section>

      {reward && (
        <div className="reward-modal">
          <div className="reward-card card-moba glow-collector">
            <div className="reward-header">
              <h2>🎉 ¡Bloque Completado!</h2>
              <p>Excelente trabajo. Tu progreso ha sido guardado.</p>
            </div>

            <div className="reward-body">
              <div className="reward-item">
                <span>⭐ Experiencia Ganada</span>
                <strong>+{reward.experienciaGanada}</strong>
              </div>
              <div className="reward-item">
                <span>💰 Monedas Obtenidas</span>
                <strong>+{reward.monedasGanadas}</strong>
              </div>
              <div className="reward-item">
                <span>📈 Nivel Actual</span>
                <strong>{reward.nivelActual}</strong>
              </div>
            </div>

            <button className="btn-moba btn-epic btn-lg btn-block" onClick={handleContinue}>
              ▶ SIGUIENTE SESIÓN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [form, setForm] = useState(defaultForm);
  const [hero, setHero] = useState(null);

  useEffect(() => {
    const progress = getStoredProgress();
    if (progress?.heroe) {
      setHero(progress.heroe);
      setScreen("aula");
    }
  }, []);

  const hasProgress = !!getStoredProgress();

  const handleCreateHero = () => setScreen("register");

  const handleContinue = () => {
    const progress = getStoredProgress();
    if (progress?.heroe) {
      setHero(progress.heroe);
      setScreen("aula");
    }
  };

  const handleStartAdventure = () => {
    const username = form.username.trim();

    if (username.length < 3) {
      alert("El nombre de usuario debe tener al menos 3 caracteres.");
      return;
    }

    const nextHero = {
      id: `hero-${Date.now()}`,
      nombre: username,
      raza: form.raza,
      genero: form.genero,
      rol: form.rol,
      nivel: 1,
      experiencia: 0,
      visualPath: defaultPortrait,
      stats: {
        poderDeResolucion: RAZA_STATS[form.raza].poder,
        resistenciaADistraccion: RAZA_STATS[form.raza].resistencia,
        velocidadDeEnfoque: RAZA_STATS[form.raza].velocidad,
      },
      habilidades: [
        { id: "rayo-comprension", nombre: "Rayo de Comprensión", icono: "⚡" },
        { id: "mapa-de-conceptos", nombre: "Mapa de Conceptos", icono: "🧠" },
        { id: "prueba-de-refuerzo", nombre: "Prueba de Refuerzo", icono: "✨" },
      ],
    };

    const progress = {
      cuenta: {
        username,
        raza: form.raza,
        genero: form.genero,
        nombreHeroe: username,
        nivel: 1,
        experiencia: 0,
        monedas: 120,
      },
      heroe: nextHero,
    };

    saveProgress(progress);
    setHero(nextHero);
    setScreen("aula");
  };

  if (screen === "welcome") {
    return <WelcomeScreen hasProgress={hasProgress} onCreate={handleCreateHero} onContinue={handleContinue} />;
  }

  if (screen === "register") {
    return (
      <RegistroScreen
        form={form}
        setForm={setForm}
        onBack={() => setScreen("welcome")}
        onStart={handleStartAdventure}
      />
    );
  }

  if (screen === "aula") {
    return (
      <AulaScreen
        hero={
          hero || {
            nombre: "Astra",
            raza: "Astrales",
            rol: "EspecialistaAcademico",
            nivel: 1,
            experiencia: 0,
            visualPath: defaultPortrait,
            habilidades: [
              { id: "h1", nombre: "Rayo de Comprensión", icono: "⚡" },
              { id: "h2", nombre: "Mapa de Conceptos", icono: "🧠" },
              { id: "h3", nombre: "Prueba de Refuerzo", icono: "✨" },
            ],
            stats: { poderDeResolucion: 100, resistenciaADistraccion: 70, velocidadDeEnfoque: 65 },
          }
        }
        onBack={() => setScreen("welcome")}
        onCloseReward={() => {}}
      />
    );
  }

  return null;
}
