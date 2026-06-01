import { getToken } from "../utils/storage"

export const BASE_URL = "http://localhost:3000"

export const getHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json"
})