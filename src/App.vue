<template>
  <div>
    <component :is="layoutComponent">
      <!-- Content passed to slot -->
      <router-view />
    </component>
  </div>
</template>

<script>
import RecruiterInnerApp from '@/layouts/RecruiterInnerApp.vue';
import CandidateInnerApp from '@/layouts/CandidateInnerApp.vue';
import AuthLayout from '@/layouts/Blank.vue';

export default {
  components: {
    RecruiterInnerApp,
    CandidateInnerApp,
    AuthLayout
  },
  computed: {
    layoutComponent() {
      const layout = this.$route.meta.layout;
      if (layout === 'Blank') return 'AuthLayout';
      if (layout === 'RecruiterInnerApp') return 'RecruiterInnerApp';
      if (layout === 'CandidateInnerApp') return 'CandidateInnerApp';
      return 'RecruiterInnerApp'; // default fallback
    }
  }
}
</script>
