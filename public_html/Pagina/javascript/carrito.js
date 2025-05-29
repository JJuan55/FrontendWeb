
import { API_BASE_URL } from './config.js';

const SESION_KEY = 'sesion';

// Guardar sesión completa (token + datos usuario)
export function guardarSesion(sesion) {
  localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
}

// Obtener toda la sesión
export function obtenerSesion() {
  return JSON.parse(localStorage.getItem(SESION_KEY));
}

// Obtener token JWT
export function obtenerToken() {
  return obtenerSesion()?.token || null;
}

// Obtener rol del usuario autenticado
export function obtenerRol() {
  return obtenerSesion()?.rol || null;
}

// Obtener IDs
export function obtenerIdCliente() {
  return obtenerSesion()?.clienteId || null;
}

export function obtenerIdVendedor() {
  return obtenerSesion()?.vendedorId || null;
}

// Verifica si hay una sesión activa
export function estaAutenticado() {
  return !!obtenerSesion();
}

// Cerrar sesión
export function cerrarSesion() {
  localStorage.removeItem(SESION_KEY);
  window.location.href = '/login.html';
}

// Redirigir según el rol
export function redireccionarPorRol() {
  const rol = obtenerRol();

  if (rol === 'CLIENTE') {
    window.location.href = '/Usuario/html/inicio.html';
  } else if (rol === 'VENDEDOR') {
    window.location.href = '/Pagina/html/inicio.html';
  } else if (rol === 'ADMIN') {
    window.location.href = '/Pagina/html/admin.html';
  } else {
    alert("Tu sesión ha expirado o es inválida.");
    cerrarSesion();
  }
}

// Proteger una ruta específica por rol
export function protegerRuta(rolEsperado) {
  if (!estaAutenticado() || obtenerRol() !== rolEsperado) {
    redireccionarPorRol();
  }
}

// Proteger para varios roles permitidos
export function protegerMultiplesRoles(rolesPermitidos) {
  if (!estaAutenticado() || !rolesPermitidos.includes(obtenerRol())) {
    redireccionarPorRol();
  }
}

// fetch con token incluido
export async function fetchConToken(path, opciones = {}) {
  const token = obtenerToken();

  if (!token) {
    cerrarSesion();
    throw new Error("Sesión inválida.");
  }

  const headers = opciones.headers || {};
  headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = 'application/json';

  const url = API_BASE_URL + path;

  return fetch(url, {
    ...opciones,
    headers
  });
}





