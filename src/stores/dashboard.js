import { defineStore } from "pinia";
import { ref } from "vue";
import { defaultAxios, setAccessTokenForApiCalls } from "@/services/api";


export const useAuthStore = defineStore("authStore", () => {
    const candidateData = ref({
        candidate: {},
        candidateList: null,
    });


    async function getAllCandidates() {
        const response = await defaultAxios.get("/me");
        return response;
    }


    return {
        getAllCandidates
    };
});