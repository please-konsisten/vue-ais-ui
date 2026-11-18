<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from 'axios'
import { RouterLink, useRouter } from 'vue-router'
import z from 'zod'
import { loginSchema } from '../schemas/login.schema'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  identifier: '',
  password: '',
  remember: false,
})

const errors = reactive({ identifier: '', password: '' })
const serverError = ref('')
const loading = ref(false)
const showPassword = ref(false)

async function handleSubmit() {
  serverError.value = ''
  errors.identifier = ''
  errors.password = ''

  const result = loginSchema.safeParse({
    identifier: form.identifier,
    password: form.password,
  })

  if (!result.success) {
    const fieldErrors = z.treeifyError(result.error)
    errors.identifier = fieldErrors.properties?.identifier?.errors?.[0] ?? ''
    errors.password = fieldErrors.properties?.password?.errors?.[0] ?? ''
    return
  }

  loading.value = true
  try {
    const response = await authStore.login(result.data)
    if (response.status === 200) {
      router.push('/dashboard')
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      serverError.value = e.response?.data?.message || 'Login gagal, periksa kredensial Anda'
    } else {
      serverError.value = e instanceof Error ? e.message : 'Terjadi kesalahan, coba lagi'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight text-foreground">Masuk ke akun Anda</h1>
      <p class="mt-2 text-sm text-muted-foreground">Silakan masukkan username atau email, lalu password.</p>
    </div>

    <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
      <!-- Error dari server -->
      <div
        v-if="serverError"
        class="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive"
        role="alert"
      >
        <svg
          class="mt-0.5 h-4 w-4 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ serverError }}</span>
      </div>

      <!-- Username / email -->
      <div>
        <label for="identifier" class="mb-1.5 block text-sm font-medium text-foreground">
          Username atau email
        </label>
        <div class="relative">
          <span
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z"
              />
            </svg>
          </span>
          <input
            id="identifier"
            v-model.trim="form.identifier"
            type="text"
            autocomplete="username"
            placeholder="nama@email.com"
            class="w-full rounded-lg border bg-surface py-2.5 placeholder:text-muted-foreground/60 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            :class="errors.identifier ? 'border-destructive' : 'border-input'"
            :aria-invalid="!!errors.identifier"
            :aria-describedby="errors.identifier ? 'identifier-error' : undefined"
          />
        </div>
        <p v-if="errors.identifier" id="identifier-error" class="mt-1.5 text-xs text-destructive">
          {{ errors.identifier }}
        </p>
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="mb-1.5 block text-sm font-medium text-foreground">
          Password
        </label>
        <div class="relative">
          <span
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full rounded-lg border bg-surface py-2.5 placeholder:text-muted-foreground/60 pl-10 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            :class="errors.password ? 'border-destructive' : 'border-input'"
            :aria-invalid="!!errors.password"
            :aria-describedby="errors.password ? 'password-error' : undefined"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3.5 text-muted-foreground transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
            :aria-pressed="showPassword"
            @click="showPassword = !showPassword"
          >
            <!-- Mata terbuka -->
            <svg
              v-if="!showPassword"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
              <path
                fill-rule="evenodd"
                d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clip-rule="evenodd"
              />
            </svg>
            <!-- Mata tercoret -->
            <svg v-else class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
                clip-rule="evenodd"
              />
              <path
                d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z"
              />
            </svg>
          </button>
        </div>
        <p v-if="errors.password" id="password-error" class="mt-1.5 text-xs text-destructive">
          {{ errors.password }}
        </p>
      </div>

      <!-- Ingat saya + bantuan akun -->
      <div class="flex items-center justify-between gap-3 text-sm">
        <label class="flex cursor-pointer items-center gap-2.5 text-muted-foreground">
          <input
            v-model="form.remember"
            type="checkbox"
            class="h-4 w-4 rounded border-input accent-primary"
          />
          Ingat saya
        </label>
        <div>
          <span class="text-xs text-muted-foreground">
            Akun Bermasalah? 
          </span>
          <RouterLink
            to="/account-helper"
            class="font-medium text-accent-foreground underline-offset-4 hover:underline text-xs"
          >
            Click Disini
          </RouterLink>
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          v-if="loading"
          class="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" class="opacity-75" />
        </svg>
        {{ loading ? 'Memproses...' : 'Masuk' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-muted-foreground">
      Belum punya akun?
      <RouterLink
        to="/register"
        class="font-medium text-accent-foreground underline-offset-4 hover:underline"
      >
        Hubungi admin
      </RouterLink>
    </p>
  </div>
</template>