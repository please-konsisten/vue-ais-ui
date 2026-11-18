import { createRouter, createWebHistory } from 'vue-router'
// Components
import App from '@/App.vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import AuthLayout from '@/components/layouts/AuthLayout.vue'
// Custome Stores
import { useAuthStore } from '@/stores/auth'
import { adminRoutes } from './sub-routes/admin'
import { studentRoutes } from './sub-routes/student'
import { useRoleStore } from '@/stores/role'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: App,
      children: [
        {
          path: '',
          component: AuthLayout,
          meta: {
            requiresGuest: true,
          },
          children: [
            {
              path: 'login',
              meta: { title: 'Login' },
              component: () => import('@/features/auth/pages/LoginPage.vue'),
            },
            {
              path: 'register',
              meta: { title: 'Register' },
              component: () => import('@/features/auth/pages/RegisterPage.vue'),
            },
            {
              path: 'account-helper',
              meta: { title: 'Account Helper' },
              component: () => import('@/features/auth/pages/AccountHelperPage.vue'),
            },
          ],
        },
        {
          path: '',
          name: 'app-layout',
          component: AppLayout,
          meta: { requiresAuth: true, title: 'App' },
          children: [
            {
              path: 'dashboard',
              meta: { roles: ['student', 'admin'], title: 'Dashboard' },
              component: () => import('@/features/dashboard/Page.vue'),
            }
          ],
        }
      ]
    }
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const roleStore = useRoleStore()

  if (!authStore.isAuthenticated) {
    await authStore.refreshAccessToken()
  }

  if (to.path === '/') {
    return authStore.isAuthenticated ? '/dashboard' : '/login'
  }

  if (to.meta.requiresGuest) {
    return authStore.isAuthenticated ? '/dashboard' : true
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }

  if (authStore.isAuthenticated && to.meta.role) {
    if (to.meta.role !== roleStore.roleName) {
      return '/dashboard'
    }
  }

  return true
})

export default router
