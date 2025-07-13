let creditosTotales = 0;
let creditosAprobados = 0;

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const contenedor = document.getElementById('contenedor-malla');

    data.forEach((semestre, i) => {
      const columna = document.createElement('div');
      columna.className = 'semestre';

      const titulo = document.createElement('h3');
      titulo.textContent = `Semestre ${i + 1}`;
      columna.appendChild(titulo);

      semestre.forEach(ramo => {
        creditosTotales += ramo.creditos;

        const div = document.createElement('div');
        div.className = 'ramo';
        div.textContent = `${ramo.nombre} (${ramo.creditos} cr)`;
        div.dataset.creditos = ramo.creditos;
        div.id = ramo.nombre.replace(/\s+/g, '_');

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
  });

function actualizarCreditos() {
  document.getElementById("contador-creditos").textContent = 
    `Créditos aprobados: ${creditosAprobados} / ${creditosTotales}`;
}
