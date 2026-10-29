<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import BFFIcon from "./BFFIcon.vue";

const avatar = {
  src: "https://github.com/benjamincanac.png",
  loading: "lazy" as const,
};

const items: NavigationMenuItem[][] = [[{
  label: "Home",
  icon: "i-lucide-house",
  to: "/",
}, {
  label: "About",
  icon: "i-lucide-info",
  badge: "4",
  to: "/about",
}, {
  label: "Portfolio",
  icon: "i-lucide-gallery-vertical-end",
  defaultOpen: true,
  children: [
    {
      label: "Roman Numeral Calculator",
      icon: "i-lucide-calculator",
      to: "/portfolio/roman-numerals",
    },
    {
      label: "FileShadow, Inc.",
      icon: "i-lucide-file",
      to: "https://portal.fileshadow.com",
      target: "_blank",
    },
    {
      label: "Glow Permanent Lighting",
      icon: "i-lucide-lightbulb",
      to: "https://www.glowpermanentlights.com/",
      target: "_blank",
    },
  ],
}, {
  label: "Dev Tools",
  icon: "i-lucide-code",
  defaultOpen: true,
  children: [
    {
      label: "JWT Decoder",
      icon: "i-lucide-braces",
      to: "/tools/jwt-decode",
    },
  ],
}], [{
  label: "Feedback",
  icon: "i-lucide-message-circle",
  to: "https://github.com/nuxt-ui-templates/dashboard",
  target: "_blank",
}, {
  label: "Help & Support",
  icon: "i-lucide-info",
  to: "https://github.com/nuxt/ui",
  target: "_blank",
}]];
</script>

<template>
  <UDashboardSidebar
    collapsible
    resizable
    :ui="{ root: 'min-h-0', footer: 'sidebar-footer' }"
  >
    <template #default="{ collapsed }">
      <UButton
        :label="collapsed ? undefined : 'Search...'"
        icon="i-lucide-search"
        color="neutral"
        variant="outline"
        block
        :square="collapsed"
      >
        <template v-if="!collapsed" #trailing>
          <div class="search-shortcut">
            <UKbd value="meta" variant="subtle" />
            <UKbd value="K" variant="subtle" />
          </div>
        </template>
      </UButton>

      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[0]"
        orientation="vertical"
      />

      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[1]"
        orientation="vertical"
        class="secondary-navigation"
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
.search-shortcut {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  margin-inline-start: auto;
}

.secondary-navigation {
  background: red;
  margin-top: auto !important;
}

.profile-button {
  width: 100%;
}

:deep(.sidebar-footer) {
  border-top: 1px solid var(--ui-border);
}
</style>
