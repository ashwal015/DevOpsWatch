import axios from "axios";

const api = axios.create({
    baseURL: "http://35.159.168.66:8000",
});

export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}

export default api;