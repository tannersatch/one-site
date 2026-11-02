<script setup lang="ts">
import BFFSidebar from "~/components/bff/BFFSidebar.vue";
import Header from "~/components/Header.vue";

const siteChrome = useTemplateRef<HTMLDivElement>("siteChrome");
let chromeObserver: ResizeObserver | undefined;

function updateChromeHeight() {
  if (!siteChrome.value) return;
  document.documentElement.style.setProperty(
    "--tool-banner-height",
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
  document.documentElement.style.removeProperty("--tool-banner-height");
});
</script>

<template>
  <div ref="siteChrome">
    <UBanner
      icon="i-lucide-construction"
      title="This site is under active development"
      color="warning"
    />
  </div>
  <UDashboardGroup class="dashboard">
    <BFFSidebar />
    <div class="page-wrapper">
      <Header />
      <UPage class="page">
        <slot />
      </UPage>
    </div>
  </UDashboardGroup>
</template>

<style scoped>
.dashboard {
  max-height: calc(100dvh - var(--tool-banner-height));
  top: var(--tool-banner-height);
}
.dashboard :deep(.sidebar) {
  min-height: 0;
  max-width: 275px;
}
.dashboard :deep(.sidebar-footer) {
  border-top: 1px solid var(--ui-border);
}
.page-wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}
.page {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 1rem;
  overflow-y: auto;
}
</style>
