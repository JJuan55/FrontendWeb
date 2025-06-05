const productos = [
  {
    nombre: "Bolso reciclado",
    tipo: "accesorios",
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
  },
  {
    nombre: "Silla ecológica",
    tipo: "muebles",
    precio: 45000,
    disponible: true,
    descripcion: "Silla resistente hecha 100% de plástico reciclado.",
    vendedor: "PlastikReusa",
    imagen: "https://st2.depositphotos.com/3944627/8211/i/950/depositphotos_82110258-stock-photo-recycled-chair-made-from-plastic.jpg"
  },
  {
    nombre: "Mesa auxiliar reciclada",
    tipo: "muebles",
    precio: 60000,
    disponible: true,
    descripcion: "Mesa compacta y moderna fabricada con plástico recuperado.",
    vendedor: "Mundo Verde",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGpDhf5d_baoa-n6bhI1uAWVvhzgsNGPMiRw&s"
  },
  {
    nombre: "Banca para exteriores",
    tipo: "muebles",
    precio: 120000,
    disponible: false,
    descripcion: "Banca durable hecha de botellas de plástico recicladas.",
    vendedor: "EcoMuebles",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrRxHPBL1qnilHptQ4ATuH7lYH5RPdGuzWsw&s"
  },
  {
    nombre: "Llavero PET",
    tipo: "accesorios",
    precio: 3500,
    disponible: true,
    descripcion: "Llavero elaborado a mano con fragmentos de plástico PET.",
    vendedor: "ArtePET",
    imagen: "https://i.pinimg.com/originals/67/5f/ca/675fcaf31b967205135cf23231a0a815.jpg"
  },
  {
    nombre: "Cuadro abstracto reciclado",
    tipo: "decoración",
    precio: 30000,
    disponible: true,
    descripcion: "Cuadro de arte hecho con piezas plásticas recicladas.",
    vendedor: "Arte Circular",
    imagen: "https://i.pinimg.com/474x/e2/43/b5/e243b5887a60d9c47f462ea0960ded64.jpg"
  },
  {
    nombre: "Macetero de botella PET",
    tipo: "macetas",
    precio: 8000,
    disponible: true,
    descripcion: "Macetero colgante hecho con botellas PET reutilizadas.",
    vendedor: "EcoHuerta",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjCPE3dQLOHNZBMr2csjN4VppvZ_c8ITdvoQ&s"
  },
  {
    nombre: "Estuche de lápices plástico reciclado",
    tipo: "hogar",
    precio: 9000,
    disponible: true,
    descripcion: "Estuche escolar elaborado con bolsas y plástico reciclado.",
    vendedor: "VerdeEstilo",
    imagen: "https://i.ytimg.com/vi/OO9bmtW-G2g/maxresdefault.jpg"
  },
  {
    nombre: "Portavasos PET",
    tipo: "hogar",
    precio: 2500,
    disponible: true,
    descripcion: "Set de portavasos hechos con tapas y botellas recicladas.",
    vendedor: "EcoDiseños",
    imagen: "https://i.ytimg.com/vi/dOqnKNmNgL0/sddefault.jpg"
  }
];


const contenedor = document.getElementById("product-carousel");
const filtroForm = document.querySelector(".filtros form");
const slider = document.getElementById("myRange");
const output = document.getElementById("demo");

// Función para renderizar productos
function renderizarProductos(lista) {
    contenedor.innerHTML = ""; // Limpiar
    const maxMostrar = 4;
    lista.slice(0, maxMostrar).forEach(producto => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.style.cursor = "pointer";  // para mostrar el cursor tipo mano al pasar

        card.innerHTML = `
            <div class="img-container">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="overlay">
                    <h4>${producto.nombre}</h4>
                    <p>$${producto.precio.toLocaleString()}</p>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
            window.location.href = "producto.html";  // aquí va la página destino
        });

        contenedor.appendChild(card);
    });
}

function renderizarUltimosVistos() {
    const contenedorVistos = document.getElementById("ultimos-vistos");
    contenedorVistos.innerHTML = "";
    const vistos = JSON.parse(localStorage.getItem("ultimosVistos")) || [];

    const maxMostrar = 4;
    vistos.slice(0, maxMostrar).forEach(producto => {
        const div = document.createElement("div");
        div.className = "product-card";
        div.style.cursor = "pointer"; // para que se vea interactivo

        div.innerHTML = `
            <div class="img-container">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="overlay">
                    <h4>${producto.nombre}</h4>
                    <p>$${producto.precio.toLocaleString()}</p>
                </div>
            </div>
        `;

        // Agregar evento click como en productos destacados
        div.addEventListener("click", () => {
            localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
            window.location.href = "producto.html";
        });

        contenedorVistos.appendChild(div);
    });
}



// Verifica si hay sesión activa
function manejarSesion() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
        console.log("Sesión activa con:", usuario.nombre);
    } else {
        console.log("No hay sesión activa");
    }
}

// Construir la URL (o usar para filtrar en frontend)
function construirURLConFiltros() {
    const tipo = filtroForm.tipo.value;
    const precioMax = parseInt(slider.value);
    const soloDisponibles = filtroForm.disponible.checked;

    const filtrados = productos.filter(p => {
        const tipoValido = tipo === "" || p.tipo === tipo;
        const precioValido = p.precio <= precioMax;
        const disponibilidadValida = !soloDisponibles || p.disponible;
        return tipoValido && precioValido && disponibilidadValida;
    });

    renderizarProductos(filtrados);
}

// Actualizar valor del slider en pantalla
slider.oninput = function () {
    output.textContent = `$${parseInt(this.value).toLocaleString()}`;
};

// Inicializar valor mostrado del slider
output.textContent = `$${parseInt(slider.value).toLocaleString()}`;

// Evento para aplicar filtros
filtroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    construirURLConFiltros();
});

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos(productos);
    renderizarUltimosVistos();
    manejarSesion();
});

