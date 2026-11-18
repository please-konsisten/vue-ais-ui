<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

useThemeStore()

const route = useRoute()
const sidebarOpen = ref(false)

const menu = [
  { label: 'Beranda', to: '/', icon: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10' },
  { label: 'Dashboard', to: '/dashboard', icon: 'M4 4h7v9H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 15h7v5H4z' },
  { label: 'Tentang', to: '/about', icon: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v5M12 8h.01' },
]

const pageTitle = computed(() => String(route.meta.title ?? 'Aplikasi'))
</script>

<template>
  <div class="min-h-svh bg-background md:flex" @keydown.esc="sidebarOpen = false">
    <!-- Overlay (mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/40 md:hidden"
      aria-hidden="true"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col bg-sidebar text-sidebar-foreground transition-transform md:sticky md:top-0 md:h-svh md:shrink-0 md:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-base font-bold text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30"
        >
          V
        </div>
        <span class="text-base font-semibold">Vue App</span>
      </div>

      <nav class="flex-1 space-y-1 px-3 py-4" aria-label="Menu utama">
        <RouterLink
          v-for="item in menu"
          :key="item.to"
          v-slot="{ href, navigate, isActive, isExactActive }"
          :to="item.to"
          custom
        >
          <a
            :href="href"
            class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-primary"
            :class="
              (item.to === '/' ? isExactActive : isActive)
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
            "
            :aria-current="(item.to === '/' ? isExactActive : isActive) ? 'page' : undefined"
            @click="
              (e: MouseEvent) => {
                navigate(e)
                sidebarOpen = false
              }
            "
          >
            <svg
              class="h-5 w-5 shrink-0 transition"
              :class="
                (item.to === '/' ? isExactActive : isActive)
                  ? 'text-sidebar-primary'
                  : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80'
              "
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path :d="item.icon" />
            </svg>
            {{ item.label }}
          </a>
        </RouterLink>
      </nav>
    </aside>

    <!-- Konten -->
    <div class="flex min-w-0 flex-1 flex-col">
      <header
        class="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur md:px-8"
      >
        <button
          type="button"
          class="-ml-2 rounded-lg p-2 text-foreground transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring md:hidden"
          aria-label="Buka menu"
          :aria-expanded="sidebarOpen"
          @click="sidebarOpen = true"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold tracking-tight text-foreground">{{ pageTitle }}</h1>
      </header>

      <main class="flex-1 px-4 py-6 md:px-8 md:py-8">
        <div class="mx-auto w-full max-w-6xl">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>