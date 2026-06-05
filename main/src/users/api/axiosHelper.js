import axios from 'axios'
import useUserAuthStore from '../store/authStore.js'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = useUserAuthStore.getState().token
    if (token) config.headers.Authorization = `${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRoute = error.config?.url?.includes('/auth/')
      if (!isAuthRoute) {
        useUserAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api