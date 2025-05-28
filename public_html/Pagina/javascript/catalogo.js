let paginaActual = 1;
const productosPorPagina = 8;

// Renderizar productos
function renderizarProductos(lista) {
  const grid = document.getElementById("productosGrid");
  grid.innerHTML = "";

  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const pagina = lista.slice(inicio, fin);

  pagina.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h4>${prod.nombre}</h4>
      <p>Precio: $${prod.precio}</p>
      <p>Vendedor: ${prod.vendedor}</p>
    `;
    card.addEventListener("click", () => {
      localStorage.setItem("productoSeleccionado", JSON.stringify(prod));
      window.location.href = "producto.html";
    });
    grid.appendChild(card);
  });

  renderizarControles(lista.length);
}

// Escuchar envío de formulario de filtros
document.getElementById("formFiltros").addEventListener("submit", function (e) {
  e.preventDefault();
  paginaActual = 1;
  obtenerProductosDelBackend();
});

// Al cargar la página, obtener todos los productos sin filtros
obtenerProductosDelBackend();

function renderizarControles(total) {
  const contenedor = document.getElementById("paginacion");
  contenedor.innerHTML = "";

  const totalPaginas = Math.ceil(total / productosPorPagina);

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = i === paginaActual;
    btn.addEventListener("click", () => {
      paginaActual = i;
      obtenerProductosDelBackend();
    });
    contenedor.appendChild(btn);
  }
}

// Obtener productos desde el backend con filtros
function obtenerProductosDelBackend() {
  const form = document.getElementById("formFiltros");
  const formData = new FormData(form);
  const params = new URLSearchParams();

  const nombre = formData.get("nombre");
  if (nombre) params.append("nombre", nombre);

  const tipos = formData.getAll("tipo");
  tipos.forEach(t => params.append("tipo", t));

  const materiales = formData.getAll("material");
  materiales.forEach(m => params.append("material", m));

  const precioMin = formData.get("precioMin");
  if (precioMin) params.append("precioMin", precioMin);

  const precioMax = formData.get("precioMax");
  if (precioMax) params.append("precioMax", precioMax);

  const disponible = formData.get("disponible");
  if (disponible === "on") params.append("disponible", "true");

  const vendedor = formData.get("vendedor");
  if (vendedor) params.append("vendedor", vendedor);

  fetch(`/api/productos/todo?${params.toString()}`)
    .then(res => res.json())
    .then(data => {
      renderizarProductos(data);
    })
    .catch(err => {
      console.error("Error al obtener productos:", err);
    });
}
