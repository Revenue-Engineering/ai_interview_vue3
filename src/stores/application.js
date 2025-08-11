import { defineStore } from "pinia";
import { ref } from "vue";
import { defaultAxios } from "@/services/api";


export const useApplicationStore = defineStore("applicationStore", () => {
    const candidateData = ref({
        candidate: {},
        candidateList: null,
    });


    async function getCandidateApplications() {
        const response = await defaultAxios.get("/candidates/applications");
        return response.data;
    }

    async function getApplicationById(id) {
        const response = await defaultAxios.get(`/candidates/applications/${id}`);
        return response.data;
    }

    return {
        getCandidateApplications,
        getApplicationById
    };
});