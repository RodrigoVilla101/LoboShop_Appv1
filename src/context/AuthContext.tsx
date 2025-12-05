import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, AuthContextType } from '../types/auth.types';
import { authService } from '../services/api';
import { storageService } from '../services/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cargar datos del usuario al iniciar la app
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = await storageService.get('token');
        const storedUser = await storageService.get('user');

        if (storedToken && storedUser) {
          // Verificar si el token sigue siendo válido
          const isValid = await authService.verifyToken(); // Esto podría fallar si el token es inválido, pero el interceptor lo manejará o el catch aquí

          if (isValid) {
            setToken(storedToken);
            setUser(typeof storedUser === 'string' ? JSON.parse(storedUser) : storedUser);
          } else {
            await logout();
          }
        }
      } catch (error) {
        console.error('Error inicializando auth:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);

      if (response.success && response.token && response.usuario) {
        // Guardar en Storage
        await storageService.set('token', response.token);
        await storageService.set('user', response.usuario);

        // Actualizar estado
        setToken(response.token);
        setUser(response.usuario);
      } else {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error de conexión');
    }
  };

  // Registro
  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);

      if (response.success && response.token && response.usuario) {
        // Guardar en Storage
        await storageService.set('token', response.token);
        await storageService.set('user', response.usuario);

        // Actualizar estado
        setToken(response.token);
        setUser(response.usuario);
      } else {
        throw new Error(response.message || 'Error al registrarse');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error de conexión');
    }
  };

  // Logout
  const logout = async () => {
    await storageService.remove('token');
    await storageService.remove('user');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
