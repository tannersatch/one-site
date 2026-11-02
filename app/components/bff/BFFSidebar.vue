<script setup lang="ts">
import BFFBanner from "./BFFBanner.vue";
import BFFIcon from "./BFFIcon.vue";
import BFFSidebarNavigation from "./BFFSidebarNavigation.vue";
</script>

<template>
  <UDashboardSidebar
    collapsible
    resizable
    class="sidebar"
    :ui="{ footer: 'sidebar-footer' }"
  >
    <template #header="{ collapsed }">
      <div class="sidebar-header">
        <BFFBanner v-if="!collapsed" />
        <BFFIcon v-else />
      </div>
    </template>

    <template #default="{ collapsed, collapse }">
      <BFFSidebarNavigation
        :collapsed="collapsed"
        @expand="collapse(false)"
      />
    </template>

    <template #footer="{ collapsed }">
      <UTooltip :text="collapsed ? 'Expand sidebar' : 'Collapse sidebar'">
        <UDashboardSidebarCollapse
          :label="collapsed ? undefined : 'Collapse sidebar'"
          :square="collapsed"
          class="sidebar-collapse"
          :class="{ 'sidebar-collapse--collapsed': collapsed }"
        />
      </UTooltip>
    </template>
  </UDashboardSidebar>
</template>

<style scoped>
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
}
.sidebar-header :deep(.org-icon) {
  max-width: 100%;
}
.sidebar {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.sidebar-collapse {
  width: 100%;
  justify-content: flex-start;
}

.sidebar-collapse--collapsed {
  justify-content: center;
}
</style>
