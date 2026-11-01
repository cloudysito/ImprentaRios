import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // Vite manda todo lo que empieza con /api al backend (puerto 8080)
  timeout: 5000,
});
