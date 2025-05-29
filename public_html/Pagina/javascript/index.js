import { obtenerUsuario } from './auth.js';


const contenedor = document.getElementById("product-carousel");
const filtroForm = document.querySelector(".filtros form");
const slider = document.getElementById("myRange");
const output = document.getElementById("demo");

// Función para renderizar productos en el contenedor
function renderizarProductos(lista) {
    contenedor.innerHTML = ""; // Limpiar el contenedor

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    lista.forEach(prod => {
        const card = document.createElement("div");
        card.classList.add("producto");
        card.innerHTML = `
            <div class="imagen-con-overlay">
                <img src="${prod.imagen}" alt="${prod.nombre}" />
                <div class="overlay">
                    <h4>${prod.nombre}</h4>
                    <p>$${prod.precio.toLocaleString()} COP</p>
                </div>
            </div>
        `;
        card.addEventListener("click", () => {
            localStorage.setItem("productoSeleccionado", JSON.stringify(prod));
            let vistos = JSON.parse(localStorage.getItem("ultimosVistos")) || [];
            vistos = vistos.filter(p => p.nombre !== prod.nombre);
            vistos.unshift(prod);
            if (vistos.length > 4) vistos = vistos.slice(0, 4);
            localStorage.setItem("ultimosVistos", JSON.stringify(vistos));
            window.location.href = "producto.html";
        });
        contenedor.appendChild(card);
    });
}

function manejarSesion() {
const usuario = obtenerUsuario(); 

    if (usuario) {
        console.log("Sesión activa con:", usuario.nombre);
    } else {
        console.log("No hay sesión activa");
    }
}

function construirURLConFiltros() {
    const tipo = filtroForm.tipo.value;
    const precioMax = parseInt(slider.value);
    const soloDisponibles = filtroForm.disponible.checked;

    const params = new URLSearchParams();
    if (tipo !== "") params.append("tipo", tipo);
    params.append("precioMax", precioMax);
    if (soloDisponibles) params.append("disponible", true);

    return `/api/productos?${params.toString()}`;
}

// Función para obtener productos desde el backend usando los filtros
function filtrarProductos() {
    const url = construirURLConFiltros();

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Error al obtener productos");
            return res.json();
        })
        .then(data => {
            renderizarProductos(data);
        })
        .catch(err => {
            console.error("Error al cargar productos:", err);
            contenedor.innerHTML = "<p>Error al cargar productos.</p>";
        });
}

// Renderizar los últimos productos vistos
function renderizarUltimosVistos() {
    const contenedor = document.getElementById("ultimos-vistos");
    const vistos = JSON.parse(localStorage.getItem("ultimosVistos")) || [];

    if (vistos.length === 0) {
        contenedor.innerHTML = "<p>No has visto ningún producto aún.</p>";
        return;
    }

    vistos.forEach(prod => {
        const card = document.createElement("div");
        card.classList.add("producto");
        card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}" />
        <h4>${prod.nombre}</h4>
        <p>$${prod.precio.toLocaleString()} COP</p>
      `;
        card.addEventListener("click", () => {
            localStorage.setItem("productoSeleccionado", JSON.stringify(prod));
            window.location.href = "producto.html";
        });
        contenedor.appendChild(card);
    });
}

// Mostrar valor del slider en tiempo real
slider.oninput = function () {
    output.innerHTML = `$${parseInt(this.value).toLocaleString()}`;
};

// Mostrar el valor inicial del slider
output.innerHTML = `$${parseInt(slider.value).toLocaleString()}`;

// Evento para aplicar filtros desde el formulario
filtroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    filtrarProductos();
});

// Inicializar la página
document.addEventListener("DOMContentLoaded", () => {
    filtrarProductos(); // Mostrar productos inicialmente con los filtros por defecto
    manejarSesion();
    renderizarUltimosVistos();
});
