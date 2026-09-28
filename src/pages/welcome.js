const btnRegistrar = document.getElementById("btn-registrar");
const btnContinuar = document.getElementById("btn-continuar");

function verificarProgreso() {
  const progress = localStorage.getItem("constela.playerProgress");
  if (progress) {
    try {
      const data = JSON.parse(progress);
      if (data.heroe && data.cuenta) {
        btnContinuar.classList.remove("hidden");
        return true;
      }
    } catch (error) {
      console.error("Error leyendo progreso:", error);
    }
  }
  return false;
}

btnRegistrar.addEventListener("click", () => {
  window.location.href = "./registro.html";
});

btnContinuar.addEventListener("click", () => {
  window.location.href = "./aula.html";
});

window.addEventListener("DOMContentLoaded", verificarProgreso);
