import { protegerRuta, obtenerUsuario, fetchConToken } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  protegerRuta("ADMIN");

  const usuario = obtenerUsuario();
  const elementosPorPagina = 5;

  let compradores = [];
  let vendedores = [];
  let productos = [];

  // Variables para buscar y filtrar
  let filtroCompradores = '';
  let filtroVendedores = '';
  let filtroProductos = '';

  async function obtenerDatos() {
    const [clientesRes, vendedoresRes, productosRes] = await Promise.all([
      fetchConToken(`${API_BASE_URL}/api/admin/clientes`),
      fetchConToken(`${API_BASE_URL}/api/admin/vendedores`),
      fetchConToken(`${API_BASE_URL}/api/admin/productos`)
    ]);

    compradores = await clientesRes.json();
    vendedores = await vendedoresRes.json();
    productos = await productosRes.json();

    inicializarTablas();
    inicializarGrafica();
  }

  function inicializarTablas() {
    // Agregar buscadores
    document.getElementById('buscadorCompradores').addEventListener('input', (e) => {
      filtroCompradores = e.target.value.toLowerCase();
      mostrarPagina('tablaCompradores', filtrarDatos(compradores, filtroCompradores, true), 1, true);
      agregarPaginacion('tablaCompradores', filtrarDatos(compradores, filtroCompradores, true), true);
    });

    document.getElementById('buscadorVendedores').addEventListener('input', (e) => {
      filtroVendedores = e.target.value.toLowerCase();
      mostrarPagina('tablaVendedores', filtrarDatos(vendedores, filtroVendedores, true), 1, true);
      agregarPaginacion('tablaVendedores', filtrarDatos(vendedores, filtroVendedores, true), true);
    });

    document.getElementById('buscadorProductos').addEventListener('input', (e) => {
      filtroProductos = e.target.value.toLowerCase();
      mostrarPagina('tablaProductos', filtrarDatos(productos, filtroProductos, false), 1, false);
      agregarPaginacion('tablaProductos', filtrarDatos(productos, filtroProductos, false), false);
    });

    // Mostrar primeras páginas sin filtro
    mostrarPagina('tablaCompradores', compradores, 1, true);
    agregarPaginacion('tablaCompradores', compradores, true);

    mostrarPagina('tablaVendedores', vendedores, 1, true);
    agregarPaginacion('tablaVendedores', vendedores, true);

    mostrarPagina('tablaProductos', productos, 1, false);
    agregarPaginacion('tablaProductos', productos, false);
  }

  // Función para filtrar datos según búsqueda
  function filtrarDatos(datos, filtro, esUsuario) {
    if (!filtro) return datos;
    return datos.filter(d => {
      const nombre = (d.nombre || d.producto).toLowerCase();
      const emailOVendedor = (d.email || d.vendedor).toLowerCase();
      return nombre.includes(filtro) || emailOVendedor.includes(filtro);
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

  // Funciones globales para botones, expuestas en window para acceso desde HTML
  window.eliminarProducto = async function (productoId) {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      const res = await fetchConToken(`${API_BASE_URL}/api/admin/productos/${productoId}`, {
        method: 'DELETE'
      });
      alert(await res.text());
      obtenerDatos();
    }
  };

  window.cambiarEstadoUsuario = async function (usuarioId) {
    const res = await fetchConToken(`${API_BASE_URL}/api/admin/usuarios/${usuarioId}/estado?estado=suspendido`, {
      method: 'PUT'
    });
    alert(await res.text());
    obtenerDatos();
  };

  window.asignarModerador = async function (usuarioId) {
    const res = await fetchConToken(`${API_BASE_URL}/api/admin/usuarios/${usuarioId}/rol?rol=moderador`, {
      method: 'PUT'
    });
    alert(await res.text());
    obtenerDatos();
  };

  obtenerDatos();
});
