<template>
    <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-gray-50">
    <body class="h-full">
    ```
  -->
    <div class="flex min-h-full flex-1 flex-col justify-center py-18 w-full sm:px-6 lg:px-8 bg-slate-800">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <div>
                <h2 class="mt-2 text-center text-2xl font-bold tracking-tight text-white">AI Interviewer</h2>
            </div>
            <h2 class="mt-2 text-center text-xl tracking-tight text-white">Welcome Back! Sign in to
                continue</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                <form class="space-y-6" @submit.prevent="login">
                    <div>
                        <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
                        <div class="mt-2">
                            <input v-model="formData.email" type="email" name="email" id="email" autocomplete="email"
                                required="" placeholder="Enter your email"
                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
                        <div class="mt-2">
                            <input v-model="formData.password" type="password" name="password" id="password"
                                autocomplete="current-password" placeholder="Enter your password" required=""
                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex gap-3">
                            <div class="flex h-6 shrink-0 items-center">
                                <div class="group grid size-4 grid-cols-1">
                                    <input id="remember-me" name="remember-me" type="checkbox"
                                        class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 indeterminate:border-blue-600 indeterminate:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto" />
                                    <svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                        viewBox="0 0 14 14" fill="none">
                                        <path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <label for="remember-me" class="block text-sm/6 text-gray-900">Remember me</label>
                        </div>

                        <div class="text-sm/6" @click="this.$router.push({name: 'ForgotPassword'})">
                            <a href="#" class="font-semibold text-blue-600 hover:text-blue-500">Forgot password?</a>
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

                            <span>{{ isLoading ? 'Signing in...' : 'Sign in' }}</span>
                        </button>
                    </div>
                </form>


            </div>

            <p class="mt-10 text-center text-sm/6 text-gray-100">
                <a href="#" class="font-semibold text-white hover:text-blue-300">Recruiter Signup</a><br></br>
                Candidates cannot signup directly, please contact your recruiter for access. <br></br>
                {{ ' ' }}

            </p>
        </div>
    </div>
</template>

<script setup>
import logo from "@/assets/ai.png";
</script>


<script>
import { defaultAxios } from '@/services/api'
import { useAuthStore } from "../stores/auth";
import { ElNotification } from 'element-plus'
import ForgotPassword from "./ForgotPassword.vue";
// import SuccessMessage from '@/components/Notifications/SuccessMessage.vue';
export default {
    data() {
        return {
            isLoading: false,
            formData: {
                email: '',
                password: ''
            },
            isLoading: false
        }
    },
    components: {
        // SuccessMessage
    },
    methods: {
        async login() {
            if (this.isLoading) return;
            this.isLoading = true;

            try {
                const response = await useAuthStore().login(this.formData);

                if (response.data.success) {
                    localStorage.setItem("token", response.data.data.token);
                    this.showSuccess();
                    if (response.data.data.user.userType === 'RECRUITER') {
                        this.$router.push({ name: 'RecruiterDashboard' });
                    } else {
                        this.$router.push({ name: 'CandidateDashboard' });
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                this.isLoading = false;
            }
        },
        showSuccess() {
            ElNotification({
                title: 'Success',
                message: "You've logged in successfully",
                type: 'success',
        })
    }
    }
}
</script>
