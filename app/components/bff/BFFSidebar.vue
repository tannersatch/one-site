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
      <BFFBanner v-if="!collapsed" />
      <BFFIcon v-else />
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
