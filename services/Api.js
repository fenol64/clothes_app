import axios from "axios";

export const backend_api = axios.create({
    baseURL: "https://clothes-one.vercel.app/api",
});