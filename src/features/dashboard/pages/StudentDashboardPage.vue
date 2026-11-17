<script setup lang="ts">
interface Stat {
  label: string
  value: string
  note: string
}

interface Activity {
  id: number
  user: string
  action: string
  time: string
  status: 'Selesai' | 'Proses' | 'Gagal'
}

// Data contoh: ganti dengan data dari API
const stats: Stat[] = [
  { label: 'Total Pengguna', value: '1.248', note: '+12% bulan ini' },
  { label: 'Pesanan Baru', value: '86', note: '+4% minggu ini' },
  { label: 'Pendapatan', value: 'Rp 24,5 jt', note: '+8% bulan ini' },
  { label: 'Tiket Terbuka', value: '17', note: '-3 dari kemarin' },
]

const activities: Activity[] = [
  { id: 1, user: 'Andi Pratama', action: 'Membuat pesanan #1024', time: '5 menit lalu', status: 'Proses' },
  { id: 2, user: 'Siti Rahma', action: 'Memperbarui profil', time: '20 menit lalu', status: 'Selesai' },
  { id: 3, user: 'Budi Santoso', action: 'Pembayaran #1021', time: '1 jam lalu', status: 'Gagal' },
  { id: 4, user: 'Dewi Lestari', action: 'Mengirim tiket bantuan', time: '3 jam lalu', status: 'Selesai' },
]

const statusClass: Record<Activity['status'], string> = {
  Selesai: 'bg-primary-soft text-primary-hover',
  Proses: 'bg-amber-100 text-amber-700',
  Gagal: 'bg-red-100 text-red-700',
}
</script>

<template>
  <div class="space-y-6">
    <!-- Kartu statistik -->
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-xl border border-border bg-surface p-5"
      >
        <p class="text-sm text-muted">{{ stat.label }}</p>
        <p class="mt-2 text-2xl font-semibold text-secondary">{{ stat.value }}</p>
        <p class="mt-1 text-xs text-primary-hover">{{ stat.note }}</p>
      </div>
    </section>

    <!-- Aktivitas terbaru -->
    <section class="rounded-xl border border-border bg-surface">
      <div class="border-b border-border px-5 py-4">
        <h2 class="font-semibold text-secondary">Aktivitas Terbaru</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-background text-muted">
            <tr>
              <th class="px-5 py-3 font-medium">Pengguna</th>
              <th class="px-5 py-3 font-medium">Aktivitas</th>
              <th class="px-5 py-3 font-medium">Waktu</th>
              <th class="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in activities"
              :key="item.id"
              class="border-t border-border"
            >
              <td class="px-5 py-3 font-medium text-secondary">{{ item.user }}</td>
              <td class="px-5 py-3">{{ item.action }}</td>
              <td class="px-5 py-3 text-muted">{{ item.time }}</td>
              <td class="px-5 py-3">
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="statusClass[item.status]"
                >
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>