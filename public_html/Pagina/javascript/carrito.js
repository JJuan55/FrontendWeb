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

    // Reasignar eventos a los nuevos botones
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

  function finalizarCompra() {
  const clienteId = localStorage.getItem("clienteId"); // Asegúrate de guardar esto al iniciar sesión
  const metodoPago = "efectivo"; // o recoger de un select
  const telefonoContacto = "3001234567"; // pide al usuario
  const cedulaContacto = "123456789"; // pide al usuario

  if (!clienteId || carrito.length === 0) {
    alert("Falta información o el carrito está vacío.");
    return;
  }

 const productos = carrito.map(item => ({
  productoId: item.id, // asegúrate que tenga id
  cantidad: item.cantidad
}));

  fetch("http://localhost:8080/api/compras/realizar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
    clienteId,
    metodoPago,
    telefonoContacto,
    cedulaContacto,
    productos
   })
  })
  
  .then(res => res.json())
  .then(data => {
    if (data.exito) {
      alert("Compra realizada con éxito.");
      localStorage.removeItem("carrito");
      location.reload();
    } else {
      alert("Error: " + data.mensaje);
    }
  })
  .catch(error => {
    alert("Error en la compra: " + error);
  });
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
  document.getElementById("descargarReciboBtn").addEventListener("click", generarFacturaPDF);

  actualizarCarrito();
});




