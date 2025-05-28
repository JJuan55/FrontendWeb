document.addEventListener('DOMContentLoaded', async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const elementosPorPagina = 5;

  let compradores = [];
  let vendedores = [];
  let productos = [];

  // Obtener datos del backend
  async function obtenerDatos() {
    const [clientesRes, vendedoresRes, productosRes] = await Promise.all([
      fetch('/api/admin/clientes'),
      fetch('/api/admin/vendedores'),
      fetch('/api/admin/productos')
    ]);
    compradores = await clientesRes.json();
    vendedores = await vendedoresRes.json();
    productos = await productosRes.json();

    inicializarTablas();
    inicializarGrafica();
  }

  function inicializarTablas() {
    mostrarPagina('tablaCompradores', compradores, 1, true);
    agregarPaginacion('tablaCompradores', compradores, true);
    crearBuscador('tablaCompradores', compradores, true);

    mostrarPagina('tablaVendedores', vendedores, 1, true);
    agregarPaginacion('tablaVendedores', vendedores, true);
    crearBuscador('tablaVendedores', vendedores, true);

    mostrarPagina('tablaProductos', productos, 1, false);
    agregarPaginacion('tablaProductos', productos, false);
    crearBuscador('tablaProductos', productos, false);
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
        acciones += `<button onclick="eliminarProducto(${d.id})">Eliminar</button>`;
      } else if (esUsuario && usuario.rol_id === 3) {
        acciones += `<button onclick="cambiarEstadoUsuario(${d.id})">Suspender</button>`;
        acciones += `<button class="btn-asignar" onclick="asignarModerador(${d.id})">Asignar Moderador</button>`;
      }

      fila.innerHTML = `
        <td>${d.nombre || d.producto}</td>
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

  function inicializarGrafica() {
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
  }

  window.eliminarProducto = async function (productoId) {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      const res = await fetch(`/api/admin/productos/${productoId}`, {
        method: 'DELETE'
      });
      alert(await res.text());
      obtenerDatos(); // refrescar tablas
    }
  };

  window.cambiarEstadoUsuario = async function (usuarioId) {
    const res = await fetch(`/api/admin/usuarios/${usuarioId}/estado?estado=suspendido`, {
      method: 'PUT'
    });
    alert(await res.text());
    obtenerDatos(); // refrescar
  };

  window.asignarModerador = async function (usuarioId) {
    const res = await fetch(`/api/admin/usuarios/${usuarioId}/rol?rol=moderador`, {
      method: 'PUT'
    });
    alert(await res.text());
    obtenerDatos(); // refrescar
  };

  // Cargar datos iniciales
  obtenerDatos();
});

