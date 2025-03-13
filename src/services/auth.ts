import { api } from "./api"
import { loginData } from "../types/auth"

export const loginService = async (data: loginData) => {
    const response = await api.post('/login', data)
    return response;
}