<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';
import InformationCard from '../components/InformationCard.vue';
import BadgeTabs from '../components/BadgeTabs.vue';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import CreateAccountDialog from '../components/CreateAccountDialog.vue';

type RoleType = 'student' | 'lecture' | 'admin';

interface UserType {
  id: string;
  username: string;
  email: string;
  role: RoleType;
  status: 'active' | 'deactive';
}

const activeTab = ref<RoleType>('student');
const usersBodyTable = ref<UserType[]>([]);

const usersHeadTable = ref([
  { name: 'id', style: 'w-14 shrink-0 px-2 py-2' },
  { name: 'username', style: 'w-36 shrink-0 px-2 py-2 truncate' },
  { name: 'email', style: 'flex-1 min-w-[180px] px-2 py-2 truncate' },
  { name: 'status', style: 'w-28 shrink-0 px-2 py-2' },
  { name: 'role', style: 'w-28 shrink-0 px-2 py-2' },
]);

const isLoading = ref(false);

async function getDataAxios(tab: RoleType) {
  isLoading.value = true;
  try {
    const response = await axios.get(`/data-dummy/users/${tab}.json`);
    usersBodyTable.value = response.data;
  } catch (error) {
    console.error('Gagal mengambil data:', error);
    usersBodyTable.value = [];
  } finally {
    isLoading.value = false;
  }
}

watch(activeTab, (newTab) => {
  getDataAxios(newTab);
}, { immediate: true });
</script>

<template>
  <InformationCard />

  <BadgeTabs v-model="activeTab">
    <div class="flex flex-row justify-between">
      <div class="flex-1 max-w-96">
        <Input type="text" placeholder="Search"/>
      </div>
      <CreateAccountDialog />
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-for="({ name }, index) in usersHeadTable" :key="index">
            {{ name }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="isLoading">
          <TableCell :colspan="usersHeadTable.length" class="text-center py-6 text-muted-foreground">
            Memuat data...
          </TableCell>
        </TableRow>

        <TableRow v-else-if="usersBodyTable.length === 0">
          <TableCell :colspan="usersHeadTable.length" class="text-center py-6 text-muted-foreground">
            Tidak ada data user.
          </TableCell>
        </TableRow>

        <TableRow v-else v-for="(user, index) in usersBodyTable" :key="user.id || index">
          <TableCell>{{ index + 1 }}</TableCell>
          <TableCell>{{ user.username }}</TableCell>
          <TableCell>{{ user.email }}</TableCell>
          <TableCell>{{ user.status }}</TableCell>
          <TableCell>{{ user.role }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </BadgeTabs>
</template>
