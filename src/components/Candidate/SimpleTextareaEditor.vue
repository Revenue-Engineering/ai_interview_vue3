<template>
    <div class="flex flex-col h-full">
        <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600">Simple Editor (Monaco failed to load)</span>
            <select v-model="selectedLanguage" @change="handleLanguageChange"
                class="border rounded px-2 py-1 text-xs focus:outline-none">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="c">C</option>
            </select>
        </div>
        
        <textarea
            ref="codeTextarea"
            v-model="code"
            class="flex-1 w-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border border-gray-700 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            :placeholder="getPlaceholder()"
            @input="handleCodeChange"
            @keydown.tab.prevent="handleTab"
            @keydown.ctrl.enter.prevent="handleRun"
            @keydown.ctrl.s.prevent="handleSubmit"
        ></textarea>
    </div>
</template>

<script>
export default {
    name: 'SimpleTextareaEditor',
    props: {
        value: {
            type: String,
            default: ''
        },
        language: {
            type: String,
            default: 'javascript'
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
    watch: {
        value(newValue) {
            if (newValue !== this.code) {
                this.code = newValue
            }
        },
        language(newLang) {
            this.selectedLanguage = newLang
            this.updateTemplate()
        }
    },
    mounted() {
        this.updateTemplate()
    },
    methods: {
        handleLanguageChange() {
            this.updateTemplate()
            this.$emit('language-change', this.selectedLanguage)
        },
        
        handleCodeChange() {
            this.$emit('input', this.code)
            this.$emit('change', this.code)
        },
        
        handleTab(event) {
            const textarea = event.target
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            
            // Insert tab
            this.code = this.code.substring(0, start) + '    ' + this.code.substring(end)
            
            // Set cursor position after tab
            this.$nextTick(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 4
            })
        },
        
        handleRun() {
            this.$emit('run-code', this.code)
        },
        
        handleSubmit() {
            this.$emit('submit-code', this.code)
        },
        
        updateTemplate() {
            if (!this.code || this.code.trim() === '') {
                this.code = this.languageTemplates[this.selectedLanguage] || this.languageTemplates.javascript
            }
        },
        
        getPlaceholder() {
            return `// Write your ${this.selectedLanguage} code here...`
        },
        
        getValue() {
            return this.code
        },
        
        setValue(value) {
            this.code = value
        }
    }
}
</script>

<style scoped>
textarea {
    line-height: 1.5;
    tab-size: 4;
}
</style> 