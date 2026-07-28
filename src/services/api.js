import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data;
};

export const getProduct = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get('/products/categories');
  return data;
};

export const createCheckout = async (checkoutData) => {
  const { data } = await api.post('/checkout', checkoutData);
  return data;
};

export default api;