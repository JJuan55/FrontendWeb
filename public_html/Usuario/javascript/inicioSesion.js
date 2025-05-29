import { guardarSesion, redireccionarPorRol } from '../../Pagina/javascript/auth.js';
import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const recuperarForm = document.getElementById('recuperarForm');
    const loginForm = document.getElementById('loginForm');

    // === RECUPERAR CONTRASEÑA ===
    if (recuperarForm) {
        recuperarForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!recuperarForm.checkValidity()) {
                alert('Por favor ingresa un correo válido para recuperar tu contraseña.');
                return;
            }

            const correo = document.getElementById('correo').value;

            try {
                const response = await fetch(`${API_BASE_URL}/api/recuperar/enviar-codigo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo })
                });

                const mensaje = await response.text();

                if (response.ok) {
                    alert(mensaje);
                    recuperarForm.reset();
                } else {
                    alert(`Error: ${mensaje}`);
                }

            } catch (error) {
                console.error('Error al enviar el código:', error);
                alert('Hubo un error al intentar enviar el código. Inténtalo más tarde.');
            }
        });
    }

    // === INICIO DE SESIÓN NORMAL ===
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!loginForm.checkValidity()) {
                alert('Por favor completa todos los campos requeridos con un formato válido.');
                return;
            }

            const correo = document.getElementById('correo').value;
            const contrasena = document.getElementById('contrasena').value;

            fetch(`${API_BASE_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, contrasena })
            })
                .then(response => {
                    if (!response.ok) throw new Error("Error en la respuesta del servidor.");
                    return response.json();
                })
                .then(data => {
                    if (data.token) {
                        guardarSesion({
                            token: data.token,
                            rol: data.rol || null
                        });
                        alert(data.mensaje || "Inicio de sesión exitoso");
                        redireccionarPorRol();
                    } else {
                        alert(data.mensaje || "Credenciales incorrectas");
                    }
                })
                .catch(error => {
                    console.error("Error en la solicitud:", error);
                    alert("Correo o contraseña incorrectos, o el servidor no respondió.");
                });
        });

        // === INICIO DE SESIÓN CON GOOGLE ===
        gapi.load('auth2', function () {
            gapi.auth2.init({
                client_id: 'TU_CLIENT_ID.apps.googleusercontent.com',
                scope: 'profile email'
            });
        });
    }
});

// === FUNCIÓN GLOBAL PARA LOGIN CON GOOGLE ===
window.signIn = function () {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn()
        .then(function (googleUser) {
            const profile = googleUser.getBasicProfile();
            const email = profile.getEmail();

            document.getElementById('google-login-result').innerHTML =
                `<p>Bienvenido, ${profile.getName()} (${email})</p>`;

            fetch(`${API_BASE_URL}/api/login/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: email })
            })
                .then(response => {
                    if (!response.ok) throw new Error("Error en el inicio de sesión con Google.");
                    return response.json();
                })
                .then(data => {
                    if (data.token) {
                        guardarSesion({
                            token: data.token,
                            rol: data.rol || null
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
};
