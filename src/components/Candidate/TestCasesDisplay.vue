<template>
    <div>
        <p class="mb-2 font-medium">Test Cases:</p>
        <div v-if="question" class="space-y-2 text-sm">
            <div class="bg-gray-50 p-2 rounded">
                <strong>Test Case 1:</strong><br>
                Input: <code>{{ question.dsaQuestion.testCase1Input }}</code><br>
                Expected: <code>{{ question.dsaQuestion.testCase1Output }}</code>
            </div>
            <div class="bg-gray-50 p-2 rounded">
                <strong>Test Case 2:</strong><br>
                Input: <code>{{ question.dsaQuestion.testCase2Input }}</code><br>
                Expected: <code>{{ question.dsaQuestion.testCase2Output }}</code>
            </div>
            <div class="bg-gray-50 p-2 rounded">
                <strong>Test Case 3:</strong><br>
                Input: <code>{{ question.dsaQuestion.testCase3Input }}</code><br>
                Expected: <code>{{ question.dsaQuestion.testCase3Output }}</code>
            </div>
        </div>
        <div v-else class="text-gray-500 text-center py-4">
            No test cases available.
        </div>
    </div>
</template>

<script>
export default {
    name: 'TestCasesDisplay',
    props: {
        question: {
            type: Object,
            default: null
        }
    }
}
</script> 