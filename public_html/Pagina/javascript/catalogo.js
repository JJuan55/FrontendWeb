// Simulación de productos (esto será reemplazado por datos de la base de datos en el futuro)
const productos = [
  {
    nombre: "Bolso reciclado",
    tipo: "bolsos",
    precio: 18000,
    disponible: true,
    descripcion: "Bolso hecho a mano con materiales reciclados.",
    vendedor: "María López",
    imagen: "https://i.pinimg.com/222x/82/c4/3f/82c43f3ad354a70f2241eb83a8d7b750.jpg"
  },
  {
    nombre: "Maceta ecológica",
    tipo: "macetas",
    precio: 12000,
    disponible: true,
    descripcion: "Maceta ecológica ideal para tu jardín.",
    vendedor: "Carlos Ruiz",
    imagen: "https://i.pinimg.com/236x/24/3e/bd/243ebdb3a754407943a2d1db8b4575ab.jpg"
  },
  {
    nombre: "Lámpara con botellas",
    tipo: "decoración",
    precio: 35000,
    disponible: false,  
    descripcion: "Lámpara elaborada con botellas recicladas.",
    vendedor: "Luz Verde",
    imagen: "https://i.pinimg.com/474x/c8/c6/59/c8c65949d7d1bf33192937dbbdc3d258.jpg"
  },
  {
    nombre: "Florero reciclado",
    tipo: "decoración",
    precio: 16000,
    disponible: true,
    descripcion: "Florero moderno hecho de materiales reutilizados.",
    vendedor: "Juan Moreno",
    imagen: "https://i.pinimg.com/236x/d4/06/a1/d406a1d91e479f615fa9d8dce013c2fc.jpg"
  }
];

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

// Filtro de productos
document.getElementById("formFiltros").addEventListener("submit", function (e) {
  e.preventDefault();
  paginaActual = 1; // Reiniciar a la primera página

  filtrarProductos();
});

// Mostrar todos al cargar
renderizarProductos(productos);

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
      filtrarProductos();
    });
    contenedor.appendChild(btn);
  }
}

function filtrarProductos() {
  const form = document.getElementById("formFiltros");
  if (!form) {
    renderizarProductos(productos);
    return;
  }

  const formData = new FormData(form);
  const nombre = formData.get("nombre")?.toLowerCase() || "";
  const tipos = formData.getAll("tipo");
  const materiales = formData.getAll("material");
  const precioMin = parseFloat(formData.get("precioMin")) || 0;
  const precioMax = parseFloat(formData.get("precioMax")) || Infinity;
  const disponible = formData.get("disponible") === "on";
  const vendedor = formData.get("vendedor")?.toLowerCase() || "";

  const filtrados = productos.filter(p => {
    return (
      p.nombre.toLowerCase().includes(nombre) &&
      (tipos.length === 0 || tipos.includes(p.tipo)) &&
      (materiales.length === 0 || materiales.includes(p.material)) &&
      p.precio >= precioMin &&
      p.precio <= precioMax &&
      (!disponible || p.disponible) &&
      (!vendedor || p.vendedor.toLowerCase().includes(vendedor))
      );
  });

  renderizarProductos(filtrados);
}