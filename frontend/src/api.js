import axios from "axios";

const api = axios.create({
    baseURL: window.__API_URL__ || "http://localhost:8000",
});

export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}

export default api;