<script setup lang="ts">
import GradientColorInput from "~/components/tools/GradientColorInput.vue";
import type { GradientStop } from "~/utils/cssGradient";

defineProps<
  { stop: GradientStop; id: number; index: number; canRemove: boolean }
>();
const emit = defineEmits<
  { change: [value: Partial<GradientStop>]; remove: [] }
>();
</script>

<template>
  <div class="stop-editor">
    <div class="stop-heading">
      <h3>Stop {{ index + 1 }}</h3><UTooltip text="Remove color stop"><UButton
          icon="i-lucide-trash-2"
          :aria-label="`Remove stop ${index + 1}`"
          :disabled="!canRemove"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="$emit('remove')"
        /></UTooltip>
    </div>
    <GradientColorInput
      :id="`gradient-color-${id}`"
      :label="`stop ${index + 1}`"
      :model-value="stop.color"
      @update:model-value="emit('change', { color: $event })"
    />
    <div class="stop-sliders">
      <div>
        <label :for="`gradient-position-${id}`">Position <span>{{
              stop.position
            }}%</span></label><USlider
          :id="`gradient-position-${id}`"
          :model-value="stop.position"
          :min="0"
          :max="100"
          :step="1"
          :aria-label="`Position for stop ${index + 1}`"
          @update:model-value="emit('change', { position: Number($event) })"
        />
      </div>
      <div>
        <label :for="`gradient-opacity-${id}`">Opacity <span>{{
              stop.opacity
            }}%</span></label><USlider
          :id="`gradient-opacity-${id}`"
          :model-value="stop.opacity"
          :min="0"
          :max="100"
          :step="1"
          :aria-label="`Opacity for stop ${index + 1}`"
          @update:model-value="emit('change', { opacity: Number($event) })"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.stop-editor {
  padding-block: 1rem;
  border-bottom: 1px solid var(--ui-border);
}
.stop-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
h3 {
  font-size: 0.8125rem;
  font-weight: 600;
}
.stop-sliders {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.stop-sliders label {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.stop-sliders label span {
  font-variant-numeric: tabular-nums;
}
</style>
