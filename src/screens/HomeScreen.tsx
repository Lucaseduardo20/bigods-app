import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const mockAgendamentos = [
  { id: '1', cliente: 'João', horario: '10:00', servico: 'Corte de Cabelo' },
  { id: '2', cliente: 'Maria', horario: '11:00', servico: 'Barba' },
];

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo(a) de volta!</Text>
      <Text style={styles.subtitle}>Aqui estão seus próximos agendamentos:</Text>

      <FlatList
        data={mockAgendamentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointmentItem}>
            <Text style={styles.appointmentText}>
              {item.cliente} - {item.servico} às {item.horario}
            </Text>
          </View>
        )}
      />

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Saldo de Comissões: R$ 1.200,00</Text>
        <Text style={styles.summaryText}>Total de Agendamentos: 15 esta semana</Text>
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
