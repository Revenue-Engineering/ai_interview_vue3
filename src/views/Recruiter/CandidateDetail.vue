<template>
    <div class="min-h-screen p-6 bg-gray-50">
        <!-- Page Title -->
        <h1 class="text-3xl font-bold text-gray-800 mb-8">Candidate Details</h1>

        <!-- Candidate Profile -->
        <el-card v-if="candidate" shadow="hover"
            class="mb-8 p-6 flex items-center gap-6 rounded-xl border border-gray-200 bg-white">
            <img :src="candidate.photoUrl || 'https://cdn2.iconfinder.com/data/icons/telegram/154/telegram-ui-avatar-man-512.png'"
                alt="avatar" class="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm" />
            <div>
                <p class="text-2xl font-semibold text-gray-800">
                    {{ candidate.firstName }} {{ candidate.lastName }}
                </p>
                <p class="text-gray-500 text-sm">{{ candidate.email }}</p>
                <el-tag size="small" type="success" class="mt-3">
                    {{ candidate.userRole }}
                </el-tag>
            </div>
        </el-card>

        <!-- Basic Information -->
        <el-card v-if="candidate.candidateDetails" shadow="never"
            class="mb-8 rounded-xl border border-gray-200 bg-white">
            <h2 class="text-xl font-semibold mb-6 border-b pb-3">Basic Information</h2>
            <div class="grid gap-6 sm:grid-cols-2 text-sm">
                <div><strong>Phone:</strong> {{ candidate.candidateDetails?.phoneNumber || 'N/A' }}</div>
                <div><strong>Location:</strong> {{ candidate.candidateDetails?.location || 'N/A' }}</div>
                <div><strong>Skills:</strong> {{ candidate.candidateDetails?.skills || 'N/A' }}</div>
                <div><strong>Education:</strong> {{ candidate.candidateDetails?.education || 'N/A' }}</div>
                <div><strong>Experience:</strong> {{ candidate.candidateDetails?.experience || 'N/A' }}</div>
                <div><strong>Status:</strong> {{ candidate.candidateDetails?.status || 'N/A' }}</div>
            </div>
        </el-card>

        <!-- Applications -->
        <el-card v-if="candidate.applications?.length > 0" shadow="never"
            class="mb-8 rounded-xl border border-gray-200 bg-white">
            <h2 class="text-xl font-semibold mb-6 border-b pb-3">Applications</h2>
            <div v-for="app in candidate.applications" :key="app.id" class="py-4 border-b last:border-b-0">
                <p class="font-medium text-gray-800">{{ app.job?.name }} ({{ app.job?.jobCategory }})</p>
                <p class="text-sm text-gray-500">{{ app.job?.city }}, {{ app.job?.country }}</p>
                <p class="mt-1 text-sm"><strong>Status:</strong> {{ app.status }}</p>
                <p class="text-sm"><strong>Applied On:</strong> {{ formatDate(app.applicationDate) }}</p>
                <p class="text-sm"><strong>Organization:</strong> {{ app.organization?.name }}</p>
            </div>
        </el-card>

        <!-- Interviews -->
        <el-card v-if="candidate.applications?.[0]?.interviews?.length" shadow="never"
            class="rounded-xl border border-gray-200 bg-white">
            <h2 class="text-xl font-semibold mb-6 border-b pb-3">Interviews</h2>
            <div v-for="interview in candidate.applications[0].interviews" :key="interview.id"
                class="py-4 border-b last:border-b-0">
                <p class="text-sm"><strong>Type:</strong> {{ interview.interviewType }}</p>
                <p class="text-sm"><strong>Mode:</strong> {{ interview.mode }}</p>
                <p class="text-sm"><strong>Status:</strong> {{ interview.status }}</p>
                <p class="text-sm"><strong>Scheduled At:</strong> {{ formatDate(interview.scheduledAt) }}</p>
                <p class="text-sm"><strong>Duration:</strong> {{ interview.durationMinutes }} minutes</p>
            </div>
        </el-card>
    </div>
</template>

<script>
import { useRecruiterStore } from '../../stores/recruiter';

export default {
    name: 'CandidateDetail',
    props: {
        email: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            candidate: {
                candidateDetails: {},
                applications: []
            }
        };
    },
    methods: {
        async getCandidateDetails() {
            try {
                const response = await useRecruiterStore().getCandidateDetails(this.email);
                this.candidate = response.data;
            } catch (error) {
                console.error("Error fetching candidate details:", error);
            }
        },
        formatDate(dateStr) {
            if (!dateStr) return 'N/A';
            return new Date(dateStr).toLocaleDateString();
        }
    },
    mounted() {
        this.getCandidateDetails();
    }
};
</script>

<style scoped>
.el-card {
    transition: all 0.2s ease-in-out;
}

.el-card:hover {
    transform: translateY(-2px);
}
</style>
