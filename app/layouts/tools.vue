<script setup lang="ts">
import BFFSidebar from "~/components/bff/BFFSidebar.vue";
</script>

<template>
  <UDashboardGroup class="dashboard">
    <BFFSidebar />
    <UPage class="page">
      <slot />
    </UPage>
  </UDashboardGroup>
</template>

<style scoped>
.dashboard {
  top: 112px;
  max-height: calc(100vh - 112px);
}
.page {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 1rem;
  max-height: calc(100vh - 112px);
  overflow-y: auto;
}
</style>
