<script setup lang="ts">
defineProps<{ resumeUrl: string }>();
</script>

<template>
  <section
    id="about"
    class="portfolio-section grid gap-10 md:grid-cols-[1fr_1.2fr] lg:gap-20"
    aria-labelledby="about-title"
  >
    <div class="portfolio-reveal">
      <p class="portfolio-eyebrow mb-4 text-muted">02 / A LITTLE ABOUT ME</p>
      <h2 id="about-title" class="portfolio-title">
        A builder,<br>in every sense<span class="text-primary">.</span>
      </h2>
    </div>
    <div class="portfolio-reveal space-y-5 leading-8 text-muted">
      <p class="text-xl leading-relaxed text-highlighted lg:text-2xl">
        From a line of code to a piece of wood, I love turning an idea into
        something you can actually use.
      </p>
      <p>
        I'm a software developer and craftsman passionate about building
        intuitive applications and unique handcrafted pieces. With a background
        in full stack engineering, I founded Big Foot Forward LLC to bring
        innovative ideas to life, whether in the digital world or the workshop.
      </p>
      <p>
        When I'm not coding or woodworking, you'll find me learning new tech,
        experimenting with designs, or enjoying time outdoors.
      </p>
      <div class="flex flex-wrap items-center gap-3 pt-2">
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
