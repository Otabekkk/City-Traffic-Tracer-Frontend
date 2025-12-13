import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const trafficLightAPI = {
  getTrafficLights: () => api.get('/traffic-lights'),
  getTrafficLight: (tlId) => api.get(`/traffic-lights/${tlId}`),
  comparePhases: (tlId, phases) => 
    api.post(`/traffic-lights/${tlId}/compare`, { phases }),
};

export default api;