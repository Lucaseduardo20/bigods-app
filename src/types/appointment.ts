export type AppointmentContextType = {
    appointments: Appointment;
    setAppointments: () => void;
    getAppointmentsApi: (token: string) => any

}

export type Appointment = {
    customer: Customer,
    date: string,
    time: string,
    status: AppointmentStatus
}

export type Customer = {
    name: string,
    email: string,
    tel: string,
}
export enum AppointmentStatus {
    pending = 'Pendente',
    scheduled = 'Agendado',
    canceled = 'Cancelado'
}