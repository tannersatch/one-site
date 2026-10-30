<script setup lang="ts">
import fileShadowImage from "~/assets/portfolio/portfolio-fileshadow.png";
import lightingImage from "~/assets/portfolio/portfolio-lighting.png";
import romanNumeralsAnimation from "~/assets/portfolio/portfolio-roman-numerals.gif";
import romanNumeralsStill from "~/assets/portfolio/portfolio-roman-numerals.png";

const lightingLinks = [
  {
    label: "Avia / iOS",
    to: "https://apps.apple.com/in/app/avia-lighting/id6726784793",
  },
  {
    label: "Avia / Android",
    to:
      "https://play.google.com/store/apps/details?id=com.getlumilights.android.app&hl=en_US",
  },
  {
    label: "Glow / iOS",
    to: "https://apps.apple.com/in/app/glow-permanent-lighting/id6670345480",
  },
  {
    label: "Glow / Android",
    to:
      "https://play.google.com/store/apps/details?id=com.glowpermanentlights.android.app",
  },
];

const projects = [
  {
    title: "Roman Numerals Converter",
    category: "SIDE PROJECT / SVELTE 5",
    image: romanNumeralsAnimation,
    stillImage: romanNumeralsStill,
    description:
      "A bi-directional Roman numeral conversion tool built as an exercise to learn Svelte 5. Features instant conversion logic and a clean, minimalist UI. Deployed as a static site.",
    links: [{
      label: "Try the converter",
      to: "https://roman-numerals.tannersatch.com",
    }],
  },
  {
    title: "FileShadow",
    category: "WEB & MOBILE / WEBFLOW + REACT",
    image: fileShadowImage,
    stillImage: undefined,
    description:
      "Developed the primary marketing website for FileShadow using Webflow. Implemented responsive designs, custom animations, and integrated their CMS for blog and feature updates. I also contributed to the FileShadow digital asset management application built with React and React Native. I was the sole frontend developer for the project.",
    links: [{ label: "Website", to: "https://fileshadow.com" }, {
      label: "React Native app",
      to: "https://portal.fileshadow.com",
    }],
  },
];
</script>

<template>
  <section id="work" class="portfolio-section" aria-labelledby="work-title">
    <div class="portfolio-reveal work-heading">
      <p class="portfolio-eyebrow work-eyebrow">01 / SELECTED WORK</p>
      <h2 id="work-title" class="portfolio-title">
        Built for the real world<span class="work-accent">.</span>
      </h2>
    </div>
    <article class="portfolio-reveal featured-project">
      <div class="featured-image">
        <img
          :src="lightingImage"
          alt="Glow and Avia permanent smart lighting mobile applications"
          width="1920"
          height="1080"
          loading="lazy"
          class="lighting-image"
        >
      </div>
      <div class="featured-copy">
        <div class="featured-meta">
          <span>FEATURED PROJECT</span><UIcon
            name="i-lucide-lightbulb"
            class="project-icon"
          />
        </div>
        <h3 class="featured-title">
          Good lighting.<br>Great control.
        </h3>
        <p class="project-name">Permanent Lighting Apps</p>
        <p class="project-description">
          Cross-platform mobile applications for Glow and Avia's smart lighting
          products. An intuitive interface and robust state management, built to
          bring numerous lighting devices together.
        </p>
        <div class="project-tags">
          <UBadge
            v-for='tech in ["React Native", "Expo", "Smart lighting"]'
            :key="tech"
            color="neutral"
            variant="outline"
          >{{ tech }}</UBadge>
        </div>
        <div class="project-platforms">
          <UIcon name="i-lucide-smartphone" /><span>Built for iOS &
            Android</span>
        </div>
        <div class="lighting-links">
          <UButton
            v-for="link in lightingLinks"
            :key="link.to"
            :to="link.to"
            target="_blank"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-arrow-up-right"
            size="sm"
          >{{ link.label }}</UButton>
        </div>
      </div>
    </article>
    <div class="more-projects">
      <article
        v-for="project in projects"
        :key="project.title"
        class="secondary-project"
      >
        <picture class="secondary-image">
          <source
            v-if="project.stillImage"
            media="(prefers-reduced-motion: reduce)"
            :srcset="project.stillImage"
          >
          <img
            :src="project.image"
            :alt="project.title"
            width="500"
            height="281"
            loading="lazy"
            class="project-image"
          >
        </picture>
        <div class="secondary-copy">
          <p class="portfolio-eyebrow project-category">
            {{ project.category }}
          </p>
          <h3 class="secondary-title">
            {{ project.title }}
          </h3>
          <p class="project-description secondary-description">
            {{ project.description }}
          </p>
          <div class="project-links">
            <UButton
              v-for="link in project.links"
              :key="link.to"
              :to="link.to"
              target="_blank"
              color="neutral"
              variant="link"
              trailing-icon="i-lucide-arrow-up-right"
            >{{ link.label }}</UButton>
          </div>
        </div>
      </article>
    </div>
    <div class="work-note">
      <UIcon name="i-lucide-github" class="project-icon" /><span>More code,
        experiments, and works in progress.</span>
      <UButton
        to="https://github.com/tannersatch"
        target="_blank"
        color="neutral"
        variant="link"
        trailing-icon="i-lucide-arrow-up-right"
        class="github-link"
      >Find me on GitHub</UButton>
    </div>
  </section>
</template>

<style scoped>
.work-heading {
  margin-bottom: 2.5rem;
}
.work-eyebrow {
  margin-bottom: 1rem;
  color: var(--ui-text-muted);
}
.work-accent, .project-category {
  color: var(--ui-primary);
}
.featured-project, .secondary-project {
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: 0.375rem;
}
.featured-project {
  display: grid;
}
.featured-image {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 1.5rem;
  background: var(--ui-bg-muted);
}
.lighting-image {
  height: auto;
  max-height: 460px;
  width: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}
.featured-project:hover .lighting-image {
  transform: scale(1.05);
}
.featured-copy, .secondary-copy {
  padding: 1.5rem;
}
.featured-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ui-primary);
}
.project-icon {
  width: 1.25rem;
  height: 1.25rem;
}
.featured-title {
  margin-bottom: 1.5rem;
  font-size: 2.25rem;
  line-height: 1.25;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.project-name {
  margin-bottom: 0.5rem;
  font-weight: 600;
}
.project-description {
  font-size: 0.875rem;
  line-height: 2rem;
  color: var(--ui-text-muted);
}
.project-tags, .lighting-links, .project-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.project-tags {
  margin-top: 1.5rem;
}
.lighting-links {
  margin-top: 1.25rem;
}
.project-platforms {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  font-size: 0.875rem;
  color: var(--ui-text-muted);
}
.more-projects {
  display: grid;
  gap: 1.5rem;
  margin-top: 1.5rem;
}
.secondary-project {
  display: flex;
  flex-direction: column;
}
.secondary-image {
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--ui-bg-muted);
}
.project-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.secondary-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
}
.secondary-title {
  margin-block: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.secondary-description {
  margin-bottom: 1.5rem;
}
.project-links {
  margin-top: auto;
}
.work-note {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--ui-text-muted);
}
@media (min-width: 640px) {
  .more-projects {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .github-link {
    margin-left: auto;
  }
}
@media (min-width: 768px) {
  .featured-project {
    grid-template-columns: 1.2fr 1fr;
  }
}
@media (min-width: 1024px) {
  .featured-image {
    padding: 2rem;
  }
  .featured-copy {
    padding: 2.5rem;
  }
  .secondary-copy {
    padding: 1.75rem;
  }
}
</style>
