import { defineStore } from "pinia";
import { ref } from "vue";
import { defaultAxios } from "@/services/api";


export const useRecruiterStore = defineStore("recruiterStore", () => {
    const recruiterData = ref({
        candidate: {},
        candidateList: null,
    });


    async function getCandidateByEmail(email) {
        const response = await defaultAxios.get(`/recruiter-candidates/by-email/${email}`);
        return response.data;
    }

    async function getCandidateDetails(email) {
        const response = await defaultAxios.get(`/recruiter-candidates/by-email/${email}/with-applications`);
        return response.data;
    }


    async function getApplicationByOrg() {
        const response = await defaultAxios.get(`applications/organization`);
        return response.data;
    }




    return {
        getCandidateByEmail,
        getCandidateDetails,
        getApplicationByOrg
    };
});