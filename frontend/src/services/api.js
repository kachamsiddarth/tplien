import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHoldings = async () => {
  const response = await apiClient.get('/allHoldings');
  return response.data;
};

export const getPositions = async () => {
  const response = await apiClient.get('/allPositions');
  return response.data;
};

export const getStockDetails = async (symbol) => {
  const response = await apiClient.get(`/api/stocks/${symbol}`);
  return response.data;
};

export const getTrending = async () => {
  const response = await apiClient.get('/api/trending');
  return response.data;
};

export const getOrders = async () => {
  const response = await apiClient.get('/allOrders');
  return response.data;
};

export const placeOrder = async (orderData) => {
  const response = await apiClient.post('/allOrders', orderData);
  return response.data;
};

export const askAI = async (query) => {
  const response = await apiClient.post('/api/ai', { query });
  return response.data;
};

export default apiClient;
