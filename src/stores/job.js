import { defineStore } from 'pinia';
import { ref } from 'vue';
import { defaultAxios } from '@/services/api';

export const useJobStore = defineStore('jobStore', () => {
    const jobList = ref(null);

    const getAllJobs = async () => {
        try {
            const response = await defaultAxios.get('/jobs/organization/jobs');
            jobList.value = response.data;
            return response.data;
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            throw error;
        }
    };

    const createJob = async (data) => {
        try {
            const response = await defaultAxios.post('/jobs/', data);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            throw error;
        }
    };

    return {
        getAllJobs,
        createJob
    };
});
