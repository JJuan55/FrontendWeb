document.addEventListener('DOMContentLoaded', () => {
  
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const elementosPorPagina = 5;

  function crearBuscador(idInput, idTabla, datos, esUsuario) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Buscar...';
    input.className = 'buscador';

    const tabla = document.getElementById(idTabla);
    tabla.parentElement.insertBefore(input, tabla);

    input.addEventListener('input', () => {
      const filtro = input.value.toLowerCase();
      const filtrados = datos.filter(d =>
        d.nombre.toLowerCase().includes(filtro) ||
        (d.email || d.vendedor).toLowerCase().includes(filtro)
      );
      mostrarPagina(idTabla, filtrados, 1, esUsuario);
      agregarPaginacion(idTabla, filtrados, esUsuario);
    });
  }

  function mostrarPagina(idTabla, datos, pagina, esUsuario) {
    const inicio = (pagina - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const paginaDatos = datos.slice(inicio, fin);
    const tabla = document.getElementById(idTabla).querySelector('tbody');
    tabla.innerHTML = '';

    paginaDatos.forEach(d => {
      const fila = document.createElement('tr');
      let acciones = '';

      if (!esUsuario && (usuario.rol_id === 3 || usuario.rol_id === 4)) {
        // Eliminar productos (admin y moderador)
        acciones += `<button onclick="eliminar('${d.nombre}', 'producto')">Eliminar</button>`;
      } else if (esUsuario && usuario.rol_id === 3) {
        // Eliminar usuarios (solo admin)
        acciones += `<button onclick="eliminar('${d.nombre}', 'usuario')">Eliminar</button>`;
        // Asignar moderador (solo admin)
        acciones += `<button class="btn-asignar" onclick="asignarModerador('${d.nombre}')">Asignar como Moderador</button>`;

      }

      fila.innerHTML = `
      <td>${d.nombre}</td>
      <td>${d.email || d.vendedor}</td>
      <td>${acciones}</td>
    `;
      tabla.appendChild(fila);
    });
  }

  function agregarPaginacion(idTabla, datos, esUsuario) {
    const totalPaginas = Math.ceil(datos.length / elementosPorPagina);
    const contenedor = document.getElementById('paginacion' + idTabla.replace('tabla', ''));
    contenedor.innerHTML = '';

    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.addEventListener('click', () => {
        mostrarPagina(idTabla, datos, i, esUsuario);
      });
      contenedor.appendChild(btn);
    }
  }

  // Compradores
  mostrarPagina('tablaCompradores', compradores, 1, true);
  agregarPaginacion('tablaCompradores', compradores, true);
  crearBuscador('inputCompradores', 'tablaCompradores', compradores, true);

  // Vendedores
  mostrarPagina('tablaVendedores', vendedores, 1, true);
  agregarPaginacion('tablaVendedores', vendedores, true);
  crearBuscador('inputVendedores', 'tablaVendedores', vendedores, true);

  // Productos
  mostrarPagina('tablaProductos', productos, 1, false);
  agregarPaginacion('tablaProductos', productos, false);
  crearBuscador('inputProductos', 'tablaProductos', productos, false);

  // Gráfica de usuarios
  new Chart(document.getElementById('graficaUsuarios'), {
    type: 'bar',
    data: {
      labels: ['Compradores', 'Vendedores', 'Productos'],
      datasets: [{
        label: 'Cantidad',
        data: [compradores.length, vendedores.length, productos.length],
        backgroundColor: ['#66bb6a', '#43a047', '#2e7d32']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Estadísticas Generales' }
      }
    }
  });
});

function eliminar(nombre, tipo) {
  if (tipo === 'usuario') {
    alert(`Usuario "${nombre}" ha sido suspendido temporalmente.`);
  } else {
    alert(`Producto "${nombre}" ha sido eliminado.`);
  }
}
