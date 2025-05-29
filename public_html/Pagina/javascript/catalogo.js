let paginaActual = 1;
const productosPorPagina = 8;

// Renderizar productos
function renderizarProductos(lista) {
  const grid = document.getElementById("productosGrid");
  grid.innerHTML = "";

  if (lista.length === 0) {
    grid.innerHTML = "<p>No se encontraron productos con los filtros aplicados.</p>";
    renderizarControles(0);
    return;
  }

  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const pagina = lista.slice(inicio, fin);

  pagina.forEach(prod => {
    const imagenUrl = (prod.imagenes && prod.imagenes.length > 0)
      ? prod.imagenes[0].imagen
      : "https://via.placeholder.com/150";

    const vendedorNombre = prod.vendedor ? prod.vendedor.nombre : "Sin vendedor";
    const precio = prod.precioUnitario || 0;

    const card = document.createElement("div");
    card.className = "product-card";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <img src="${imagenUrl}" alt="${prod.nombre}">
      <h4>${prod.nombre}</h4> 
      <p>Precio: $${precio}</p>
      <p>Vendedor: ${vendedorNombre}</p>
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
  if (nombre && nombre.trim() !== "") params.append("nombre", nombre.trim());

  const tipos = formData.getAll("tipo");
  tipos.filter(t => t && t.trim() !== "").forEach(t => params.append("tipo", t.trim()));

  const materiales = formData.getAll("material");
  materiales.filter(m => m && m.trim() !== "").forEach(m => params.append("material", m.trim()));

  const precioMin = formData.get("precioMin");
  if (precioMin && precioMin.trim() !== "") params.append("precioMin", precioMin.trim());

  const precioMax = formData.get("precioMax");
  if (precioMax && precioMax.trim() !== "") params.append("precioMax", precioMax.trim());

  const disponible = formData.get("disponible");
  if (disponible === "on") params.append("disponible", "true");

  const vendedor = formData.get("vendedor");
  if (vendedor && vendedor.trim() !== "") params.append("vendedor", vendedor.trim());

  console.log("Query params:", params.toString()); // Para depuración

  fetch(`http://localhost:8081/api/productos/todo?${params.toString()}`)
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta del backend:", data);
      renderizarProductos(data);
    })
    .catch(err => {
      console.error("Error al obtener productos:", err);
    });
}
