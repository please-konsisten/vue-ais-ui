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
          children: [ ],
        }
      ]
    }
  ],
})

let loadedRole = ''

function syncRoleRoutes(role: string) {
  /* Jika Role kosong atau loadedRole memiliki value yang sama Maka Kembali */
  if (!role || loadedRole === role) return

  // Hapus route role sebelumnya jika berganti akun tanpa refresh browser
  if (loadedRole === 'admin') {
    adminRoutes.forEach((r) => r.name && router.removeRoute(r.name))
  } else if (loadedRole === 'student') {
    studentRoutes.forEach((r) => r.name && router.removeRoute(r.name))
  }

  // Tambahkan route sesuai role baru
  if (role === 'admin') {
    adminRoutes.forEach((route) => router.addRoute('app-layout', route))
  } else if (role === 'student') {
    studentRoutes.forEach((route) => router.addRoute('app-layout', route))
  }

  loadedRole = role
}

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const roleStore = useRoleStore()

  /* Memastikan Telah memiliki Refresh Token */
  if (!authStore.isAuthenticated) {
    await authStore.refreshAccessToken()
  }

  if (authStore.isAuthenticated && roleStore.roleName && loadedRole !== roleStore.roleName) {
    syncRoleRoutes(roleStore.roleName)
    /** Ulang kembali ke  router.beforeEach()*/
    return to.fullPath
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

  return true
})

export default router
