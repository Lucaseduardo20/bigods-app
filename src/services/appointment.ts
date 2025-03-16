import { DoneAppointmentType, CancelAppointmentType } from "../types/appointment";
import { api } from "./api"

export const getAppointments = async (token: string) => {
    const response = await api.get('/appointments', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const doneAppointmentService = async ({ token, id, payment_method }: DoneAppointmentType) => {
    return await api.post('/appointments/done', 
        { id, payment_method },
        { headers: { Authorization: `Bearer ${token}` } } 
    )
    .then((response) => {
        return response;
    })
    .catch((err) => {
        console.log(err);
        return err;
    });
};

export const cancelAppointment = async ({id, reason}: CancelAppointmentType) => {
    await api.post('/appointments/done', {id: id, reason: reason}).then((response) => {
        return response;
    }).catch((err) => {
        console.log(err);
        return err;
    })
}