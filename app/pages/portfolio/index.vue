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
  <main class="portfolio">
    <UContainer>
      <nav
        v-reveal
        class="portfolio-nav"
        aria-label="Portfolio sections"
      >
        <a
          href="#intro"
          aria-label="Tanner Satchwell, back to introduction"
          class="wordmark"
        >ts<span>.</span></a>
        <div class="section-links">
          <a
            v-for='section in ["Work", "About", "Skills", "Contact"]'
            :key="section"
            :href="`#${section.toLowerCase()}`"
            class="section-link"
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
      <PortfolioContact v-reveal />
      <footer v-reveal class="portfolio-footer">
        <span>&copy; {{ new Date().getFullYear() }} Tanner Satchwell</span>
        <span class="footer-note">Made with intention.</span>
        <a
          href="#intro"
          class="footer-link"
        >Back to top <UIcon name="i-lucide-arrow-up-right" /></a>
      </footer>
    </UContainer>
  </main>
</template>

<style scoped>
.portfolio {
  background: var(--ui-bg);
  color: var(--ui-text);
}
.portfolio-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--ui-border);
  padding-block: 1.25rem;
}
.wordmark {
  font-size: 1.875rem;
  line-height: 1;
  font-weight: 800;
  color: var(--ui-text-highlighted);
}
.wordmark span, .section-link:hover, .footer-link:hover {
  color: var(--ui-primary);
}
.section-links {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
}
.section-link, .footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
.portfolio-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 1rem 2rem;
  scroll-margin-top: 6rem;
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}
.footer-note {
  display: none;
}
@media (min-width: 640px) {
  .section-links {
    gap: 2rem;
    font-size: 0.875rem;
  }
  .footer-note {
    display: inline;
  }
}
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
