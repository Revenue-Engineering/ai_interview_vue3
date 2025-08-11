<template>
    <div class="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
        <h1 class="text-[100px] sm:text-[120px] font-extrabold text-slate-800 animate-bounce">
            404
        </h1>
        <p class="text-2xl font-semibold text-slate-800 mt-4">
            Page not found
        </p>
        <p class="text-base text-slate-500 mt-2 max-w-md">
            The page you're looking for doesn’t exist or might have been moved.
        </p>
        <button @click="goHome"
            class="mt-6 px-5 py-2.5 rounded-md border border-slate-800 text-slate-800 hover:bg-slate-100 transition-colors">
            Go back home
        </button>
    </div>
</template>

<script>
export default {
    name: 'Unauthorized',
    methods: {
        goHome() {
            this.$router.push('/');
        }
    },
    mounted() {
        console.log('404 Loaded')
    }
}
</script>
