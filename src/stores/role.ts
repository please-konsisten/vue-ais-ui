import { defineStore } from 'pinia'
import { computed, watch } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { useAuthStore } from './auth'

export interface accessTokenDecoded {
  sub: string; // user ID --> UUID
  roleId: string; // role ID --> UUID
  roleName: string; // roleName --> admin, student, and lecture
} 

export const useRoleStore = defineStore('role', () => {
  const authStore = useAuthStore()

  const roleName = computed(() => {
    if (!authStore.accessToken) return ''

    try {
      const decoded:accessTokenDecoded = jwtDecode(authStore.accessToken)
      return decoded.roleName || ''
    } catch (error) {
      console.error('Gagal decode token:', error)
      return ''
    }
  })

  watch(
    roleName,
    (newRoleName) => {
      console.log('Role Name berubah', newRoleName)
    }
  )

  return {
    roleName
  }
})
