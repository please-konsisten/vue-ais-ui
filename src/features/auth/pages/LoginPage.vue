<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const errors = reactive({ email: '', password: '' })
const serverError = ref('')
const loading = ref(false)
const showPassword = ref(false)

function validate(): boolean {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email wajib diisi'
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Format email tidak valid'
  }

  if (!form.password) {
    errors.password = 'Password wajib diisi'
  } else if (form.password.length < 6) {
    errors.password = 'Password minimal 6 karakter'
  }

  return !errors.email && !errors.password
}

async function handleSubmit() {
  serverError.value = ''
  if (!validate()) return

  loading.value = true
  try {
    // TODO: ganti dengan request ke backend, misalnya:
    // const res = await fetch(`${import.meta.env.VITE_APP_API}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: form.email, password: form.password }),
    // })
    // if (!res.ok) throw new Error('Email atau password salah')
    await new Promise((resolve) => setTimeout(resolve, 800)) // simulasi

    // Setelah login berhasil, kembali ke halaman tujuan (kalau ada) atau dashboard
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    await router.push(redirect)
  } catch (e) {
    serverError.value = e instanceof Error ? e.message : 'Terjadi kesalahan, coba lagi'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-svh items-center justify-center px-4 py-10">
    <div class="w-full max-w-md">
      <!-- Logo / judul -->
      <div class="mb-8 text-center">
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white"
        >
          V
        </div>
        <h1 class="text-2xl font-semibold text-secondary">Masuk ke akun Anda</h1>
        <p class="mt-1 text-sm text-muted">Silakan masukkan email dan password.</p>
      </div>

      <form
        class="space-y-5 rounded-xl border border-border bg-surface p-6 shadow-sm"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <!-- Error dari server -->
        <p
          v-if="serverError"
          class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {{ serverError }}
        </p>

        <!-- Email -->
        <div>
          <label for="email" class="mb-1.5 block text-sm font-medium text-secondary">Email</label>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            placeholder="nama@email.com"
            class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            :class="errors.email ? 'border-red-400' : 'border-border'"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="mb-1.5 block text-sm font-medium text-secondary">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full rounded-md border bg-background px-3 py-2 pr-16 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              :class="errors.password ? 'border-red-400' : 'border-border'"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 px-3 text-xs font-medium text-muted hover:text-secondary"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Sembunyikan' : 'Tampilkan' }}
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
        </div>

        <!-- Ingat saya -->
        <label class="flex items-center gap-2 text-sm text-muted">
          <input
            v-model="form.remember"
            type="checkbox"
            class="h-4 w-4 rounded border-border accent-primary"
          />
          Ingat saya
        </label>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>
    </div>
  </div>
</template>