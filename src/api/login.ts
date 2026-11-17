// // src/api.ts
// import axios from 'axios'
// import { useAuthStore } from '@/stores/auth'

// const api = axios.create({
//   baseURL: import.meta.env.VITE_APP_API,
//   withCredentials: true, 
// })

// api.interceptors.request.use((config) => {
//   const auth = useAuthStore()
//   if (auth.accessToken) {
//     config.headers.Authorization = `Bearer ${auth.accessToken}`
//   }
//   return config
// })

// export default api


import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import axios from 'axios'


const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API,
  withCredentials: true, 
})

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  watch(accessToken, (newToken) => {
    if (newToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  })

  async function login(payload: {identifier:any, password:any}) {
    const { identifier, password } = payload
    try {
      const response = await api.post('/auth/login', {identifier, password})
      accessToken.value = response.data.data.accessToken
      user.value = response.data.data.user
      console.log(user.value)
    } catch (error) {
      console.error('Login gagal:', error)
      throw error
    }
  }

  async function refreshAccessToken() {
    try {
      const response = await axios.post('/auth/refresh-token')
      accessToken.value = response.data.accessToken
      user.value = response.data.user
      return true
    } catch (error) {
      // Jika refresh token juga expired atau tidak ada, pastikan state bersih
      accessToken.value = null
      user.value = null
      return false
    }
  }

  async function logout() {
    try {
      await axios.post('/api/logout') // Minta backend menghapus HttpOnly Cookie
    } finally {
      // Hapus token dari memory
      accessToken.value = null
      user.value = null
    }
  }

  return {
    accessToken,
    user,
    isAuthenticated,
    login,
    refreshAccessToken,
    logout
  }
})
