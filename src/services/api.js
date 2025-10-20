import axios from 'axios';

const API_BASE_URL = 'https://sgdown.vigix.ir/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (username, email, password) =>
    apiClient.post('/auth/register', { username, email, password }),
  
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  
  getCurrentUser: () =>
    apiClient.get('/auth/me')
};

export const todoService = {
  getTodos: () =>
    apiClient.get('/todos'),
  
  createTodo: (todoData) =>
    apiClient.post('/todos', todoData),
  
  updateTodo: (id, updates) =>
    apiClient.put(`/todos/${id}`, updates),
  
  deleteTodo: (id) =>
    apiClient.delete(`/todos/${id}`),
  
  toggleTodo: (id) =>
    apiClient.patch(`/todos/${id}/toggle`)
};

export default apiClient;
