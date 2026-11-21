import { createRouter, createWebHistory } from 'vue-router'
// Components
import App from '@/App.vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import AuthLayout from '@/components/layouts/AuthLayout.vue'
// Custome Stores
import { useAuthStore } from '@/stores/auth'
import { useRoleStore } from '@/stores/role'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    requiresGuest?: boolean
    role?: 'admin' | 'student' | 'lecture'
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: App,
      children: [
        {
          /**
           * Auth/Guest Only Routes
           */
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
          /**
           * Student Roles Routes
           */
          path: '',
          name: 'student-layout',
          component: AppLayout,
          meta: { requiresAuth: true, role: 'student', title: 'App' },
          children: [
            {
              path: 'dashboard',
              meta: { title: 'Dashboard' },
              component: () => import('@/features/dashboard/pages/StudentDashboardPage.vue'),
            },
          ],
        },
        {
          /**
           * Admin Roles Routes
           */
          path: 'admin',
          name: 'admin-layout',
          component: AppLayout,
          meta: { requiresAuth: true, role: 'admin', title: 'App' },
          children: [
            {
              path: 'dashboard',
              meta: { title: 'Dashboard' },
              component: () => import('@/features/dashboard/pages/AdminDashboardPage.vue'),
            },
            {
              path: 'users',
              meta: { title: 'User Management' },
              component: () => import('@/features/user/pages/AdminUserManagementPage.vue'),
            },
          ],
        },
        {
          /**
           * Lecture Roles Routes
           */
          path: 'lecture',
          name: 'lecture-layout',
          component: AppLayout,
          meta: { requiresAuth: true, role: 'lecture', title: 'App' },
          children: [
            {
              path: 'dashboard',
              meta: { title: 'Dashboard' },
              component: () => import('@/features/dashboard/pages/LectureDashboardPage.vue'),
            },
          ],
        },
        {
          /**
           * Error Not Found Page
           */
          path: '/:pathMatch(.*)*',
          name: 'not-found',
          component: () => import('@/features/error/pages/NotFoundPage.vue'),
        },
      ]
    }
  ],
})

const NO_ACCESS_PATH = '/403'

function getDefaultPath(role: string | null | undefined) {
  switch (role) {
    case "admin":
      return "/admin/dashboard"
    case "student":
      return "/dashboard"
    case "lecture":
      return "/lecture/dashboard"

    default:
      return NO_ACCESS_PATH
  }
}

let authInitPromise: Promise<void> | null = null

async function tryRefresh(authStore: ReturnType<typeof useAuthStore>): Promise<boolean> {
  try {
    await authStore.refreshAccessToken()
    return true
  } catch (error: any) {
    const status = error?.response?.status
    if (status === 401 || status === 403) return true

    console.error('[auth] refresh gagal tak terduga:', error?.message ?? error)
    return false
  }
}

const initAuth = (authStore: ReturnType<typeof useAuthStore>) => {
  if (!authInitPromise) {
    authInitPromise = tryRefresh(authStore).then((settled) => {
      if (!settled) authInitPromise = null
    })
  }
  return authInitPromise
}

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const roleStore = useRoleStore()

  if (!authStore.isAuthenticated) {
    await initAuth(authStore)
  }

  const isAuth = authStore.isAuthenticated
  const homePath = getDefaultPath(roleStore.roleName)

  if (to.path === '/') {
    return isAuth ? homePath : '/login'
  }

  if (to.meta.requiresGuest) {
    return isAuth ? homePath : true
  }

  if (to.matched.some((r) => r.meta.requiresAuth)) {
    if (!isAuth) {
      return '/login'
    }

    const requiredRole = to.matched.find((r) => r.meta.role)?.meta.role

    if (!requiredRole || requiredRole !== roleStore.roleName) {
      return homePath
    }
  }

  return true
})

export default router