<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { sites } from "~/data/sites";
import BFFBanner from "./bff/BFFBanner.vue";
import BFFSidebarNavigation from "./bff/BFFSidebarNavigation.vue";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Home",
    to: "/",
    active: route.path === "/",
  },
  ...sites.map(site => ({
    label: site.navigationLabel ?? site.title,
    to: site.to,
    active: route.path === site.to || route.path.startsWith(`${site.to}/`),
  })),
]);

const headerTitle = computed(() => {
  if (route.path.startsWith("/bff") || route.path.startsWith("/tools")) {
    return "";
  }
  if (route.path === "/") {
    return "";
  }
  if (route.path.startsWith("/portfolio")) {
    return "Portfolio";
  }
  return "";
});
</script>

<template>
  <UHeader :title="headerTitle">
    <template
      #title
      v-if="route.path.startsWith('/bff') || route.path.startsWith('/tools')"
    >
      <BFFBanner
        v-if="route.path.startsWith('/bff') || route.path.startsWith('/tools')"
      />
    </template>

    <UNavigationMenu :items="items" />

    <template #body>
      <div class="mobile-navigation">
        <UNavigationMenu :items="items" orientation="vertical" />
        <section
          v-if="route.path === '/tools' || route.path.startsWith('/tools/')"
          class="mobile-tools"
          aria-labelledby="mobile-tools-title"
        >
          <h2 id="mobile-tools-title">Developer tools</h2>
          <BFFSidebarNavigation />
        </section>
      </div>
    </template>

    <template #right>
      <UTooltip text="Toggle site theme">
        <UColorModeButton />
      </UTooltip>
    </template>
  </UHeader>
</template>

<style scoped>
.mobile-navigation {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  gap: 1.5rem;
}
.mobile-tools {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--ui-border);
}
.mobile-tools h2 {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}
</style>
