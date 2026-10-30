<script setup lang="ts">
defineProps<{ resumeUrl: string }>();
</script>

<template>
  <section
    id="about"
    class="portfolio-section about"
    aria-labelledby="about-title"
  >
    <div class="portfolio-reveal">
      <p class="portfolio-eyebrow about-eyebrow">02 / A LITTLE ABOUT ME</p>
      <h2 id="about-title" class="portfolio-title">
        A builder,<br>in every sense<span class="about-accent">.</span>
      </h2>
    </div>
    <div class="portfolio-reveal about-copy">
      <p class="about-lead">
        From a line of code to a 3D-printed design, I love turning an idea into
        something you can actually use.
      </p>
      <p>
        I'm a software developer and maker passionate about building intuitive
        applications and designing 3D models for custom prints. With a
        background in full stack engineering, I founded Big Foot Forward LLC to
        bring innovative ideas to life, from digital experiences to physical
        prints.
      </p>
      <p>
        When I'm not coding, designing 3D models, or 3D printing, you'll find me
        learning new tech, experimenting with designs, or enjoying time
        outdoors.
      </p>
      <div class="about-links">
        <UBadge
          icon="i-lucide-footprints"
          color="neutral"
          variant="soft"
          size="lg"
        >Founder, Big Foot Forward LLC</UBadge>
        <UButton
          :to="resumeUrl"
          target="_blank"
          color="neutral"
          variant="link"
          trailing-icon="i-lucide-arrow-up-right"
        >View resume</UButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  display: grid;
  gap: 2.5rem;
}
.about-eyebrow {
  margin-bottom: 1rem;
  color: var(--ui-text-muted);
}
.about-accent {
  color: var(--ui-primary);
}
.about-copy {
  line-height: 2;
  color: var(--ui-text-muted);
}
.about-copy > * + * {
  margin-top: 1.25rem;
}
.about-lead {
  font-size: 1.25rem;
  line-height: 1.625;
  color: var(--ui-text-highlighted);
}
.about-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.5rem;
}
@media (min-width: 768px) {
  .about {
    grid-template-columns: 1fr 1.2fr;
  }
}
@media (min-width: 1024px) {
  .about {
    gap: 5rem;
  }
  .about-lead {
    font-size: 1.5rem;
  }
}
</style>
