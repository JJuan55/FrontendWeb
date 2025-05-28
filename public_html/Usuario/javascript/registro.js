document.addEventListener("DOMContentLoaded", () => {
  const registroForm = document.getElementById("registroForm");
  const mensajeError = document.getElementById("mensajeError");
  const correoInput = document.getElementById("correo");
  const verCorreoInput = document.getElementById("vercorreo");
  const contrasenaInput = document.getElementById("contrasena");
  const verContrasenaInput = document.getElementById("vercontrasena");
  const mensajeCorreo = document.getElementById("mensajeCorreo");
  const mensajeContrasena = document.getElementById("mensajeContrasena");

  // Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  // Validación dinámica de correos
  function validarCorreosIguales() {
    const c1 = correoInput.value.trim().toLowerCase();
    const c2 = verCorreoInput.value.trim().toLowerCase();

    if (c1 && c2 && c1 !== c2) {
      mensajeCorreo.textContent = "Los correos no coinciden.";
      return false;
    } else {
      mensajeCorreo.textContent = "";
      return true;
    }
  }

  correoInput.addEventListener("input", validarCorreosIguales);
  verCorreoInput.addEventListener("input", validarCorreosIguales);

  // Validación dinámica de contraseña
  function validarFormatoContrasena() {
    const clave = contrasenaInput.value;
    if (!passwordRegex.test(clave)) {
      mensajeContrasena.textContent =
        "Debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo.";
      return false;
    } else {
      mensajeContrasena.textContent = "";
      return true;
    }
  }

  contrasenaInput.addEventListener("input", validarFormatoContrasena);

  // Validación final al enviar
  registroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    mensajeError.innerHTML = "";

    const nombres = document.getElementById("nombres").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const correo = correoInput.value.trim();
    const verCorreo = verCorreoInput.value.trim();
    const contrasena = contrasenaInput.value;
    const verContrasena = verContrasenaInput.value;

    // Validaciones básicas
    if (
      !nombres ||
      !apellidos ||
      !correo ||
      !verCorreo ||
      !contrasena ||
      !verContrasena
    ) {
      mensajeError.innerHTML = "Por favor completa todos los campos.";
      return;
    }

    if (!emailRegex.test(correo)) {
      mensajeError.innerHTML =
        "Por favor ingrese un correo electrónico válido.";
      return;
    }

    if (!validarCorreosIguales()) {
      mensajeError.innerHTML = "Los correos no coinciden.";
      return;
    }

    const apellidosArray = apellidos.split(" ");
    if (apellidosArray.length < 2) {
      mensajeError.innerHTML = "Por favor, ingrese al menos dos apellidos.";
      return;
    }

    if (contrasena !== verContrasena) {
      mensajeError.innerHTML = "Las contraseñas no coinciden.";
      return;
    }

    if (!validarFormatoContrasena()) {
      mensajeError.innerHTML = "La contraseña no cumple con los requisitos.";
      return;
    }

    // Crear objeto JSON
    const datosRegistro = {
      nombre: nombres,
      apellido: apellidos,  // Cambiado de 'apellidos' a 'apellido'
      contrasena: contrasena,  // Cambiado de 'clave' a 'contrasena'
      correo: correo,
      confirmarContrasena: verContrasena
    };
    // Enviar al servidor (AJUSTAR URL)
    fetch("http://localhost:8081/api/registro/iniciar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosRegistro),
    })
      .then((response) => {
        if (response.ok) {
          mensajeError.style.color = "green";
          mensajeError.innerHTML = "Registro exitoso.";
          document.getElementById("modalVerificacion").style.display = "flex";
        } else {
          mensajeError.innerHTML = "Hubo un problema con el registro.";
        }
      })
      .catch((error) => {
        mensajeError.innerHTML = "Error al enviar los datos: " + error.message;
      });

    // Verificación de código (opcional si ya lo agregaste)
    const btnVerificar = document.getElementById("btnVerificarCodigo");
    if (btnVerificar) {
      btnVerificar.addEventListener("click", () => {
        const codigo = document.getElementById("codigoVerificacion").value.trim();
        const correo = correoInput.value.trim();
        const mensajeVerificacion = document.getElementById(
          "mensajeVerificacion"
        );

        if (codigo === "") {
          mensajeVerificacion.textContent = "Por favor ingresa el código.";
          return;
        }

        fetch('http://localhost:8081/api/registro/verificar', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, codigo }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.verificado) {
              mensajeVerificacion.style.color = "green";
              mensajeVerificacion.textContent =
                "¡Cuenta verificada correctamente!";
              setTimeout(() => {
                document.getElementById("modalVerificacion").style.display =
                  "none";
                window.location.href = "inicioSesion.html";
              }, 2000);
            } else {
              mensajeVerificacion.textContent =
                "Código incorrecto. Inténtalo de nuevo.";
            }
          })
          .catch((error) => {
            mensajeVerificacion.textContent =
              "Error al verificar: " + error.message;
          });
      });
    }
  });
}
);
document.addEventListener("DOMContentLoaded", () => {
  const abrirModal = document.getElementById("abrirModalTerminos");
  const modal = document.getElementById("modalTerminos");
  const cerrarModal = document.getElementById("cerrarModalTerminos");

  abrirModal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
  });

  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Validación extra al enviar formulario (opcional, ya que HTML5 ya valida)
  const formulario = document.getElementById("registroForm");
  formulario.addEventListener("submit", (e) => {
    const acepta = document.getElementById("aceptaTerminos");
    if (!acepta.checked) {
      e.preventDefault();
      alert("Debes aceptar los Términos y Condiciones para registrarte.");
    }
  });
});