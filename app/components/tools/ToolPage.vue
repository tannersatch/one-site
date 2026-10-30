<script setup lang="ts">
withDefaults(
  defineProps<{ title: string; icon: string; maxWidth?: string }>(),
  {
    maxWidth: "1200px",
  },
);
</script>

<template>
  <main class="tool-page" :style="{ maxWidth }">
    <header v-reveal class="tool-heading">
      <div class="tool-title">
        <div class="tool-icon"><UIcon :name="icon" /></div>
        <div>
          <p class="tool-category">DEVELOPER TOOLS</p>
          <h1>{{ title }}</h1>
        </div>
      </div>
      <div v-if="$slots.status" class="tool-status"><slot name="status" /></div>
    </header>
    <slot />
  </main>
</template>

<style scoped>
.tool-page {
  width: 100%;
  min-width: 0;
  margin-inline: auto;
  padding: 0.5rem;
}
.tool-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1.5rem;
}
.tool-title {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
}
.tool-icon {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  background: var(--ui-bg-muted);
  color: var(--ui-primary);
}
.tool-icon .iconify {
  width: 1.4rem;
  height: 1.4rem;
}
.tool-category {
  margin-bottom: 0.2rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}
.tool-status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
h1 {
  font-size: 1.5rem;
  line-height: 1.25;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
@media (min-width: 1280px) {
  .tool-page {
    padding: 1rem;
  }
  h1 {
    font-size: 1.75rem;
  }
}
@media (max-width: 479px) {
  .tool-page {
    padding: 0;
  }
  h1 {
    font-size: 1.25rem;
  }
}
</style>
