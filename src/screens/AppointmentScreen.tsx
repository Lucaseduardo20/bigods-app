import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl  } from 'react-native';
import { useAppointments } from '../contexts/AppointmentContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { AppointmentStatus } from '../types/appointment';

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
  const [refreshing, setRefreshing] = useState(false);
  const {appointments} = useAppointments()

  const { getAppointmentsApi } = useAppointments();
  const handleCancelar = (id: string) => {
    console.log(`Cancelando agendamento com id: ${id}`);
  };

  const handleConcluir = (id: string) => {
    console.log(`Concluindo agendamento com id: ${id}`);
  };

  const handleDetalhes = (id: string) => {
    console.log(`Ver detalhes do agendamento com id: ${id}`);
  };

  const formatDateTime = (date: string, time: string) => {
    const appointmentDate = new Date(`${date}T${time}`);
    return format(appointmentDate, "dd/MM/yyyy 'às' HH:mm");
  };

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
      <FlatList
        data={appointments as any}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.infoContainer}>
              <Text style={styles.cliente}>{item.customer.name}</Text>
              <Text style={styles.horario}>{formatDateTime(item.appointment_date, item.appointment_time)}</Text>
              <Text style={styles.servicos}>Serviço: {item.service.name}</Text>
              <Text style={styles.valor}>Valor: R$ {item.service.price}</Text>
              <Text style={[styles.status, item.status === 'concluído' ? styles.concluido : styles.pendente]}>
                Status: {AppointmentStatus[item.status as keyof typeof AppointmentStatus]}
              </Text>
            </View>

            <View style={styles.buttonsContainer}>
              {item.status === 'pending' && (
                <>
                  <TouchableOpacity 
                    style={[styles.button, styles.concluirButton]} 
                    onPress={() => handleConcluir(item.id)}
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
});
