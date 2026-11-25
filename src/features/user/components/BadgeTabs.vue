<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const activeTab = ref('student')
</script>

<template>
  <Tabs v-model="activeTab">
    <TabsList>
      <TabsTrigger value="student">Student</TabsTrigger>
      <TabsTrigger value="lecture">Lecture</TabsTrigger>
      <TabsTrigger value="admin">Admin</TabsTrigger>
    </TabsList>

    <TabsContent :value="activeTab" class="flex-1 bg-surface p-4 sm:p-6 lg:p-8 rounded-lg border min-w-0">
      <slot :active-tab="activeTab" />
    </TabsContent>

  </Tabs>
</template>
