<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AdminContactCard from '../components/AdminContactCard.vue'
import { useAdminContact } from '../components/useAdminContact'

interface Topic {
  id: string
  label: string
  hint: string
  subject: string
  message: string
}

const { hasContact } = useAdminContact()

const topics: Topic[] = [
  {
    id: 'forgot-password',
    label: 'Lupa password',
    hint: 'Minta admin mengatur ulang password Anda.',
    subject: 'Permintaan reset password',
    message: [
      'Halo Admin, saya lupa password akun saya dan ingin meminta reset password.',
      '',
      'Username atau email akun: ',
      'Nama lengkap: ',
      '',
      'Terima kasih.',
    ].join('\n'),
  },
  {
    id: 'cannot-login',
    label: 'Tidak bisa masuk',
    hint: 'Akun terkunci, dinonaktifkan, atau muncul pesan error saat masuk.',
    subject: 'Kendala saat masuk ke akun',
    message: [
      'Halo Admin, saya tidak bisa masuk ke akun saya.',
      '',
      'Username atau email akun: ',
      'Pesan error yang muncul: ',
      '',
      'Mohon bantuannya. Terima kasih.',
    ].join('\n'),
  },
  {
    id: 'update-data',
    label: 'Ubah data akun',
    hint: 'Ganti nama, email, atau username.',
    subject: 'Permintaan perubahan data akun',
    message: [
      'Halo Admin, saya ingin mengubah data akun saya.',
      '',
      'Username atau email akun saat ini: ',
      'Data yang ingin diubah: ',
      'Data baru: ',
      '',
      'Terima kasih.',
    ].join('\n'),
  },
  {
    id: 'other',
    label: 'Kendala lain',
    hint: 'Ceritakan masalah Anda langsung ke admin.',
    subject: 'Bantuan terkait akun',
    message: [
      'Halo Admin, saya butuh bantuan terkait akun saya.',
      '',
      'Username atau email akun: ',
      'Kendala: ',
      '',
      'Terima kasih.',
    ].join('\n'),
  },
]

const selectedId = ref<string>('forgot-password')

const topic = computed<Topic>(
  () => topics.find((t) => t.id === selectedId.value) ?? (topics[0] as Topic),
)
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight text-foreground">Bantuan akun</h1>
      <p class="mt-2 text-sm text-muted-foreground">
        Semua perubahan akun dilakukan oleh admin. Pilih kendala Anda, pesannya sudah kami siapkan.
      </p>
    </div>

    <fieldset v-if="hasContact" class="mb-6">
      <legend class="mb-3 text-sm font-medium text-foreground">Apa kendala Anda?</legend>
      <div class="space-y-2.5">
        <label v-for="t in topics" :key="t.id" class="block cursor-pointer">
          <input
            v-model="selectedId"
            type="radio"
            name="topic"
            :value="t.id"
            class="peer sr-only"
          />
          <div
            class="rounded-lg border border-input bg-surface px-4 py-3 transition hover:border-primary/60 peer-checked:border-primary peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-ring/40"
          >
            <p class="text-sm font-medium text-foreground">{{ t.label }}</p>
            <p class="mt-0.5 text-xs text-muted-foreground">{{ t.hint }}</p>
          </div>
        </label>
      </div>
    </fieldset>

    <AdminContactCard :subject="topic.subject" :message="topic.message" />

    <p v-if="hasContact" class="mt-3 text-center text-xs text-muted-foreground">
      Pesan terisi otomatis. Anda tinggal melengkapi datanya sebelum mengirim.
    </p>

    <p class="mt-6 text-center text-sm text-muted-foreground">
      <RouterLink
        to="/login"
        class="font-medium text-accent-foreground underline-offset-4 hover:underline"
      >
        Kembali ke halaman masuk
      </RouterLink>
    </p>
  </div>
</template>