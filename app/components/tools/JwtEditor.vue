<script setup lang="ts">
import CopyButton from "~/components/tools/CopyButton.vue";

withDefaults(
  defineProps<{
    id: string;
    label: string;
    modelValue: string;
    format: string;
    icon: string;
    rows?: number;
    readonly?: boolean;
    placeholder?: string;
  }>(),
  { rows: 6, readonly: false, placeholder: "" },
);

defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <section
    class="jwt-editor"
    :class="{ 'jwt-editor--token': format === 'JWT' }"
    :aria-labelledby="`${id}-label`"
  >
    <div class="editor-heading">
      <label :id="`${id}-label`" :for="id" class="editor-label"><UIcon
          :name="icon"
        />{{ label }}</label>
      <div class="editor-actions">
        <UBadge color="neutral" variant="soft" size="sm">{{ format }}</UBadge>
        <CopyButton
          :value="modelValue"
          :label="`Copy ${label.toLowerCase()}`"
        />
      </div>
    </div>
    <UTextarea
      :id="id"
      :model-value="modelValue"
      :readonly="readonly"
      :rows="rows"
      :placeholder="placeholder"
      :spellcheck="false"
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      class="editor-input"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </section>
</template>

<style scoped>
.jwt-editor {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  background: var(--ui-bg);
}
.editor-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-bg-muted);
}
.editor-label, .editor-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.editor-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.editor-label .iconify {
  width: 1rem;
  height: 1rem;
  color: var(--ui-primary);
}
.editor-input {
  display: flex;
  flex: 1;
  width: 100%;
  min-height: 0;
}
.editor-input :deep(textarea) {
  flex: 1;
  width: 100%;
  min-height: 5rem;
  padding: 1rem;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  background: var(--ui-bg);
  font-family: var(--font-mono, monospace);
  font-size: 0.8125rem;
  line-height: 1.7;
  overflow-wrap: anywhere;
  word-break: break-all;
  tab-size: 2;
  resize: vertical;
}
.editor-input :deep(textarea:focus-visible) {
  outline: 2px solid var(--ui-primary);
  outline-offset: -2px;
}
.editor-input :deep(textarea[readonly]) {
  color: var(--ui-text-muted);
}
.jwt-editor--token .editor-input :deep(textarea) {
  min-height: 14rem;
}
@media (min-width: 900px) {
  .jwt-editor--token .editor-input :deep(textarea) {
    height: 100%;
    min-height: 32rem;
  }
}
</style>
