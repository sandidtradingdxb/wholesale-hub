import axios from "axios";

// In production, VITE_API_URL points at the Render backend (e.g. https://wholesale-hub.onrender.com).
// Locally, it's usually unset, so we fall back to a relative "/api" which the Vite dev server proxies.
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
  : "/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
