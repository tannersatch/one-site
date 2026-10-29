<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import BFFBanner from "./BFFBanner.vue";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Home",
    to: "/",
    active: route.path === "/",
  },
  {
    label: "About",
    to: "/about",
    active: route.path === "/about",
  },
  {
    label: "Dev Tools",
    to: "/tools",
    active: route.path === "/tools",
  },
]);
</script>

<template>
  <UHeader>
    <template #title>
      <BFFBanner />
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UTooltip text="Toggle site theme">
        <UColorModeButton />
      </UTooltip>
    </template>
  </UHeader>
</template>
