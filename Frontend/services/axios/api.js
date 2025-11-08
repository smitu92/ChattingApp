import axios from 'axios';
import { setupInterceptors } from './interceptors';
import { useAppStore } from '../../src/store/appStore';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_CHATAPP_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${useAppStore.getState().accessToken}`
  }
});

// Setup interceptors
setupInterceptors(apiClient);

export default apiClient;
