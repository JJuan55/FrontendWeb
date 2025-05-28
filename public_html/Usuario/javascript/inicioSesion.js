document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!form.checkValidity()) {
            alert('Por favor completa todos los campos requeridos con un formato válido.');
            return;
        }

        const correo = document.getElementById('correo').value;
        const contrasena = document.getElementById('contrasena').value;

        fetch("http://localhost:8081/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ correo, contrasena })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor.");
            }
            return response.json();
        })
        .then(data => {
            console.log("Respuesta del servidor:", data);

            if (data.token) {
                localStorage.setItem("token", data.token); // Guardar token JWT
                alert(data.mensaje);
                window.location.href = "../../Pagina/html/index.html";
            } else {
                alert(data.mensaje || "Error al iniciar sesión");
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            alert("Correo o contraseña incorrectos, o el servidor no respondió.");
        });
    });
});
// Manejo de sesión y perfil de usuario
// Este código maneja la sesión del usuario, mostrando u ocultando elementos según su rol