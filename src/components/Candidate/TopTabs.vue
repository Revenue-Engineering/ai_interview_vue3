<template>
    <div class="flex-1 border-b flex flex-col">
        <div class="flex border-b">
            <button class="flex-1 py-2 text-center transition"
                :class="activeTab === 'video' ? activeTabClass : inactiveTabClass" @click="switchTab('video')">
                Video
            </button>
            <button class="flex-1 py-2 text-center transition"
                :class="activeTab === 'testcases' ? activeTabClass : inactiveTabClass" @click="switchTab('testcases')">
                Test Cases
            </button>
            <button class="flex-1 py-2 text-center transition"
                :class="activeTab === 'results' ? activeTabClass : inactiveTabClass" @click="switchTab('results')">
                Results
            </button>
        </div>
        <div class="p-4 overflow-auto h-full">
            {{ newResult }}
            <div v-show="activeTab === 'video'">
                <VideoDisplay />
            </div>
            <div v-show="activeTab === 'testcases'">
                <TestCasesDisplay :question="question" />
            </div>
            <div v-show="activeTab === 'results'">
                <ResultsDisplay :result="interviewStore.lastResult"
                    :loading="interviewStore.isRunningCode || interviewStore.isSubmittingCode" />
            </div>
        </div>
    </div>
</template>

<script>
import VideoDisplay from './VideoDisplay.vue'
import TestCasesDisplay from './TestCasesDisplay.vue'
import ResultsDisplay from './ResultsDisplay.vue'
import { useInterviewStore } from '@/stores/interview'

export default {
    name: 'TopTabs',
    components: {
        VideoDisplay,
        TestCasesDisplay,
        ResultsDisplay
    },
    props: {
        question: {
            type: Object,
            default: null
        },
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
            activeTab: 'video',
            interviewStore: useInterviewStore()
        }
    },
    watch: {
        'interviewStore.lastResult': {
            handler(result) {
                console.log('TopTabs: Result changed in store:', result)
                // Auto-switch to results tab when new result arrives
                if (result && Object.keys(result).length > 0) {
                    this.activeTab = 'results'
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        switchTab(tab) {
            this.activeTab = tab
        },

        showResults() {
            this.activeTab = 'results'
        }
    }
}
</script>