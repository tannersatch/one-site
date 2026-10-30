<script setup lang="ts">
import CopyButton from "~/components/tools/CopyButton.vue";

withDefaults(
  defineProps<{
    id: string;
    label: string;
    modelValue: string;
    language?: string;
    readonly?: boolean;
    error?: boolean;
    errorId?: string;
    placeholder?: string;
  }>(),
  {
    language: "TEXT",
    readonly: false,
    error: false,
    errorId: undefined,
    placeholder: "",
  },
);
defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <section class="text-editor" :aria-labelledby="`${id}-label`">
    <div class="editor-heading">
      <label :id="`${id}-label`" :for="id">{{ label }}</label>
      <div class="editor-actions">
        <UBadge color="neutral" variant="soft" size="sm">{{
          language
        }}</UBadge><CopyButton
          :value="modelValue"
          :label="`Copy ${label.toLowerCase()}`"
        />
      </div>
    </div>
    <UTextarea
      :id="id"
      :model-value="modelValue"
      :readonly="readonly"
      :placeholder="placeholder"
      :aria-invalid="error"
      :aria-describedby="errorId"
      :rows="14"
      :spellcheck="false"
      autocomplete="off"
      autocapitalize="off"
      autocorrect="off"
      wrap="off"
      class="editor-input"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </section>
</template>

<style scoped>
.text-editor {
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
.editor-heading label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.editor-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.editor-input {
  display: flex;
  flex: 1;
  width: 100%;
  min-width: 0;
}
.editor-input :deep(textarea) {
  width: 100%;
  min-height: 12rem;
  height: 22rem;
  padding: 1rem;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  background: var(--ui-bg);
  font-family: var(--font-mono, monospace);
  font-size: 0.8125rem;
  line-height: 1.7;
  tab-size: 4;
  resize: vertical;
}
.editor-input :deep(textarea:focus-visible) {
  outline: 2px solid var(--ui-primary);
  outline-offset: -2px;
}
.editor-input :deep(textarea[aria-invalid="true"]) {
  outline: 2px solid var(--ui-error);
  outline-offset: -2px;
}
@media (max-width: 639px) {
  .editor-input :deep(textarea) {
    height: 16rem;
  }
}
</style>
