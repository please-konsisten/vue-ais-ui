<!-- DashboardPage.vue -->
<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoleStore } from '@/stores/role'

const roleStore = useRoleStore()

const dashboards = {
  student: defineAsyncComponent(() => import('./pages/StudentDashboardPage.vue')),
  admin: defineAsyncComponent(() => import('./pages/AdminDashboardPage.vue')),
}

const current = computed(
  () => dashboards[roleStore.roleName as keyof typeof dashboards] ?? null,
)
</script>

<template>
  <component :is="current" v-if="current" />
</template>