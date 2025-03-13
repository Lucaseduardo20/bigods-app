import React from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export const AccountScreen = () => {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/150' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.profileName}>Barbeiro Exemplo</Text>
        <Text style={styles.profileEmail}>barbeiro@exemplo.com</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Telefone: (11) 99999-9999</Text>
        <Text style={styles.infoText}>Endereço: Rua Exemplo, 123, São Paulo</Text>
        <Text style={styles.infoText}>Experiência: 5 anos</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
    justifyContent: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#003366',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  infoContainer: {
    marginBottom: 32,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: '#ff3300',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
