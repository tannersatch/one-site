<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";

const links = ref<ButtonProps[]>([
  {
    label: "Portfolio",
    to: "/portfolio",
    trailingIcon: "i-lucide-arrow-right",
  },
  {
    label: "BFF LLC",
    to: "/bff",
    trailingIcon: "i-lucide-arrow-right",
  },
  {
    label: "Dev Tools",
    to: "/tools",
    trailingIcon: "i-lucide-arrow-right",
  },
]);
</script>

<template>
  <UPageHero
    title="One Site to Rule Them All"
    description="Tanner's portfolio, Big Foot Forward LLC, Dev Tools, what more could you ask for?"
    class="hero"
    :links="links"
  />
</template>

<style scoped>
.hero {
  background-color: var(--ui-bg);
  background-image:
    radial-gradient(at 75% 75%, light-dark(#ff007b, #950048), transparent 70%),
    radial-gradient(at 15% 59%, light-dark(#00ff77, #007e3b), transparent 70%),
    radial-gradient(at 59% 15%, light-dark(#6e9cf0, #4f70ad), transparent 70%);
}
</style>
