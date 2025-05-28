document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("items-carrito");
  const resumen = document.getElementById("resumen-detalle");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  function actualizarCarrito() {
    contenedor.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
      contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
      document.getElementById("total-compra").textContent = "0";
      return;
    }

    carrito.forEach((item, index) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;

      const div = document.createElement("div");
      div.classList.add("item-carrito");
      div.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}" class="producto-imagen" />
        <div class="item-info">
          <h4>${item.nombre}</h4>
          <p>${item.descripcion}</p>
          <p>Vendedor: ${item.vendedor}</p>
          <p>Cantidad: <span class="cantidad">${item.cantidad}</span></p>
        </div>
        <div class="item-precio">$${subtotal.toLocaleString()} COP</div>
        <button class="eliminar-btn" data-index="${index}">Eliminar</button>
      `;
      contenedor.appendChild(div);
    });

    document.getElementById("total-compra").textContent = total.toLocaleString();
    localStorage.setItem("carrito", JSON.stringify(carrito));

    document.querySelectorAll(".eliminar-btn").forEach(btn => {
      btn.addEventListener("click", eliminarItem);
    });
  }

  function eliminarItem(event) {
    const index = event.target.getAttribute("data-index");
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
  }

  async function finalizarCompra() {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || !usuario.id) {
      alert("Debes estar registrado para realizar una compra.");
      return;
    }

    const peticionCompra = {
      usuarioId: usuario.id,
      productos: carrito.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad
      }))
    };

    try {
      const respuesta = await fetch("/api/compras/realizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(peticionCompra)
      });

      const data = await respuesta.json();

      if (respuesta.ok && data.exito) {
        generarFacturaPDF();
        alert("Compra finalizada con éxito. ¡Gracias!");
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
      } else {
        alert(`Error al realizar la compra: ${data.mensaje || "Intenta más tarde"}`);
      }
    } catch (error) {
      console.error("Error en la compra:", error);
      alert("No se pudo realizar la compra. Intenta más tarde.");
    }
  }

  function vaciarCarrito() {
    if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
      carrito = [];
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCarrito();
    }
  }

  function generarFacturaPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const fecha = new Date().toLocaleString();
    let y = 20;

    doc.setFontSize(16);
    doc.text("Factura de Compra", 105, y, { align: "center" });
    y += 10;
    doc.setFontSize(10);
    doc.text(`Fecha: ${fecha}`, 105, y, { align: "center" });

    y += 15;
    doc.setFontSize(12);
    doc.text("Detalle de la compra:", 14, y);
    y += 10;

    doc.setFontSize(10);
    doc.text("Producto", 14, y);
    doc.text("Cant.", 80, y);
    doc.text("Precio", 110, y);
    doc.text("Subtotal", 160, y);

    let total = 0;
    y += 6;

    carrito.forEach(item => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;

      doc.text(item.nombre, 14, y);
      doc.text(`${item.cantidad}`, 85, y);
      doc.text(`$${item.precio.toLocaleString()}`, 110, y);
      doc.text(`$${subtotal.toLocaleString()}`, 160, y);
      y += 6;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    y += 10;
    doc.setFontSize(12);
    doc.text(`Total: $${total.toLocaleString()} COP`, 160, y);
    y += 20;
    doc.setFontSize(10);
    doc.text("¡Gracias por tu compra!", 105, y, { align: "center" });

    doc.save("factura_compra.pdf");
  }

  // Eventos
  document.getElementById("finalizarCompraBtn").addEventListener("click", finalizarCompra);
  document.getElementById("vaciarCarritoBtn").addEventListener("click", vaciarCarrito);

  actualizarCarrito();
});





