<script setup lang="ts">
import PortfolioAbout from "~/components/portfolio/About.vue";
import PortfolioContact from "~/components/portfolio/Contact.vue";
import PortfolioIntro from "~/components/portfolio/Intro.vue";
import PortfolioSkills from "~/components/portfolio/Skills.vue";
import PortfolioWork from "~/components/portfolio/Work.vue";

const resumeUrl =
  "https://tannersatch.hackerresume.io/efcdbf21-a634-4c22-a3c5-1e53ccf80833";

useSeoMeta({
  title: "Tanner Satchwell | Developer & Craftsman",
  description:
    "Software developer, craftsman, and founder of Big Foot Forward LLC. Building intuitive applications and unique handcrafted pieces.",
  ogTitle: "Tanner Satchwell | Developer & Craftsman",
  ogDescription:
    "Thoughtful software. Things made by hand. Explore Tanner Satchwell's work, skills, and story.",
});
</script>

<template>
  <main class="portfolio bg-default text-default">
    <UContainer>
      <nav
        class="flex items-center justify-between gap-4 border-b border-default py-5"
        aria-label="Portfolio sections"
      >
        <a
          href="#intro"
          aria-label="Tanner Satchwell, back to introduction"
          class="text-3xl leading-none font-extrabold text-highlighted"
        >ts<span class="text-primary">.</span></a>
        <div class="flex gap-3 text-xs sm:gap-8 sm:text-sm">
          <a
            v-for='section in ["Work", "About", "Skills", "Contact"]'
            :key="section"
            :href="`#${section.toLowerCase()}`"
            class="inline-flex items-center gap-1 hover:text-primary"
          >{{ section }}<UIcon
              v-if="section === 'Contact'"
              name="i-lucide-arrow-up-right"
            /></a>
        </div>
      </nav>
      <PortfolioIntro :resume-url="resumeUrl" />
      <PortfolioWork />
      <PortfolioAbout :resume-url="resumeUrl" />
      <PortfolioSkills />
      <PortfolioContact />
      <footer class="flex scroll-mt-24 flex-wrap items-center justify-between gap-4 pt-4 pb-8 text-xs text-muted">
        <span>&copy; {{ new Date().getFullYear() }} Tanner Satchwell</span>
        <span class="hidden sm:inline">Made with intention.</span>
        <a
          href="#intro"
          class="inline-flex items-center gap-1 hover:text-primary"
        >Back to top <UIcon name="i-lucide-arrow-up-right" /></a>
      </footer>
    </UContainer>
  </main>
</template>

<style scoped>
.portfolio :deep(.portfolio-section) {
  padding-block: 4.5rem;
  border-top: 1px solid var(--ui-border);
  scroll-margin-top: 6rem;
}
.portfolio :deep(.portfolio-eyebrow) {
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.7;
}
.portfolio :deep(.portfolio-title) {
  font-size: 2.8rem;
  font-weight: 600;
  line-height: 1.15;
  color: var(--ui-text-highlighted);
}
.portfolio :deep(a:focus-visible) {
  outline: 2px solid var(--ui-primary);
  outline-offset: 6px;
}
.portfolio :deep(.portfolio-entrance) {
  animation: arrive 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
@keyframes arrive {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@supports (animation-timeline: view()) {
  .portfolio :deep(.portfolio-reveal) {
    animation: arrive linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 22%;
  }
}
@media (max-width: 639px) {
  .portfolio :deep(.portfolio-section) {
    padding-block: 3rem;
  }
  .portfolio :deep(.portfolio-title) {
    font-size: 2.2rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .portfolio :deep(*), .portfolio :deep(*::before), .portfolio :deep(*::after) {
    animation: none !important;
    transition: none !important;
  }
}
</style>
