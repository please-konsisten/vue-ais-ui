export const adminRoutes = [
  {
    path: 'dashboard',
    name: 'dashboard',
    component: () => import('@/features/dashboard/pages/AdminDashboardPage.vue'),
    meta: { title: 'Dashboard' },
  },
  {
    path: 'academic',
    name: 'academic',
    component: () => import('@/features/academic/pages/AdminAcademicPage.vue'),
    meta: { title: 'Academic' },
  },
];