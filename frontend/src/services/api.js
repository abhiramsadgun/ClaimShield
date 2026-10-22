import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Automatically inject JWT Token into requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('claimshield_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/auth') && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('claimshield_token');
        localStorage.removeItem('claimshield_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.token) {
      localStorage.setItem('claimshield_token', response.data.token);
      localStorage.setItem('claimshield_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data?.token) {
      localStorage.setItem('claimshield_token', response.data.token);
      localStorage.setItem('claimshield_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('claimshield_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('claimshield_token');
    localStorage.removeItem('claimshield_user');
  }
};

export const claimService = {
  verify: async (payload) => {
    // payload can be a string or an object with text, imageUrl, imageForensics, extractedFromImage
    const body = typeof payload === 'string' ? { text: payload } : payload;
    const response = await api.post('/verify', body);
    return response.data;
  },

  extractImage: async (imageBase64, mimeType = 'image/jpeg', fileName = 'upload.jpg') => {
    const response = await api.post('/extract-image', {
      imageBase64,
      mimeType,
      fileName
    });
    return response.data;
  },

  getEngineStatus: async () => {
    const response = await api.get('/engine-status');
    return response.data;
  },

  updateApiKeys: async (keys) => {
    const response = await api.post('/keys/config', keys);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/history');
    return response.data;
  },

  deleteHistoryItem: async (id) => {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  },

  getRepoBank: async (params = {}) => {
    const response = await api.get('/repo-bank', { params });
    return response.data;
  },

  getRepoBankStats: async () => {
    const response = await api.get('/repo-bank/stats');
    return response.data;
  },

  seedRepoBank: async () => {
    const response = await api.post('/repo-bank/seed');
    return response.data;
  },

  deleteRepoBankItem: async (id) => {
    const response = await api.delete(`/repo-bank/${id}`);
    return response.data;
  }
};

export default api;
