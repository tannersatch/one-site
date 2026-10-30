<script setup lang="ts">
import CopyButton from "~/components/tools/CopyButton.vue";
import GradientColorInput from "~/components/tools/GradientColorInput.vue";
import GradientMeshOverlay from "~/components/tools/GradientMeshOverlay.vue";
import GradientPointEditor from "~/components/tools/GradientPointEditor.vue";
import GradientStopEditor from "~/components/tools/GradientStopEditor.vue";
import ToolPage from "~/components/tools/ToolPage.vue";
import ToolToolbar from "~/components/tools/ToolToolbar.vue";
import {
  buildGradient,
  buildMeshGradient,
  gradientPresets,
  meshPreset,
  reverseGradientStops,
  stopsFromColors,
} from "~/utils/cssGradient";
import type {
  GradientOptions,
  GradientStop,
  MeshPoint,
} from "~/utils/cssGradient";

definePageMeta({ title: "CSS Gradient Generator" });
useSeoMeta({
  title: "CSS Gradient Generator | Dev Tools",
  description:
    "Build CSS linear, radial, and mesh gradients with editable colors, opacity, presets, and a live preview.",
});

type EditableStop = GradientStop & { id: number };
type EditablePoint = MeshPoint & { id: number };
let nextStopId = 0;
const makeStops = (colors: string[]): EditableStop[] =>
  stopsFromColors(colors).map(stop => ({ ...stop, id: nextStopId++ }));
const makePoints = (): EditablePoint[] =>
  meshPreset.points.map(point => ({ ...point, id: nextStopId++ }));
const type = ref<GradientOptions["type"] | "mesh">("linear");
const angle = ref<number | undefined>(120);
const shape = ref<GradientOptions["shape"]>("ellipse");
const centerX = ref(50);
const centerY = ref(50);
const stops = ref(makeStops(gradientPresets[0]!.colors));
const points = ref(makePoints());
const meshBackground = ref(meshPreset.background);
const modes = [
  {
    label: "Linear",
    value: "linear",
    icon: "i-lucide-move-up-right",
  },
  { label: "Radial", value: "radial", icon: "i-lucide-focus" },
  { label: "Mesh", value: "mesh", icon: "i-lucide-grid-2x2" },
];
const shapes = [{ label: "Ellipse", value: "ellipse" }, {
  label: "Circle",
  value: "circle",
}];
const stopGeometry = computed(() =>
  type.value === "mesh" ? undefined : {
    type: type.value,
    angle: angle.value ?? NaN,
    centerX: centerX.value,
    centerY: centerY.value,
  }
);
const result = computed(() => {
  try {
    return {
      gradient: type.value === "mesh"
        ? buildMeshGradient({
          background: meshBackground.value,
          points: points.value,
        })
        : buildGradient({
          type: type.value,
          angle: angle.value ?? NaN,
          shape: shape.value,
          centerX: centerX.value,
          centerY: centerY.value,
          stops: stops.value,
        }),
      error: "",
    };
  } catch (error) {
    return {
      gradient: null,
      error: error instanceof Error
        ? error.message
        : "Unable to create gradient.",
    };
  }
});

function applyPreset(preset: typeof gradientPresets[number]) {
  type.value = "linear";
  angle.value = preset.angle;
  stops.value = makeStops(preset.colors);
}
function reset() {
  applyPreset(gradientPresets[0]!);
  shape.value = "ellipse";
  centerX.value = 50;
  centerY.value = 50;
  points.value = makePoints();
  meshBackground.value = meshPreset.background;
}
function applyMeshPreset() {
  points.value = makePoints();
  meshBackground.value = meshPreset.background;
  type.value = "mesh";
}
function addPoint() {
  if (points.value.length < 8) {
    points.value.push({
      id: nextStopId++,
      color: "#ffffff",
      x: 50,
      y: 50,
      opacity: 100,
      spread: 50,
    });
  }
}
function removePoint(id: number) {
  if (points.value.length > 2) {
    points.value = points.value.filter(point => point.id !== id);
  }
}
function movePoint(id: number, position: { x: number; y: number }) {
  const point = points.value.find(point => point.id === id);
  if (point) Object.assign(point, position);
}
function moveStop(id: number, position: number) {
  const stop = stops.value.find(stop => stop.id === id);
  if (stop) stop.position = position;
}
function reverse() {
  if (type.value === "mesh") points.value = [...points.value].reverse();
  else stops.value = reverseGradientStops(stops.value);
}
function addStop() {
  if (stops.value.length >= 8) return;
  const sorted = [...stops.value].sort((first, second) =>
    first.position - second.position
  );
  let position = 50;
  let gap = -1;
  for (let index = 1; index < sorted.length; index++) {
    const first = sorted[index - 1]!;
    const second = sorted[index]!;
    if (second.position - first.position > gap) {
      gap = second.position - first.position;
      position = Math.round((first.position + second.position) / 2);
    }
  }
  stops.value.push({
    id: nextStopId++,
    color: "#ffffff",
    position,
    opacity: 100,
  });
}
function removeStop(id: number) {
  if (stops.value.length > 2) {
    stops.value = stops.value.filter(stop => stop.id !== id);
  }
}
</script>

