<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AdminContactCard from '../components/AdminContactCard.vue'

const subject = 'Permintaan pembuatan akun'

const message = [
  'Halo Admin, saya ingin dibuatkan akun.',
  '',
  'Nama lengkap: ',
  'Email aktif: ',
  'Nomor identitas (jika ada): ',
  '',
  'Terima kasih.',
].join('\n')

const requirements = ['Nama lengkap', 'Email aktif', 'Nomor identitas, jika diminta admin']
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight text-foreground">Daftar akun</h1>
      <p class="mt-2 text-sm text-muted-foreground">
        Akun dibuat oleh admin. Hubungi admin dan kirim data Anda, lalu akun akan disiapkan.
      </p>
    </div>

    <div class="mb-6 rounded-lg border border-border bg-surface p-4">
      <p class="mb-3 text-sm font-medium text-foreground">Siapkan data berikut</p>
      <ul class="space-y-2.5">
        <li
          v-for="item in requirements"
          :key="item"
          class="flex items-center gap-2.5 text-sm text-muted-foreground"
        >
          <span
            class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
          >
            <svg
              class="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          {{ item }}
        </li>
      </ul>
    </div>

    <AdminContactCard :subject="subject" :message="message" />

    <p class="mt-6 text-center text-sm text-muted-foreground">
      Sudah punya akun?
      <RouterLink
        to="/login"
        class="font-medium text-accent-foreground underline-offset-4 hover:underline"
      >
        Masuk
      </RouterLink>
    </p>
  </div>
</template>