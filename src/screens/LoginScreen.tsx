import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { AxiosResponse } from 'axios';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('123123');
  const [loginStatus, setLoginStatus] = useState<number>();
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response: any = await login({ email, password });
      
      if (response && response.status === 200) {
        setLoginStatus(response.status);
        setTimeout(() => {
          setLoading(false);
          setIsAuthenticated(true);
        }, 2000);
      } else if (response && response.status === 401) {
        setLoginStatus(401);
      } else {
        setLoginStatus(response.status || 500);
      }
    } catch (error) {
      setLoginStatus(500); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loginStatus === 200}>
          {!loading ?
            <Text style={styles.buttonText}>Entrar</Text>
            :
            <ActivityIndicator size="small" color="#fff" />
          }
        </TouchableOpacity>
        {(loginStatus === 200)
        ?
         <Text style={styles.success}>Autenticado com sucesso!</Text>
        : (loginStatus === 401) 
        ?
         <Text style={{marginTop: 20, color: 'red', textAlign: 'center'}}>Credenciais inválidas!</Text>
         : ''
        }
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  success: {
    marginTop: 20,
    color: '#4CAF50',
    textAlign: 'center',
  },
});
