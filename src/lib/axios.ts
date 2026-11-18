import axios from 'axios'
import { useAuthStore } from '@/stores/auth' // Sesuaikan dengan path file store Anda

/*---- Default API attributes ----*/
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API,
  withCredentials: true,
  headers: {
    'X-Client-Platform': 'web',
  },
})

/*---- Bearer Token ----*/
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore()

    /*---- Retry Apakah Terjadi kesalahan pada bagian Authorization(401) ----*/
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true

      const isRefreshed = await authStore.refreshAccessToken()
      if (isRefreshed && authStore.accessToken) {
        originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`
        return api(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)

export default api
