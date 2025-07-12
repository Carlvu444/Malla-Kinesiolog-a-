let ramos = [];

fetch("data.json")
  .then(response => response.json())
  .then(data => {
    ramos = data;
    renderMalla();
  });

function renderMalla() {
  const container = document.getElementById("malla-container");
  container.innerHTML = "";

  const semestres = [...new Set(ramos.map(r => r.semestre))].sort((a, b) => a - b);

  semestres.forEach(sem => {
    const semDiv = document.createElement("div");
    semDiv.classList.add("semestre");
    semDiv.innerHTML = `<h2>Semestre ${sem}</h2>`;

    ramos.filter(r => r.semestre === sem).forEach(ramo => {
      const div = document.createElement("div");
      div.classList.add("ramo");

      const cumplido = ramo.prerrequisitos.every(cod => localStorage.getItem(cod) === "true");

      if (ramo.prerrequisitos.length > 0 && !cumplido) {
        div.classList.add("bloqueado");
      }

      if (localStorage.getItem(ramo.codigo) === "true") {
        div.classList.add("aprobado");
      }

      div.innerText = `${ramo.nombre}`;
      div.onclick = () => {
        if (!div.classList.contains("bloqueado")) {
          const aprobado = localStorage.getItem(ramo.codigo) === "true";
          localStorage.setItem(ramo.codigo, !aprobado);
          renderMalla();
        }
      };

      semDiv.appendChild(div);
    });

    container.appendChild(semDiv);
  });
}
