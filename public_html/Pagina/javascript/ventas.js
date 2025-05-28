const modalEditar = document.getElementById('modalEditarProducto');
const cerrarModalEditar = document.getElementById('cerrarModalEditar');
const formEditar = document.getElementById('formEditarProducto');

const modalInfo = document.getElementById('modalInfo');
const cerrarModalInfo = modalInfo.querySelector('.close');

const contenedorVenta = document.getElementById('enVenta');
const contenedorVendidos = document.getElementById('vendidos');

let productosEnVenta = [];
// Si quieres productos vendidos, aquí puedes cargar también

// Obtener usuario (simulado para URL; cambia según tu lógica real)
const usuario = JSON.parse(localStorage.getItem('usuario')) || { id: 1 };

// ---------------------- Función para cargar productos --------------------
async function cargarProductos() {
  try {
    const res = await fetch(`http://localhost:8080/api/productos/vendedor/${usuario.id}`);
    if (!res.ok) throw new Error('No se pudo obtener productos');
    productosEnVenta = await res.json();
    renderProductos(productosEnVenta, contenedorVenta, false);
  } catch (e) {
    contenedorVenta.innerHTML = '<p>Error cargando productos en venta</p>';
    console.error(e);
  }
}

// ---------------------- Renderizar productos -------------------------------
function renderProductos(lista, contenedor, esVendido = false) {
  contenedor.innerHTML = '';

  if (!lista || lista.length === 0) {
    const mensaje = document.createElement('p');
    mensaje.textContent = 'No hay productos para mostrar.';
    mensaje.classList.add('mensaje-no-productos'); // opcional para estilos CSS
    contenedor.appendChild(mensaje);
    return;
  }

  lista.forEach((p, index) => {
    const div = document.createElement('div');
    div.classList.add('producto');

    const img = document.createElement('img');
    img.src = p.imagen || '';
    img.alt = p.nombre || 'Producto';

    const h3 = document.createElement('h3');
    h3.textContent = p.nombre || '';

    const precio = document.createElement('p');
    precio.textContent = p.precio !== undefined ? `$${p.precio.toFixed(2)}` : '';

    div.appendChild(img);
    div.appendChild(h3);
    div.appendChild(precio);

    if (!esVendido) {
      const botonesDiv = document.createElement('div');
      botonesDiv.classList.add('botones-venta');

      const btnEditar = document.createElement('button');
      btnEditar.textContent = 'Editar venta';
      btnEditar.classList.add('boton-editar');
      btnEditar.addEventListener('click', (ev) => {
        ev.stopPropagation();
        abrirModalEditar(p, index);
      });

      const btnEliminar = document.createElement('button');
      btnEliminar.textContent = 'Eliminar venta';
      btnEliminar.classList.add('boton-eliminar');
      btnEliminar.addEventListener('click', (ev) => {
        ev.stopPropagation();
        eliminarProducto(p.id, index);
      });

      botonesDiv.appendChild(btnEditar);
      botonesDiv.appendChild(btnEliminar);
      div.appendChild(botonesDiv);
    }

    div.addEventListener('click', () => {
      mostrarInfoProducto(
        p.nombre,
        p.descripcion || 'Sin descripción',
        esVendido ? p.comprador : null,
        esVendido ? p.fechaVenta : null,
        p.imagen
      );
    });

    contenedor.appendChild(div);
  });
}

// ... el resto de tu código queda igual ...
