document.addEventListener('DOMContentLoaded', () => {
  // ✅ Restringir acceso solo a vendedores
  verificarSesion(['vendedor']);

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
            // ✅ Usar fetchConToken
            const response = await fetchConToken(`/api/vendedor/productos/${p.id}?idVendedor=${idVendedor}`, {
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

    // ✅ Usar fetchConToken
    const response = await fetchConToken(`/api/vendedor/productos/${productoEditando.id}?idVendedor=${idVendedor}`, {
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = form.querySelector('input[type="text"]').value;
    const precio = parseInt(form.querySelector('input[type="number"]').value);
    const tipo = form.querySelector('select').value;
    const imagen = form.querySelector('input[type="file"]').value;

    const nuevo = {
      nombre, precio, tipo, imagen
    };

    // ✅ Subida de producto usando backend
    const response = await fetchConToken("/api/vendedor/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo)
    });

    const msg = await response.text();
    alert(msg);

    if (response.ok) {
      // Opcional: recargar lista desde backend
      nuevo.id = Date.now(); // temporal, hasta que lo obtengas del backend
      productosEnVenta.push(nuevo);
      renderProductos(productosEnVenta, contenedorVenta);
    }

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
