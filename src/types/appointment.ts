export type AppointmentContextType = {
    appointments: Appointment[];
    setAppointments: () => void;
    getAppointmentsApi: (token: string) => any

}

export type Appointment = {
    id: number,
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
    canceled = 'Cancelado',
    done = 'Concluído'
}

export enum AppointmentPaymentMethod {
    pix = 'pix',
    credit_card = 'credit_card',
    debit = 'debit_card',
    money = 'money'
}

export interface DoneAppointmentType {
    token: string | null,
    id: number,
    payment_method: AppointmentPaymentMethod
}

export interface CancelAppointmentType {
    id: number,
    reason: string
}