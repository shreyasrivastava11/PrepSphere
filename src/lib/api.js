import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
let authToken = null;

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token) {
  authToken = token || null;
}

export async function apiRequest(path, options = {}) {
  try {
    const res = await apiClient.request({
      url: path,
      method: options.method || 'GET',
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(options.headers || {}),
      },
      data: options.data ?? options.body,
      params: options.params,
    });
    return res.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Backend may be waking up on Render, please try again in a few seconds.');
    }
    if (!error.response) {
      throw new Error(`Cannot reach backend at ${API_BASE}. Start backend server and check CORS/port.`);
    }
    const message = error.response?.data?.message || `Request failed with status ${error.response.status}`;
    throw new Error(message);
  }
}

export function getApiBase() {
  return API_BASE;
}

export function warmUpBackend() {
  // Fire-and-forget call to reduce first-action latency on cold starts.
  apiClient.get('/api/health').catch(() => {});
}
