import axios from "axios";

const api = axios.create({
    baseURL: "http://54.93.243.198:8000",
});   /* baseURL: "http://localhost:8000", */

export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}

export default api;