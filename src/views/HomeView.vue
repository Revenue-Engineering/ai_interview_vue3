<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 px-6">
    <div class="max-w-3xl text-center">
      <h1 class="text-4xl font-extrabold text-gray-900">AI Interviewer for Recruiters</h1>
      <p class="mt-4 text-gray-600 text-lg">
        Streamline your hiring process by conducting structured, AI-powered candidate interviews — saving time and
        improving decision quality.
      </p>
      <div class="mt-8 flex justify-center">
        <button @click="$router.push({ name: 'Login' })"
          class="px-6 py-3 bg-slate-700 cursor-pointer text-white rounded-lg shadow hover:bg-slate-800 transition">
          Get Started
        </button>
      </div>
      <div class="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="p-6 bg-white rounded shadow-sm">
          <h3 class="font-semibold">Automated Questioning</h3>
          <p class="mt-2 text-sm text-gray-600">Our AI generates tailored questions based on job role and candidate
            profile.</p>
        </div>
        <div class="p-6 bg-white rounded shadow-sm">
          <h3 class="font-semibold">Objective Scoring</h3>
          <p class="mt-2 text-sm text-gray-600">Receive unbiased, structured evaluations for every candidate interview.
          </p>
        </div>
        <div class="p-6 bg-white rounded shadow-sm">
          <h3 class="font-semibold">Detailed Reports</h3>
          <p class="mt-2 text-sm text-gray-600">Get comprehensive summaries to support your hiring decisions.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIInterviewerHomepage'
};
</script>

<style scoped>
/* Tailwind handles most of the styling */
</style>
