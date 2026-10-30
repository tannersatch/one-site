<script setup lang="ts">
import GradientColorInput from "~/components/tools/GradientColorInput.vue";
import type { MeshPoint } from "~/utils/cssGradient";

defineProps<
  { point: MeshPoint; id: number; index: number; canRemove: boolean }
>();
const emit = defineEmits<{ change: [value: Partial<MeshPoint>]; remove: [] }>();
const controls = [
  { key: "x", label: "Horizontal position", min: 0 },
  { key: "y", label: "Vertical position", min: 0 },
  { key: "opacity", label: "Opacity", min: 0 },
  { key: "spread", label: "Spread", min: 1 },
] as const;
</script>

<template>
  <div class="point-editor">
    <div class="point-heading">
      <h3>Point {{ index + 1 }}</h3><UTooltip text="Remove mesh point"><UButton
          icon="i-lucide-trash-2"
          :aria-label="`Remove point ${index + 1}`"
          :disabled="!canRemove"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="$emit('remove')"
        /></UTooltip>
    </div>
    <GradientColorInput
      :id="`gradient-point-color-${id}`"
      :label="`point ${index + 1}`"
      :model-value="point.color"
      @update:model-value="emit('change', { color: $event })"
    />
    <div class="point-sliders">
      <div v-for="control in controls" :key="control.key">
        <label :for="`gradient-point-${control.key}-${id}`">{{ control.label }}
          <span>{{ point[control.key] }}%</span></label><USlider
          :id="`gradient-point-${control.key}-${id}`"
          :model-value="point[control.key]"
          :min="control.min"
          :max="100"
          :step="1"
          :aria-label="`${control.label} for point ${index + 1}`"
          @update:model-value="emit('change', { [control.key]: Number($event) })"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.point-editor {
  padding-block: 1rem;
  border-bottom: 1px solid var(--ui-border);
}
.point-heading {
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
.point-sliders {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.point-sliders label {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.point-sliders label span {
  font-variant-numeric: tabular-nums;
}
</style>
