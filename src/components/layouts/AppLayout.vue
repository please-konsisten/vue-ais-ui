<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sidebarOpen = ref(false)

const menu = [
  { label: 'Beranda', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Tentang', to: '/about' },
]

const pageTitle = computed(() => String(route.meta.title ?? 'Aplikasi'))
</script>

<template>
  <div class="min-h-svh md:flex">
    <!-- Overlay (mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/40 md:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-40 w-64 transform bg-secondary text-white transition-transform md:static md:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-16 items-center gap-2 px-6 text-lg font-semibold">
        <span class="inline-block h-3 w-3 rounded-full bg-primary" />
        Vue App
      </div>

      <nav class="space-y-1 px-3 py-4">
        <RouterLink
          v-for="item in menu"
          :key="item.to"
          :to="item.to"
          class="block rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
          active-class="!bg-primary !text-white"
          exact-active-class="!bg-primary !text-white"
          @click="sidebarOpen = false"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>

    <!-- Konten -->
    <div class="flex min-w-0 flex-1 flex-col">
      <header
        class="flex h-16 items-center gap-3 border-b border-border bg-surface px-4 md:px-6"
      >
        <button
          type="button"
          class="rounded-md p-2 text-secondary hover:bg-primary-soft md:hidden"
          aria-label="Buka menu"
          @click="sidebarOpen = true"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold text-secondary">{{ pageTitle }}</h1>
      </header>

      <main class="flex-1 p-4 md:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>