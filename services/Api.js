import axios from "axios";

export const backend_api = axios.create({
    baseURL: "http://192.168.0.130:3000/api",
});