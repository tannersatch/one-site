<script setup lang="ts">
import BFFBanner from "~/components/bff/BFFBanner.vue";

const services = [
  {
    icon: "i-lucide-code-xml",
    title: "Software & digital products",
    description:
      "Custom web and mobile applications shaped around the people who use them and the problems they need to solve.",
  },
  {
    icon: "i-lucide-compass",
    title: "Technology consulting",
    description:
      "A practical sounding board for product direction, technical decisions, and turning an early idea into a workable plan.",
  },
  {
    icon: "i-lucide-hammer",
    title: "Design & making",
    description:
      "A hands-on approach to prototypes and custom-made pieces, bringing the same care to physical projects as to software.",
  },
];

useSeoMeta({
  title: "Big Foot Forward | Software, Ideas & Making",
  description:
    "Big Foot Forward brings thoughtful software, practical technology guidance, and hands-on making together to help good ideas move forward.",
  ogTitle: "Big Foot Forward",
  ogDescription:
    "Thoughtful software, practical guidance, and hands-on making for ideas ready to move forward.",
});
</script>

<template>
  <main class="bff-page">
    <UContainer>
      <section class="bff-hero" aria-labelledby="bff-title">
        <div v-reveal class="hero-copy">
          <UBadge
            color="primary"
            variant="subtle"
            icon="i-lucide-footprints"
            class="hero-label"
          >
            BIG FOOT FORWARD LLC
          </UBadge>
          <h1 id="bff-title">
            Big ideas deserve<br>
            <span>a real next step.</span>
          </h1>
          <p class="hero-description">
            Big Foot Forward brings software, problem-solving, and hands-on
            creativity together to turn good ideas into useful things.
          </p>
          <div class="hero-actions">
            <UButton
              to="/portfolio#contact"
              size="lg"
              trailing-icon="i-lucide-arrow-up-right"
            >
              Talk about your idea
            </UButton>
            <UButton
              to="/portfolio"
              size="lg"
              color="neutral"
              variant="ghost"
              trailing-icon="i-lucide-arrow-right"
            >
              Meet the founder
            </UButton>
          </div>
        </div>

        <UCard v-reveal="100" class="brand-card">
          <div class="brand-mark">
            <BFFBanner size="lg" alt="Big Foot Forward" />
          </div>
          <p>Thoughtful work.<br>Forward momentum.</p>
          <UIcon
            name="i-lucide-move-up-right"
            class="brand-card-icon"
            aria-hidden="true"
          />
        </UCard>
      </section>

      <section
        id="what-we-do"
        v-reveal
        class="services-section"
        aria-labelledby="services-title"
      >
        <div class="section-heading">
          <p class="section-kicker">A FEW WAYS TO MOVE FORWARD</p>
          <h2 id="services-title">From first thought to finished thing.</h2>
          <p>
            Every project is different. The common thread is thoughtful
            problem-solving, personal attention, and care in the details.
          </p>
        </div>

        <div class="services-grid">
          <UCard
            v-for="(service, index) in services"
            :key="service.title"
            v-reveal="index * 80"
            class="service-card"
          >
            <UIcon
              :name="service.icon"
              class="service-icon"
              aria-hidden="true"
            />
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </UCard>
        </div>
      </section>

      <section
        v-reveal
        class="about-section"
        aria-labelledby="about-title"
      >
        <div class="about-heading">
          <p class="section-kicker">BUILT BY A BUILDER</p>
          <h2 id="about-title">Different materials.<br>Same instinct.</h2>
        </div>
        <div class="about-copy">
          <p>
            Big Foot Forward is the independent practice of Tanner Satchwell:
            software developer, problem-solver, and maker.
          </p>
          <p>
            Whether the work starts with a blank screen or a sketch on paper,
            the goal is the same: make something useful, make it with care, and
            help it take its next step.
          </p>
          <UButton
            to="/portfolio"
            color="neutral"
            variant="link"
            trailing-icon="i-lucide-arrow-up-right"
            class="about-link"
          >
            Explore Tanner's work
          </UButton>
        </div>
      </section>

      <section v-reveal class="contact-card" aria-labelledby="contact-title">
        <div>
          <p class="section-kicker">HAVE SOMETHING IN MIND?</p>
          <h2 id="contact-title">Let's make a little progress.</h2>
          <p>
            Tell me what you’re working on. We can figure out a good next step
            together.
          </p>
        </div>
        <UButton
          to="/portfolio#contact"
          size="lg"
          color="neutral"
          trailing-icon="i-lucide-arrow-up-right"
        >
          Get in touch
        </UButton>
      </section>

      <footer class="bff-footer">
        <BFFBanner size="sm" alt="Big Foot Forward" />
        <span>Independent by nature. Moving ideas forward.</span>
      </footer>
    </UContainer>
  </main>
