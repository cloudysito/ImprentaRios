import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // Vite manda todo lo que empieza con /api al backend (puerto 8080)
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("imprenta.token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
