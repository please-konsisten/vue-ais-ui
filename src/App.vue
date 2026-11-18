<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useRoleStore } from './stores/role'
import { useThemeStore } from './stores/theme'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

useRoleStore()
useThemeStore()

watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (isAuth && (route.path === '/' || route.meta.requiresGuest)) {
      router.push("/dashboard")
    } else if (!isAuth && (route.path === '/' || route.meta.requiresAuth)) {
      router.push("/login")
    }
  }
)
</script>

<template>
  <RouterView />
</template>