</template>

<style scoped>
.bff-page {
  overflow: hidden;
  background: var(--ui-bg);
  color: var(--ui-text);
}
.bff-hero {
  display: grid;
  align-items: center;
  gap: 3rem;
  padding-block: 4rem 5rem;
}
.hero-copy {
  max-width: 42rem;
}
.hero-label {
  margin-bottom: 1.5rem;
}
.hero-copy h1 {
  color: var(--ui-text-highlighted);
  font-size: clamp(2.75rem, 8vw, 5rem);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.045em;
}
.hero-copy h1 span {
  color: var(--ui-primary);
}
.hero-description {
  max-width: 34rem;
  margin-top: 1.5rem;
  color: var(--ui-text-muted);
  font-size: 1.125rem;
  line-height: 1.75;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}
.brand-card {
  position: relative;
  display: flex;
  min-height: 15rem;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(
      ellipse at 82% 18%,
      color-mix(in srgb, var(--ui-primary) 16%, transparent),
      transparent 50%
    ),
    var(--ui-bg-muted);
}
.brand-mark {
  display: grid;
  min-height: 12rem;
  place-items: center;
}
.brand-card p {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  color: var(--ui-text-muted);
  font-size: 0.75rem;
  line-height: 1.5;
}
.brand-card-icon {
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--ui-primary);
}
.services-section {
  border-top: 1px solid var(--ui-border);
  padding-block: 4rem;
}
.section-heading {
  max-width: 42rem;
  margin-bottom: 2rem;
}
.section-kicker {
  margin-bottom: 0.8rem;
  color: var(--ui-text-muted);
  font-family: var(--font-mono, monospace);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
}
.section-heading h2, .about-heading h2, .contact-card h2 {
  color: var(--ui-text-highlighted);
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.025em;
}
.section-heading > p:last-child {
  max-width: 34rem;
  margin-top: 1rem;
  color: var(--ui-text-muted);
  line-height: 1.75;
}
.services-grid {
  display: grid;
  gap: 1rem;
}
.service-card {
  height: 100%;
}
.service-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--ui-primary);
}
.service-card h3 {
  color: var(--ui-text-highlighted);
  font-size: 1.125rem;
  font-weight: 600;
}
.service-card p {
  margin-top: 0.75rem;
  color: var(--ui-text-muted);
  font-size: 0.9375rem;
  line-height: 1.7;
}
.about-section {
  display: grid;
  gap: 2rem;
  border-top: 1px solid var(--ui-border);
  padding-block: 4rem;
}
.about-copy {
  max-width: 38rem;
  color: var(--ui-text-muted);
  line-height: 1.8;
}
.about-copy p + p {
  margin-top: 1rem;
}
.about-link {
  margin-top: 0.75rem;
  padding-inline: 0;
}
.contact-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  background: var(--ui-bg-muted);
  padding: clamp(1.5rem, 5vw, 3rem);
}
.contact-card > div {
  max-width: 38rem;
}
.contact-card h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
}
.contact-card > div > p:last-child {
  margin-top: 0.75rem;
  color: var(--ui-text-muted);
  line-height: 1.7;
}
.bff-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid var(--ui-border);
  margin-top: 4rem;
  padding-block: 1.5rem;
  color: var(--ui-text-muted);
  font-size: 0.75rem;
}
.bff-page :deep(a:focus-visible) {
  outline: 2px solid var(--ui-primary);
  outline-offset: 4px;
}
@media (min-width: 768px) {
  .bff-hero {
    grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
    gap: 3rem;
    padding-block: 5rem 6rem;
  }
  .services-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .about-section {
    grid-template-columns: 1fr 1.2fr;
    gap: 4rem;
    padding-block: 5rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bff-page :deep(*), .bff-page :deep(*::before), .bff-page :deep(*::after) {
    animation: none !important;
    transition: none !important;
  }
}
</style>
