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

    // === INICIO DE SESIÓN ===
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const correo = document.getElementById('correo').value;
            const contrasena = document.getElementById('contrasena').value;

            try {
                const response = await fetch(`${API_BASE_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo, contrasena })
                });

                const data = await response.json();

                if (response.ok) {
                    guardarSesion(data); // Guarda token y usuario
                    redireccionarPorRol(data); // Redirige según rol
                } else {
                    alert(data.mensaje || "Credenciales incorrectas.");
                }
            } catch (error) {
                console.error('Error en el inicio de sesión:', error);
                alert('Hubo un error al iniciar sesión. Inténtalo más tarde.');
            }
        });
    }
});
