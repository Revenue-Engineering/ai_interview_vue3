<template>
    <div v-if="show" class="fixed top-4 right-4 z-50">
        <div class="bg-white border rounded-lg shadow-lg p-4 max-w-sm" :class="typeClasses">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <svg v-if="type === 'success'" class="h-5 w-5 text-green-400" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                    <svg v-else-if="type === 'error'" class="h-5 w-5 text-red-400" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium" :class="textClasses">
                        {{ title }}
                    </p>
                    <p v-if="message" class="text-sm mt-1" :class="textClasses">
                        {{ message }}
                    </p>
                </div>
                <div class="ml-auto pl-3">
                    <button @click="close" class="inline-flex text-gray-400 hover:text-gray-600">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Toast',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'info',
            validator: value => ['success', 'error', 'info'].includes(value)
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            default: ''
        },
        duration: {
            type: Number,
            default: 5000
        }
    },
    emits: ['close'],
    mounted() {
        if (this.duration > 0) {
            setTimeout(() => {
                this.close()
            }, this.duration)
        }
    },
    computed: {
        typeClasses() {
            const classes = {
                success: 'border-green-200 bg-green-50',
                error: 'border-red-200 bg-red-50',
                info: 'border-blue-200 bg-blue-50'
            }
            return classes[this.type] || classes.info
        },
        textClasses() {
            const classes = {
                success: 'text-green-800',
                error: 'text-red-800',
                info: 'text-blue-800'
            }
            return classes[this.type] || classes.info
        }
    },
    methods: {
        close() {
            this.$emit('close')
        }
    }
}
</script>