<template>
    <div>
        <TransitionRoot as="template" :show="open">
            <Dialog class="relative z-50" @close="closeShowAddJob">
                <div class="fixed inset-0" />

                <div class="fixed inset-0 overflow-hidden">
                    <div class="absolute inset-0 overflow-hidden">
                        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                            <TransitionChild as="template"
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enter-from="translate-x-full" enter-to="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leave-from="translate-x-0" leave-to="translate-x-full">
                                <DialogPanel class="pointer-events-auto w-screen max-w-2xl">
                                    <div class="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                                        <div class="px-4 sm:px-6">
                                            <div class="flex items-start justify-between">
                                                <DialogTitle class="text-base font-semibold text-gray-900">Add Job
                                                </DialogTitle>
                                                <div class="ml-3 flex h-7 items-center">
                                                    <button type="button"
                                                        class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                                        @click="closeShowAddJob()">
                                                        <span class="absolute -inset-2.5" />
                                                        <span class="sr-only">Close panel</span>
                                                        <XMarkIcon class="size-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="relative mt-6 flex-1 px-4 sm:px-6">
                                            <!-- Element Plus Form -->
                                            <el-form :model="form" label-position="top"
                                                class="p-6 bg-white rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <!-- Job Title -->
                                                <el-form-item label="Job Title">
                                                    <el-input v-model="form.name"
                                                        placeholder="e.g., Software Engineer" />
                                                </el-form-item>

                                                <!-- Openings -->
                                                <el-form-item label="Openings">
                                                    <el-input v-model.number="form.numberOfOpenings" type="number" />
                                                </el-form-item>

                                                <!-- Min Experience -->
                                                <el-form-item label="Min Experience (yrs)">
                                                    <el-input v-model.number="form.minimumExperience" type="number" />
                                                </el-form-item>

                                                <!-- Max Experience -->
                                                <el-form-item label="Max Experience (yrs)">
                                                    <el-input v-model.number="form.maximumExperience" type="number" />
                                                </el-form-item>

                                                <!-- Min Salary -->
                                                <el-form-item label="Min Annual Salary">
                                                    <el-input v-model.number="form.minAnnualSalary" type="number" />
                                                </el-form-item>

                                                <!-- Max Salary -->
                                                <el-form-item label="Max Annual Salary">
                                                    <el-input v-model.number="form.maxAnnualSalary" type="number" />
                                                </el-form-item>

                                                <!-- Skills -->
                                                <el-form-item label="Skills">
                                                    <el-input v-model="form.jobSkill"
                                                        placeholder="e.g., JavaScript, React" />
                                                </el-form-item>

                                                <!-- Category -->
                                                <el-form-item label="Category">
                                                    <el-input v-model="form.jobCategory" />
                                                </el-form-item>

                                                <!-- Country -->
                                                <el-form-item label="Country">
                                                    <el-input v-model="form.country" />
                                                </el-form-item>

                                                <!-- State -->
                                                <el-form-item label="State">
                                                    <el-input v-model="form.state" />
                                                </el-form-item>

                                                <!-- City -->
                                                <el-form-item label="City">
                                                    <el-input v-model="form.city" />
                                                </el-form-item>

                                                <!-- Currency ID -->
                                                <el-form-item label="Currency ID">
                                                    <el-input v-model.number="form.currencyId" type="number" />
                                                </el-form-item>

                                                <!-- Salary Type -->
                                                <el-form-item label="Salary Type">
                                                    <el-select v-model="form.salaryType"
                                                        placeholder="Select salary type">
                                                        <el-option label="Annual" value="ANNUAL" />
                                                        <el-option label="Monthly" value="MONTHLY" />
                                                        <el-option label="Hourly" value="HOURLY" />
                                                    </el-select>
                                                </el-form-item>

                                                <!-- Status -->
                                                <el-form-item label="Status">
                                                    <el-select v-model="form.jobPostingStatus"
                                                        placeholder="Select status">
                                                        <el-option label="Active" value="ACTIVE" />
                                                        <el-option label="Inactive" value="INACTIVE" />
                                                        <el-option label="Draft" value="DRAFT" />
                                                    </el-select>
                                                </el-form-item>

                                                <!-- Enable Application Form -->
                                                <el-form-item class="col-span-2">
                                                    <el-checkbox v-model="form.enableJobApplicationForm">
                                                        Enable Job Application Form
                                                    </el-checkbox>
                                                </el-form-item>

                                                <!-- Submit -->
                                                <el-form-item class="col-span-2">
                                                    <el-button type="primary" @click="addJob" class="w-full">
                                                        Add Job
                                                    </el-button>
                                                </el-form-item>
                                            </el-form>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>

<script>
import { ref } from 'vue'
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useJobStore } from '../../stores/job'
import { ElNotification } from 'element-plus'

export default {
    components: {
        Dialog,
        DialogPanel,
        DialogTitle,
        TransitionChild,
        TransitionRoot,
        XMarkIcon,
    },
    props: ['show'],
    data() {
        return {
            open: this.show,
            form: {
                name: 'Software Engineer 2',
                numberOfOpenings: 5,
                minimumExperience: 2,
                maximumExperience: 5,
                minAnnualSalary: 80000,
                maxAnnualSalary: 120000,
                jobSkill: 'JavaScript, React, Node.js, TypeScript',
                jobCategory: 'Engineering',
                city: 'San Francisco',
                country: 'USA',
                state: 'CA',
                enableJobApplicationForm: true,
                currencyId: 1,
                salaryType: 'ANNUAL',
                jobPostingStatus: 'ACTIVE',
            },
        }
    },
    methods: {
        closeShowAddJob(state) {
            this.$emit('closeShowAddJob', state);
        },
        showSuccess() {
            ElNotification({
                title: 'Success',
                message: "Job added successfully",
                type: 'success',
        })
        },
        async addJob() {
            const response = await useJobStore().createJob(this.form);
            debugger
            if(response.success) {
                this.showSuccess();
                this.closeShowAddJob(true);
            }
            return response;
        }
    }
}
</script>
