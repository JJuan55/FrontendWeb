document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recuperarForm');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!form.checkValidity()) {
            alert('Por favor ingresa un correo válido para recuperar tu contraseña.');
            return;
        }

        const correo = document.getElementById('correo').value;

        try {
            const response = await fetch('http://localhost:8081/api/recuperar/enviar-codigo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo })
            });

            const mensaje = await response.text();

            if (response.ok) {
                alert(mensaje); // "Código de recuperación enviado"
                form.reset();
            } else {
                alert(`Error: ${mensaje}`);
            }

        } catch (error) {
            console.error('Error al enviar el código:', error);
            alert('Hubo un error al intentar enviar el código. Inténtalo más tarde.');
        }
    });
});
