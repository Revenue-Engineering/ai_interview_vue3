<template>
    <div class="flex min-h-full flex-1 flex-col justify-center w-full sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <div>
                <!-- <h2 class="mt-2 text-center text-2xl font-bold tracking-tight text-slate-800">
                    Interview Scheduler
                </h2> -->
            </div>
            <!-- <h2 class="mt-2 text-center text-xl tracking-tight text-slate-800">
                Create interview slots easily
            </h2> -->
        </div>

        <div class="mt-2 sm:mx-auto sm:w-full sm:max-w-full">
            <div class="bg-white px-6 py-8 shadow-2xl sm:rounded-lg sm:px-12">
                <form class="space-y-6" @submit.prevent="submitSchedule">

                    <!-- Job Selection -->
                    <div>
                        <label for="job" class="block text-sm font-medium text-gray-900">Job</label>
                        <el-select v-model="formData.job" placeholder="Select job" class="w-full mt-2">
                            <el-option v-for="job in jobs" :key="job.value" :label="job.label" :value="job.value" />
                        </el-select>
                    </div>

                    <!-- CSV Upload -->
                    <div>
                        <label class="block text-sm font-medium text-gray-900">Upload CSV</label>
                        <el-upload class="mt-2" drag action="#" :auto-upload="false" :on-change="handleFileChange">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">Drop CSV here or <em>click to upload</em></div>
                        </el-upload>
                    </div>

                    <!-- Number of days -->
                    <div>
                        <label for="days" class="block text-sm font-medium text-gray-900">Number of Days</label>
                        <el-input-number v-model="formData.days" :min="1" class="w-full mt-2" />
                    </div>

                    <!-- Start & End Time -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-900">Start Time</label>
                            <el-time-picker v-model="formData.startTime" placeholder="Select time"
                                class="w-full mt-2" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-900">End Time</label>
                            <el-time-picker v-model="formData.endTime" placeholder="Select time" class="w-full mt-2" />
                        </div>
                    </div>

                    <!-- Slots -->
                    <div>
                        <label for="slots" class="block text-sm font-medium text-gray-900">Number of Slots</label>
                        <el-input-number v-model="formData.slots" :min="1" class="w-full mt-2" />
                    </div>

                    <!-- Interview Type -->
                    <div>
                        <label class="block text-sm font-medium text-gray-900">Interview Type</label>
                        <el-select v-model="formData.type" placeholder="Select type" class="w-full mt-2">
                            <el-option label="Technical" value="technical" />
                            <el-option label="Behavioral" value="behavioral" />
                            <el-option label="HR Round" value="hr" />
                        </el-select>
                    </div>

                    <!-- Duration -->
                    <div>
                        <label for="duration" class="block text-sm font-medium text-gray-900">Duration (minutes)</label>
                        <el-input-number v-model="formData.duration" :min="10" class="w-full mt-2" />
                    </div>

                    <!-- Submit -->
                    <div>
                        <el-button type="primary" native-type="submit" :loading="isLoading"
                            class="w-full !bg-blue-600 hover:!bg-blue-500">
                            {{ isLoading ? 'Creating...' : 'Create Schedule' }}
                        </el-button>
                    </div>

                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElNotification } from 'element-plus'

const isLoading = ref(false)

const formData = ref({
    job: '',
    csvFile: null,
    days: 1,
    startTime: '',
    endTime: '',
    slots: 1,
    type: '',
    duration: 30
})

const jobs = [
    { label: 'Frontend Developer', value: 'frontend' },
    { label: 'Backend Developer', value: 'backend' },
    { label: 'Product Manager', value: 'pm' }
]

const handleFileChange = (file) => {
    formData.value.csvFile = file.raw
}

const submitSchedule = async () => {
    if (isLoading.value) return
    isLoading.value = true

    try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        ElNotification({
            title: 'Success',
            message: 'Interview schedule created successfully!',
            type: 'success'
        })
    } catch (err) {
        console.error(err)
    } finally {
        isLoading.value = false
    }
}
</script>

<style>
.el-upload {
    width: 100%;
}
</style>
