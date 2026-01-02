import axios from "axios";

const RAW = import.meta.env.VITE_BACKEND_URL || "https://rebuzzar-backends.onrender.com";

// Remove extra trailing slashes
const API_BASE = RAW.replace(/\/+$/, "");

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// FIXED UNIVERSAL TOKEN HANDLER
export function withAuthHeaders(token?: string) {
  const finalToken =
    token ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  return {
    headers: finalToken ? { Authorization: `Bearer ${finalToken}` } : {},
  };
}

export default api;
