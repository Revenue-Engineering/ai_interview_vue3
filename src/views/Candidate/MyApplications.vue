<template>
    <div class="min-h-screenpy-10 px-6">
        <div class="max-w-7xl mx-auto">
            <h1 class="text-xl font-semibold text-gray-800 mb-8">My Job Applications</h1>

            <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <div v-for="app in applications" :key="app.id" class="group relative h-[200px] flex flex-col">
                    <!-- Thin Gradient Border -->
                    <div
                        class="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    </div>

                    <!-- Inner Card -->
                    <div @click="$router.push({ name: 'ApplicationDetail', params: { jobId: app.id } })" class="cursor-pointer relative flex flex-col justify-between h-full bg-white rounded-2xl p-5
                        border border-gray-100 transition-transform duration-300 group-hover:scale-[1.02]
                        group-hover:shadow-xl">
                        <div class="flex justify-between items-start">
                            <div>
                                <h2 class="text-lg font-bold text-gray-800">{{ app.job.name }}</h2>
                                <p class="text-sm text-gray-500">{{ app.job.jobCategory }}</p>
                                <p class="text-sm text-gray-500">{{ app.job.city }}, {{ app.job.country }}</p>


                            </div>

                            <span class="text-xs font-semibold px-2 py-2 rounded-full" :class="{
                                    'bg-green-100 text-green-700': app.status === 'Accepted',
                                    'bg-yellow-100 text-yellow-700': app.status === 'PENDING',
                                    'bg-red-100 text-red-700': app.status === 'Rejected',
                                }">
                                {{ app.status }}
                            </span>
                        </div>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                {{ app.job.jobDescriptionText?.length > 50
                                    ? app.job.jobDescriptionText.slice(0, 50) + '...'
                                    : app.job.jobDescriptionText }}
                            </p>
                        </div>
                        <div class="mt-2 text-sm text-gray-600 space-y-1">
                            <p><span class="font-medium text-gray-700">Applied On:</span> {{
                                formatDate(app.appliedAt) }}</p>
                            <p v-if="app.location"><span class="font-medium text-gray-700">Location:</span> {{
                                app.location }}</p>
                            <p v-if="app.notes"><span class="font-medium text-gray-700">Notes:</span> {{ app.notes
                                }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { useApplicationStore } from '../../stores/application';

export default {
  name: 'JobApplications',
  data() {
    return {
      applications: []
    }
  },
  methods: {
    formatDate(dateString) {
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(dateString).toLocaleString(undefined, options);
    },

      async getCandidateApplications() {
          const response = await useApplicationStore().getCandidateApplications();
          console.log(response)
          this.applications = response.data;
      }
  },
  mounted() {
    this.getCandidateApplications();
  }
};
</script>
