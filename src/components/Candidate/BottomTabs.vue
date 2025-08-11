<template>
    <div class="flex-1 flex flex-col">
        <div class="flex border-b">
            <button class="flex-1 py-2 text-center transition"
                :class="activeTab === 'interviewer' ? activeTabClass : inactiveTabClass"
                @click="switchTab('interviewer')">
                AI Interviewer
            </button>
            <button class="flex-1 py-2 text-center transition"
                :class="activeTab === 'proctor' ? activeTabClass : inactiveTabClass" @click="switchTab('proctor')">
                AI Proctor Logs
            </button>
        </div>
        <div class="p-4 overflow-auto h-full text-sm">
            <div v-show="activeTab === 'interviewer'">
                <div class="space-y-3">
                    <p class="text-gray-600 mb-2">AI Interviewer is asking follow-up questions...</p>
                    <ul class="list-disc list-inside space-y-1">
                        <li>Can you explain your approach?</li>
                        <li>What's the time complexity?</li>
                        <li>How would you optimize this solution?</li>
                        <li>What edge cases should we consider?</li>
                    </ul>
                </div>
            </div>
            <div v-show="activeTab === 'proctor'">
                <div class="space-y-3">
                    <p class="text-gray-600 mb-2">AI Proctor is monitoring...</p>
                    <ul class="list-disc list-inside space-y-1 text-xs text-gray-500">
                        <li>Switched tabs at 10:05 AM</li>
                        <li>Suspicious movement at 10:12 AM</li>
                        <li>Code execution started at 10:15 AM</li>
                        <li>Test cases completed at 10:16 AM</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BottomTabs',
    props: {
        activeTabClass: {
            type: String,
            default: 'bg-blue-100 text-blue-800 font-semibold'
        },
        inactiveTabClass: {
            type: String,
            default: 'bg-white text-gray-700 hover:bg-gray-100'
        }
    },
    data() {
        return {
            activeTab: 'interviewer'
        }
    },
    methods: {
        switchTab(tab) {
            this.activeTab = tab
        }
    }
}
</script>