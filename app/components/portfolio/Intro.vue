<script setup lang="ts">
import portraitImage from "~/assets/portfolio/portfolio-tanner.png";

defineProps<{ resumeUrl: string }>();
</script>

<template>
  <section
    id="intro"
    class="grid scroll-mt-24 items-center gap-10 py-10 md:grid-cols-[1.25fr_1fr] md:gap-12 md:py-16 xl:gap-16 xl:py-20"
    aria-labelledby="intro-title"
  >
    <div class="portfolio-entrance min-w-0">
      <p class="portfolio-eyebrow mb-7 flex items-center gap-2 text-muted">
        <span
          class="size-2 shrink-0 rounded-full bg-primary ring-4 ring-primary/10"
        /> SOFTWARE DEVELOPER & CRAFTSMAN
      </p>
      <h1 id="intro-title" class="name font-semibold text-highlighted">
        Tanner<br>Satchwell<span class="text-primary">.</span>
      </h1>
      <p class="mt-7 text-xl leading-relaxed lg:text-2xl">
        I write the computer codes.<br><span class="text-muted"
        >And make things that matter.</span>
      </p>
      <div class="mt-8 flex flex-wrap items-center gap-3">
        <UButton to="#work" trailing-icon="i-lucide-arrow-down-right" size="xl"
        >Explore my work</UButton>
        <UButton
          :to="resumeUrl"
          target="_blank"
          icon="i-lucide-file-text"
          color="neutral"
          variant="ghost"
          size="xl"
        >Resume</UButton>
      </div>
    </div>
    <div class="portrait-area portfolio-entrance relative w-[calc(100%-2rem)] max-w-80 justify-self-center md:w-full md:max-w-[430px] md:justify-self-end">
      <div class="group aspect-[1/0.85] rotate-2 overflow-hidden rounded-sm bg-muted md:aspect-[1/1.08]">
        <img
          :src="portraitImage"
          alt="Tanner Satchwell"
          width="615"
          height="615"
          fetchpriority="high"
          class="size-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2"
        >
      </div>
      <div class="mt-5 flex justify-between gap-2 text-[0.55rem] font-semibold text-muted md:text-[0.6rem]">
        <span>DEVELOPER BY TRADE.</span><span>BUILDER AT HEART.</span>
      </div>
      <div
        class="absolute bottom-12 -left-4 flex size-22 -rotate-12 flex-col items-center justify-center gap-2 rounded-full bg-primary text-inverted md:-left-8 md:size-26"
        aria-hidden="true"
      >
        <UIcon name="i-lucide-code-xml" class="size-6" /><span
          class="text-center text-[0.6rem] font-bold"
        >IDEA<br>TO REALITY</span>
      </div>
    </div>
  </section>
  <div class="flex items-center justify-between gap-4 pb-8 text-xs text-muted sm:text-sm">
    <span>Digital products. Handcrafted pieces. A little curiosity.</span>
    <UButton
      to="#work"
      icon="i-lucide-arrow-down"
      aria-label="Scroll to selected work"
      color="neutral"
      variant="outline"
      class="shrink-0 rounded-full"
    />
  </div>
</template>

<style scoped>
.name {
  font-size: 3.6rem;
  line-height: 1.03;
}
.portrait-area {
  animation-delay: 0.15s;
}
@media (min-width: 360px) {
  .name {
    font-size: 4.25rem;
  }
}
@media (min-width: 768px) {
  .name {
    font-size: 4.5rem;
  }
}
@media (min-width: 1280px) {
  .name {
    font-size: 6rem;
  }
}
</style>
