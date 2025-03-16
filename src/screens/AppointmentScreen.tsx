import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Modal  } from 'react-native';
import { useAppointments } from '../contexts/AppointmentContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { Appointment, AppointmentPaymentMethod, AppointmentStatus } from '../types/appointment';
import { ModalContainer } from '../components/utils/ModalContainer';
import { doneAppointmentService } from '../services/appointment';

const mockAgendamentos = [
  { 
    id: '1', 
    cliente: 'João Silva', 
    horario: '10:00', 
    servicos: ['Corte', 'Barba'], 
    valor: 'R$ 50,00', 
    status: 'pendente' 
  },
  { 
    id: '2', 
    cliente: 'Maria Oliveira', 
    horario: '11:00', 
    servicos: ['Corte'], 
    valor: 'R$ 30,00', 
    status: 'concluído' 
  },
  { 
    id: '3', 
    cliente: 'Carlos Sousa', 
    horario: '12:00', 
    servicos: ['Corte', 'Barba', 'Massagem'], 
    valor: 'R$ 80,00', 
    status: 'pendente' 
  },
];

export const AppointmentsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState() as any;
  const [doneModal, setDoneModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [doneAppointment, setDoneAppointment] = useState({} as Appointment)
  const [refreshing, setRefreshing] = useState(false);
  const {appointments} = useAppointments()

  const { getAppointmentsApi } = useAppointments();
  const handleCancelar = (id: string) => {
    console.log(`Cancelando agendamento com id: ${id}`);
  };

  const handleDetalhes = (id: string) => {
    console.log(`Ver detalhes do agendamento com id: ${id}`);
  };

  const formatDateTime = (date: string, time: string) => {
    const appointmentDate = new Date(`${date}T${time}`);
    return format(appointmentDate, "dd/MM/yyyy 'às' HH:mm");
  };
  const paymentMethods: Record<string, AppointmentPaymentMethod> = {
    Pix: AppointmentPaymentMethod.pix,
    'Cartão de Crédito': AppointmentPaymentMethod.credit_card,
    'Cartão de Débito': AppointmentPaymentMethod.debit,
    Dinheiro: AppointmentPaymentMethod.money,
  };

  const openDoneModal = (appointment: Appointment) => {
    setDoneModal(true);
    setDoneAppointment(appointment);
  }

  const fetchAppointments = async () => {
    const token: string = await AsyncStorage.getItem('token') as string;
    try {
      await getAppointmentsApi(token);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const setMethod = async (method: string) => {
      setPaymentMethod(paymentMethods[method]);
      const token = await AsyncStorage.getItem('token');
      await doneAppointmentService({
        token: token,
        id: doneAppointment.id,
        payment_method: paymentMethods[method]
      }).then((res: any) => {
        alert(res.data.message);
        onRefresh();
      }).catch((err) => {
        alert('Erro ao concluir atendimento. Entre em contato com o administrador')
      })
  }

  useEffect(() => {
    fetchAppointments();
  }, [])


  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };
  
  return (
<View style={styles.container}>
      <Text style={styles.title}>Agendamentos</Text>
      {appointments.length === 0 ? (
        <Text style={styles.notfound}>Ainda não há agendamentos para hoje.</Text>
      ): (
        <FlatList
          data={appointments as any}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.infoContainer}>
                <Text style={styles.cliente}>{item.customer.name}</Text>
                <Text style={styles.horario}>{formatDateTime(item.appointment_date, item.appointment_time)}</Text>
                {/* <Text style={styles.servicos}>Serviços: 
                  {item.services.map((servico: any) => 
                    <Text>{servico.name} - </Text>
                  )}
                </Text> */}
                <Text style={styles.valor}>Valor: R$ {item.amount}</Text>
                <Text style={[styles.status, item.status === 'done' ? styles.concluido : styles.pendente]}>
                  Status: {AppointmentStatus[item.status as keyof typeof AppointmentStatus]}
                </Text>
              </View>

              <View style={styles.buttonsContainer}>
                {item.status === 'pending' && (
                  <>
                    <TouchableOpacity 
                      style={[styles.button, styles.concluirButton]} 
                      onPress={() => openDoneModal(item)}
                    >
                      <Text style={styles.buttonText}>Concluir</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.button, styles.cancelarButton]} 
                      onPress={() => handleCancelar(item.id)}
                    >
                      <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </>
                )}

                <TouchableOpacity 
                  style={[styles.button, styles.detalhesButton]} 
                  onPress={() => handleDetalhes(item.id)}
                >
                  <Text style={styles.buttonText}>Detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <ModalContainer visible={doneModal} setVisible={setDoneModal} >
      <View style={styles.doneModal}>
        <View style={{ width: '95%', display: 'flex', alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => setDoneModal(false)}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>X</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.doneModalTitle}>Qual foi a forma de pagamento utilizada?</Text>
        <View style={styles.paymentOptionsContainer}>
        {Object.keys(paymentMethods).map((method) => (
          <TouchableOpacity onPress={() => setMethod(method as keyof typeof paymentMethods)} key={method} style={styles.paymentButton}>
            <Text style={styles.paymentButtonText}>{method}</Text>
          </TouchableOpacity>
        ))}
        </View>
      </View>
      </ModalContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingVertical: 30,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 12,
  },
  cliente: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
  horario: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  servicos: {
    fontSize: 16,
    color: '#333',
  },
  valor: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginVertical: 4,
  },
  status: {
    fontSize: 14,
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    textAlign: 'center',
  },
  pendente: {
    backgroundColor: '#ffcc00',
    color: '#fff',
  },
  concluido: {
    backgroundColor: '#00cc66',
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  concluirButton: {
    backgroundColor: '#00cc66',
  },
  cancelarButton: {
    backgroundColor: '#ff3300',
  },
  detalhesButton: {
    backgroundColor: '#003366',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  notfound: {
    color: 'gray',
    margin: 'auto',
    fontSize: 18
  },
  doneModal: {
    width: 300,
    height: 300,
    borderRadius: 10,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
  },

  doneModalTitle: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center'
  },
  paymentOptionsContainer: {
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  
  paymentButton: {
    backgroundColor: '#003366',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
