<script setup lang="ts">
import portraitImage from "~/assets/portfolio/portfolio-tanner.png";

defineProps<{ resumeUrl: string }>();
</script>

<template>
  <section
    id="intro"
    class="intro"
    aria-labelledby="intro-title"
  >
    <div v-reveal class="intro-copy">
      <p class="portfolio-eyebrow intro-eyebrow">
        <span class="status-dot" /> SOFTWARE DEVELOPER & CRAFTSMAN
      </p>
      <h1 id="intro-title" class="name">
        Tanner<br>Satchwell<span class="intro-accent">.</span>
      </h1>
      <p class="intro-tagline">
        I write the computer codes.<br><span>And make things that matter.</span>
      </p>
      <div class="intro-actions">
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
    <div v-reveal="120" class="portrait-area">
      <div class="portrait-frame">
        <img
          :src="portraitImage"
          alt="Tanner Satchwell"
          width="615"
          height="615"
          fetchpriority="high"
          class="portrait"
        >
      </div>
      <div class="portrait-caption">
        <span>DEVELOPER BY TRADE.</span><span>BUILDER AT HEART.</span>
      </div>
      <div
        class="maker-stamp"
        aria-hidden="true"
      >
        <UIcon name="i-lucide-code-xml" class="maker-icon" /><span>IDEA<br>TO
          REALITY</span>
      </div>
    </div>
  </section>
  <div class="intro-footnote">
    <span>Digital products. Handcrafted pieces. A little curiosity.</span>
    <UButton
      to="#work"
      icon="i-lucide-arrow-down"
      aria-label="Scroll to selected work"
      color="neutral"
      variant="outline"
      class="scroll-button"
    />
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  align-items: center;
  gap: 2.5rem;
  padding-block: 2.5rem;
  scroll-margin-top: 6rem;
}
.intro-copy {
  min-width: 0;
}
.intro-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
  color: var(--ui-text-muted);
}
.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--ui-primary);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ui-primary) 10%, transparent);
}
.intro-accent {
  color: var(--ui-primary);
}
.intro-tagline {
  margin-top: 1.75rem;
  font-size: 1.25rem;
  line-height: 1.625;
}
.intro-tagline span {
  color: var(--ui-text-muted);
}
.intro-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
}
.name {
  font-size: 3.6rem;
  line-height: 1.03;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.portrait-area {
  position: relative;
  width: calc(100% - 2rem);
  max-width: 20rem;
  justify-self: center;
  animation-delay: 0.15s;
}
.portrait-frame {
  aspect-ratio: 1 / 0.85;
  transform: rotate(2deg);
  overflow: hidden;
  border-radius: 0.125rem;
  background: var(--ui-bg-muted);
}
.portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.portrait-frame:hover .portrait {
  transform: scale(1.05) rotate(-2deg);
}
.portrait-caption {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 1.25rem;
  font-size: 0.55rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}
.maker-stamp {
  position: absolute;
  bottom: 3rem;
  left: -1rem;
  display: flex;
  width: 5.5rem;
  height: 5.5rem;
  transform: rotate(-12deg);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 50%;
  background: var(--ui-primary);
  color: var(--ui-text-inverted);
}
.maker-icon {
  width: 1.5rem;
  height: 1.5rem;
}
.maker-stamp span {
  text-align: center;
  font-size: 0.6rem;
  font-weight: 700;
}
.intro-footnote {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 2rem;
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}
.scroll-button {
  flex-shrink: 0;
  border-radius: 50%;
}
@media (min-width: 360px) {
  .name {
    font-size: 4.25rem;
  }
}
@media (min-width: 640px) {
  .intro-footnote {
    font-size: 0.875rem;
  }
}
@media (min-width: 768px) {
  .intro {
    grid-template-columns: 1.25fr 1fr;
    gap: 3rem;
    padding-block: 4rem;
  }
  .portrait-area {
    width: 100%;
    max-width: 430px;
    justify-self: end;
  }
  .portrait-frame {
    aspect-ratio: 1 / 1.08;
  }
  .portrait-caption {
    font-size: 0.6rem;
  }
  .maker-stamp {
    left: -2rem;
    width: 6.5rem;
    height: 6.5rem;
  }
  .name {
    font-size: 4.5rem;
  }
}
@media (min-width: 1024px) {
  .intro-tagline {
    font-size: 1.5rem;
  }
}
@media (min-width: 1280px) {
  .intro {
    gap: 4rem;
    padding-block: 5rem;
  }
  .name {
    font-size: 6rem;
  }
}
</style>
