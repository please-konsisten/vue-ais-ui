<script setup lang="ts">
type Tone = 'good' | 'neutral' | 'warn'

interface Stat {
  label: string
  value: string
  note: string
  tone: Tone
  icon: string
  /** 0 sampai 100, opsional */
  progress?: number
}

interface Activity {
  id: number
  action: string
  course: string
  time: string
  status: 'Selesai' | 'Proses' | 'Terlambat'
}

// Data contoh: ganti dengan data dari API
const stats: Stat[] = [
  {
    label: 'IPK',
    value: '3,72',
    note: 'Naik 0,05 dari semester lalu',
    tone: 'good',
    icon: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  },
  {
    label: 'SKS ditempuh',
    value: '96 SKS',
    note: 'dari 144 SKS',
    tone: 'neutral',
    icon: 'M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2zM4 19a2 2 0 002 2h12',
    progress: 67,
  },
  {
    label: 'Mata kuliah aktif',
    value: '6',
    note: 'Semester ini',
    tone: 'neutral',
    icon: 'M3 8l9-5 9 5-9 5zM7 10.5V16c0 1.5 2.2 3 5 3s5-1.5 5-3v-5.5',
  },
  {
    label: 'Tugas terbuka',
    value: '4',
    note: '2 jatuh tempo minggu ini',
    tone: 'warn',
    icon: 'M9 11l2 2 4-4M5 4h14v16H5z',
  },
]

const activities: Activity[] = [
  { id: 1, action: 'Mengumpulkan tugas 3', course: 'Pemrograman Web', time: '5 menit lalu', status: 'Proses' },
  { id: 2, action: 'Mengisi presensi pertemuan 9', course: 'Basis Data', time: '1 jam lalu', status: 'Selesai' },
  { id: 3, action: 'Mengumpulkan laporan praktikum', course: 'Jaringan Komputer', time: 'Kemarin', status: 'Terlambat' },
  { id: 4, action: 'Mengunduh materi minggu 8', course: 'Kecerdasan Buatan', time: '2 hari lalu', status: 'Selesai' },
]

const toneClass: Record<Tone, string> = {
  good: 'text-accent-foreground dark:text-primary',
  neutral: 'text-muted-foreground',
  warn: 'text-destructive',
}

const statusClass: Record<Activity['status'], string> = {
  Selesai: 'bg-accent text-accent-foreground',
  Proses: 'bg-muted text-foreground',
  Terlambat: 'bg-destructive/10 text-destructive',
}
</script>

<template>
  <div class="space-y-8">
    <!-- Kartu statistik -->
    <section aria-label="Ringkasan" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-xl border border-border bg-surface p-5"
      >
        <div class="flex items-start justify-between gap-3">
          <p class="text-sm text-muted-foreground">{{ stat.label }}</p>
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground"
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
              <path :d="stat.icon" />
            </svg>
          </span>
        </div>

        <p class="mt-3 text-3xl font-semibold tracking-tight text-foreground">{{ stat.value }}</p>

        <div
          v-if="stat.progress !== undefined"
          class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          :aria-valuenow="stat.progress"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`${stat.label}: ${stat.progress}%`"
        >
          <div class="h-full rounded-full bg-primary" :style="{ width: `${stat.progress}%` }" />
        </div>

        <p class="mt-2 text-xs" :class="toneClass[stat.tone]">{{ stat.note }}</p>
      </article>
    </section>

    <!-- Aktivitas terbaru -->
    <section class="overflow-hidden rounded-xl border border-border bg-surface">
      <div class="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 class="font-semibold text-foreground">Aktivitas terbaru</h2>
      </div>

      <div v-if="activities.length" class="overflow-x-auto">
        <table class="w-full min-w-[36rem] text-left text-sm">
          <caption class="sr-only">
            Daftar aktivitas akademik terbaru
          </caption>
          <thead class="bg-muted/60 text-muted-foreground">
            <tr>
              <th scope="col" class="px-5 py-3 font-medium">Aktivitas</th>
              <th scope="col" class="px-5 py-3 font-medium">Mata kuliah</th>
              <th scope="col" class="px-5 py-3 font-medium">Waktu</th>
              <th scope="col" class="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="item in activities" :key="item.id" class="transition hover:bg-accent/40">
              <td class="px-5 py-3.5 font-medium text-foreground">{{ item.action }}</td>
              <td class="px-5 py-3.5 text-muted-foreground">{{ item.course }}</td>
              <td class="whitespace-nowrap px-5 py-3.5 text-muted-foreground">{{ item.time }}</td>
              <td class="px-5 py-3.5">
                <span
                  class="inline-block rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="statusClass[item.status]"
                >
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="px-5 py-10 text-center text-sm text-muted-foreground">
        Belum ada aktivitas. Aktivitas akademik Anda akan muncul di sini.
      </p>
    </section>
  </div>
</template>