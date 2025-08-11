<template>
    <div class="flex flex-col h-full">
        <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-medium">Code Editor</h3>
            <select v-model="selectedLanguage" @change="handleLanguageChange"
                class="border rounded px-2 py-1 text-sm focus:outline-none">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="c">C</option>
            </select>
        </div>
        
        <div class="flex-1 relative">
            <div class="absolute inset-0 bg-gray-900 rounded border border-gray-700">
                <!-- Line numbers -->
                <div class="absolute left-0 top-0 w-12 h-full bg-gray-800 text-gray-400 text-xs font-mono p-2 select-none pointer-events-none overflow-hidden">
                    <div v-for="(line, index) in lineCount" :key="index" class="text-right">
                        {{ index + 1 }}
                    </div>
                </div>
                
                <!-- Code textarea -->
                <textarea
                    ref="codeTextarea"
                    v-model="code"
                    class="absolute left-12 right-0 top-0 bottom-0 w-full h-full p-2 font-mono text-sm bg-gray-900 text-gray-100 border-0 resize-none focus:outline-none"
                    :placeholder="getPlaceholder()"
                    @input="handleCodeChange"
                    @keydown.tab.prevent="handleTab"
                    @keydown.ctrl.enter.prevent="handleRun"
                    @keydown.ctrl.s.prevent="handleSubmit"
                    @paste="handlePaste"
                    @drop="handleDrop"
                    spellcheck="false"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                ></textarea>
            </div>
        </div>
        
        <div class="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span v-if="timeLimit">Time Limit: {{ timeLimit }}s</span>
            <span>{{ lineCount.length }} lines</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LightweightCodeEditor',
    props: {
        value: {
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
        }
    },
    data() {
        return {
            code: this.value,
            selectedLanguage: this.language,
            languageTemplates: {
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
        }
    },
    computed: {
        lineCount() {
            return this.code.split('\n')
        }
    },
    watch: {
        value: {
            handler(newValue) {
                if (newValue !== this.code) {
                    this.code = newValue
                }
            },
            deep: false
        },
        language: {
            handler(newLang) {
                this.selectedLanguage = newLang
                this.updateTemplate()
            },
            deep: false
        }
    },
    mounted() {
        this.updateTemplate()
        this.adjustTextareaHeight()
    },
    methods: {
        handleLanguageChange() {
            this.updateTemplate()
            this.$emit('language-change', this.selectedLanguage)
        },
        
        handleCodeChange() {
            this.$emit('input', this.code)
            this.$emit('change', this.code)
            this.adjustTextareaHeight()
        },
        
        handleTab(event) {
            event.preventDefault()
            const textarea = event.target
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            
            // Insert 4 spaces
            this.code = this.code.substring(0, start) + '    ' + this.code.substring(end)
            
            // Set cursor position after tab
            this.$nextTick(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 4
                textarea.focus()
            })
        },
        
        handleRun() {
            this.$emit('run-code', this.code)
        },
        
        handleSubmit() {
            this.$emit('submit-code', this.code)
        },
        
        handlePaste(event) {
            // Allow paste but prevent any processing delays
            setTimeout(() => {
                this.handleCodeChange()
            }, 0)
        },
        
        handleDrop(event) {
            // Allow drop but prevent any processing delays
            setTimeout(() => {
                this.handleCodeChange()
            }, 0)
        },
        
        updateTemplate() {
            if (!this.code || this.code.trim() === '') {
                this.code = this.languageTemplates[this.selectedLanguage] || this.languageTemplates.javascript
            }
        },
        
        getPlaceholder() {
            return `// Write your ${this.selectedLanguage} code here...`
        },
        
        adjustTextareaHeight() {
            // This is a lightweight version - no height adjustment needed
        },
        
        getValue() {
            return this.code
        },
        
        setValue(value) {
            this.code = value
        },
        
        focus() {
            if (this.$refs.codeTextarea) {
                this.$refs.codeTextarea.focus()
            }
        }
    }
}
</script>

<style scoped>
textarea {
    line-height: 1.5;
    tab-size: 4;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* Custom scrollbar for better performance */
textarea::-webkit-scrollbar {
    width: 8px;
}

textarea::-webkit-scrollbar-track {
    background: #1f2937;
}

textarea::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
}
</style> 