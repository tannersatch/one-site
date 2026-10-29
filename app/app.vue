<script setup lang="ts">
import Header from "./components/Header.vue";
</script>

<template>
  <UApp>
    <UBanner
      icon="i-lucide-construction"
      title="This site is under active development"
      color="warning"
    />

    <Header />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UFooter />
  </UApp>
</template>
