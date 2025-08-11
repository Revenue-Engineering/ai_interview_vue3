import { defineStore } from "pinia";
import { ref } from "vue";
import { defaultAxios } from "@/services/api";


export const useInterviewStore = defineStore("interviewStore", () => {
    const candidateData = ref({
        candidate: {},
        candidateList: null,
    });

    // Add lastResult state
    const lastResult = ref(null);
    const isRunningCode = ref(false);
    const isSubmittingCode = ref(false);


    async function getCandidateInterviews() {
        const response = await defaultAxios.get("/candidates/interviews");
        return response.data;
    }

    async function getInterviewById(id) {
        const response = await defaultAxios.get(`/candidates/applications/${id}`);
        return response.data;
    }

    async function startInterview(id) {
        const response = await defaultAxios.post(`/interviews/${id}/start/`);
        return response.data;
    }

    async function getInterviewQuestions(interviewId) {
        const response = await defaultAxios.get(`/interviews/${interviewId}/questions`);
        return response.data;
    }

    async function runCode(data) {
        isRunningCode.value = true;
        try {
            // Encode user code to base64
            const encodedData = {
                ...data,
                userCode: btoa(unescape(encodeURIComponent(data.userCode)))
            };

            const response = await defaultAxios.post('/interviews/run-code', encodedData);
            lastResult.value = response.data;
            return response.data;
        } finally {
            isRunningCode.value = false;
        }
    }

    async function submitCode(data) {
        isSubmittingCode.value = true;
        try {
            // Encode user code to base64
            const encodedData = {
                ...data,
                userCode: btoa(unescape(encodeURIComponent(data.userCode)))
            };

            const response = await defaultAxios.post('/interviews/submit-code', encodedData);
            lastResult.value = response.data;
            return response.data;
        } finally {
            isSubmittingCode.value = false;
        }
    }

    async function getInterviewSubmissions(interviewId) {
        const response = await defaultAxios.get(`/interviews/${interviewId}/submissions`);
        return response.data;
    }

    return {
        // State
        lastResult,
        isRunningCode,
        isSubmittingCode,

        // Actions
        getCandidateInterviews,
        getInterviewById,
        startInterview,
        getInterviewQuestions,
        runCode,
        submitCode,
        getInterviewSubmissions
    };
});