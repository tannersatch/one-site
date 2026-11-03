<script setup lang="ts">
import lightingImage from "~/assets/portfolio/portfolio-lighting.png";
import portrait from "~/assets/portfolio/portfolio-tanner.png";
import BFFBanner from "~/components/bff/BFFBanner.vue";
import SiteDestination from "~/components/home/SiteDestination.vue";
import ToolsPreview from "~/components/home/ToolsPreview.vue";
import { sites } from "~/data/sites";
import { tools } from "~/data/tools";

const featuredTools = tools.filter(tool =>
  [
    "css-gradient-generator",
    "json-formatter",
    "regex-tester",
    "uuid-generator",
  ].includes(tool.id)
);

useSeoMeta({
  title: "Tanner Satchwell | Software, Design & Making",
  description:
    "Explore Tanner Satchwell's portfolio, Big Foot Forward LLC, and useful developer tools.",
  ogTitle: "Tanner Satchwell",
  ogDescription: "My work, my business, and the things I build along the way.",
});
</script>

<template>
  <main id="top" class="home">
    <header class="home-heading">
      <img
        :src="portrait"
        alt="Tanner Satchwell in the mountains"
        width="615"
        height="615"
        fetchpriority="high"
        class="hero-image"
      >
      <div class="hero-shade" />
      <div class="hero-content">
        <p class="home-eyebrow"><span />SOFTWARE / DESIGN / MAKING</p>
        <h1>Tanner<br>Satchwell<span>.</span></h1>
        <div class="hero-bottom">
          <p class="home-introduction">
            A developer by trade.<br>A maker by nature.
          </p>
          <a href="#explore" class="explore-link">Explore my corner of the
            internet<UIcon name="i-lucide-arrow-down" /></a>
        </div>
      </div>
    </header>
    <UContainer>
      <section
        id="explore"
        class="explore-section"
        aria-labelledby="explore-title"
      >
        <div v-reveal class="section-heading">
          <p class="section-kicker">A FEW THINGS I PUT MY NAME ON</p>
          <h2 id="explore-title">Different projects.<br>Same curiosity.</h2>
          <p>
            My work, my business, and the useful little things built along the
            way.
          </p>
        </div>
        <div class="destination-grid">
          <SiteDestination
            v-for="(site, index) in sites"
            :key="site.id"
            :site="site"
            :index="index"
          >
            <template v-if="site.id === 'portfolio'" #preview><img
                :src="lightingImage"
                alt="Glow and Avia smart lighting mobile apps"
                width="1920"
                height="1080"
                loading="lazy"
                class="portfolio-preview"
              ></template>
            <template
              v-else-if="site.id === 'big-foot-forward'"
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
        </div>
      </section>

      <section v-reveal class="workbench" aria-labelledby="workbench-title">
        <div class="workbench-heading">
          <div>
            <p class="section-kicker">LESS FRICTION. MORE BUILDING.</p>
            <h2 id="workbench-title">Good tools, within reach.</h2>
          </div><NuxtLink to="/tools" class="all-tools">All {{ tools.length }}
            tools<UIcon name="i-lucide-arrow-up-right" /></NuxtLink>
        </div>
        <div class="workbench-links">
          <NuxtLink
            v-for="tool in featuredTools"
            :key="tool.id"
            :to="tool.to"
            class="workbench-tool"
          ><UIcon :name="tool.icon" /><span>{{ tool.title }}</span><UIcon
              name="i-lucide-arrow-up-right"
            /></NuxtLink>
        </div>
      </section>
      <footer class="home-footer">
        <span>Tanner Satchwell</span><p>Always something in the works.</p><a
          href="#top"
          aria-label="Back to top"
        ><UIcon name="i-lucide-arrow-up" /></a>
      </footer>
    </UContainer>
  </main>
</template>

<style scoped>
.home {
  background: var(--ui-bg);
  color: var(--ui-text);
  scroll-margin-top: var(--main-header-height, var(--ui-header-height));
}
.home-heading {
  position: relative;
  isolation: isolate;
  display: flex;
  min-height: 28rem;
  height: min(36rem, 72svh);
  max-height: 46rem;
  color: #fff;
  overflow: hidden;
}
.hero-image, .hero-shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.hero-image {
  object-fit: cover;
  object-position: center 30%;
}
.hero-shade {
  background: rgb(0 0 0 / 52%);
}
.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: min(100%, 80rem);
  margin-inline: auto;
  padding: 2rem 1.25rem;
}
.home-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
}
.home-eyebrow > span {
  width: 0.5rem;
  height: 0.5rem;
  background: var(--ui-primary);
}
h1 {
  max-width: 100%;
  font-size: 3.75rem;
  line-height: 0.98;
  font-weight: 600;
  color: #fff;
}
h1 span {
  color: var(--ui-primary);
}
.hero-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-top: auto;
  padding-top: 2rem;
}
.home-introduction {
  font-size: 1rem;
  line-height: 1.5;
}
.explore-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  border-bottom: 1px solid rgb(255 255 255 / 50%);
  padding-bottom: 0.5rem;
}
.explore-link .iconify {
  color: var(--ui-primary);
}
.explore-section {
  padding-block: 2.5rem;
  scroll-margin-top: 5rem;
}
.section-heading {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}
.section-kicker {
  font-family: var(--font-mono, monospace);
  font-size: 0.625rem;
  color: var(--ui-text-muted);
}
.section-heading h2 {
  font-size: 2rem;
  line-height: 1.1;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.section-heading > p:last-child {
  max-width: 24rem;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--ui-text-muted);
}
.destination-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}
.portfolio-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  color: #33422a;
}
.workbench {
  border-top: 1px solid var(--ui-border);
  padding-block: 2rem 3rem;
}
.workbench-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.workbench h2 {
  margin-top: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.all-tools {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--ui-primary);
}
.workbench-links {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}
.workbench-tool {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
  padding: 1rem 0.5rem;
  border-top: 1px solid var(--ui-border);
  transition: background 180ms;
}
.workbench-tool > .iconify:first-child {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--ui-primary);
  flex-shrink: 0;
}
.workbench-tool span {
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
}
.workbench-tool > .iconify:last-child {
  width: 1rem;
  height: 1rem;
  color: var(--ui-text-muted);
  flex-shrink: 0;
}
.workbench-tool:hover {
  background: var(--ui-bg-muted);
}
.home-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid var(--ui-border);
  padding-block: 1.25rem;
  color: var(--ui-text-muted);
  font-size: 0.75rem;
}
.home-footer > span {
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.home-footer p {
  flex: 1;
}
.home-footer a {
  padding: 0.5rem;
}
.home a:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 4px;
}
@media (min-width: 640px) {
  .hero-content {
    padding-inline: 2rem;
  }
  h1 {
    font-size: 5.5rem;
  }
  .section-heading {
    grid-template-columns: 1fr 1fr;
    align-items: end;
  }
  .section-heading .section-kicker {
    grid-column: 1 / -1;
  }
  .section-heading h2 {
    font-size: 2.5rem;
  }
  .workbench-links {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 2rem;
  }
  .home-introduction {
    font-size: 1.125rem;
  }
}
@media (min-width: 900px) {
  .explore-section {
    padding-block: 3rem;
  }
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
    font-size: 7rem;
  }
  .home-heading {
    height: min(38rem, 70svh);
  }
}
@media (max-width: 359px) {
  h1 {
    font-size: 3.25rem;
  }
  .home-eyebrow {
    font-size: 0.6rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .workbench-tool {
    transition: none;
  }
}
</style>
