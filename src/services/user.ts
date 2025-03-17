import { api } from "./api";

export const previewService = async (token: string) => {
    const response = await api.get('/user/preview', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}