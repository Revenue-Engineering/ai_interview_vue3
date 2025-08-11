<template>
    <div>
        <p class="mb-2 font-medium">Live Interview Video</p>
        <video ref="videoRef" autoplay playsinline muted
            class="w-full aspect-video rounded border bg-black"></video>
    </div>
</template>

<script>
export default {
    name: 'VideoDisplay',
    data() {
        return {
            stream: null
        }
    },
    async mounted() {
        await this.startWebcam()
    },
    beforeUnmount() {
        this.stopWebcam()
    },
    methods: {
        async startWebcam() {
            try {
                this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                this.$nextTick(() => {
                    if (this.$refs.videoRef) {
                        this.$refs.videoRef.srcObject = this.stream
                    }
                })
            } catch (err) {
                console.error('Webcam error:', err)
            }
        },
        stopWebcam() {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop())
                this.stream = null
            }
        }
    }
}
</script> 