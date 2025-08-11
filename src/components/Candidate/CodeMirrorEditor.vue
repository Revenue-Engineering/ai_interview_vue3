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
            <div ref="editorContainer" class="h-full w-full"></div>
        </div>

        <div class="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span v-if="timeLimit">Time Limit: {{ timeLimit }}s</span>
            <span>{{ lineCount }} lines</span>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { EditorView } from '@codemirror/view'
import { keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import { indentWithTab } from '@codemirror/commands'

export default {
    name: 'CodeMirrorEditor',
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
    emits: ['input', 'change', 'language-change', 'run-code', 'submit-code'],
    setup(props, { emit }) {
        const editorContainer = ref(null)
        const editor = ref(null)
        const selectedLanguage = ref(props.language)
        const lineCount = ref(0)

        const languageTemplates = {
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

        const languageExtensions = {
            javascript: javascript(),
            python: python(),
            cpp: cpp(),
            java: java(),
            c: cpp() // Use C++ extension for C as well
        }

        const getLanguageExtension = (lang) =>
            languageExtensions[lang] || languageExtensions.javascript

        const createEditor = () => {
            if (!editorContainer.value) return

            try {
                const extensions = [
                    oneDark,
                    getLanguageExtension(selectedLanguage.value),
                    keymap.of([indentWithTab]),
                    EditorView.lineWrapping,
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
                            const value = update.state.doc.toString()
                            lineCount.value = update.state.doc.lines
                            emit('input', value)
                            emit('change', value)
                        }
                    }),
                    keymap.of([
                        {
                            key: 'Ctrl-Enter',
                            run: () => {
                                const value = editor.value.state.doc.toString()
                                emit('run-code', value)
                                return true
                            }
                        },
                        {
                            key: 'Ctrl-s',
                            run: () => {
                                const value = editor.value.state.doc.toString()
                                emit('submit-code', value)
                                return true
                            }
                        }
                    ])

                ]

                const state = EditorState.create({
                    doc:
                        props.value ||
                        languageTemplates[selectedLanguage.value] ||
                        languageTemplates.javascript,
                    extensions
                })

                editor.value = new EditorView({
                    state,
                    parent: editorContainer.value
                })

                lineCount.value = state.doc.lines
            } catch (error) {
                console.error('Failed to initialize CodeMirror editor:', error)
                emit('error', error)
            }
        }

        const destroyEditor = () => {
            if (editor.value) {
                editor.value.destroy()
                editor.value = null
            }
        }

        const handleLanguageChange = () => {
            const newValue =
                languageTemplates[selectedLanguage.value] ||
                languageTemplates.javascript

            if (editor.value) {
                const transaction = editor.value.state.update({
                    changes: {
                        from: 0,
                        to: editor.value.state.doc.length,
                        insert: newValue
                    }
                })
                editor.value.dispatch(transaction)
            }

            emit('language-change', selectedLanguage.value)
        }

        const setValue = (value) => {
            if (editor.value) {
                const transaction = editor.value.state.update({
                    changes: {
                        from: 0,
                        to: editor.value.state.doc.length,
                        insert: value
                    }
                })
                editor.value.dispatch(transaction)
            }
        }

        const getValue = () => {
            return editor.value ? editor.value.state.doc.toString() : ''
        }

        const focus = () => {
            if (editor.value) {
                editor.value.focus()
            }
        }

        // Watch for prop changes
        watch(
            () => props.value,
            (newValue) => {
                if (editor.value && newValue !== getValue()) {
                    setValue(newValue)
                }
            }
        )

        watch(
            () => props.language,
            (newLang) => {
                selectedLanguage.value = newLang
            }
        )

        // Lifecycle
        onMounted(() => {
            nextTick(() => {
                createEditor()
            })
        })

        onBeforeUnmount(() => {
            destroyEditor()
        })

        return {
            editorContainer,
            selectedLanguage,
            lineCount,
            handleLanguageChange,
            setValue,
            getValue,
            focus
        }
    }
}
</script>

<style scoped>
/* CodeMirror handles its own styling */
</style>
