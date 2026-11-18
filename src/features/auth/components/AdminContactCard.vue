<script setup lang="ts">
import { useAdminContact } from './useAdminContact'

defineProps<{
  /** Subjek email */
  subject: string
  /** Isi pesan yang sudah terisi otomatis untuk WhatsApp dan email */
  message: string
}>()

const { hasWhatsApp, hasEmail, hasContact, displayPhone, displayEmail, whatsappLink, emailLink } =
  useAdminContact()
</script>

<template>
  <div v-if="hasContact" class="space-y-3">
    <a
      v-if="hasWhatsApp"
      :href="whatsappLink(message)"
      target="_blank"
      rel="noopener noreferrer"
      class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <svg
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21 11.5a8.4 8.4 0 01-12.4 7.4L3 21l2.2-5.4A8.4 8.4 0 1121 11.5z" />
      </svg>
      Hubungi lewat WhatsApp
    </a>

    <a
      v-if="hasEmail"
      :href="emailLink(subject, message)"
      class="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <svg
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
      Kirim email ke admin
    </a>

    <div class="space-y-0.5 pt-1 text-center text-xs text-muted-foreground">
      <p v-if="hasWhatsApp">WhatsApp: {{ displayPhone }}</p>
      <p v-if="hasEmail">Email: {{ displayEmail }}</p>
    </div>
  </div>

  <div
    v-else
    class="rounded-lg border border-dashed border-input bg-surface px-4 py-6 text-center"
    role="status"
  >
    <div
      class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground"
    >
      <svg
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M5.6 5.6l12.8 12.8" />
      </svg>
    </div>
    <p class="text-sm font-medium text-foreground">Tidak ada yang bisa dihubungi</p>
    <p class="mt-1 text-sm text-muted-foreground">
      Kontak admin belum diatur. Silakan temui admin secara langsung.
    </p>
  </div>
</template>