<template>
  <ToolPage
    title="CSS Gradient Generator"
    icon="i-lucide-palette"
    max-width="1400px"
  >
    <template #status><UBadge
        :color="result.error ? 'error' : 'neutral'"
        variant="subtle"
      >{{
        result.error
        ? "Invalid settings"
        : type === "mesh"
        ? `${points.length} mesh points`
        : `${stops.length} color stops`
      }}</UBadge></template>
    <ToolToolbar
      clear-label="Reset"
      clear-icon="i-lucide-rotate-ccw"
      @clear="reset"
    >
      <UTabs
        v-model="type"
        :items="modes"
        :content="false"
        aria-label="Gradient type"
        class="mode-control"
      />
      <template #actions><UButton
          icon="i-lucide-arrow-left-right"
          color="neutral"
          variant="ghost"
          @click="reverse"
        >{{
          type === "mesh" ? "Reverse layers" : "Reverse"
        }}</UButton></template>
    </ToolToolbar>
    <div aria-live="polite" aria-atomic="true">
      <UAlert
        v-if="result.error"
        id="gradient-error"
        :title="result.error"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        class="gradient-error"
      />
    </div>
    <div class="generator-grid">
      <section class="preview-pane" aria-labelledby="gradient-preview-title">
        <div class="section-heading">
          <h2 id="gradient-preview-title">Live preview</h2><UBadge
            color="neutral"
            variant="soft"
            size="sm"
          >CSS</UBadge>
        </div>
        <div class="preview-checker">
          <div
            id="gradient-preview"
            class="gradient-preview"
            role="img"
            :aria-label="result.error
            ? 'No gradient: invalid settings'
            : `${type} gradient with ${
              type === 'mesh'
                ? points.length + ' mesh points'
                : stops.length + ' color stops'
            }`"
            :style="{
              background: result.gradient?.image ?? 'transparent',
              backgroundColor: type === 'mesh'
                ? result.gradient?.fallback ?? 'transparent'
                : 'transparent',
            }"
          />
          <GradientMeshOverlay
            v-if="!result.error"
            :points="points"
            :stops="stops"
            :geometry="stopGeometry"
            @move="movePoint"
            @position="moveStop"
          />
        </div>
        <section class="css-output" aria-labelledby="gradient-css-title">
          <div class="section-heading">
            <h2 id="gradient-css-title">Generated CSS</h2><CopyButton
              :value="result.gradient?.css ?? ''"
              label="Copy CSS"
            />
          </div>
          <pre
            tabindex="0"
            aria-labelledby="gradient-css-title"
          ><code id="gradient-css">{{ result.gradient?.css ?? '' }}</code></pre>
        </section>
      </section>
      <div class="settings-pane">
        <section class="geometry-controls" aria-label="Gradient geometry">
          <template v-if="type === 'linear'"><div class="section-heading">
              <label for="gradient-angle">Angle</label><UInputNumber
                id="gradient-angle"
                v-model="angle"
                :min="0"
                :max="360"
                :step="1"
                aria-label="Gradient angle"
                class="angle-input"
              />
            </div><USlider
              :model-value="angle ?? 0"
              :min="0"
              :max="360"
              :step="1"
              aria-label="Gradient angle slider"
              @update:model-value="angle = Number($event)"
            /></template>
          <template v-else-if="type === 'radial'"><UFormField
              label="Shape"
            ><USelect
                id="gradient-shape"
                v-model="shape"
                :items="shapes"
                aria-label="Radial shape"
                class="shape-select"
              /></UFormField><div class="radial-sliders">
              <div>
                <label for="gradient-center-x">Horizontal center <span>{{
                      centerX
                    }}%</span></label><USlider
                  id="gradient-center-x"
                  v-model="centerX"
                  :min="0"
                  :max="100"
                  :step="1"
                  aria-label="Horizontal center"
                />
              </div>
              <div>
                <label for="gradient-center-y">Vertical center <span>{{
                      centerY
                    }}%</span></label><USlider
                  id="gradient-center-y"
                  v-model="centerY"
                  :min="0"
                  :max="100"
                  :step="1"
                  aria-label="Vertical center"
                />
              </div>
            </div></template>
          <template v-else><label
              for="gradient-mesh-background"
              class="mesh-background-label"
            >Background color</label><GradientColorInput
              id="gradient-mesh-background"
              v-model="meshBackground"
              label="mesh background"
            /></template>
        </section>
        <section v-if="type !== 'mesh'" aria-labelledby="color-stops-title">
          <div class="section-heading">
            <h2 id="color-stops-title">Color stops</h2><UButton
              icon="i-lucide-plus"
              color="neutral"
              variant="outline"
              size="sm"
              :disabled="stops.length >= 8"
              @click="addStop"
            >Add stop</UButton>
          </div><GradientStopEditor
            v-for="(stop, index) in stops"
            :id="stop.id"
            :key="stop.id"
            :index="index"
            :stop="stop"
            :can-remove="stops.length > 2"
            @change="patch => Object.assign(stop, patch)"
            @remove="removeStop(stop.id)"
          />
        </section>
        <section v-else aria-labelledby="mesh-points-title">
          <div class="section-heading">
            <h2 id="mesh-points-title">Mesh points</h2><UButton
              icon="i-lucide-plus"
              color="neutral"
              variant="outline"
              size="sm"
              :disabled="points.length >= 8"
              @click="addPoint"
            >Add point</UButton>
          </div><GradientPointEditor
            v-for="(point, index) in points"
            :id="point.id"
            :key="point.id"
            :point="point"
            :index="index"
            :can-remove="points.length > 2"
            @change="patch => Object.assign(point, patch)"
            @remove="removePoint(point.id)"
          />
        </section>
      </div>
    </div>
    <section class="presets-section" aria-labelledby="gradient-presets-title">
      <h2 id="gradient-presets-title">Presets</h2>
      <div class="preset-list">
        <button
          v-for="preset in gradientPresets"
          :key="preset.name"
          type="button"
          class="preset-button"
          :aria-label="`Apply ${preset.name} preset`"
          @click="applyPreset(preset)"
        >
          <span
            class="preset-swatch"
            :style="{
              background: buildGradient({
                type: 'linear',
                angle: preset.angle,
                shape: 'ellipse',
                centerX: 50,
                centerY: 50,
                stops: stopsFromColors(preset.colors),
              }).image,
            }"
          /><span>{{ preset.name }}</span>
        </button>
        <button
          type="button"
          class="preset-button"
          :aria-label="`Apply ${meshPreset.name} preset`"
          @click="applyMeshPreset"
        >
          <span
            class="preset-swatch"
            :style="{
              background: buildMeshGradient(meshPreset).image,
              backgroundColor: meshPreset.background,
            }"
          /><span>{{ meshPreset.name }}</span>
        </button>
      </div>
    </section>
    <footer class="gradient-footer">
      <UIcon name="i-lucide-lock-keyhole" />Local processing
    </footer>
  </ToolPage>
