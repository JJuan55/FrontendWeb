(function manejarSesion() {
    const usuario = JSON.parse(localStorage.getItem("usuario")); // Debe incluir rol_id
    const loginBtn = document.getElementById("loginBtn");
    const profileContainer = document.getElementById("profileContainer");
    const profileIcon = document.getElementById("profileIcon");
    const ventasLink = document.getElementById("ventasLink");
    const adminLink = document.getElementById("adminLink");
    const logoutBtn = document.getElementById("logoutBtn");

    if (usuario) {
        if (loginBtn) loginBtn.style.display = "none";
        if (profileContainer) profileContainer.style.display = "inline-block";

        if (ventasLink) ventasLink.style.display = "none";
        if (adminLink) adminLink.style.display = "none";

        if (usuario.rol_id === 2 && ventasLink) {
            ventasLink.style.display = "block";
        }

        // Mostrar si es MODERADOR o ADMIN
        if ((usuario.rol_id === 3 || usuario.rol_id === 4) && adminLink) {
            adminLink.style.display = "block";
        }

        // Cerrar sesión
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                localStorage.removeItem("usuario");
                window.location.href = "../../Usuario/html/inicioSesion.html";
            });
        }

        // Mostrar/ocultar menú al hacer clic en el icono
        if (profileIcon) {
            profileIcon.addEventListener("click", () => {
                const profileMenu = document.getElementById("profileMenu");
                if (profileMenu) {
                    profileMenu.classList.toggle("show");
                }
            });

            // Cierra el menú si haces clic fuera
            document.addEventListener("click", (e) => {
                const profileMenu = document.getElementById("profileMenu");
                if (profileMenu && !profileIcon.contains(e.target) && !profileMenu.contains(e.target)) {
                    profileMenu.classList.remove("show");
                }
            });
        }

    } else {
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (profileContainer) profileContainer.style.display = "none";
    }
})();
