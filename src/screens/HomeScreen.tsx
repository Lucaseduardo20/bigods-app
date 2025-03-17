import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { previewService } from '../services/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockAgendamentos = [
  { id: '1', cliente: 'João', horario: '10:00', servico: 'Corte de Cabelo' },
  { id: '2', cliente: 'Maria', horario: '11:00', servico: 'Barba' },
];


export const HomeScreen = () => {
  const [nextAppointments, setNextAppointments] = useState([]);
  const [appointmentsCount, setAppointmentsCount] = useState();
  const [commission, setCommission] = useState();
  
  const getPreview = async () => {
    const token = await AsyncStorage.getItem('token') as string;
    return await previewService(token).then((res) => {
      setNextAppointments(res.next_appointments);
      setCommission(res.commission);
      setAppointmentsCount(res.total_week_appointments);
    }).catch((err: any) => {
      console.log(err);
      alert(err);
    });
  }

useEffect(() => {
  getPreview();
}, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo de volta!</Text>
      {nextAppointments.length > 0 ? (
        <Text style={styles.subtitle}>Aqui estão seus próximos agendamentos:</Text>
      ): (
        <Text style={styles.subtitle}>Não há agendamentos hoje.</Text>
      )}

      <FlatList
        data={nextAppointments as any}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointmentItem}>
            <Text style={styles.appointmentText}>
              {item.customer.name}
            </Text>
            <Text style={styles.appointmentText}>
              {item.appointment_time}
            </Text>
          </View>
        )}
      />

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Saldo de Comissões: {commission}</Text>
        <Text style={styles.summaryText}>Total de Agendamentos: {appointmentsCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingVertical: 50,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  appointmentItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  appointmentText: {
    fontSize: 16,
    color: '#333',
  },
  summaryContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#003366',
  },
  summaryText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
});
