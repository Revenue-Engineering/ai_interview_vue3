<template>
    <div class="flex flex-col gap-3 h-full overflow-hidden pb-24">
        <CodeMirrorEditor ref="codeEditor" :value="currentCode" :language="selectedLanguage" :time-limit="timeLimit"
            @input="handleCodeChange" @language-change="handleLanguageChange" @run-code="handleRun"
            @submit-code="handleSubmit" />

        <div
            class="flex justify-between items-center fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 px-4 py-2 z-10 border-t">
            <div class="text-sm text-gray-600">
                <span v-if="timeLimit">Time Limit: {{ timeLimit }}s</span>
            </div>
            <div class="flex gap-2">
                <button @click="handleRun" :disabled="running"
                    class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
                    {{ running ? 'Running...' : 'Run' }}
                </button>
                <button @click="handleSubmit" :disabled="submitting"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                    {{ submitting ? 'Submitting...' : 'Submit' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import CodeMirrorEditor from './CodeMirrorEditor.vue'

const defaultTemplates = {
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

export default {
    name: 'CodeEditor',
    components: {
        CodeMirrorEditor
    },
    props: {
        initialCode: {
            type: String,
            default: ''
        },
        language: {
            type: String,
            default: 'javascript'
        },
        timeLimit: {
            type: Number,
            default: 30
        },
        running: {
            type: Boolean,
            default: false
        },
        submitting: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            selectedLanguage: this.language,
            currentCode: this.initialCode || ''
        }
    },
    watch: {
        initialCode(newCode) {
            if (newCode !== this.currentCode) {
                this.currentCode = newCode
            }
        },
        language(newLang) {
            if (newLang !== this.selectedLanguage) {
                this.selectedLanguage = newLang

                // Only override code if it's empty
                if (!this.currentCode || this.currentCode.trim() === '') {
                    this.updateCodeTemplate()
                }
            }
        }
    },
    mounted() {
        if (!this.currentCode || this.currentCode.trim() === '') {
            this.updateCodeTemplate()
        }
    },
    methods: {
        updateCodeTemplate() {
            this.currentCode = defaultTemplates[this.selectedLanguage] || defaultTemplates.javascript
        },

        handleLanguageChange(language) {
            if (language !== this.selectedLanguage) {
                this.selectedLanguage = language

                // Only apply new template if current code is empty
                if (!this.currentCode || this.currentCode.trim() === '') {
                    this.updateCodeTemplate()
                }

                this.$emit('language-change', language)
            }
        },

        handleCodeChange(code) {
            this.currentCode = code
            this.$emit('code-change', code)
        },

        handleRun() {
            this.$emit('run-code', this.currentCode)
        },

        handleSubmit() {
            this.$emit('submit-code', this.currentCode)
        },

        getCode() {
            return this.currentCode
        },

        setCode(newCode) {
            this.currentCode = newCode
        }
    }
}
</script>

<style scoped>
/* no extra styling needed */
</style>
