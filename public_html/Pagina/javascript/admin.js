// admin.js

import { protegerRuta, fetchConToken, cerrarSesion } from "../auth.js";

// Proteger esta página solo para administradores
protegerRuta("ADMIN");

// Función para cargar usuarios
async function cargarUsuarios() {
  try {
    const respuesta = await fetchConToken("/api/admin/usuarios");
    if (!respuesta.ok) throw new Error("Error al obtener usuarios");

    const usuarios = await respuesta.json();
    mostrarUsuarios(usuarios);
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    alert("No se pudo cargar la lista de usuarios.");
  }
}

// Ejemplo de función de renderizado
function mostrarUsuarios(lista) {
  const contenedor = document.getElementById("lista-usuarios");
  contenedor.innerHTML = "";

  lista.forEach((usuario) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${usuario.nombre}</td>
      <td>${usuario.rol}</td>
      <td>${usuario.activo ? "Activo" : "Suspendido"}</td>
      <td>
        <button class="suspender-btn" data-id="${usuario.id}">Suspender</button>
      </td>
    `;
    contenedor.appendChild(fila);
  });

  // Delegación de eventos
  document.querySelectorAll(".suspender-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await suspenderUsuario(id);
    });
  });
}

// Función para suspender un usuario
async function suspenderUsuario(id) {
  try {
    const respuesta = await fetchConToken(`/api/admin/usuarios/${id}/suspender`, {
      method: "PUT"
    });
    if (!respuesta.ok) throw new Error("Error al suspender usuario");

    alert("Usuario suspendido correctamente.");
    cargarUsuarios(); // Refrescar lista
  } catch (error) {
    console.error("Error al suspender:", error);
    alert("No se pudo suspender al usuario.");
  }
}

// Evento de logout
document.getElementById("cerrar-sesion-btn")?.addEventListener("click", () => {
  cerrarSesion();
});

// Cargar todo al iniciar
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
});
