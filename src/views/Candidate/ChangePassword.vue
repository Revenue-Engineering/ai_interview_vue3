<template>
    <div class="py-16 flex items-center justify-center px-4">
        <div class="w-full max-w-sm bg-white border border-slate-200 rounded-lg shadow-sm p-6">
            <h2 class="text-base font-medium text-slate-800 mb-4 text-center">
                Change Password
            </h2>
            <form @submit.prevent="handleChangePassword" class="space-y-4 text-sm">
                <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">Current Password</label>
                    <input type="password" v-model="form.currentPassword" placeholder="********"
                        class="w-full px-3 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-slate-700 text-sm"
                        required />
                </div>

                <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">New Password</label>
                    <input type="password" v-model="form.newPassword" placeholder="********"
                        class="w-full px-3 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-slate-700 text-sm"
                        required />
                </div>

                <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">Confirm New Password</label>
                    <input type="password" v-model="form.confirmPassword" placeholder="********"
                        class="w-full px-3 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-slate-700 text-sm"
                        required />
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full bg-slate-800 text-white text-sm py-1.5 rounded-md hover:bg-slate-700 transition-colors flex items-center justify-center">
                    <span v-if="!loading">Update</span>
                    <span v-else class="flex items-center space-x-1">
                        <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <span>Updating...</span>
                    </span>
                </button>


                <p v-if="error" class="text-xs text-red-600 text-center mt-2">{{ error }}</p>
                <p v-if="success" class="text-xs text-green-600 text-center mt-2">{{ success }}</p>
            </form>
        </div>
    </div>
    <Notification v-if="showSuccessMessage" messageType="success" message="Password changed successfully!" />
</template>

<script>
import Notification from '@/components/Common/Notification.vue'
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'ChangePassword',
    data() {
        return {
            form: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            error: '',
            showSuccessMessage: false,
            authStore: useAuthStore(),
            loading: false,
        };
    },
    components: {
        Notification
    },
    methods: {
        async handleChangePassword() {
            this.error = '';
            this.success = '';
            this.loading = true;

            if(this.form.confirmPassword != this.form.newPassword) {
                alert('New password and confirm password do not match')
                this.loading = false;
                return;
            }

            try {
                const response = await this.authStore.changePassword(this.form);
                if (response.data.success) {
                    this.showSuccessMessage = true;
                } else {
                    this.error = response.data.message || 'Something went wrong.';
                }
                return response;
            } catch (e) {
                this.error = e.response?.data?.message || 'An unexpected error occurred.';
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped></style>
