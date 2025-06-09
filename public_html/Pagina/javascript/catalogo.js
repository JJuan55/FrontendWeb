const productos = [
  {
    nombre: "Bolso reciclado",
    tipo: "accesorios",
    precio: 18000,
    disponible: true,
    descripcion: "Bolso hecho a mano con materiales reciclados.",
    cantidad: 10,
    vendedor: "María López",
    imagen: "https://i.pinimg.com/222x/82/c4/3f/82c43f3ad354a70f2241eb83a8d7b750.jpg"
  },
  {
    nombre: "Maceta ecológica",
    tipo: "macetas",
    precio: 12000,
    disponible: true,
    descripcion: "Maceta ecológica ideal para tu jardín.",
    cantidad: 5,
    vendedor: "Carlos Ruiz",
    imagen: "https://i.pinimg.com/236x/24/3e/bd/243ebdb3a754407943a2d1db8b4575ab.jpg"
  },
  {
    nombre: "Lámpara con botellas",
    tipo: "decoración",
    precio: 35000,
    disponible: false,
    descripcion: "Lámpara elaborada con botellas recicladas.",
    cantidad: 6,
    vendedor: "Luz Verde",
    imagen: "https://i.pinimg.com/474x/c8/c6/59/c8c65949d7d1bf33192937dbbdc3d258.jpg"
  },
  {
    nombre: "Florero reciclado",
    tipo: "decoración",
    precio: 16000,
    disponible: true,
    descripcion: "Florero moderno hecho de materiales reutilizados.",
    cantidad: 2,
    vendedor: "Juan Moreno",
    imagen: "https://i.pinimg.com/236x/d4/06/a1/d406a1d91e479f615fa9d8dce013c2fc.jpg"
  },
  {
    nombre: "Silla ecológica",
    tipo: "muebles",
    precio: 45000,
    disponible: true,
    descripcion: "Silla resistente hecha 100% de plástico reciclado.",
    cantidad: 6,
    vendedor: "PlastikReusa",
    imagen: "https://st2.depositphotos.com/3944627/8211/i/950/depositphotos_82110258-stock-photo-recycled-chair-made-from-plastic.jpg"
  },
  {
    nombre: "Mesa auxiliar reciclada",
    tipo: "muebles",
    precio: 60000,
    disponible: true,
    descripcion: "Mesa compacta y moderna fabricada con plástico recuperado.",
    cantidad: 16,
    vendedor: "Mundo Verde",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGpDhf5d_baoa-n6bhI1uAWVvhzgsNGPMiRw&s"
  },
  {
    nombre: "Banca para exteriores",
    tipo: "muebles",
    precio: 120000,
    disponible: false,
    descripcion: "Banca durable hecha de botellas de plástico recicladas.",
    cantidad: 36,
    vendedor: "EcoMuebles",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrRxHPBL1qnilHptQ4ATuH7lYH5RPdGuzWsw&s"
  },
  {
    nombre: "Llavero PET",
    tipo: "accesorios",
    precio: 3500,
    disponible: true,
    descripcion: "Llavero elaborado a mano con fragmentos de plástico PET.",
    cantidad: 6,
    vendedor: "ArtePET",
    imagen: "https://i.pinimg.com/originals/67/5f/ca/675fcaf31b967205135cf23231a0a815.jpg"
  },
  {
    nombre: "Cuadro abstracto reciclado",
    tipo: "decoración",
    precio: 30000,
    disponible: true,
    descripcion: "Cuadro de arte hecho con piezas plásticas recicladas.",
    cantidad: 2,
    vendedor: "Arte Circular",
    imagen: "https://i.pinimg.com/474x/e2/43/b5/e243b5887a60d9c47f462ea0960ded64.jpg"
  },
  {
    nombre: "Macetero de botella PET",
    tipo: "macetas",
    precio: 8000,
    disponible: true,
    descripcion: "Macetero colgante hecho con botellas PET reutilizadas.",
    cantidad: 5,
    vendedor: "EcoHuerta",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjCPE3dQLOHNZBMr2csjN4VppvZ_c8ITdvoQ&s"
  },
  {
    nombre: "Estuche de lápices plástico reciclado",
    tipo: "hogar",
    precio: 9000,
    disponible: true,
    descripcion: "Estuche escolar elaborado con bolsas y plástico reciclado.",
    cantidad: 2,
    vendedor: "VerdeEstilo",
    imagen: "https://i.ytimg.com/vi/OO9bmtW-G2g/maxresdefault.jpg"
  },
  {
    nombre: "Portavasos PET",
    tipo: "hogar",
    precio: 2500,
    disponible: true,
    descripcion: "Set de portavasos hechos con tapas y botellas recicladas.",
    cantidad: 7,
    vendedor: "EcoDiseños",
    imagen: "https://i.ytimg.com/vi/dOqnKNmNgL0/sddefault.jpg"
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

// Filtros
function filtrarProductos() {
  const form = document.getElementById("formFiltros");
  const formData = new FormData(form);

  const nombre = formData.get("nombre")?.toLowerCase() || "";
  const tipos = formData.getAll("tipo");
  const precioMin = parseFloat(formData.get("precioMin")) || 0;
  const precioMax = parseFloat(formData.get("precioMax")) || Infinity;
  const disponible = formData.get("disponible") === "on";
  const vendedor = formData.get("vendedor")?.toLowerCase() || "";

  const filtrados = productos.filter(p => {
    return (
      p.nombre.toLowerCase().includes(nombre) &&
      (tipos.length === 0 || tipos.includes(p.tipo)) &&
      p.precio >= precioMin &&
      p.precio <= precioMax &&
      (!disponible || p.disponible) &&
      p.vendedor.toLowerCase().includes(vendedor)
    );
  });

  renderizarProductos(filtrados);
}

// Paginación
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

// Evento del formulario de filtros
document.getElementById("formFiltros").addEventListener("submit", function (e) {
  e.preventDefault();
  paginaActual = 1;
  filtrarProductos();
});

// Mostrar todos al cargar
filtrarProductos();

