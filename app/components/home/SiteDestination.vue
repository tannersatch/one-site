<script setup lang="ts">
import type { SiteEntry } from "~/data/sites";

defineProps<{ site: SiteEntry; index: number }>();
</script>

<template>
  <article
    class="site-destination"
    :style="{ '--entry-delay': `${Math.min(index, 5) * 80}ms` }"
  >
    <div class="destination-preview">
      <slot name="preview">
        <img
          v-if="site.image"
          :src="site.image"
          :alt="site.imageAlt ?? site.title"
          width="615"
          height="615"
          class="destination-image"
        >
        <UIcon
          v-else
          :name="site.icon"
          class="destination-mark"
          aria-hidden="true"
        />
      </slot>
    </div>
    <NuxtLink :to="site.to" class="destination-link">
      <div class="destination-meta">
        <span>{{ site.category }}</span><span class="destination-number">{{
          String(index + 1).padStart(2, "0")
        }}</span>
      </div>
      <div class="destination-heading">
        <h2>{{ site.title }}</h2><UIcon
          name="i-lucide-arrow-up-right"
          class="destination-arrow"
          aria-hidden="true"
        />
      </div>
      <p>{{ site.description }}</p>
    </NuxtLink>
  </article>
</template>

<style scoped>
.site-destination {
  display: grid;
  grid-template-columns: 5rem minmax(0, 1fr);
  align-items: center;
  gap: 1rem;
  min-width: 0;
  padding-block: 1.25rem;
  border-top: 1px solid var(--ui-border);
  animation: destination-arrive 0.6s ease both;
  animation-delay: var(--entry-delay);
}
.destination-preview {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 1;
  min-width: 0;
  overflow: hidden;
  border-radius: 0.375rem;
  background: var(--ui-bg-muted);
}
.destination-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
  transition: transform 0.5s ease;
}
.site-destination:hover .destination-image {
  transform: scale(1.035);
}
.destination-mark {
  width: 2rem;
  height: 2rem;
  color: var(--ui-primary);
}
.destination-link {
  display: block;
  min-width: 0;
}
.destination-link:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 6px;
  border-radius: 0.125rem;
}
.destination-meta, .destination-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.destination-meta {
  margin-bottom: 0.5rem;
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}
.destination-number {
  font-family: var(--font-mono, monospace);
}
.destination-heading {
  align-items: baseline;
}
h2 {
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: 1.25rem;
  line-height: 1.3;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.destination-arrow {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
  color: var(--ui-primary);
  transition: transform 0.2s ease;
}
.destination-link:hover .destination-arrow {
  transform: translate(2px, -2px);
}
.destination-link p {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.65;
  color: var(--ui-text-muted);
}
@keyframes destination-arrive {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (min-width: 640px) {
  .site-destination {
    grid-template-columns: 7rem minmax(0, 1fr);
    gap: 1.5rem;
  }
  h2 {
    font-size: 1.5rem;
  }
  .destination-link p {
    font-size: 0.875rem;
  }
}
@media (min-width: 900px) {
  .site-destination {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
    padding: 1.5rem;
    border-top: 0;
  }
  .site-destination:not(:nth-child(3n)) {
    border-right: 1px solid var(--ui-border);
  }
  .site-destination:nth-child(n+4) {
    border-top: 1px solid var(--ui-border);
  }
  .destination-preview {
    aspect-ratio: 1.8;
  }
  .destination-meta {
    margin-bottom: 0.85rem;
  }
  .destination-link {
    flex: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .site-destination {
    animation: none;
  }
  .destination-image, .destination-arrow {
    transition: none;
  }
}
</style>
