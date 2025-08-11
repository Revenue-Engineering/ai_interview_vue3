<template>
    <div class="overflow-auto max-h-full">
        <div v-if="loading" class="flex items-center justify-center h-32">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <div v-else-if="question" class="bg-white p-6 rounded-lg shadow border">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">🧠 Problem: {{ question.dsaQuestion.name }}</h2>
                <div class="flex gap-2">
                    <span class="px-2 py-1 text-xs rounded-full"
                        :class="getDifficultyClass(question.dsaQuestion.level)">
                        {{ question.dsaQuestion.level }}
                    </span>
                    <span class="px-2 py-1 text-xs bg-gray-100 rounded-full">
                        Question {{ questionIndex + 1 }} of {{ totalQuestions }}
                    </span>
                </div>
            </div>

            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-2">Problem Statement:</h3>
                <p class="text-gray-700 mb-4">{{ question.dsaQuestion.problemStatement }}</p>
            </div>

            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-2">Input Format:</h3>
                <p class="text-gray-700 mb-2">{{ question.dsaQuestion.inputFormat }}</p>
                <h3 class="text-lg font-semibold mb-2">Output Format:</h3>
                <p class="text-gray-700 mb-2">{{ question.dsaQuestion.outputFormat }}</p>
            </div>

            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-2">Examples:</h3>
                <div class="space-y-3">
                    <div class="bg-gray-50 p-3 rounded border">
                        <p><strong>Input:</strong>
                            <code>{{ question.dsaQuestion.inputExample }}</code></p>
                        <p><strong>Output:</strong>
                            <code>{{ question.dsaQuestion.outputExample }}</code></p>
                        <p><strong>Explanation:</strong> {{ question.dsaQuestion.explanation }}</p>
                    </div>
                </div>
            </div>

            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-2">Constraints:</h3>
                <p class="text-gray-700">{{ question.dsaQuestion.constraints }}</p>
            </div>

            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-2">Test Cases:</h3>
                <div class="space-y-2 text-sm">
                    <div class="bg-gray-50 p-2 rounded">
                        <strong>Test Case 1:</strong> Input:
                        <code>{{ question.dsaQuestion.testCase1Input }}</code> → Output:
                        <code>{{ question.dsaQuestion.testCase1Output }}</code>
                    </div>
                    <div class="bg-gray-50 p-2 rounded">
                        <strong>Test Case 2:</strong> Input:
                        <code>{{ question.dsaQuestion.testCase2Input }}</code> → Output:
                        <code>{{ question.dsaQuestion.testCase2Output }}</code>
                    </div>
                    <div class="bg-gray-50 p-2 rounded">
                        <strong>Test Case 3:</strong> Input:
                        <code>{{ question.dsaQuestion.testCase3Input }}</code> → Output:
                        <code>{{ question.dsaQuestion.testCase3Output }}</code>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center py-8">
            <p class="text-gray-500">No questions available for this interview.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'QuestionDisplay',
    props: {
        question: {
            type: Object,
            default: null
        },
        questionIndex: {
            type: Number,
            default: 0
        },
        totalQuestions: {
            type: Number,
            default: 0
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getDifficultyClass(level) {
            const classes = {
                'Easy': 'bg-green-100 text-green-800',
                'Medium': 'bg-yellow-100 text-yellow-800',
                'Hard': 'bg-red-100 text-red-800'
            }
            return classes[level] || 'bg-gray-100 text-gray-800'
        }
    }
}
</script> 