</template>

<style scoped>
.mode-control {
  width: 21rem;
  max-width: 100%;
}
.gradient-error {
  margin-bottom: 1rem;
}
.generator-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;
}
.preview-pane, .settings-pane {
  min-width: 0;
}
.section-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}
h2, .geometry-controls > .section-heading > label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.preview-checker {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  background-color: var(--ui-bg);
  background-image:
    linear-gradient(45deg, var(--ui-bg-accented) 25%, transparent 25%),
    linear-gradient(-45deg, var(--ui-bg-accented) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--ui-bg-accented) 75%),
    linear-gradient(-45deg, transparent 75%, var(--ui-bg-accented) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
}
.gradient-preview {
  position: absolute;
  inset: 0;
}
.css-output {
  margin-top: 1.25rem;
}
.css-output pre {
  max-height: 20rem;
  overflow: auto;
  padding: 1rem;
  border: 1px solid var(--ui-border);
  border-radius: 0.375rem;
  background: var(--ui-bg-muted);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 0.75rem;
  line-height: 1.8;
}
.css-output pre:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 3px;
}
.geometry-controls {
  padding-bottom: 1.5rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--ui-border);
}
.mesh-background-label {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.geometry-controls :deep(.angle-input) {
  width: 9rem;
}
.geometry-controls :deep(.shape-select) {
  width: 100%;
}
.radial-sliders {
  display: grid;
  gap: 1.25rem;
  margin-top: 1.25rem;
}
.radial-sliders label {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}
.presets-section {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--ui-border);
}
.preset-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}
.preset-button {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0;
  text-align: left;
  font-size: 0.75rem;
  color: var(--ui-text-muted);
  cursor: pointer;
}
.preset-button:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 4px;
}
.preset-swatch {
  display: block;
  width: 100%;
  height: 3rem;
  border: 1px solid var(--ui-border);
  border-radius: 0.375rem;
}
.gradient-footer {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1.5rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
@media (min-width: 900px) {
  .generator-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    align-items: start;
  }
  .preview-pane {
    grid-column: 2;
    grid-row: 1;
    position: sticky;
    top: 0;
  }
  .settings-pane {
    grid-column: 1;
    grid-row: 1;
  }
  .preset-list {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: 479px) {
  .mode-control {
    width: 100%;
  }
}
</style>
