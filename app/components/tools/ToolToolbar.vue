<script setup lang="ts">
defineProps<{ title?: string }>();
defineEmits<{ clear: [] }>();
</script>

<template>
  <div
    class="tool-toolbar"
    :class="{ 'tool-toolbar--controls': !!$slots.default }"
  >
    <div class="toolbar-main">
      <slot><h2 v-if="title">{{ title }}</h2></slot>
    </div>
    <div class="toolbar-actions">
      <slot name="actions" />
      <UButton
        icon="i-lucide-eraser"
        color="neutral"
        variant="ghost"
        @click="$emit('clear')"
      >Clear</UButton>
    </div>
  </div>
</template>

<style scoped>
.tool-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-block: 0.875rem;
  margin-bottom: 1.5rem;
  border-block: 1px solid var(--ui-border);
}
.toolbar-main {
  min-width: 0;
}
.toolbar-main h2 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
@media (max-width: 479px) {
  .tool-toolbar--controls {
    align-items: stretch;
  }
  .tool-toolbar--controls .toolbar-main,
  .tool-toolbar--controls .toolbar-actions {
    width: 100%;
  }
  .tool-toolbar--controls .toolbar-actions {
    justify-content: flex-end;
  }
}
</style>
