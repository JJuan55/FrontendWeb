export const API_BASE_URL = window.location.hostname.includes("localhost") || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8081"
  : "https://plasticweb-flu2.onrender.com";
