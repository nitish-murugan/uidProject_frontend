import axios from 'axios';

const API_URL = 'https://uidproject-backend.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  getAllUsers: () => api.get('/auth/users'),
};

// Teams API
export const teamsAPI = {
  getAll: () => api.get('/teams'),
  getById: (id) => api.get(`/teams/${id}`),
  create: (teamData) => api.post('/teams', teamData),
  update: (id, teamData) => api.put(`/teams/${id}`, teamData),
  delete: (id) => api.delete(`/teams/${id}`),
  getStatistics: (id) => api.get(`/teams/${id}/statistics`),
};

// Players API
export const playersAPI = {
  getAll: (params) => api.get('/players', { params }),
  getById: (id) => api.get(`/players/${id}`),
  create: (playerData) => api.post('/players', playerData),
  update: (id, playerData) => api.put(`/players/${id}`, playerData),
  delete: (id) => api.delete(`/players/${id}`),
  updateStatistics: (id, stats) => api.put(`/players/${id}/statistics`, stats),
};

// Rosters API
export const rostersAPI = {
  getAll: (params) => api.get('/rosters', { params }),
  getById: (id) => api.get(`/rosters/${id}`),
  create: (rosterData) => api.post('/rosters', rosterData),
  update: (id, rosterData) => api.put(`/rosters/${id}`, rosterData),
  delete: (id) => api.delete(`/rosters/${id}`),
  addPlayer: (id, playerData) => api.post(`/rosters/${id}/players`, playerData),
  removePlayer: (id, playerId) => api.delete(`/rosters/${id}/players/${playerId}`),
};

// Games API
export const gamesAPI = {
  getAll: (params) => api.get('/games', { params }),
  getById: (id) => api.get(`/games/${id}`),
  create: (gameData) => api.post('/games', gameData),
  update: (id, gameData) => api.put(`/games/${id}`, gameData),
  delete: (id) => api.delete(`/games/${id}`),
  updateParticipation: (id, participationData) => api.put(`/games/${id}/participation`, participationData),
};

export default api;
