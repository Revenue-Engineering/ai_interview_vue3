<template>
    <transition name="fade" appear>
        <div v-if="visible" :class="['fixed top-18 mx-auto py-4 right-5 px-4 rounded-lg shadow-md text-white z-50', bgColor]">
            <div class="flex items-start justify-between gap-4">
                <p class="text-sm text-white">{{ message }}</p>
                <button @click="close" class="text-white hover:opacity-80 font-bold">
                    ✕
                </button>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'NotificationPopup',
    props: {
        messageType: {
            type: String,
            required: true,
            validator: (val) => ['success', 'warning', 'error'].includes(val),
        },
        message: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            visible: true,
        }
    },
    computed: {
        bgColor() {
            switch (this.messageType) {
                case 'success':
                    return 'bg-slate-800';
                case 'warning':
                    return 'bg-yellow-500';
                case 'error':
                    return 'bg-red-600';
                default:
                    return 'bg-gray-700';
            }
        },
    },
    mounted() {
        setTimeout(() => {
            this.visible = false;
        }, 3000);
    },
    methods: {
        close() {
            this.visible = false;
        },
    },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
