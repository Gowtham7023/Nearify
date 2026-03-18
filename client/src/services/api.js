import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const getPlaces = async (params) => {
  const { data } = await api.get('/places', { params });
  return data;
};

export const geocodeAddress = async (address) => {
  const { data } = await api.get('/geocode', { params: { address } });
  return data;
};
