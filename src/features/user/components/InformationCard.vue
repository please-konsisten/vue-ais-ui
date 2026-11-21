<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import { Layout, type LucideIcon } from '@lucide/vue';
import { ref, type Ref } from 'vue';

const data: Ref<{
  title: string;
  icon: LucideIcon;
  numbers: number
}[]> = ref([
    {
      title: "Students",
      icon: Layout,
      numbers: 1000
    },
    {
      title: "Lecture",
      icon: Layout,
      numbers: 100
    },
    {
      title: "Admin",
      icon: Layout,
      numbers: 5
    }
  ])


</script>
<template>
  <div class="flex flex-row justify-between gap-4 item-center">
    <Card 
      v-for="({ title, icon, numbers }, index) in data" 
      :key="index"
      class="max-w-96 shrink-0 flex-1">
      <CardHeader>
        {{ title }}
      </CardHeader>
      <CardContent>
        <component :is="icon" class="w-6 h-6" />
      </CardContent>
      <CardFooter>
        {{ numbers }}
      </CardFooter>
    </Card>
  </div>
</template>