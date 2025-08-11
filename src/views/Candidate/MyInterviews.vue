<template>
    <div class="min-h-screen px-6">
        <div class="max-w-7xl mx-auto">
            <h1 class="text-xl font-semibold text-gray-800 mb-8">My Interviews</h1>

            <!-- Upcoming Interviews -->
            <div v-if="upcoming.length" class="mb-10">
                <h2 class="text-lg font-semibold text-gray-700 mb-4">Upcoming Interviews</h2>
                <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div v-for="interview in upcoming" :key="interview.id"
                        class="group relative h-[200px] flex flex-col">
                        <!-- Gradient Border -->
                        <div
                            class="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        </div>

                        <!-- Inner Card -->
                        <div class="cursor-pointer relative flex flex-col justify-between h-full bg-white rounded-2xl p-5 border border-gray-100 transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl"
                            @click="$router.push({ name: 'ApplicationDetail', params: { jobId: interview.application.jobId } })">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h2 class="text-lg font-bold text-gray-800">
                                        {{ interview.application.job.name }}
                                    </h2>
                                    <p class="text-sm text-gray-500">
                                        {{ interview.application.job.organization.name }}
                                    </p>
                                </div>
                                <span class="text-xs font-semibold px-2 py-1 rounded-full" :class="{
                                    'bg-yellow-100 text-yellow-700': interview.status === 'pending',
                                    'bg-green-100 text-green-700': interview.status === 'completed',
                                    'bg-gray-100 text-gray-700': interview.status === 'cancelled'
                                }">
                                    {{ interview.status }}
                                </span>
                            </div>

                            <div class="mt-4 text-sm text-gray-600 space-y-1">
                                <p>
                                    <span class="font-medium text-gray-700">Scheduled:</span>
                                    {{ formatDate(interview.scheduledAt, interview.timezone) }}
                                </p>
                                <p v-if="interview.application.notes">
                                    <span class="font-medium text-gray-700">Notes:</span>
                                    {{ interview.application.notes.replace(/"/g, '') }}
                                </p>
                            </div>

                            <div v-if="!interview.startedAt" class="mt-4">
                                <button @click.stop="startInterview(interview.id)"
                                    class="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700">
                                    Start Interview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Past Interviews -->
            <div v-if="past.length">
                <h2 class="text-lg font-semibold text-gray-700 mb-4">Past Interviews</h2>
                <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div v-for="interview in past" :key="interview.id" class="group relative h-[200px] flex flex-col">
                        <!-- Gradient Border -->
                        <div
                            class="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        </div>

                        <!-- Inner Card -->
                        <div class="relative flex flex-col justify-between h-full bg-white rounded-2xl p-5 border border-gray-100 transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl"
                            @click="$router.push({ name: 'ApplicationDetail', params: { jobId: interview.application.jobId } })">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h2 class="text-lg font-bold text-gray-800">
                                        {{ interview.application.job.name }}
                                    </h2>
                                    <p class="text-sm text-gray-500">
                                        {{ interview.application.job.organization.name }}
                                    </p>
                                </div>
                                <span class="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                    Completed
                                </span>
                            </div>

                            <div class="mt-4 text-sm text-gray-600 space-y-1">
                                <p>
                                    <span class="font-medium text-gray-700">Scheduled:</span>
                                    {{ formatDate(interview.scheduledAt, interview.timezone) }}
                                </p>
                                <p>
                                    <span class="font-medium text-gray-700">Ended:</span>
                                    {{ formatDate(interview.endedAt, interview.timezone) }}
                                </p>
                                <p v-if="interview.application.notes">
                                    <span class="font-medium text-gray-700">Notes:</span>
                                    {{ interview.application.notes.replace(/"/g, '') }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p v-if="!past.length && !upcoming.length" class="text-gray-500 text-center mt-10">
                No interviews found.
            </p>
        </div>
    </div>

    <!-- Popup Confirmation -->
    <!-- Fullscreen Prompt Modal -->
    <div v-if="showFullscreenPrompt" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Enter Fullscreen Mode</h3>
            <p class="text-gray-600 text-sm mb-6">
                To start the interview, you need to switch to fullscreen mode. Do you want to proceed?
            </p>
            <div class="flex justify-end space-x-3">
                <button @click="cancelFullscreenPrompt"
                    class="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                    Cancel
                </button>
                <button @click="confirmFullscreenPrompt"
                    class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Yes, Proceed
                </button>
            </div>
        </div>
    </div>

</template>

<script>
import { useInterviewStore } from "@/stores/interview.js";

export default {
    name: "JobApplications",
    data() {
        return {
            interviews: [],
            showFullscreenPrompt: false,
            selectedInterviewId: null,
        };
    },
    computed: {
        upcoming() {
            return this.interviews.filter(
                (i) => new Date(i.scheduledAt) > new Date() && !i.endedAt
            );
        },
        past() {
            return this.interviews.filter((i) => i.endedAt);
        },
    },
    methods: {
        formatDate(dateString, timezone = "UTC") {
            try {
                const date = new Date(dateString);
                return date.toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: timezone,
                });
            } catch {
                return "Invalid Date";
            }
        },
        async getCandidateInterviews() {
            const response = await useInterviewStore().getCandidateInterviews();
            this.interviews = response.data || [];
        },
        startInterview(interviewId) {
            this.selectedInterviewId = interviewId;
            this.showFullscreenPrompt = true;
        },
        cancelFullscreenPrompt() {
            this.showFullscreenPrompt = false;
            this.selectedInterviewId = null;
        },
        async confirmFullscreenPrompt() {
            this.showFullscreenPrompt = false;
            this.$router.push({name: 'InterviewPrecheck', params: {id: this.selectedInterviewId}})
            await this.enterFullscreen();
            // Now you can navigate to the interview room
            // this.$router.push({ name: "InterviewRoom", params: { id: this.selectedInterviewId } });
        },
        enterFullscreen() {
            const el = document.documentElement;
            if (el.requestFullscreen) return el.requestFullscreen();
            else if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
            else if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
            else if (el.msRequestFullscreen) return el.msRequestFullscreen();
        },
    },
    mounted() {
        this.getCandidateInterviews();
    },
};
</script>
