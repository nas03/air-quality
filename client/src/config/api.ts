import axios from "axios";
const env = import.meta.env.DEV
const baseURL = env ? "http://localhost:443/api" : "https://api.nas03.xyz/api"
const api = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

export default api;
