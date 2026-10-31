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
  top: var(--site-chrome-height, var(--ui-header-height));
}
.dashboard :deep(.sidebar) {
  min-height: 0;
}
.dashboard :deep(.sidebar-footer) {
  border-top: 1px solid var(--ui-border);
}
.page {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 1rem;
  max-height: calc(100dvh - var(--site-chrome-height, var(--ui-header-height)));
  overflow-y: auto;
}
</style>
