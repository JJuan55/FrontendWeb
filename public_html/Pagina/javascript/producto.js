import { usuarioActivo, fetchConToken } from './auth.js';
document.addEventListener("DOMContentLoaded", () => {
  const producto = JSON.parse(localStorage.getItem("productoSeleccionado"));

  if (!producto) {
    document.querySelector(".detalle-producto").innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }

  // Guardar en últimos vistos
  let vistos = JSON.parse(localStorage.getItem("ultimosVistos")) || [];
  vistos = vistos.filter(p => p.nombre !== producto.nombre);
  vistos.unshift(producto);
  if (vistos.length > 5) vistos = vistos.slice(0, 5);
  localStorage.setItem("ultimosVistos", JSON.stringify(vistos));

  // Mostrar información del producto
  document.querySelector(".imagenes-producto img").src = producto.imagen;
  document.querySelector(".imagenes-producto img").alt = producto.nombre;
  document.querySelector(".detalles h2").textContent = producto.nombre;
  document.querySelector(".precio").textContent = `$${producto.precio.toLocaleString()} COP`;
  document.querySelector(".descripcion").textContent = producto.descripcion || "Este producto no tiene descripción.";
  document.querySelector(".vendedor").innerHTML = `<strong>Vendido por:</strong> ${producto.vendedor || "Vendedor anónimo"}`;
  document.querySelector("#producto-disponibilidad").textContent = producto.disponible ? "Disponible" : "No disponible";

  const btnAgregar = document.querySelector(".btn-carrito");
  const sesion = obtenerSesion(); 


  if (!producto.disponible) {
    btnAgregar.disabled = true;
    btnAgregar.textContent = "Producto no disponible";
    btnAgregar.style.backgroundColor = "#ccc";
    btnAgregar.style.cursor = "not-allowed";
  }

  btnAgregar.addEventListener("click", () => {
    if (!sesion) {
      mostrarMensajeSesion();
      return;
    }

    const cantidad = parseInt(document.querySelector("#cantidad").value);
    if (cantidad > 0) {
      const dto = {
        idUsuario: usuario.id,
        idProducto: producto.id,
        cantidad: cantidad
      };

      fetchConToken("/api/carrito/agregar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dto)
      })
        .then(res => {
          if (!res.ok) throw new Error("Error al agregar al carrito");
          return res.text();
        })
        .then(msg => {
          alert(msg);
        })
        .catch(err => {
          alert("Hubo un error al agregar el producto al carrito: " + err.message);
        });
    }
  });

  function mostrarMensajeSesion() {
    const mensaje = document.getElementById("mensaje-sesion");
    mensaje.classList.add("mostrar");

    setTimeout(() => {
      mensaje.classList.remove("mostrar");
    }, 3000);
  }
});



