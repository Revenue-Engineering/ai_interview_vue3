<template>
    <div class="min-h-screenp-2 space-y-6">
        <!-- Interview Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Upcoming Interviews Card -->
            <div
                class="rounded-2xl p-6 bg-white shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:-translate-y-1 hover:scale-[1.01] duration-200 relative overflow-hidden flex flex-col justify-between">
                <div>
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-20 pointer-events-none rounded-2xl">
                    </div>
                    <h2 class="text-xl font-semibold text-gray-800 mb-4">Upcoming Interviews</h2>
                    <ul class="text-gray-600 space-y-3 text-sm">
                        <li class="flex justify-between">
                            <span>Frontend Developer</span>
                            <span class="text-gray-500">3 Aug, 11:00 AM</span>
                        </li>
                        <li class="flex justify-between">
                            <span>Backend Engineer</span>
                            <span class="text-gray-500">5 Aug, 3:00 PM</span>
                        </li>
                    </ul>
                </div>
                <div class="mt-6">
                    <button
                        class="mt-4 w-full py-2 text-sm font-medium text-blue-600 border border-blue-100 hover:bg-blue-50 rounded-lg transition">
                        Show All
                    </button>
                </div>
            </div>

            <!-- Interviews Taken Card -->
            <div
                class="rounded-2xl p-6 bg-white shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:-translate-y-1 hover:scale-[1.01] duration-200 relative overflow-hidden flex flex-col justify-between">
                <div>
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-gray-100 to-transparent opacity-20 pointer-events-none rounded-2xl">
                    </div>
                    <h2 class="text-xl font-semibold text-gray-800 mb-4">Interviews Taken</h2>
                    <ul class="text-gray-600 space-y-3 text-sm">
                        <li class="flex justify-between">
                            <span>Full Stack Intern</span>
                            <span class="text-green-600 font-medium">Completed</span>
                        </li>
                        <li class="flex justify-between">
                            <span>iOS Developer</span>
                            <span class="text-red-500 font-medium">Rejected</span>
                        </li>
                    </ul>
                </div>
                <div class="mt-6">
                    <button
                        class="mt-4 w-full py-2 text-sm font-medium text-green-600 border border-green-100 hover:bg-green-50 rounded-lg transition">
                        Show All
                    </button>
                </div>
            </div>
        </div>

        <!-- Instructions -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Interview Guidelines</h3>
            <ul class="list-disc list-inside text-gray-600 space-y-2 text-sm">
                <li>Only the candidate should be visible on camera. No one else should be present in the frame during
                    the interview.</li>
                <li>Copying and pasting code or text is strictly prohibited to maintain assessment integrity.</li>
                <li>Switching browser tabs during the interview is not allowed and may result in disqualification.</li>
                <li>The interview must be conducted in fullscreen mode. Exiting fullscreen will be flagged as a
                    violation.</li>
                <li>Ensure that your webcam is connected and functioning properly before the interview begins.</li>
                <li>Your microphone should be working clearly to allow uninterrupted communication.</li>
                <li>A stable internet connection is essential. Frequent disconnects may lead to automatic termination of
                    the interview.</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InterviewDashboard'
}
</script>
