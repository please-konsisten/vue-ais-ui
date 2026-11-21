<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';
import InformationCard from '../components/InformationCard.vue';
import BadgeTabs from '../components/BadgeTabs.vue';

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

function getDataAxios(tab: RoleType) {
  axios.get(`/data-dummy/users/${tab}.json`)
    .then((response) => {
      usersBodyTable.value = response.data;
    })
    .catch((error) => {
      console.error('Gagal mengambil data:', error);
    });
}

watch(activeTab, (newTab) => {
  getDataAxios(newTab);
}, { immediate: true });
</script>

<template>
  <InformationCard />

  <BadgeTabs v-model="activeTab">
    <div class="w-full overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="flex flex-row items-center w-full border-b font-semibold">
            <th v-for="({ name, style }, index) in usersHeadTable" :key="index" :class="style">
              {{ name }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(user, index) in usersBodyTable"
            :key="user.id || index"
            class="flex flex-row items-center w-full border-b"
          >
            <td class="w-14 shrink-0 px-2 py-2">{{ index + 1 }}</td>
            <td class="w-36 shrink-0 px-2 py-2 truncate">{{ user.username }}</td>
            <td class="flex-1 min-w-[180px] px-2 py-2 truncate">{{ user.email }}</td>
            <td class="w-28 shrink-0 px-2 py-2">{{ user.status }}</td>
            <td class="w-28 shrink-0 px-2 py-2">{{ user.role }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </BadgeTabs>
</template>
