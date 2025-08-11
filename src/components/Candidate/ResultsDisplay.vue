<template>
    <div>
        <p class="mb-2 font-medium">Execution Results:</p>
        <div v-if="result?.data && typeof result.data === 'object'" class="space-y-3">
            <div class="bg-green-50 p-3 rounded border">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-semibold">Score: {{ result.data.score }}%</span>
                    <span class="text-sm text-gray-600">
                        {{ result.data.testCasesPassed }}/{{ result.data.totalTestCases }} passed
                    </span>
                </div>
                <div class="text-sm space-y-1">
                    <div>Execution Time: {{ result.data.executionTime ?? 'N/A' }}</div>
                    <div>Memory Used: {{ result.data.memoryUsed }}MB</div>
                </div>
            </div>

            <div v-if="result.data.output" class="bg-blue-50 p-3 rounded border">
                <h4 class="font-semibold mb-2">Output:</h4>
                <pre class="text-sm whitespace-pre-wrap bg-white p-2 rounded">{{ result.data.output }}</pre>
            </div>

            <div v-if="result.data.error" class="bg-red-50 p-3 rounded border">
                <h4 class="font-semibold mb-2 text-red-800">Error:</h4>
                <pre class="text-sm whitespace-pre-wrap text-red-700 bg-white p-2 rounded">{{ result.data.error }}</pre>
            </div>

            <div v-if="result.data.testCaseResults?.length > 0" class="bg-gray-50 p-3 rounded">
                <h4 class="font-semibold mb-3">Test Case Details:</h4>
                <div class="space-y-3">
                    <div v-for="testCase in result.data.testCaseResults" :key="testCase.testCaseNumber"
                        class="border rounded p-3"
                        :class="testCase.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'">

                        <div class="flex justify-between items-center mb-2">
                            <span class="font-medium">Test Case {{ testCase.testCaseNumber }}</span>
                            <span class="text-sm px-2 py-1 rounded"
                                :class="testCase.passed ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'">
                                {{ testCase.status }}
                            </span>
                        </div>

                        <div class="text-xs text-gray-600 mb-2">{{ testCase.statusDescription }}</div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                                <strong>Input:</strong>
                                <pre class="bg-white p-2 rounded mt-1 text-xs">{{ testCase.input }}</pre>
                            </div>
                            <div>
                                <strong>Expected Output:</strong>
                                <pre class="bg-white p-2 rounded mt-1 text-xs">{{ testCase.expectedOutput }}</pre>
                            </div>
                        </div>

                        <div v-if="testCase.actualOutput !== undefined" class="mt-2">
                            <strong>Actual Output:</strong>
                            <pre class="bg-white p-2 rounded mt-1 text-xs">{{ testCase.actualOutput }}</pre>
                        </div>

                        <div v-if="testCase.executionTime || testCase.memoryUsed" class="mt-2 text-xs text-gray-600">
                            <span v-if="testCase.executionTime">Time: {{ testCase.executionTime }}ms</span>
                            <span v-if="testCase.memoryUsed" class="ml-2">Memory: {{ testCase.memoryUsed }}MB</span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="result.data.feedback" class="bg-gray-50 p-3 rounded">
                <h4 class="font-semibold mb-2">Feedback:</h4>
                <pre class="text-sm whitespace-pre-wrap">{{ result.data.feedback }}</pre>
            </div>
        </div>

        <div v-else-if="loading" class="text-gray-500 text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Running code...
        </div>

        <div v-else class="text-gray-500 text-center py-4">
            No results yet. Run or submit your code to see results.
        </div>
    </div>
</template>

<script>
export default {
    name: 'ResultsDisplay',
    props: {
        result: {
            type: Object,
            default: null
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        result: {
            handler(newResult) {
                console.log('ResultsDisplay: Result prop changed:', newResult)
            },
            deep: true,
            immediate: true
        }
    }
}
</script>
