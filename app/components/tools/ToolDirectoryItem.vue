<script setup lang="ts">
import type { DeveloperTool } from "~/data/tools";

defineProps<{ tool: DeveloperTool }>();
</script>

<template>
  <NuxtLink
    v-reveal
    :to="tool.to"
    :aria-label="tool.title"
    :aria-describedby="`directory-${tool.id}-description`"
    class="tool-entry"
  >
    <div class="entry-content">
      <div class="entry-top">
        <span class="entry-icon"><UIcon :name="tool.icon" /></span><span
          class="entry-category"
        >{{ tool.category }}</span><UIcon
          name="i-lucide-arrow-up-right"
          class="entry-arrow"
          aria-hidden="true"
        />
      </div>
      <h3>{{ tool.title }}</h3>
      <p :id="`directory-${tool.id}-description`">{{ tool.description }}</p>
      <div class="entry-tags">
        <UBadge
          v-for="tag in tool.tags"
          :key="tag"
          color="neutral"
          variant="subtle"
          size="sm"
        >{{ tag }}</UBadge>
      </div>
    </div>
    <div class="entry-preview" aria-hidden="true">
      <slot name="preview"><UIcon
          :name="tool.icon"
          class="preview-icon"
        /></slot>
    </div>
  </NuxtLink>
</template>

<style scoped>
.tool-entry {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  background: var(--ui-bg);
  transition: border-color 0.2s ease;
}
.tool-entry:hover {
  border-color: var(--ui-primary);
}
.tool-entry:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 4px;
}
.entry-content {
  flex: 1;
  padding: 1.25rem;
}
.entry-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.entry-icon {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  border-radius: 0.375rem;
  background: var(--ui-bg-muted);
  color: var(--ui-primary);
}
.entry-icon .iconify {
  width: 1.125rem;
  height: 1.125rem;
}
.entry-category {
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.entry-arrow {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
  margin-left: auto;
  color: var(--ui-text-muted);
  transition: transform 0.2s ease;
}
.tool-entry:hover .entry-arrow {
  transform: translate(2px, -2px);
  color: var(--ui-primary);
}
h3 {
  font-size: 1.125rem;
  line-height: 1.4;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.entry-content p {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--ui-text-muted);
}
.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
.entry-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 6rem;
  padding: 1rem;
  border-top: 1px solid var(--ui-border);
  background: var(--ui-bg-muted);
}
.preview-icon {
  width: 2rem;
  height: 2rem;
  color: var(--ui-primary);
}
@media (min-width: 1280px) {
  .entry-content {
    padding: 1.5rem;
  }
  .entry-preview {
    min-height: 7rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .tool-entry, .entry-arrow {
    transition: none;
  }
}
</style>
