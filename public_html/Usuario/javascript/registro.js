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

  function validarFormatoContrasena() {
    const clave = contrasenaInput.value;
    if (!passwordRegex.test(clave)) {
      mensajeContrasena.textContent = "Debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo.";
      return false;
    } else {
      mensajeContrasena.textContent = "";
      return true;
    }
  }

  correoInput.addEventListener("input", validarCorreosIguales);
  verCorreoInput.addEventListener("input", validarCorreosIguales);
  contrasenaInput.addEventListener("input", validarFormatoContrasena);

  registroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    mensajeError.style.color = "red";
    mensajeError.textContent = "";

    const nombres = document.getElementById("nombres").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const correo = correoInput.value.trim();
    const verCorreo = verCorreoInput.value.trim();
    const contrasena = contrasenaInput.value;
    const verContrasena = verContrasenaInput.value;
    const acepta = document.getElementById("aceptaTerminos");

    if (!nombres || !apellidos || !correo || !verCorreo || !contrasena || !verContrasena) {
      mensajeError.textContent = "Por favor completa todos los campos.";
      return;
    }

    if (!emailRegex.test(correo)) {
      mensajeError.textContent = "Por favor ingrese un correo electrónico válido.";
      return;
    }

    if (!validarCorreosIguales()) {
      mensajeError.textContent = "Los correos no coinciden.";
      return;
    }

    const apellidosArray = apellidos.split(" ");
    if (apellidosArray.length < 2) {
      mensajeError.textContent = "Por favor, ingrese al menos dos apellidos.";
      return;
    }

    if (contrasena !== verContrasena) {
      mensajeError.textContent = "Las contraseñas no coinciden.";
      return;
    }

    if (!validarFormatoContrasena()) {
      mensajeError.textContent = "La contraseña no cumple con los requisitos.";
      return;
    }

    if (!acepta.checked) {
      mensajeError.textContent = "Debes aceptar los Términos y Condiciones para registrarte.";
      return;
    }

    // Enviar los datos al backend
    const datosRegistro = {
      nombre: nombres,
      apellido: apellidos,
      contrasena: contrasena,
      correo: correo
    };

    fetch("http://localhost:8081/api/registro/iniciar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosRegistro),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.codigoEnviado) {
        mensajeError.style.color = "green";
        mensajeError.textContent = "Registro iniciado correctamente. Revisa tu correo.";
        document.getElementById("modalVerificacion").style.display = "flex";
      } else {
        mensajeError.textContent = data.mensaje || "No se pudo iniciar el registro.";
      }
    })
    .catch((error) => {
      mensajeError.textContent = "Error al registrar: " + error.message;
    });
  });

  // Verificación de código
  const btnVerificar = document.getElementById("btnVerificarCodigo");
  if (btnVerificar) {
    btnVerificar.addEventListener("click", () => {
      const codigo = document.getElementById("codigoVerificacion").value.trim();
      const correo = correoInput.value.trim();
      const mensajeVerificacion = document.getElementById("mensajeVerificacion");

      if (!codigo) {
        mensajeVerificacion.textContent = "Por favor ingresa el código.";
        return;
      }

      fetch("http://localhost:8081/api/registro/verificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, codigo })
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.verificado) {
          mensajeVerificacion.style.color = "green";
          mensajeVerificacion.textContent = "¡Cuenta verificada correctamente!";
          setTimeout(() => {
            document.getElementById("modalVerificacion").style.display = "none";
            window.location.href = "inicioSesion.html";
          }, 2000);
        } else {
          mensajeVerificacion.style.color = "red";
          mensajeVerificacion.textContent = "Código incorrecto. Inténtalo de nuevo.";
        }
      })
      .catch((error) => {
        mensajeVerificacion.textContent = "Error al verificar: " + error.message;
      });
    });
  }

  // Modal de Términos y Condiciones
  const abrirModal = document.getElementById("abrirModalTerminos");
  const modal = document.getElementById("modalTerminos");
  const cerrarModal = document.getElementById("cerrarModalTerminos");

  abrirModal?.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
  });

  cerrarModal?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});

    if (!acepta.checked) {
      e.preventDefault();
      alert("Debes aceptar los Términos y Condiciones para registrarte.");
    }
  });
});
