<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoleStore } from '@/stores/role'

const roleStore = useRoleStore()

const AdminDashboardPage = defineAsyncComponent(() => import('./AdminDashboardPage.vue'))
const StudentDashboardPage = defineAsyncComponent(() => import('./StudentDashboardPage.vue'))
// const LectureDashboardPage = defineAsyncComponent(() => import('./LectureDashboardPage.vue'))

const currentDashboardComponent = computed(() => {
  switch (roleStore.roleName) {
    case 'admin':
      return AdminDashboardPage
    case 'student':
      return StudentDashboardPage
    // case 'lecture':
    //   return LectureDashboardPage
    default:
      return null
  }
})
</script>

<template>
  <component :is="currentDashboardComponent" v-if="currentDashboardComponent" />
  <div v-else>
    Memuat dashboard...
  </div>
</template>
