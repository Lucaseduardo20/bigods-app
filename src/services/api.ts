import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
  baseURL: 'http://192.168.15.28:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});