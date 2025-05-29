import { guardarSesion, redireccionarPorRol } from '../../Pagina/javascript/auth.js';
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('loginForm');

    // Manejador de envío del formulario
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!form.checkValidity()) {
            alert('Por favor completa todos los campos requeridos con un formato válido.');
            return;
        }

        const correo = document.getElementById('correo').value;
        const contrasena = document.getElementById('contrasena').value;
                
        
        // Enviar datos al backend
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
                if (data.token) {
                 guardarSesion({
                   token: data.token,
                   rol: data.rol || null,
                                  // Agrega más si el backend devuelve: clienteId, vendedorId, etc.
                });

                alert(data.mensaje || "Inicio de sesión exitoso");
                redireccionarPorRol(); // Usa directamente el auth.js para ir al módulo correcto
             }

                else {
                    alert(data.mensaje || "Credenciales incorrectas");
                }
            })
            .catch(error => {
                console.error("Error en la solicitud:", error);
                alert("Correo o contraseña incorrectos, o el servidor no respondió.");
            });
    });

    // Inicializa Google Auth2
    gapi.load('auth2', function () {
        gapi.auth2.init({
            client_id: 'TU_CLIENT_ID.apps.googleusercontent.com',
            scope: 'profile email'
        });
    });
});

// Función global para Google Sign-In
function signIn() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn()
        .then(function (googleUser) {
            const profile = googleUser.getBasicProfile();
            const email = profile.getEmail();

            document.getElementById('google-login-result').innerHTML =
                `<p>Bienvenido, ${profile.getName()} (${email})</p>`;

            fetch("http://localhost:8081/api/login/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ correo: email })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en el inicio de sesión con Google.");
                }
                return response.json();
            })
            .then(data => {
                if (data.token) {
                    // Guardamos la sesión usando la misma función
                    guardarSesion({
                        token: data.token,
                        rol: data.rol || null  // Si el backend no envía rol, se pone null
                    });
                    alert(data.mensaje || "Inicio de sesión exitoso con Google");
                    redireccionarPorRol();
                } else {
                    alert(data.mensaje || "No se pudo iniciar sesión con Google.");
                }
            })
            .catch(error => {
                console.error('Error al iniciar sesión con Google:', error);
                alert("Hubo un problema al iniciar sesión con Google.");
            });
        })
        .catch(function (error) {
            console.error('Error al iniciar sesión con Google:', error);
        });
}   