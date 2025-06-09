document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("items-carrito");
  const totalSpan = document.getElementById("total-compra");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  function actualizarCarrito() {
    contenedor.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
      contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
      totalSpan.textContent = "0";
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

    totalSpan.textContent = total.toLocaleString();
    localStorage.setItem("carrito", JSON.stringify(carrito));

    document.querySelectorAll(".eliminar-btn").forEach(btn => {
      btn.addEventListener("click", eliminarItem);
    });
  }

  function mostrarAlerta(mensaje, tipo = "error", duracion = 4000) {
    const alerta = document.getElementById("alerta-mensaje");

    alerta.textContent = mensaje;
    alerta.className = "alerta-mostrar";

    if (tipo === "exito") {
      alerta.classList.add("alerta-exito");
    } else if (tipo === "info") {
      alerta.classList.add("alerta-info");
    } else {
      alerta.classList.add("alerta-error");
    }

    alerta.style.opacity = "1";
    alerta.style.display = "block";

    setTimeout(() => {
      alerta.style.opacity = "0";
      setTimeout(() => {
        alerta.className = "alerta-oculta";
        alerta.style.display = "none";
      }, 500);
    }, duracion);
  }

  function eliminarItem(e) {
    const index = e.target.getAttribute("data-index");
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
  }

  function finalizarCompra() {
    if (carrito.length === 0) {
      mostrarAlerta("Tu carrito está vacío.", "info");
      return;
    }
    mostrarAlerta("Compra finalizada. ¡Gracias por tu compra!", "exito");
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
  }

  function vaciarCarrito() {
    const modal = document.getElementById("modal-confirmacion");
    modal.style.display = "flex";

    document.getElementById("confirmarVaciar").onclick = () => {
      carrito = [];
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCarrito();
      modal.style.display = "none";
    };

    document.getElementById("cancelarVaciar").onclick = () => {
      modal.style.display = "none";
    };
  }

  function generarFacturaPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const fecha = new Date().toLocaleString();
    let y = 20;

    doc.setFontSize(16);
    doc.text("Factura de Compra - Platic Web", 105, y, { align: "center" });
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

    if (carrito.length === 0) {
      doc.setFontSize(10);
      doc.text("No hay productos en el carrito.", 14, y);
      y += 10;
    } else {
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
    }

    y += 10;
    doc.setFontSize(12);
    doc.text(`Total a pagar: $${total.toLocaleString()} COP`, 160, y);

    y += 20;
    doc.setFontSize(10);
    doc.text("¡Gracias por tu compra!", 105, y, { align: "center" });

    doc.save("factura_compra.pdf");
    const pdfBlob = doc.output("blob");
    if (callback) callback(pdfBlob);
  }

  function enviarFacturaPorCorreo(blob) {
    const formData = new FormData();
    formData.append("factura", blob, "factura_compra.pdf");
    formData.append("carrito", JSON.stringify(carrito));
    formData.append("correoComprador", localStorage.getItem("userEmail")); // o donde guardes el email

    fetch("/api/facturas/enviar", {
      method: "POST",
      body: formData
    })
      .then(res => {
        if (res.ok) {
          alert("Factura enviada por correo.");
        } else {
          alert("Hubo un error al enviar la factura.");
        }
      })
      .catch(err => {
        console.error("Error:", err);
        alert("Error al contactar el servidor.");
      });
  }

  document.getElementById("finalizarCompraBtn").addEventListener("click", () => {
    if (carrito.length === 0) {
      return;
    }

    generarFacturaPDF((pdfBlob) => {
      enviarFacturaPorCorreo(pdfBlob);
      carrito = [];
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCarrito();
    });
  });


  // Eventos
  document.getElementById("finalizarCompraBtn").addEventListener("click", finalizarCompra);
  document.getElementById("vaciarCarritoBtn").addEventListener("click", vaciarCarrito);
  document.getElementById("finalizarCompraBtn").addEventListener("click", generarFacturaPDF);

  actualizarCarrito();
});
