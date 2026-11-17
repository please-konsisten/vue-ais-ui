import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { studentRoutes } from './sub-routes/student'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/features/auth/pages/LoginPage.vue'),
      meta: { title: 'Masuk' },
    },
    {
      path: '/',
      component: AppLayout,
      children: [...studentRoutes],
    },
  ],
})

export default router