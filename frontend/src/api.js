import axios from "axios";

const api = axios.create({
    baseURL: window.__API_URL__ || "http://localhost:8000",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export function setAuthToken(token) {
    if (!token) {
        delete api.defaults.headers.common["Authorization"];
    }
}

export default api;