import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios' // Import instance api dari Urutan 1

export const useAuthStore = defineStore('auth', () => {
  // State disimpan murni di memory
  const accessToken = ref<string | null>(null)
  const user = ref<any>(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  async function login(payload: { identifier: string; password: string }) {
    try {
      const response = await api.post('/auth/login', payload)
      // Sesuaikan dengan struktur JSON backend Anda (response.data.data)
      accessToken.value = response.data.data.accessToken
      user.value = response.data.data.user
      return response
    } catch (error) {
      console.error('Login gagal:', error)
      throw error
    }
  }

  async function refreshAccessToken() {
    try {
      // Gunakan `api` (bukan `axios`) agar baseURL dan withCredentials: true ikut terbawa
      const response = await api.post('/auth/refresh-token')
      // Pastikan struktur response.data.data sama dengan endpoint login
      accessToken.value = response.data.data.accessToken
      user.value = response.data.data.user
      return true
    } catch (error) {
      accessToken.value = null
      user.value = null
      return false
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout') // Sesuaikan prefix endpoint logout backend Anda
    } finally {
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
    logout,
  }
})
