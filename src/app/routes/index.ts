import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { studentRoutes } from './sub-routes/student'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/features/auth/pages/LoginPage.vue'),
      meta: {
        title: 'Masuk',
        requiresGuest: true,
      },
    },
    {
      path: '/',
      component: AppLayout,
      children: [...studentRoutes],
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresGuest) {
    if (!authStore.isAuthenticated) {
      await authStore.refreshAccessToken()
    }
    if (authStore.isAuthenticated) {
      return '/'
    }
    return true
  }

  if (to.meta.requiresAuth) {
    const isRefreshed = await authStore.refreshAccessToken()
    if (!isRefreshed) {
      return '/login'
    }
  }

  return true
})


export default router
