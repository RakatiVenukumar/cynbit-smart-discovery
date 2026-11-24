import axios from 'axios'

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const API_BASE = RAW_API_URL.replace(/\/+$/, '')

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const api = {
  health: () => apiClient.get('/health'),
  recommend: (data) => apiClient.post('/recommend', data),
  submitInquiry: (data) => apiClient.post('/inquiries', data),

  // Admin endpoints
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getMe: () => apiClient.get('/auth/me'),
  getInquiries: (params) => apiClient.get('/inquiries', { params }),
  getInquiry: (id) => apiClient.get(`/inquiries/${id}`),
  updateInquiryStatus: (id, status) => apiClient.patch(`/inquiries/${id}`, { status }),
  getAnalytics: () => apiClient.get('/analytics'),
}
