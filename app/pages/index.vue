<script setup lang="ts">
import BFFBanner from "~/components/bff/BFFBanner.vue";
import SiteDestination from "~/components/home/SiteDestination.vue";
import ToolsPreview from "~/components/home/ToolsPreview.vue";
import { sites } from "~/data/sites";

useSeoMeta({
  title: "Tanner Satchwell | Software, Design & Making",
  description:
    "Explore Tanner Satchwell's portfolio, Big Foot Forward LLC, and useful developer tools.",
  ogTitle: "Tanner Satchwell",
  ogDescription: "My work, my business, and the things I build along the way.",
});
</script>

<template>
  <main class="home">
    <UContainer>
      <header class="home-heading">
        <p class="home-eyebrow">SOFTWARE / DESIGN / MAKING</p>
        <h1>Tanner Satchwell<span>.</span></h1>
        <p class="home-introduction">
          My work, my business, and the things I build along the way.
        </p>
      </header>

      <section class="destination-grid" aria-label="Explore the site">
        <SiteDestination
          v-for="(site, index) in sites"
          :key="site.id"
          :site="site"
          :index="index"
        >
          <template
            v-if="site.id === 'big-foot-forward'"
            #preview
          ><div class="business-preview">
              <BFFBanner size="lg" alt="Big Foot Forward LLC" /><span
                class="business-tagline"
              >IDEAS INTO REALITY.</span>
            </div></template>
          <template
            v-else-if="site.id === 'developer-tools'"
            #preview
          ><ToolsPreview /></template>
        </SiteDestination>
      </section>

      <section class="workbench" aria-labelledby="workbench-title">
        <h2 id="workbench-title">
          <span class="workbench-dot" />ON THE WORKBENCH
        </h2>
        <div class="workbench-links">
          <UButton
            to="/tools/jwt-decode"
            icon="i-lucide-braces"
            color="neutral"
            variant="link"
            trailing-icon="i-lucide-arrow-up-right"
          >JWT Encode / Decode</UButton><UButton
            to="/tools/roman-numeral-converter"
            icon="i-lucide-landmark"
            color="neutral"
            variant="link"
            trailing-icon="i-lucide-arrow-up-right"
          >Roman Numeral Converter</UButton>
        </div>
      </section>
    </UContainer>
  </main>
</template>

<style scoped>
.home {
  background: var(--ui-bg);
  color: var(--ui-text);
}
.home-heading {
  padding-block: 2.5rem;
}
.home-eyebrow {
  margin-bottom: 1rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}
h1 {
  max-width: 100%;
  font-size: 2.75rem;
  line-height: 1.08;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
h1 span {
  color: var(--ui-primary);
}
.home-introduction {
  max-width: 32rem;
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--ui-text-muted);
}
.destination-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}
.business-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  color: var(--ui-text-highlighted);
}
.business-preview :deep(.org-icon) {
  width: 100%;
  max-width: 20rem;
  height: auto;
  aspect-ratio: 4;
}
.business-tagline {
  display: none;
  font-size: 0.55rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}
.workbench {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid var(--ui-border);
  padding-block: 1.5rem 2rem;
}
.workbench h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}
.workbench-dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: var(--ui-primary);
}
.workbench-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
}
@media (min-width: 640px) {
  .home-heading {
    padding-block: 3rem;
  }
  h1 {
    font-size: 3.75rem;
  }
  .home-introduction {
    font-size: 1.125rem;
  }
}
@media (min-width: 900px) {
  .destination-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-top: 1px solid var(--ui-border);
  }
  .business-preview {
    padding: 1.5rem;
  }
  .business-tagline {
    display: block;
  }
}
@media (min-width: 1280px) {
  h1 {
    font-size: 4.5rem;
  }
  .home-heading {
    padding-block: 3.5rem;
  }
}
</style>
