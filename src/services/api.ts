import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth.types';
import { Product, ProductFilters, ProductsResponse, Category } from '../types/product.types';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 30000, // 30 segundos para permitir carga de imágenes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
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
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/registro', data);
    return response.data;
  },

  getProfile: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/auth/perfil');
    return response.data;
  },

  verifyToken: async (): Promise<boolean> => {
    try {
      await api.get('/auth/perfil');
      return true;
    } catch {
      return false;
    }
  },
};

// Servicios de categorías
export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categorias');
    return response.data.categorias;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categorias/${id}`);
    return response.data.categoria;
  },
};

// Servicios de productos
export const productService = {
  // Obtener productos con filtros
  getAll: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const response = await api.get('/productos', { params: filters });
    return response.data;
  },

  // Obtener un producto por ID
  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/productos/${id}`);
    return response.data.producto;
  },

  // Obtener mis productos
  getMyProducts: async (): Promise<Product[]> => {
    const response = await api.get('/productos/usuario/mis-productos');
    return response.data.productos;
  },

  // Crear producto con imágenes
  create: async (formData: FormData): Promise<Product> => {
    const response = await api.post('/productos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.producto;
  },

  // Actualizar producto
  update: async (id: string, formData: FormData): Promise<Product> => {
    const response = await api.put(`/productos/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.producto;
  },

  // Eliminar producto
  delete: async (id: string): Promise<void> => {
    await api.delete(`/productos/${id}`);
  },

  // Eliminar imagen específica
  deleteImage: async (productId: string, imageId: string): Promise<void> => {
    await api.delete(`/productos/${productId}/imagenes/${imageId}`);
  },
};

export default api;

