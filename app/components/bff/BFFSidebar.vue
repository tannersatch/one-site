<script setup lang="ts">
import BFFSidebarNavigation from "./BFFSidebarNavigation.vue";

const avatar = {
  src: "https://github.com/benjamincanac.png",
  loading: "lazy" as const,
};
</script>

<template>
  <UDashboardSidebar
    collapsible
    resizable
    class="sidebar"
    :ui="{ footer: 'sidebar-footer' }"
  >
    <template #default="{ collapsed, collapse }">
      <BFFSidebarNavigation
        :collapsed="collapsed"
        collapsible
        @expand="collapse(false)"
      />
    </template>

    <template #footer="{ collapsed }">
      <UButton
        :avatar="avatar"
        :label="collapsed ? undefined : 'Benjamin'"
        color="neutral"
        variant="ghost"
        class="profile-button"
        :block="collapsed"
      />
    </template>
  </UDashboardSidebar>
</template>

<style scoped>
.profile-button {
  width: 100%;
}
</style>
