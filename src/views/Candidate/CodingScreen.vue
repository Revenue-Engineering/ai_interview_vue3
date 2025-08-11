<template>
    <div class="h-screen">
        <!-- Precheck Screen -->
        <InterviewPrecheck v-if="!isFullscreen" @passed="enterFullscreen" />

        <!-- Interview UI -->
        <div v-else class="flex h-screen bg-gray-50 text-gray-800">
            <!-- LEFT PANEL -->
            <div class="w-[70%] flex flex-col border-r bg-white overflow-hidden">
                <!-- Left Panel Top Tabs -->
                <div class="flex border-b">
                    <button class="flex-1 py-2 text-center transition"
                        :class="activeLeftTab === 'question' ? activeTabClass : inactiveTabClass"
                        @click="switchLeftTab('question')">
                        Question
                    </button>
                    <button class="flex-1 py-2 text-center transition"
                        :class="activeLeftTab === 'editor' ? activeTabClass : inactiveTabClass"
                        @click="switchLeftTab('editor')">
                        Code Editor
                    </button>
                </div>

                <!-- Left Tab Content -->
                <div class="flex-1 p-6 overflow-hidden">
                    <!-- Question Tab -->
                    <div v-show="activeLeftTab === 'question'" class="h-full">
                        <QuestionDisplay :question="currentQuestion" :question-index="currentQuestionIndex"
                            :total-questions="totalQuestions" :loading="loading" />
                    </div>

                    <!-- Code Editor Tab -->
                    <div v-show="activeLeftTab === 'editor'" class="h-full">
                        <CodeEditor :initial-code="currentCode" :language="selectedLanguage"
                            :time-limit="currentQuestion?.dsaQuestion?.timeLimit || 30" :running="runningCode"
                            :submitting="submittingCode" @language-change="handleLanguageChange"
                            @code-change="handleCodeChange" @run-code="runCode" @submit-code="submitCode" />
                    </div>
                </div>
            </div>

            <!-- RIGHT PANEL -->
            <div class="w-[30%] flex flex-col">
                <!-- Top Tabs: Video / Test Cases / Results -->
                <TopTabs :key="topTabsKey" :question="currentQuestion" :active-tab-class="activeTabClass"
                    :inactive-tab-class="inactiveTabClass" />

                <!-- Bottom Tabs: Interviewer / Proctor -->
                <BottomTabs :active-tab-class="activeTabClass" :inactive-tab-class="inactiveTabClass" />
            </div>
        </div>

        <!-- Toast Notifications -->
        <Toast :show="toast.show" :type="toast.type" :title="toast.title" :message="toast.message"
            @close="toast.show = false" />
    </div>
</template>

<script>
import InterviewPrecheck from '@/components/Candidate/InterviewPrecheck.vue'
import QuestionDisplay from '@/components/Candidate/QuestionDisplay.vue'
import CodeEditor from '@/components/Candidate/CodeEditor.vue'
import TopTabs from '@/components/Candidate/TopTabs.vue'
import BottomTabs from '@/components/Candidate/BottomTabs.vue'
import Toast from '@/components/Toast.vue'
import { useInterviewStore } from '@/stores/interview'

