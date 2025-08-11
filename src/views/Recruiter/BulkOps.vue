<template>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <el-card v-for="card in cards" :key="card.label" shadow="never"
            class="rounded-lg p-4 flex items-center  cursor-pointer hover:bg-gray-50 transition"
            @click="$router.push({ name: card.route })">
            <component :is="card.icon" class="w-6 h-6 text-blue-600" />
            <span class="text-gray-700 font-medium">{{ card.label }}</span>
        </el-card>
    </div>
</template>

<script setup>
import { UserGroupIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/vue/24/outline'

const cards = [
    { label: 'Bulk Assign Candidates', route: 'BulkAssignCandidates', icon: UserGroupIcon },
]
</script>

<style>
.el-card {
    border-radius: 0.5rem;
}
</style>
