import axios from "axios";

// In production, VITE_API_URL already points at the full API base
// (e.g. https://wholesale-hub.onrender.com/api). Locally, it's usually
// unset, so we fall back to a relative "/api" which the Vite dev server proxies.
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
