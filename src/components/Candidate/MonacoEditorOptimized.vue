<template>
    <div ref="editorContainer" class="w-full h-full"></div>
</template>

<script>
export default {
    name: 'MonacoEditorOptimized',
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
            _isUpdating: false,
            _isInitialized: false
        }
    },
    watch: {
        value: {
            handler(newValue) {
                if (this.editor && this._isInitialized && !this._isUpdating) {
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
                if (this.editor && this.monaco && this._isInitialized) {
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
                if (this.editor && this._isInitialized) {
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
        this.cleanup()
    },
    methods: {
        async initEditor() {
            try {
                // Dynamically import Monaco Editor
                this.monaco = await import('monaco-editor')
                
                // Create editor instance with optimized settings
                this.editor = this.monaco.editor.create(this.$refs.editorContainer, {
                    value: this.value,
                    language: this.language,
                    theme: this.theme,
                    readOnly: this.readOnly,
                    automaticLayout: false, // Disable automatic layout to prevent excessive updates
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
                    // Additional performance settings
                    renderLineHighlight: 'none',
                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                    overviewRulerLanes: 0,
                    scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible',
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10
                    },
                    ...this.options
                })

                // Listen for content changes with throttling
                this.editor.onDidChangeModelContent(() => {
                    if (this._changeTimeout) {
                        clearTimeout(this._changeTimeout)
                    }
                    this._changeTimeout = setTimeout(() => {
                        if (!this._isUpdating && this._isInitialized) {
                            const value = this.editor.getValue()
                            this.$emit('input', value)
                            this.$emit('change', value)
                        }
                    }, 300) // Increased throttle to 300ms
                })

                // Set up manual layout updates (more efficient than ResizeObserver)
                this.setupLayoutUpdates()

                // Mark as initialized
                this._isInitialized = true

                // Emit ready event
                this.$emit('ready', this.editor)

            } catch (error) {
                console.error('Failed to initialize Monaco editor:', error)
                this.$emit('error', error)
            }
        },

        setupLayoutUpdates() {
            // Use a more efficient approach than ResizeObserver
            let layoutTimeout = null
            
            const updateLayout = () => {
                if (layoutTimeout) {
                    clearTimeout(layoutTimeout)
                }
                layoutTimeout = setTimeout(() => {
                    if (this.editor) {
                        this.editor.layout()
                    }
                }, 100)
            }

            // Listen for window resize events
            window.addEventListener('resize', updateLayout)
            
            // Store cleanup function
            this._layoutCleanup = () => {
                window.removeEventListener('resize', updateLayout)
                if (layoutTimeout) {
                    clearTimeout(layoutTimeout)
                }
            }
        },

        cleanup() {
            // Clean up timeouts
            if (this._changeTimeout) {
                clearTimeout(this._changeTimeout)
            }
            
            // Clean up layout updates
            if (this._layoutCleanup) {
                this._layoutCleanup()
            }
            
            // Dispose editor
            if (this.editor) {
                this.editor.dispose()
                this.editor = null
            }

            this._isInitialized = false
        },

        getValue() {
            return this.editor ? this.editor.getValue() : ''
        },

        setValue(value) {
            if (this.editor && this._isInitialized) {
                this._isUpdating = true
                this.editor.setValue(value)
                this._isUpdating = false
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