const btnRegistrar = document.getElementById("btn-registrar");
const btnContinuar = document.getElementById("btn-continuar");

function verificarProgreso() {
  const progress = localStorage.getItem("constela.playerProgress");
  if (progress) {
    try {
      const data = JSON.parse(progress);
      if (data.heroe && data.cuenta) {
        btnContinuar.classList.remove("hidden");
        // Animar entrada del botón continuar
        btnContinuar.style.animation = "slideInLeft 0.6s ease";
        return true;
      }
    } catch (error) {
      console.error("Error leyendo progreso:", error);
    }
  }
  return false;
}

function handleRegistrar() {
  btnRegistrar.classList.add("btn-loading");
  setTimeout(() => {
    window.location.href = "./registro.html";
  }, 200);
}

function handleContinuar() {
  btnContinuar.classList.add("btn-loading");
  setTimeout(() => {
    window.location.href = "./aula.html";
  }, 200);
}

btnRegistrar.addEventListener("click", handleRegistrar);
btnContinuar.addEventListener("click", handleContinuar);

window.addEventListener("DOMContentLoaded", () => {
  verificarProgreso();
  // Añadir animación de carga completa
  document.body.classList.add("page-loaded");
});
