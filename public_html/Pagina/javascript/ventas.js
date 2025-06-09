import { verificarSesion, obtenerIdVendedor, fetchConToken } from './auth.js';
const productosEnVenta = [
  {
    id: 1,
    nombre: "Bolso reciclado",
    tipo: "accesorios",
    precio: 18000,
    disponible: true,
    descripcion: "Bolso hecho a mano con materiales reciclados.",
    vendedor: "María López",
    imagen: "https://i.pinimg.com/222x/82/c4/3f/82c43f3ad354a70f2241eb83a8d7b750.jpg"
  },
  {
    id: 2,
    nombre: "Maceta ecológica",
    tipo: "macetas",
    precio: 12000,
    disponible: true,
    descripcion: "Maceta ecológica ideal para tu jardín.",
    vendedor: "Carlos Ruiz",
    imagen: "https://i.pinimg.com/236x/24/3e/bd/243ebdb3a754407943a2d1db8b4575ab.jpg"
  },
  {
    id: 3,
    nombre: "Florero reciclado",
    tipo: "decoración",
    precio: 16000,
    disponible: true,
    descripcion: "Florero moderno hecho de materiales reutilizados.",
    vendedor: "Juan Moreno",
    imagen: "https://i.pinimg.com/236x/d4/06/a1/d406a1d91e479f615fa9d8dce013c2fc.jpg"
  },
  {
    id: 4,
    nombre: "Silla ecológica",
    tipo: "muebles",
    precio: 45000,
    disponible: true,
    descripcion: "Silla resistente hecha 100% de plástico reciclado.",
    vendedor: "PlastikReusa",
    imagen: "https://st2.depositphotos.com/3944627/8211/i/950/depositphotos_82110258-stock-photo-recycled-chair-made-from-plastic.jpg"
  }
];

