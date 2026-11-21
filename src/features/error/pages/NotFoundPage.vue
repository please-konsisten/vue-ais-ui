<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// /403 dipakai router untuk user login dengan role yang tidak dikenali
const isForbidden = computed(() => route.path === '/403')

const code = computed(() => (isForbidden.value ? '403' : '404'))
const title = computed(() => (isForbidden.value ? 'Akses ditolak' : 'Halaman tidak ditemukan'))
const description = computed(() =>
  isForbidden.value
    ? 'Akun kamu belum memiliki akses ke halaman ini. Coba login kembali atau hubungi admin.'
    : 'Alamat yang kamu buka tidak ada atau sudah dipindahkan. Periksa kembali URL-nya.',
)

// Kalau tidak ada riwayat (misalnya halaman dibuka langsung), router.back() tidak berguna,
// jadi arahkan ke '/' dan biarkan guard menentukan tujuan sesuai role.
const goBack = () => {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <main class="flex min-h-svh items-center justify-center bg-background px-4">
    <div class="w-full max-w-md text-center">
      <p class="text-7xl font-bold tracking-tight text-primary" aria-hidden="true">{{ code }}</p>

      <h1 class="mt-4 text-2xl font-semibold tracking-tight text-foreground">{{ title }}</h1>
      <p class="mt-2 text-sm text-foreground/70">{{ description }}</p>

      <div class="mt-8 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          class="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring sm:w-auto"
          @click="goBack"
        >
          Kembali
        </button>
        <RouterLink
          to="/"
          class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-ring sm:w-auto"
        >
          Ke beranda
        </RouterLink>
      </div>
    </div>
  </main>
</template>