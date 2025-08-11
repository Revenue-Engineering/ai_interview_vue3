<template>
    <div class="min-h-screen p-6 bg">
        <!-- Page Title -->
        <h1 class="text-2xl font-semibold text-gray-800 mb-6">Search Candidate</h1>

        <!-- Search Box -->
        <el-card shadow="never" class="p-6 rounded-lg">
            <form @submit.prevent="searchCandidate" class="flex flex-col sm:flex-row gap-4">
                <el-input v-model="email" placeholder="Enter candidate email" clearable prefix-icon="Message"
                    class="flex-1" />
                <el-button type="primary" native-type="submit" :loading="isLoading"
                    class="flex items-center justify-center !bg-slate-700 !border-none">
                    Search
                </el-button>
            </form>
        </el-card>

        <!-- Candidate Result -->
        <div v-if="searched && candidate" class="mt-6">
            <el-card shadow="hover" class="rounded-lg transition-transform transform hover:scale-[1.02]" @click="$router.push({name: 'CandidateDetail', params:{email: candidate.email}})">
                <div class="flex items-center gap-4">
                    <img src="https://cdn2.iconfinder.com/data/icons/telegram/154/telegram-ui-avatar-man-512.png"
                        alt="avatar" class="w-14 h-14 rounded-full object-cover border" />
                    <div>
                        <p class="text-lg font-medium text-gray-800">{{ candidate.firstName }}</p>
                        <p class="text-gray-500">{{ candidate.email }}</p>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- No Result -->
        <div v-else-if="searched && !candidate" class="mt-6 text-gray-500 text-center">
            No candidate found with that email.
        </div>
    </div>
</template>

<script>
import { ElNotification } from 'element-plus'
import { useRecruiterStore } from '../../stores/recruiter'
import CandidateDetail from './CandidateDetail.vue'

export default {
    name: 'SearchCandidate',
    data() {
        return {
            email: '',
            isLoading: false,
            candidate: null,
            searched: false
        }
    },
    methods: {
        async searchCandidate() {
            if (!this.email) return
            this.isLoading = true
            this.searched = false
            this.candidate = null

            try {
                const response = await useRecruiterStore().getCandidateByEmail(this.email)
                // Assuming API always returns one candidate object or null
                this.candidate = response.data || null
                this.searched = true
            } catch (error) {
                ElNotification({
                    title: 'Error',
                    message: 'Failed to search candidate',
                    type: 'error'
                })
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>

<style scoped>
.el-card {
    border-radius: 0.5rem;
}
</style>
