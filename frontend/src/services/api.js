import axios from 'axios';

const API_BASE_URL = 'https://psychic-giggle-r6vvjjvwrp62pv6-8000.app.github.dev/api';

// إنشاء instance من axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// إضافة interceptor للتوكن
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// إضافة interceptor للاستجابة
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// خدمات المصادقة
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    return response.data;
  },
  
  me: async () => {
    const response = await api.get('/me');
    return response.data;
  }
};

// خدمات مدير النظام
export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  }
};

// خدمات رئيس قلم التوثيق
export const notaryHeadService = {
  getDashboard: async () => {
    const response = await api.get('/notary-head/dashboard');
    return response.data;
  },
  
  getNotaries: async (page = 1) => {
    const response = await api.get(`/notary-head/notaries?page=${page}`);
    return response.data;
  },
  
  createNotary: async (notaryData) => {
    const response = await api.post('/notary-head/notaries', notaryData);
    return response.data;
  },
  
  updateNotary: async (id, notaryData) => {
    const response = await api.put(`/notary-head/notaries/${id}`, notaryData);
    return response.data;
  },
  
  getPerformanceReport: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/notary-head/performance-report?${params}`);
    return response.data;
  }
};

export default api;

