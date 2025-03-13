import { createContext, ReactNode, useContext, useState } from "react";
import { AppointmentContextType, Appointment } from "../types/appointment";
import { getAppointments } from "../services/appointment";

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined)

export const AppointmentProvider = ({children}: {children: ReactNode}) => {
    const [appointments, setAppointments] = useState({} as Appointment);

    const getAppointmentsApi = async(token: string) => {
        await getAppointments(token).then((value) => {
            setAppointments(value);
        }).catch((error) => {
            return error;
        })
    }

    return (
        <AppointmentContext.Provider value={{ appointments, setAppointments, getAppointmentsApi } as AppointmentContextType}>
          {children}
        </AppointmentContext.Provider>
    );
}

export const useAppointments = () => {
    const context = useContext(AppointmentContext);
    if (!context) {
      throw new Error('useAppointments deve ser usado dentro de AppointmentsProvider');
    }
    return context;
  };