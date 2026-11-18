<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()

const appName = 'V'
const year = new Date().getFullYear()

// Teks panel kiri bisa diatur per halaman lewat route meta, dengan nilai bawaan
const headline = computed(
  () => (route.meta.headline as string) ?? 'Semua urusan Anda, dalam satu akun',
)
const description = computed(
  () =>
    (route.meta.description as string) ??
    'Masuk untuk melanjutkan ke dashboard dan melihat data terbaru.',
)
</script>

<template>
  <div class="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
    <!-- Panel brand: biru tua Vue + aksen hijau (hanya tampil di layar besar) -->
    <aside
      class="relative hidden overflow-hidden bg-secondary text-secondary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12"
    >
      <!-- Pola grid halus -->
      <div class="auth-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <!-- Cahaya hijau lembut + lingkaran dekoratif -->
      <div
        class="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full border border-primary/40"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -bottom-10 -right-10 h-52 w-52 rounded-full border border-primary/40"
        aria-hidden="true"
      />

      <div class="relative flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-primary/30"
        >
          {{ appName.charAt(0) }}
        </div>
        <span class="text-lg font-semibold">{{ appName }}</span>
      </div>

      <div class="relative max-w-md">
        <div class="mb-6 h-1 w-12 rounded-full bg-primary" aria-hidden="true" />
        <h2 class="text-4xl font-semibold leading-tight tracking-tight">{{ headline }}</h2>
        <p class="mt-4 text-base leading-relaxed text-secondary-foreground/75">{{ description }}</p>
      </div>

      <p class="relative text-sm text-secondary-foreground/55">&copy; {{ year }} {{ appName }}</p>
    </aside>

    <!-- Area halaman (diisi oleh route anak) -->
    <main class="flex items-center justify-center px-4 py-10 sm:px-8">
      <div class="w-full max-w-md">
        <!-- Logo versi mobile -->
        <div class="mb-8 flex items-center justify-center gap-3 lg:hidden">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground"
          >
            {{ appName.charAt(0) }}
          </div>
          <span class="text-lg font-semibold text-foreground">{{ appName }}</span>
        </div>

        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth-grid {
  background-image:
    linear-gradient(to right, rgb(255 255 255 / 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(255 255 255 / 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom right, black 20%, transparent 85%);
}
</style>