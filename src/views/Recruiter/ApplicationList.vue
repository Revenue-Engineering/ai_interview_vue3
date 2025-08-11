<template>
    <div class="px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold text-gray-900">Applications</h1>
                <p class="mt-2 text-sm text-gray-700">
                    A list of all the Applications in your account including their
                    name, title, email and role.
                </p>
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button type="button"
                    class="block rounded-md bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600">
                    Add Application
                </button>
            </div>
        </div>

        <!-- Table -->
        <div class="mt-8 flow-root">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div class="overflow-hidden shadow outline outline-1 outline-black/5 sm:rounded-lg">
                        <table class="relative min-w-full divide-y divide-gray-300">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Name
                                    </th>
                                    <th scope="col"
                                        class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Job Title
                                    </th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Category
                                    </th>
                                    <th scope="col" class="py-3.5 pl-3 pr-4 sm:pr-6">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-for="application in applications" :key="application.id">
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {{ application.candidate?.firstName + ' ' + application.candidate?.lastName ||
                                        'N/A' }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {{ application.job?.name }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ application.job?.jobCategory }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                                        <el-button type="primary" class="!bg-slate-700 !border-none">View</el-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="mt-4 flex justify-center">
                        <el-pagination background layout="prev, pager, next" :total="pagination.total"
                            :page-size="pageSize" :current-page="currentPage" @current-change="handlePageChange" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRecruiterStore } from '../../stores/recruiter';

export default {
    data() {
        return {
            applications: [],
            pagination: {
                total: 0,
                totalPages: 1,
                currentPage: 1
            },
            pageSize: 10, // You can adjust this
            currentPage: 1
        }
    },
    methods: {
        async getAllApplications(page = 1) {
            const response = await useRecruiterStore().getApplicationByOrg({ page });
            this.applications = response.data.data;
            this.pagination = response.data.pagination;
            this.currentPage = this.pagination.currentPage;
        },
        handlePageChange(page) {
            this.getAllApplications(page);
        }
    },
    mounted() {
        this.getAllApplications();
    }
}
</script>
