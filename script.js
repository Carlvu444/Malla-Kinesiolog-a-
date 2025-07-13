let creditosTotales = 0;
let creditosAprobados = 0;
let aprobados = new Set();
let ramosPorCodigo = {}; // Acceso rápido

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    creditosTotales = 0;
    creditosAprobados = 0;

    const contenedor = document.getElementById('contenedor-malla');
    contenedor.innerHTML = '';

    const semestresMap = new Map();

    // Agrupar por semestre y guardar por código
    data.forEach(ramo => {
      if (!semestresMap.has(ramo.semestre)) {
        semestresMap.set(ramo.semestre, []);
      }
      semestresMap.get(ramo.semestre).push(ramo);
      creditosTotales += ramo.creditos;
      ramosPorCodigo[ramo.codigo] = ramo;
    });

    // Ordenar semestres
    const semestresOrdenados = Array.from(semestresMap.keys()).sort((a, b) => a - b);

    // Dibujar cada semestre
    semestresOrdenados.forEach(sem => {
      const columna = document.createElement('div');
      columna.className = 'semestre';

      const titulo = document.createElement('h3');
      titulo.textContent = `Semestre ${sem}`;
      columna.appendChild(titulo);

      semestresMap.get(sem).forEach(ramo => {
        const div = document.createElement('div');
        div.className = 'ramo bloqueado'; // se bloquea por defecto
        div.textContent = `${ramo.nombre} (${ramo.creditos} cr)`;
        div.dataset.codigo = ramo.codigo;
        div.dataset.creditos = ramo.creditos;
        div.dataset.prerrequisitos = JSON.stringify(ramo.prerrequisitos);
        div.id = ramo.codigo;

        div.addEventListener('click', () => {
          if (div.classList.contains('bloqueado')) return;

          div.classList.toggle('aprobado');
          const aprobado = div.classList.contains('aprobado');
          const creditos = parseInt(div.dataset.creditos);

          if (aprobado) {
            aprobados.add(ramo.codigo);
            creditosAprobados += creditos;
          } else {
            aprobados.delete(ramo.codigo);
            creditosAprobados -= creditos;
          }

          actualizarCreditos();
          actualizarBloqueos();
        });

        columna.appendChild(div);
      });

      contenedor.appendChild(columna);
    });

    actualizarCreditos();
    actualizarBloqueos(); // Aplicar lógica de desbloqueo inicial
  })
  .catch(error => console.error('Error al cargar JSON:', error));

function actualizarCreditos() {
  document.getElementById("contador-creditos").textContent =
    `Créditos aprobados: ${creditosAprobados} / ${creditosTotales}`;
}

function actualizarBloqueos() {
  document.querySelectorAll('.ramo').forEach(div => {
    if (div.classList.contains('aprobado')) return; // ya aprobado

    const prerreqs = JSON.parse(div.dataset.prerrequisitos);
    const habilitado = prerreqs.every(cod => aprobados.has(cod));

    if (habilitado) {
      div.classList.remove('bloqueado');
    } else {
      div.classList.add('bloqueado');
    }
  });
}
