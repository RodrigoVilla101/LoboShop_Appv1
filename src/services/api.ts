import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth.types';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // Cambiar en producción
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // Registro
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/registro', data);
    return response.data;
  },

  // Obtener perfil
  getProfile: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/auth/perfil');
    return response.data;
  },

  // Verificar token
  verifyToken: async (): Promise<boolean> => {
    try {
      await api.get('/auth/perfil');
      return true;
    } catch {
      return false;
    }
  },
};

export default api;
