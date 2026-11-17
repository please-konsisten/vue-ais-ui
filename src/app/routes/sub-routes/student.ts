export const studentRoutes = [
  {
    path: 'dashboard',
    name: 'dashboard',
    component: () => import('@/features/dashboard/pages/StudentDashboardPage.vue'),
    meta: { title: 'Dashboard' },
  }
];