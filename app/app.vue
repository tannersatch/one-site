<script setup lang="ts">
import Header from "./components/Header.vue";

const siteChrome = useTemplateRef<HTMLDivElement>("siteChrome");
let chromeObserver: ResizeObserver | undefined;

function updateChromeHeight() {
  if (!siteChrome.value) return;
  document.documentElement.style.setProperty(
    "--site-chrome-height",
    `${siteChrome.value.getBoundingClientRect().height}px`,
  );
}

onMounted(() => {
  if (!siteChrome.value) return;
  updateChromeHeight();
  chromeObserver = new ResizeObserver(updateChromeHeight);
  chromeObserver.observe(siteChrome.value);
});

onBeforeUnmount(() => {
  chromeObserver?.disconnect();
  document.documentElement.style.removeProperty("--site-chrome-height");
});
</script>

<template>
  <UApp>
    <div ref="siteChrome">
      <!-- <UBanner
        icon="i-lucide-construction"
        title="This site is under active development"
        color="warning"
      /> -->

      <Header />
    </div>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UFooter />
  </UApp>
</template>
