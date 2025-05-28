document.addEventListener('DOMContentLoaded', async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const elementosPorPagina = 5;

  // Función genérica para obtener datos desde la API
  async function obtenerDatos(endpoint) {
    const respuesta = await fetch(`/api/admin/${endpoint}`);
    if (!respuesta.ok) throw new Error(`Error al obtener ${endpoint}`);
    return await respuesta.json();
  }

  function crearBuscador(idTabla, datos, esUsuario) {
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
        (d.email || d.vendedor || '').toLowerCase().includes(filtro)
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
        acciones += `<button onclick="eliminarProducto(${d.id})">Eliminar</button>`;
      } else if (esUsuario && usuario.rol_id === 3) {
        acciones += `<button onclick="suspenderUsuario(${d.id})">Suspender</button>`;
        acciones += `<button class="btn-asignar" onclick="asignarModerador(${d.id})">Asignar como Moderador</button>`;
      }

      fila.innerHTML = `
        <td>${d.nombre}</td>
        <td>${d.email || d.vendedor || 'N/A'}</td>
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

  // Funciones de acción
  window.suspenderUsuario = async function (id) {
    const confirmado = confirm("¿Deseas suspender a este usuario?");
    if (confirmado) {
      await fetch(`/api/admin/usuarios/${id}/estado?estado=suspendido`, { method: 'PUT' });
      alert("Usuario suspendido correctamente.");
      location.reload();
    }
  };

  window.asignarModerador = async function (id) {
    const confirmado = confirm("¿Deseas asignar este usuario como moderador?");
    if (confirmado) {
      await fetch(`/api/admin/usuarios/${id}/rol?rol=moderador`, { method: 'PUT' });
      alert("Moderador asignado correctamente.");
      location.reload();
    }
  };

  window.eliminarProducto = async function (id) {
    const confirmado = confirm("¿Deseas eliminar este producto?");
    if (confirmado) {
      await fetch(`/api/admin/productos/${id}`, { method: 'DELETE' });
      alert("Producto eliminado correctamente.");
      location.reload();
    }
  };

  // Cargar todos los datos
  try {
    const [compradores, vendedores, productos, estadisticas] = await Promise.all([
      obtenerDatos('clientes'),
      obtenerDatos('vendedores'),
      obtenerDatos('productos'),
      obtenerDatos('estadisticas')
    ]);

    // Compradores
    mostrarPagina('tablaCompradores', compradores, 1, true);
    agregarPaginacion('tablaCompradores', compradores, true);
    crearBuscador('tablaCompradores', compradores, true);

    // Vendedores
    mostrarPagina('tablaVendedores', vendedores, 1, true);
    agregarPaginacion('tablaVendedores', vendedores, true);
    crearBuscador('tablaVendedores', vendedores, true);

    // Productos
    mostrarPagina('tablaProductos', productos, 1, false);
    agregarPaginacion('tablaProductos', productos, false);
    crearBuscador('tablaProductos', productos, false);

    // Gráfica de usuarios
    new Chart(document.getElementById('graficaUsuarios'), {
      type: 'bar',
      data: {
        labels: ['Compradores', 'Vendedores', 'Productos'],
        datasets: [{
          label: 'Cantidad',
          data: [estadisticas.totalClientes, estadisticas.totalVendedores, estadisticas.totalProductos],
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

  } catch (err) {
    console.error("Error al cargar datos:", err);
    alert("Ocurrió un error al cargar los datos.");
  }
});