const productosVendidos = [
  {
    id: 5,
    nombre: "Lámpara con botellas",
    tipo: "decoración",
    precio: 35000,
    disponible: false,
    descripcion: "Lámpara elaborada con botellas recicladas.",
    vendedor: "Luz Verde",
    comprador: "Ana Pérez",
    imagen: "https://i.pinimg.com/474x/c8/c6/59/c8c65949d7d1bf33192937dbbdc3d258.jpg"
  },
  {
    id: 6,
    nombre: "Banca para exteriores",
    tipo: "muebles",
    precio: 120000,
    disponible: false,
    descripcion: "Banca durable hecha de botellas de plástico recicladas.",
    vendedor: "EcoMuebles",
    comprador: "José Martínez",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrRxHPBL1qnilHptQ4ATuH7lYH5RPdGuzWsw&s"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const btnSubir = document.getElementById('btnSubirProducto');
  const modal = document.getElementById('modalProducto');
  const cerrarModal = document.getElementById('cerrarModal');
  const form = document.getElementById('formProducto');
  const contenedorVenta = document.getElementById('enVenta');
  const contenedorVendidos = document.getElementById('vendidos');

  const modalEditar = document.getElementById('modalEditarProducto');
  const cerrarModalEditar = document.getElementById('cerrarModalEditar');
  const formEditar = document.getElementById('formEditarProducto');

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const idVendedor = usuario?.id;

  let productoEditando = null;

  const renderProductos = (lista, contenedor, esVendido = false) => {
    contenedor.innerHTML = '';
    lista.forEach((p, index) => {
      const productoDiv = document.createElement('div');
      productoDiv.classList.add('producto');

      const imagen = document.createElement('img');
      imagen.src = p.imagen;
      imagen.alt = p.nombre;

      const nombre = document.createElement('h3');
      nombre.textContent = p.nombre;

      const precio = document.createElement('p');
      precio.textContent = `$${p.precio.toFixed(2)}`;

      productoDiv.appendChild(imagen);
      productoDiv.appendChild(nombre);
      productoDiv.appendChild(precio);

      if (!esVendido) {
        const contenedorBotones = document.createElement('div');
        contenedorBotones.classList.add('botones-venta');

        const btnEditar = document.createElement('button');
        btnEditar.classList.add('boton-editar');
        btnEditar.textContent = 'Editar venta';
        btnEditar.addEventListener('click', (e) => {
          e.stopPropagation();
          productoEditando = p;
          abrirModalEdicion(p);
        });

        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('boton-eliminar');
        btnEliminar.textContent = 'Eliminar venta';
        btnEliminar.addEventListener('click', async (e) => {
          e.stopPropagation();
          if (confirm(`¿Estás seguro de eliminar "${p.nombre}"?`)) {
            const response = await fetch(`/api/vendedor/productos/${p.id}?idVendedor=${idVendedor}`, {
              method: 'DELETE'
            });
            const msg = await response.text();
            alert(msg);
            if (response.ok) {
              productosEnVenta.splice(index, 1);
              renderProductos(productosEnVenta, contenedorVenta);
            }
          }
        });

        contenedorBotones.appendChild(btnEditar);
        contenedorBotones.appendChild(btnEliminar);
        productoDiv.appendChild(contenedorBotones);
      }

      productoDiv.addEventListener('click', () => {
        mostrarInfoProducto(
          p.nombre,
          p.descripcion || 'Sin descripción',
          esVendido ? p.comprador : null,
          esVendido ? '2024-12-01' : null,
          p.imagen
        );
      });

      contenedor.appendChild(productoDiv);
    });
  };

  const abrirModalEdicion = (producto) => {
    const [inputNombre, inputPrecio, inputTipo, inputImagen] = formEditar.querySelectorAll('input');
    inputNombre.value = producto.nombre;
    inputPrecio.value = producto.precio;
    inputTipo.value = producto.tipo;
    inputImagen.value = producto.imagen;

    modalEditar.style.display = 'block';
  };

  formEditar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const [nombre, precio, tipo, imagen] = formEditar.querySelectorAll('input');

    const productoActualizado = {
      nombre: nombre.value,
      precio: parseInt(precio.value),
      tipo: tipo.value,
      imagen: imagen.value
    };

    const response = await fetch(`/api/vendedor/productos/${productoEditando.id}?idVendedor=${idVendedor}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoActualizado)
    });

    const msg = await response.text();
    alert(msg);

    if (response.ok) {
      const index = productosEnVenta.findIndex(p => p.id === productoEditando.id);
      productosEnVenta[index] = { ...productoEditando, ...productoActualizado };
      renderProductos(productosEnVenta, contenedorVenta);
      modalEditar.style.display = 'none';
    }
  });

  renderProductos(productosEnVenta, contenedorVenta, false);
  renderProductos(productosVendidos, contenedorVendidos, true);

  btnSubir.addEventListener('click', () => modal.style.display = 'block');
  cerrarModal.addEventListener('click', () => modal.style.display = 'none');
  cerrarModalEditar.addEventListener('click', () => modalEditar.style.display = 'none');

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
    if (e.target === modalEditar) modalEditar.style.display = 'none';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.querySelector('input[type="text"]').value;
    const precio = parseInt(form.querySelector('input[type="number"]').value);
    const tipo = form.querySelector('select').value;
    const imagen = form.querySelector('input[type="file"]').value; // Puedes ajustar si manejas files con FileReader

    const nuevo = {
      id: Date.now(), // Reemplazar por ID real desde backend si es necesario
      nombre, precio, tipo, imagen
    };

    productosEnVenta.push(nuevo);
    renderProductos(productosEnVenta, contenedorVenta);
    form.reset();
    modal.style.display = 'none';
  });
});

function mostrarInfoProducto(nombre, descripcion, comprador = null, fecha = null, imagen) {
  document.getElementById('modalTitulo').textContent = nombre;
  document.getElementById('modalDescripcion').textContent = descripcion;
  document.getElementById('modalImagen').src = imagen;

  const extra = comprador && fecha
    ? `Vendido a: ${comprador} el día ${fecha}`
    : 'Este producto aún no ha sido vendido.';
  document.getElementById('modalExtra').textContent = extra;

  document.getElementById('modalInfo').style.display = "block";
}

document.querySelector('#modalInfo .close').onclick = function () {
  document.getElementById('modalInfo').style.display = "none";
};

window.onclick = function (event) {
  const modal = document.getElementById('modalInfo');
  if (event.target === modal) {
    modal.style.display = "none";
  }
};


