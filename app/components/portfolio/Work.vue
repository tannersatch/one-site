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
    <div class="portfolio-reveal mb-10">
      <p class="portfolio-eyebrow mb-4 text-muted">01 / SELECTED WORK</p>
      <h2 id="work-title" class="portfolio-title">
        Built for the real world<span class="text-primary">.</span>
      </h2>
    </div>
    <article class="portfolio-reveal group grid overflow-hidden rounded-md border border-default md:grid-cols-[1.2fr_1fr]">
      <div class="flex items-center justify-center overflow-hidden bg-muted p-6 lg:p-8">
        <img
          :src="lightingImage"
          alt="Glow and Avia permanent smart lighting mobile applications"
          width="1920"
          height="1080"
          loading="lazy"
          class="h-auto max-h-[460px] w-full object-contain transition-transform duration-500 group-hover:scale-105"
        >
      </div>
      <div class="p-6 lg:p-10">
        <div class="mb-8 flex items-center justify-between text-xs font-semibold text-primary">
          <span>FEATURED PROJECT</span><UIcon
            name="i-lucide-lightbulb"
            class="size-5"
          />
        </div>
        <h3 class="mb-6 text-4xl leading-tight font-semibold text-highlighted">
          Good lighting.<br>Great control.
        </h3>
        <p class="mb-2 font-semibold">Permanent Lighting Apps</p>
        <p class="text-sm leading-8 text-muted">
          Cross-platform mobile applications for Glow and Avia's smart lighting
          products. An intuitive interface and robust state management, built to
          bring numerous lighting devices together.
        </p>
        <div class="mt-6 flex flex-wrap gap-2">
          <UBadge
            v-for='tech in ["React Native", "Expo", "Smart lighting"]'
            :key="tech"
            color="neutral"
            variant="outline"
          >{{ tech }}</UBadge>
        </div>
        <div class="mt-8 flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-smartphone" /><span>Built for iOS &
            Android</span>
        </div>
        <div class="mt-5 flex flex-wrap gap-2">
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
    <div class="mt-6 grid gap-6 sm:grid-cols-2">
      <article
        v-for="project in projects"
        :key="project.title"
        class="flex flex-col overflow-hidden rounded-md border border-default"
      >
        <picture class="block aspect-video overflow-hidden bg-muted">
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
            class="size-full object-contain"
          >
        </picture>
        <div class="flex flex-1 flex-col items-start p-6 lg:p-7">
          <p class="portfolio-eyebrow text-primary">{{ project.category }}</p>
          <h3 class="my-3 text-2xl font-semibold text-highlighted">
            {{ project.title }}
          </h3>
          <p class="mb-6 text-sm leading-8 text-muted">
            {{ project.description }}
          </p>
          <div class="mt-auto flex flex-wrap gap-2">
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
    <div class="flex flex-wrap items-center gap-3 pt-6 text-sm text-muted">
      <UIcon name="i-lucide-github" class="size-5" /><span>More code,
        experiments, and works in progress.</span>
      <UButton
        to="https://github.com/tannersatch"
        target="_blank"
        color="neutral"
        variant="link"
        trailing-icon="i-lucide-arrow-up-right"
        class="sm:ml-auto"
      >Find me on GitHub</UButton>
    </div>
  </section>
</template>
