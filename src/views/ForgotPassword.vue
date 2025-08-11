<template>
    <div class="flex min-h-full h-[100vh] flex-1 flex-col justify-center py-18 w-full sm:px-6 lg:px-8 bg-slate-800">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <div>
                <h2 class="mt-2 text-center text-2xl font-bold tracking-tight text-white">AI Interviewer</h2>
            </div>
            <h2 class="mt-2 text-center text-xl tracking-tight text-white">Forgot your password?</h2>
            <p class="mt-2 text-center text-sm text-gray-300">
                Enter your email address and we’ll send you instructions to reset your password.
            </p>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                <form class="space-y-6" @submit.prevent="sendResetEmail">
                    <div>
                        <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
                        <div class="mt-2">
                            <input v-model="formData.email" type="email" name="email" id="email" autocomplete="email"
                                required placeholder="Enter your email"
                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" :disabled="isLoading" class="flex w-full justify-center items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm 
                                   hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
                                   disabled:opacity-50 disabled:cursor-not-allowed">

                            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                                </path>
                            </svg>

                            <span>{{ isLoading ? 'Sending...' : 'Send Reset Link' }}</span>
                        </button>
                    </div>
                </form>

                <p class="mt-6 text-center text-sm text-gray-500">
                    <router-link to="/login" class="font-semibold text-blue-600 hover:text-blue-500">
                        Back to Login
                    </router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import { ElNotification } from 'element-plus';

export default {
    data() {
        return {
            isLoading: false,
            formData: {
                email: ''
            }
        }
    },
    methods: {
        async sendResetEmail() {
            if (this.isLoading) return;
            this.isLoading = true;

            try {
                const response = await useAuthStore().forgotPassword(this.formData.email);

                if (response.data.success) {
                    ElNotification({
                        title: 'Success',
                        message: 'Password reset instructions sent to your email.',
                        type: 'success',
                    });
                    this.formData.email = '';
                } else {
                    ElNotification({
                        title: 'Error',
                        message: response.data.message || 'Failed to send reset email.',
                        type: 'error',
                    });
                }
            } catch (error) {
                console.error(error);
                ElNotification({
                    title: 'Error',
                    message: 'Something went wrong. Please try again.',
                    type: 'error',
                });
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>
