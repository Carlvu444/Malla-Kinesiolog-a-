let creditosTotales = 0;
let creditosAprobados = 0;

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    creditosTotales = 0;
    creditosAprobados = 0;

    const contenedor = document.getElementById('contenedor-malla');
    contenedor.innerHTML = '';

    // Agrupar ramos por semestre
    const semestresMap = new Map();

    data.forEach(ramo => {
      if (!semestresMap.has(ramo.semestre)) {
        semestresMap.set(ramo.semestre, []);
      }
      semestresMap.get(ramo.semestre).push(ramo);
      creditosTotales += ramo.creditos;
    });

    // Ordenar semestres ascendente
    const semestresOrdenados = Array.from(semestresMap.keys()).sort((a,b) => a - b);

    // Crear columnas por semestre
    semestresOrdenados.forEach(sem => {
      const columna = document.createElement('div');
      columna.className = 'semestre';

      const titulo = document.createElement('h3');
      titulo.textContent = `Semestre ${sem}`;
      columna.appendChild(titulo);

      semestresMap.get(sem).forEach(ramo => {
        const div = document.createElement('div');
        div.className = 'ramo';
        div.textContent = `${ramo.nombre} (${ramo.creditos} cr)`;
        div.dataset.creditos = ramo.creditos;
        div.id = ramo.codigo.replace(/\s+/g, '_');

        div.addEventListener('click', () => {
          div.classList.toggle('aprobado');
          if (div.classList.contains('aprobado')) {
            creditosAprobados += ramo.creditos;
          } else {
            creditosAprobados -= ramo.creditos;
          }
          actualizarCreditos();
        });

        columna.appendChild(div);
      });

      contenedor.appendChild(columna);
    });

    actualizarCreditos();
  })
  .catch(error => console.error('Error al cargar JSON:', error));

function actualizarCreditos() {
  document.getElementById("contador-creditos").textContent =
    `Créditos aprobados: ${creditosAprobados} / ${creditosTotales}`;
}
