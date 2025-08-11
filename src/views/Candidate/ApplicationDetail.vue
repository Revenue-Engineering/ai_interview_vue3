<template>
    <div class="min-h-screen px-4">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Job Details -->
            <div class="lg:col-span-3 bg-white rounded-2xl shadow-lg p-8 space-y-8">
                <!-- Title & Status -->
                <div class="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">{{ job?.name }}</h1>
                        <p class="text-gray-500 text-sm mt-1">{{ job?.organization?.name }}</p>
                    </div>
                    <span class="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                        {{ job?.jobPostingStatus }}
                    </span>
                </div>

                <!-- Job Meta -->
                <div class="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
                    <div><span class="font-medium">Experience:</span> {{ job?.minimumExperience }} - {{
                        job?.maximumExperience }} years</div>
                    <div><span class="font-medium">Openings:</span> {{ job?.numberOfOpenings }}</div>
                    <!-- <div><span class="font-medium">Salary:</span> {{ job?.currencySymbol }}{{
                        job.minAnnualSalary.toLocaleString() }} – {{ job?.maxAnnualSalary.toLocaleString() }} / {{
                        job.salaryType }}</div> -->
                    <div><span class="font-medium">Specialization:</span> {{ job?.specialization || 'N/A' }}</div>
                    <div><span class="font-medium">Job Category:</span> {{ job?.jobCategory }}</div>
                    <div><span class="font-medium">Skills:</span> {{ job?.jobSkill }}</div>
                </div>

                <!-- Location -->
                <div class="text-sm text-gray-700">
                    <span class="font-medium text-gray-900">Location:</span>
                    <p class="mt-1">
                        {{ job.locality ? job.locality + ', ' : '' }}
                        {{ job.city ? job.city + ', ' : '' }}
                        {{ job.state ? job.state + ', ' : '' }}
                        {{ job.country || '' }}
                    </p>
                    <p v-if="job.address" class="text-xs mt-1 text-gray-500">{{ job.address }}</p>
                </div>

                <!-- Description -->
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 mb-2">Job Description</h2>
                    <p class="text-sm text-gray-700 whitespace-pre-line">{{ job.jobDescriptionText }}</p>
                </div>

                <!-- Application Button -->
                <div v-if="job.enableJobApplicationForm && job.applicationFormUrl" class="pt-4">
                    <a :href="job.applicationFormUrl" target="_blank" rel="noopener"
                        class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-md transition">
                        Apply Now
                    </a>
                </div>

                <!-- Timestamps -->
                <div class="text-xs text-gray-400 border-t pt-4">
                    <p>Posted on {{ formatDate(job.createdOn) }} | Last updated {{ formatDate(job.updatedOn) }}</p>
                </div>
            </div>

            <!-- Sidebar: Interview Card + Org Info -->
            <aside class="space-y-6 sticky top-12 h-fit">
                <!-- Interview Card -->
                <div class="bg-white rounded-2xl shadow-lg p-6">
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Interview Schedule</h2>
                    <div v-if="interviews.length > 0" class="space-y-3 text-sm text-gray-700">
                        <div v-for="interview in interviews" :key="interview.id"
                            class="border border-gray-100 rounded-lg px-3 py-2 flex justify-between items-center">
                            <div>
                                <p class="font-medium">{{ formatDateTime(interview.scheduledAt) }}</p>
                                <p class="text-xs text-gray-500">Mode: {{ interview.mode }}</p>
                            </div>
                            <span class="text-xs font-semibold px-2 py-1 rounded-full"
                                :class="statusBadge(interview.status)">
                                {{ interview.status }}
                            </span>
                        </div>
                    </div>
                    <p v-else class="text-sm text-gray-500">No interviews scheduled yet.</p>
                </div>

                <!-- Organization Card -->
                <div class="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                    <h2 class="text-lg font-semibold text-gray-800 mb-2">About the Organization</h2>
                    <div class="text-sm text-gray-700 space-y-2">
                        <div class="font-bold" v-if="job.organization?.name">{{ job.organization?.name }}</div>
                        <div v-if="job.organization?.description">{{ job.organization?.description }}</div>
                        <div><span class="font-medium">Industry:</span> {{ job.organization?.industry || 'N/A' }}</div>
                        <div><span class="font-medium">Company Size:</span> {{ job.organization?.size || 'N/A' }}</div>
                        <div><span class="font-medium">Location:</span> {{ job.organization?.location || 'N/A' }}</div>
                        <div v-if="job.organization?.website">
                            <span class="font-medium">Website:</span>
                            <a :href="job.organization?.website" target="_blank" rel="noopener"
                                class="text-indigo-600 hover:underline break-all">
                                {{ job.organization?.website }}
                            </a>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</template>

<script>

import { useApplicationStore } from '@/stores/application';

export default {
    props: ['jobId'],
    name: 'JobPostDetails',
    data() {
        return {
            job: {},
            interviews: {}
        };
    },
    methods: {
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
        formatDateTime(datetime) {
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            };
            return new Date(datetime).toLocaleString(undefined, options);
        },
        statusBadge(status) {
            return {
                'bg-yellow-100 text-yellow-700': status === 'Pending',
                'bg-blue-100 text-blue-700': status === 'Under Review',
                'bg-green-100 text-green-700': status === 'Selected',
                'bg-red-100 text-red-700': status === 'Rejected',
            };
        },
        async getApplicationById() {
            const response = await useApplicationStore().getApplicationById(this.jobId);
            this.job = response.data.job;
            this.organization = response.data.organization
            this.interviews = response.data.interviews
        }
    },
    mounted() {
        this.getApplicationById();
    }
};
</script>
