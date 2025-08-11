<template>
    <div class="min-h-screen p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <el-card v-for="card in cards" :key="card.title" shadow="hover" class="rounded-2xl transition">
                <div class="flex items-center space-x-4">
                    <component :is="card.icon" class="w-8 h-8 text-gray-600" />
                    <div>
                        <p class="text-sm text-gray-500">{{ card.title }}</p>
                        <p class="text-xl font-bold text-gray-800">{{ card.value }}</p>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { DocumentTextIcon, MicrophoneIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const cards = ref([
    { title: 'Total Applications', value: 120, icon: DocumentTextIcon },
    { title: 'Total Interviews', value: 75, icon: MicrophoneIcon },
    { title: 'Passed Interviews', value: 48, icon: CheckCircleIcon },
    { title: 'Failed Interviews', value: 27, icon: XCircleIcon },
])
</script>

<style>
/* Optional: Make Element Plus cards match Tailwind rounded style */
.el-card {
    border-radius: 1rem;
}
</style>
