<template>
    <div class="px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold text-gray-900">Jobs</h1>
                <p class="mt-2 text-sm text-gray-700">A list of all the Jobs in your account including their
                    name,
                    title, email and role.</p>
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button type="button" @click="triggerShowAddJob()"
                    class="block rounded-md bg-slate-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600">Add
                    Job</button>
            </div>
        </div>
        <div class="mt-8 flow-root">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div class="overflow-hidden shadow outline outline-1 outline-black/5 sm:rounded-lg">
                        <table class="relative min-w-full divide-y divide-gray-300">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Job Title</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Category</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        City</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Country</th>
                                    <th scope="col" class="py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span class="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-for="job in jobs" :key="job.email">
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {{ job.name }}</td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ job.jobCategory }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ job.city }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ job.country }}</td>
                                    <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <a href="#" class="text-slate-600 hover:text-slate-900">Edit<span
                                                class="sr-only">, {{ job.name }}</span></a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
<AddJob v-if="showAddJob" :show="showAddJob" @closeShowAddJob="closeShowAddJob"/>
</template>


<script>
import { useJobStore } from '@/stores/job.js'
import AddJob from '../../components/Recruiter/AddJob.vue';

export default {
    name: 'JobList',
    data() {
        return {
            jobs: [],
            jobStore: useJobStore(),
            showAddJob: false
        }
    },
    components: {
        AddJob
    },
    methods: {
        triggerShowAddJob() {
            this.showAddJob = true;
        },
        closeShowAddJob(state) {
            if(state) {
                this.showAddJob = false;
                this.fetchJobs();
            } else {
                this.showAddJob = false;
            }
        },
        async fetchJobs() {
            try {
                const response = await useJobStore().getAllJobs();
                this.jobs = response.data;
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        }
    },
    mounted() {
        this.fetchJobs();
    }

}
</script>