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
  formVendedor.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      categoria: document.getElementById("categoria").value,
      nombre: document.getElementById("nombre-v").value,
      telefono: document.getElementById("telefono-v").value,
      correo: document.getElementById("correo-v").value,
      ubicacion: document.getElementById("ubicacion").value
    };

    console.log("Solicitud de vendedor:", data);

    // Aquí puedes enviar la info a tu servidor si lo deseas
    alert("¡Solicitud enviada! Pronto nos pondremos en contacto.");
    modal.style.display = "none";
    formVendedor.reset();
  });
});

