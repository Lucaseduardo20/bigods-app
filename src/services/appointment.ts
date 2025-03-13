import { api } from "./api"

export const getAppointments = async (token: string) => {
    const response = await api.get('/appointments', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}