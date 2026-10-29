<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import BFFBanner from "./bff/BFFBanner.vue";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Home",
    to: "/",
    active: route.path === "/",
  },
  {
    label: "Portfolio",
    to: "/portfolio",
    active: route.path.startsWith("/portfolio"),
  },
  {
    label: "Big Foot Forward LLC",
    to: "/bff",
    active: route.path.startsWith("/bff"),
  },
  {
    label: "Dev Tools",
    to: "/tools",
    active: route.path.startsWith("/tools"),
  },
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
      <UNavigationMenu :items="items" orientation="vertical" />
    </template>

    <template #right>
      <UTooltip text="Toggle site theme">
        <UColorModeButton />
      </UTooltip>
    </template>
  </UHeader>
</template>
