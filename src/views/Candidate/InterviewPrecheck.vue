<template>
    <div class="flex items-center justify-center h-screen bg-slate-100 p-4">
        <div class="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center border border-slate-200">
            <h2 class="text-2xl font-semibold text-slate-800 mb-2">Device & Network Check</h2>
            <p class="text-slate-500 mb-4 text-sm">
                Please enter full screen mode and pass all checks before starting the interview.
            </p>

            <!-- 📌 NEW INSTRUCTIONS -->
            <ul
                class="text-left text-xs bg-yellow-50 border border-yellow-300 text-yellow-800 p-3 rounded-lg mb-4 space-y-2">
                <li>⚠️ Do not exit fullscreen mode more than 2 times.</li>
                <li>🔁 Reloading the tab will shuffle the questions — avoid reloading.</li>
                <li>👤 Do not have more than 1 person around you during the interview.</li>
                <li>🚫 Do not try to switch tabs or browser windows during the interview.</li>
            </ul>

            <ul class="text-left text-sm mb-6">
                <li class="flex justify-between mb-2">
                    <span>🎥 Webcam:</span>
                    <span :class="webcamOk ? 'text-green-600' : 'text-red-600'">{{ webcamStatus }}</span>
                </li>
                <li class="flex justify-between mb-2">
                    <span>🎙️ Microphone:</span>
                    <span :class="micOk ? 'text-green-600' : 'text-red-600'">{{ micStatus }}</span>
                </li>
                <li class="flex justify-between mb-2">
                    <span>🌐 Internet:</span>
                    <span :class="netOk ? 'text-green-600' : 'text-red-600'">{{ netStatus }}</span>
                </li>
            </ul>
            <p class="text-red-400 my-2 text-sm">{{ errorMessage }}</p>
            <div class="flex justify-center gap-4">
                <button @click="runAllChecks"
                    class="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-sm text-slate-800 font-medium">
                    Retest
                </button>

                <button :disabled="!allChecksPassed" @click="startInterview()"
                    class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50">
                    Start Interview
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {useInterviewStore} from "@/stores/interview"
import { errorMessages } from "vue/compiler-sfc"
import CodingScreen from "./CodingScreen.vue"
export default {
    props: ['id'],
    name: 'InterviewPrecheck',
    data() {
        return {
            webcamOk: false,
            micOk: false,
            netOk: false,
            webcamStatus: 'Checking...',
            micStatus: 'Checking...',
            netStatus: 'Checking...',
            errorMessage: ''
        }
    },
    computed: {
        allChecksPassed() {
            return this.webcamOk && this.micOk && this.netOk
        },
    },
    mounted() {
        this.runAllChecks()
        document.addEventListener('fullscreenchange', this.onFullscreenChange)
    },
    beforeDestroy() {
        document.removeEventListener('fullscreenchange', this.onFullscreenChange)
    },
    methods: {
        runAllChecks() {
            this.webcamStatus = this.micStatus = this.netStatus = 'Checking...'
            this.webcamOk = this.micOk = this.netOk = false
            this.checkMediaDevices()
            this.checkInternetSpeed()
        },
        async checkMediaDevices() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                this.webcamOk = !!stream.getVideoTracks().length
                this.micOk = !!stream.getAudioTracks().length
                this.webcamStatus = this.webcamOk ? 'Available' : 'Unavailable'
                this.micStatus = this.micOk ? 'Available' : 'Unavailable'
                stream.getTracks().forEach((t) => t.stop())
            } catch {
                this.webcamStatus = 'Unavailable'
                this.micStatus = 'Unavailable'
            }
        },
        checkInternetSpeed() {
            const start = performance.now()
            fetch('https://api.ipify.org?format=json')
                .then((res) => res.json())
                .then(() => {
                    const duration = performance.now() - start
                    if (duration < 100) this.netStatus = 'Excellent'
                    else if (duration < 300) this.netStatus = 'Good'
                    else if (duration < 700) this.netStatus = 'Fair'
                    else this.netStatus = 'Slow'
                    this.netOk = true
                })
                .catch(() => {
                    this.netStatus = 'Unreachable'
                    this.netOk = false
                })
        },
        onFullscreenChange() {
            if (!document.fullscreenElement) {
                // alert('⚠️ Please do not exit fullscreen mode during the interview.')
            }
        },
        async startInterview() {
            try {
                const response = await useInterviewStore().startInterview(this.id);
                debugger
                if (response.message == "Interview started successfully" ) {
                    this.$router.push({ name: 'CodingScreen', params: {id: this.id}})
                }
            console.log(response.data)
            return response;
        } catch(error) {
            console.log(error.response?.data);
            this.errorMessage = error.response.data?.message;
        }
        }
    },
}
</script>
