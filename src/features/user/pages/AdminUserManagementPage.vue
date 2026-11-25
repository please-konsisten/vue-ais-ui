<script setup lang="ts">
import { ref, watch, markRaw } from 'vue';
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
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import Button from '@/components/ui/button/Button.vue';
import { FilterIcon, ImportIcon } from '@lucide/vue';
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuLabel from '@/components/ui/dropdown-menu/DropdownMenuLabel.vue';
import DropdownMenuSeparator from '@/components/ui/dropdown-menu/DropdownMenuSeparator.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';

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
  { name: '', component: markRaw(Checkbox) },
  { name: 'id' },
  { name: 'username' },
  { name: 'email' },
  { name: 'status' },
  { name: 'role' },
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
  <div class="flex flex-col gap-4 sm:gap-6 w-full min-w-0">
    <InformationCard />

    <!-- Tabs { Student, Lecture, Admin } -->
    <BadgeTabs v-model="activeTab" class="flex flex-col gap-3 sm:gap-4 w-full min-w-0">
      <!-- Filter -->
      <div class="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mb-2 sm:mb-4">
        <div class="w-full sm:flex-1 sm:max-w-96">
          <Input type="text" placeholder="Search" class="w-full" />
        </div>
        <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
          <DropdownMenu :modal="false">
            <DropdownMenuTrigger as-child>
              <Button variant="outline" class="flex-1 sm:flex-initial">
                Filter
                <FilterIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" class="flex-1 sm:flex-initial">
            Import
            <ImportIcon />
          </Button>

          <CreateAccountDialog />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-for="({ name, component }, index) in usersHeadTable" :key="index">
              <component :is="component" v-if="component" />
              <template v-else>{{ name }}</template>
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
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>{{ index + 1 }}</TableCell>
            <TableCell>{{ user.username }}</TableCell>
            <TableCell>{{ user.email }}</TableCell>
            <TableCell>{{ user.status }}</TableCell>
            <TableCell>{{ user.role }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </BadgeTabs>
  </div>
</template>
