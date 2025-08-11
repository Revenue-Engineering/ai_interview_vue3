<template>
    <div ref="editorContainer" class="w-full h-full"></div>
</template>

<script>
export default {
    name: 'MonacoEditor',
    props: {
        value: {
            type: String,
            default: ''
        },
        language: {
            type: String,
            default: 'javascript'
        },
        theme: {
            type: String,
            default: 'vs-dark'
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        options: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            editor: null,
            monaco: null,
            _resizeObserver: null,
            _changeTimeout: null,
            _isUpdating: false
        }
    },
    watch: {
        value: {
            handler(newValue) {
                if (this.editor && !this._isUpdating) {
                    const currentValue = this.editor.getValue()
                    if (currentValue !== newValue) {
                        this._isUpdating = true
                        this.editor.setValue(newValue)
                        this._isUpdating = false
                    }
                }
            },
            deep: false
        },
        language: {
            handler(newLanguage) {
                if (this.editor && this.monaco) {
                    const model = this.editor.getModel()
                    if (model) {
                        this.monaco.editor.setModelLanguage(model, newLanguage)
                    }
                }
            },
            deep: false
        },
        readOnly: {
            handler(newReadOnly) {
                if (this.editor) {
                    this.editor.updateOptions({ readOnly: newReadOnly })
                }
            },
            deep: false
        }
    },
    async mounted() {
        await this.initEditor()
    },
    beforeUnmount() {
        // Clean up timeouts
        if (this._changeTimeout) {
            clearTimeout(this._changeTimeout)
        }
        
        // Clean up resize observer
        if (this._resizeObserver) {
            this._resizeObserver.disconnect()
        }
        
        // Dispose editor
        if (this.editor) {
            this.editor.dispose()
        }
    },
    methods: {
        async initEditor() {
            try {
                // Dynamically import Monaco Editor
                this.monaco = await import('monaco-editor')
                
                // Create editor instance
                this.editor = this.monaco.editor.create(this.$refs.editorContainer, {
                    value: this.value,
                    language: this.language,
                    theme: this.theme,
                    readOnly: this.readOnly,
                    automaticLayout: true,
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    roundedSelection: false,
                    cursorStyle: 'line',
                    tabSize: 4,
                    insertSpaces: true,
                    detectIndentation: false,
                    // Performance optimizations
                    renderWhitespace: 'none',
                    folding: false,
                    links: false,
                    colorDecorators: false,
                    lightbulb: { enabled: false },
                    parameterHints: { enabled: false },
                    suggestOnTriggerCharacters: false,
                    quickSuggestions: false,
                    acceptSuggestionOnCommitCharacter: false,
                    acceptSuggestionOnEnter: 'off',
                    tabCompletion: 'off',
                    wordBasedSuggestions: false,
                    ...this.options
                })

                // Listen for content changes with throttling
                this.editor.onDidChangeModelContent(() => {
                    if (this._changeTimeout) {
                        clearTimeout(this._changeTimeout)
                    }
                    this._changeTimeout = setTimeout(() => {
                        if (!this._isUpdating) {
                            const value = this.editor.getValue()
                            this.$emit('input', value)
                            this.$emit('change', value)
                        }
                    }, 200) // Throttle to 200ms
                })

                // Set up resize observer with throttling
                let resizeTimeout = null
                this._resizeObserver = new ResizeObserver(() => {
                    if (resizeTimeout) {
                        clearTimeout(resizeTimeout)
                    }
                    resizeTimeout = setTimeout(() => {
                        if (this.editor) {
                            this.editor.layout()
                        }
                    }, 100) // Throttle to 100ms
                })

                if (this.$refs.editorContainer) {
                    this._resizeObserver.observe(this.$refs.editorContainer)
                }

                // Emit ready event
                this.$emit('ready', this.editor)

            } catch (error) {
                console.error('Failed to initialize Monaco editor:', error)
                this.$emit('error', error)
            }
        },

        getValue() {
            return this.editor ? this.editor.getValue() : ''
        },

        setValue(value) {
            if (this.editor) {
                this.editor.setValue(value)
            }
        },

        focus() {
            if (this.editor) {
                this.editor.focus()
            }
        },

        addCommand(keybinding, handler) {
            if (this.editor && this.monaco) {
                this.editor.addCommand(keybinding, handler)
            }
        }
    }
}
</script>

<style scoped>
/* Monaco Editor handles its own styling */
</style> 