<script setup lang="ts">
import { normalizeHex } from "~/utils/cssGradient";

const props = defineProps<{ id: string; label: string; modelValue: string }>();
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
const validColor = computed(() => {
  try {
    return normalizeHex(props.modelValue);
  } catch {
    return "";
  }
});
</script>

<template>
  <div class="color-row">
    <UPopover><UButton
        :aria-label="`Pick color for ${label}`"
        color="neutral"
        variant="outline"
        square
        class="color-swatch"
        :style="{ backgroundColor: validColor || 'transparent' }"
      /><template #content><div class="color-picker">
          <UColorPicker
            :model-value="validColor || '#000000'"
            format="hex"
            @update:model-value="emit('update:modelValue', $event ?? '#000000')"
          />
        </div></template></UPopover>
    <UInput
      :id="id"
      :model-value="modelValue"
      :aria-label="`Hex color for ${label}`"
      :aria-invalid="!validColor"
      autocomplete="off"
      :spellcheck="false"
      :maxlength="7"
      class="color-input"
      @update:model-value="emit('update:modelValue', String($event))"
    />
  </div>
</template>

<style scoped>
.color-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}
.color-swatch {
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: 0.375rem;
}
.color-input {
  flex: 1;
  min-width: 0;
}
.color-input :deep(input) {
  font-family: var(--font-mono, monospace);
}
.color-picker {
  padding: 1rem;
}
</style>