export default {
    props: ['id'],
    name: 'CodingScreen',
    components: {
        InterviewPrecheck,
        QuestionDisplay,
        CodeEditor,
        TopTabs,
        BottomTabs,
        Toast
    },
    data() {
        return {
            // UI State
            isFullscreen: false,
            activeLeftTab: 'question',
            activeTabClass: 'bg-blue-100 text-blue-800 font-semibold',
            inactiveTabClass: 'bg-white text-gray-700 hover:bg-gray-100',

            // Interview Data
            interviewStore: useInterviewStore(),
            loading: false,
            currentQuestion: null,
            currentQuestionIndex: 0,
            totalQuestions: 0,
            questions: [],
            interviewId: null,

            // Code Editor State
            selectedLanguage: 'javascript',
            currentCode: '',

            // Execution State - now managed by store
            // runningCode: false,
            // submittingCode: false,
            // lastResult: null,

            // Toast State
            toast: {
                show: false,
                type: 'info',
                title: '',
                message: ''
            },
            sampleVariable: 0
        }
    },
    computed: {
        currentLanguageId() {
            const languageMap = {
                javascript: 63,
                python: 71,
                java: 62,
                cpp: 54,
                c: 50
            }
            return languageMap[this.selectedLanguage] || 63
        },
        showLastResult() {
            // Get result from store
            return this.interviewStore.lastResult;
        },
        topTabsKey() {
            // Create a unique key based on the lastResult to force re-rendering
            const result = this.interviewStore.lastResult;
            return result?.memoryUsed ? JSON.stringify(result.memoryUsed) : 'no-result';
        },
        runningCode() {
            return this.interviewStore.isRunningCode;
        },
        submittingCode() {
            return this.interviewStore.isSubmittingCode;
        }
    },
    watch: {
        'interviewStore.lastResult': {
            handler(newResult) {
                console.log('CodingScreen: lastResult changed in store:', newResult)
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        // Fullscreen Management
        checkFullscreen() {
            this.isFullscreen = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            )
        },

        enterFullscreen() {
            const el = document.documentElement
            this.loadInterviewQuestions()

            if (el.requestFullscreen) el.requestFullscreen()
            else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
            else if (el.mozRequestFullScreen) el.mozRequestFullScreen()
            else if (el.msRequestFullscreen) el.msRequestFullscreen()
        },

        // Tab Management
        switchLeftTab(tab) {
            this.activeLeftTab = tab
        },



        // Interview Data Management
        async loadInterviewQuestions() {
            this.loading = true
            try {
                this.interviewId = this.id

                if (!this.interviewId || isNaN(parseInt(this.interviewId))) {
                    throw new Error('Invalid interview ID. Please check the interview link.')
                }

                const response = await this.interviewStore.getInterviewQuestions(this.interviewId)
                const data = response.data

                this.questions = data.questions
                this.currentQuestionIndex = data.currentQuestionIndex
                this.totalQuestions = data.totalQuestions
                this.currentQuestion = this.questions[this.currentQuestionIndex]

                // Initialize code template for current question
                this.initializeCodeTemplate()

            } catch (error) {
                console.error('Error loading questions:', error)
                alert('Failed to load interview questions. Please try again.')
            } finally {
                this.loading = false
            }
        },

        initializeCodeTemplate() {
            if (this.currentQuestion) {
                const templates = {
                    javascript: `function solution(input) {
    // Your code here
    return input;
}`,
                    python: `def solution(input):
    # Your code here
    return input`,
                    java: `public class Solution {
    public static String solution(String input) {
        // Your code here
        return input;
    }
}`,
                    cpp: `#include <iostream>
#include <string>
using namespace std;

string solution(string input) {
    // Your code here
    return input;
}`,
                    c: `#include <stdio.h>
#include <string.h>

char* solution(char* input) {
    // Your code here
    return input;
}`
                }
                this.currentCode = templates[this.selectedLanguage] || templates.javascript
            }
        },

        // Code Editor Event Handlers
        handleLanguageChange(language) {
            this.selectedLanguage = language
            this.initializeCodeTemplate()
        },

        handleCodeChange(code) {
            this.currentCode = code
        },

        // Code Execution
        async runCode(code) {
            if (!this.currentQuestion) {
                this.showToast('error', 'No Question', 'No question is currently loaded.')
                return
            }

            if (!this.interviewId || isNaN(parseInt(this.interviewId))) {
                this.showToast('error', 'Invalid Interview', 'Invalid interview ID. Please check the interview link.')
                return
            }

            try {
                const response = await this.interviewStore.runCode({
                    dsaQuestionId: this.currentQuestion.dsaQuestion.id,
                    userCode: code,
                    language: this.selectedLanguage
                })

                console.log('Run code response:', response)
                this.sampleVariable = 1;

                // Show toast notification
                const message = response.score === 100
                    ? '🎉 All test cases passed!'
                    : `Code executed successfully. ${response.testCasesPassed}/${response.totalTestCases} test cases passed.`

                this.showToast('success', 'Code Execution Complete', message)

            } catch (error) {
                console.error('Error running code:', error)
                this.showToast('error', 'Execution Failed', 'Failed to run code. Please check your syntax and try again.')
            }
        },

        async submitCode(code) {
            if (!this.currentQuestion) {
                this.showToast('error', 'No Question', 'No question is currently loaded.')
                return
            }

            if (!this.interviewId || isNaN(parseInt(this.interviewId))) {
                this.showToast('error', 'Invalid Interview', 'Invalid interview ID. Please check the interview link.')
                return
            }

            try {
                const response = await this.interviewStore.submitCode({
                    dsaQuestionId: this.currentQuestion.dsaQuestion.id,
                    interviewId: this.interviewId,
                    userCode: code,
                    language: this.selectedLanguage
                })

                // Move to next question if available
                if (this.currentQuestionIndex < this.totalQuestions - 1) {
                    this.currentQuestionIndex++
                    this.currentQuestion = this.questions[this.currentQuestionIndex]
                    this.initializeCodeTemplate()
                }

                // Show success message
                const message = `Code submitted successfully! Score: ${response.score}%`
                this.showToast('success', 'Submission Complete', message)

            } catch (error) {
                console.error('Error submitting code:', error)
                this.showToast('error', 'Submission Failed', 'Failed to submit code. Please try again.')
            }
        },

        // Toast Management
        showToast(type, title, message) {
            this.toast = {
                show: true,
                type,
                title,
                message
            }
        }
    },

    mounted() {
        // Initialize store
        this.interviewStore = useInterviewStore()

        // Setup fullscreen listeners
        this.checkFullscreen()
        document.addEventListener('fullscreenchange', this.checkFullscreen)
        document.addEventListener('webkitfullscreenchange', this.checkFullscreen)
        document.addEventListener('mozfullscreenchange', this.checkFullscreen)
        document.addEventListener('msfullscreenchange', this.checkFullscreen)
    },

    beforeUnmount() {
        // Cleanup event listeners
        document.removeEventListener('fullscreenchange', this.checkFullscreen)
        document.removeEventListener('webkitfullscreenchange', this.checkFullscreen)
        document.removeEventListener('mozfullscreenchange', this.checkFullscreen)
        document.removeEventListener('msfullscreenchange', this.checkFullscreen)
    }
}
</script>
