document.addEventListener("DOMContentLoaded", () => {
  const btnVendedor = document.getElementById("btn-vendedor");
  const modal = document.getElementById("formulario-vendedor");
  const cerrarModal = document.getElementById("cerrar-modal");

  // Mostrar el formulario
  btnVendedor.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Cerrar el formulario
  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Cerrar si se hace clic fuera del modal
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Manejo de envío del formulario
  const formVendedor = document.getElementById("form-vendedor");
  formVendedor.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      categoria: document.getElementById("categoria").value,
      nombre: document.getElementById("nombre-v").value,
      telefono: document.getElementById("telefono-v").value,
      correo: document.getElementById("correo-v").value,
      ubicacion: document.getElementById("ubicacion").value
    };

    try {
      const response = await fetch("/api/vendedor/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + (errorData.error || "No se pudo enviar la solicitud"));
        return;
      }

      const result = await response.json();
      console.log("Respuesta del servidor:", result);
      alert("¡Solicitud enviada! Pronto nos pondremos en contacto.");
      modal.style.display = "none";
      formVendedor.reset();
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Ocurrió un error al enviar la solicitud.");
    }
  });
});


