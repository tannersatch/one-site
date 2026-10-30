<script setup lang="ts">
import {
  gradientStopAxis,
  gradientStopPoint,
  gradientStopPosition,
  meshPositionFromPointer,
  normalizeHex,
} from "~/utils/cssGradient";
import type {
  GradientOptions,
  GradientStop,
  MeshPoint,
} from "~/utils/cssGradient";

type PreviewPoint = Pick<MeshPoint, "x" | "y" | "color"> & {
  id: number;
  position?: number;
};
const props = withDefaults(
  defineProps<{
    points: (MeshPoint & { id: number })[];
    stops?: (GradientStop & { id: number })[];
    geometry?: Pick<GradientOptions, "type" | "angle" | "centerX" | "centerY">;
  }>(),
  { stops: () => [] },
);
const emit = defineEmits<
  {
    move: [id: number, position: { x: number; y: number }];
    position: [id: number, position: number];
  }
>();
const overlay = useTemplateRef<HTMLDivElement>("overlay");
const dimensions = ref({ width: 0, height: 0 });
let observer: ResizeObserver | undefined;
onMounted(() => {
  if (!overlay.value) return;
  const bounds = overlay.value.getBoundingClientRect();
  dimensions.value = { width: bounds.width, height: bounds.height };
  observer = new ResizeObserver(entries => {
    const bounds = entries[0]?.contentRect;
    if (bounds) {
      dimensions.value = { width: bounds.width, height: bounds.height };
    }
  });
  observer.observe(overlay.value);
});
onBeforeUnmount(() => observer?.disconnect());
const axis = computed(() =>
  props.geometry && dimensions.value.width > 0 && dimensions.value.height > 0
    ? gradientStopAxis(
      props.geometry,
      dimensions.value.width,
      dimensions.value.height,
    )
    : null
);
const handles = computed<PreviewPoint[]>(() => {
  if (!props.geometry) return props.points;
  const track = axis.value;
  if (!track) return [];
  return props.stops.map(stop => {
    const point = gradientStopPoint(track, stop.position);
    return {
      ...stop,
      x: point.x / dimensions.value.width * 100,
      y: point.y / dimensions.value.height * 100,
    };
  });
});
const axisStyle = computed(() => {
  const track = axis.value;
  if (!track) return {};
  const delta = {
    x: track.end.x - track.start.x,
    y: track.end.y - track.start.y,
  };
  return {
    left: `${track.start.x}px`,
    top: `${track.start.y}px`,
    width: `${Math.hypot(delta.x, delta.y)}px`,
    transform: `rotate(${Math.atan2(delta.y, delta.x)}rad)`,
  };
});
const dragging = ref<
  { id: number; pointerId: number; offsetX: number; offsetY: number } | null
>(null);
const directions: Record<string, { x: number; y: number }> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
};

watch(() => handles.value.map(point => point.id), ids => {
  if (dragging.value && !ids.includes(dragging.value.id)) dragging.value = null;
});
watch(() => props.geometry, () => dragging.value = null);

function color(value: string) {
  try {
    return normalizeHex(value);
  } catch {
    return "#ffffff";
  }
}

function startDrag(event: PointerEvent, point: PreviewPoint) {
  if (event.button !== 0 || dragging.value) return;
  const bounds = overlay.value?.getBoundingClientRect();
  if (!bounds?.width || !bounds.height) return;
  event.preventDefault();
  const target = event.currentTarget as HTMLButtonElement;
  target.setPointerCapture(event.pointerId);
  target.focus({ preventScroll: true });
  dragging.value = {
    id: point.id,
    pointerId: event.pointerId,
    offsetX: event.clientX - (bounds.left + point.x / 100 * bounds.width),
    offsetY: event.clientY - (bounds.top + point.y / 100 * bounds.height),
  };
}

function moveDrag(event: PointerEvent) {
  const active = dragging.value;
  const bounds = overlay.value?.getBoundingClientRect();
  if (
    !active || active.pointerId !== event.pointerId || !bounds?.width
    || !bounds.height
  ) return;
  event.preventDefault();
  if (props.geometry) {
    emit(
      "position",
      active.id,
      gradientStopPosition(
        gradientStopAxis(props.geometry, bounds.width, bounds.height),
        event.clientX - active.offsetX - bounds.left,
        event.clientY - active.offsetY - bounds.top,
      ),
    );
    return;
  }
  emit(
    "move",
    active.id,
    meshPositionFromPointer(
      event.clientX - active.offsetX,
      event.clientY - active.offsetY,
      bounds,
    ),
  );
}

function endDrag(event: PointerEvent) {
  if (dragging.value?.pointerId !== event.pointerId) return;
  dragging.value = null;
  const target = event.currentTarget as HTMLButtonElement;
  if (target.hasPointerCapture(event.pointerId)) {
    target.releasePointerCapture(event.pointerId);
  }
}

function moveWithKeys(event: KeyboardEvent, point: PreviewPoint) {
  if (props.geometry && (event.key === "Home" || event.key === "End")) {
    event.preventDefault();
    emit("position", point.id, event.key === "Home" ? 0 : 100);
    return;
  }
  const direction = directions[event.key];
  if (!direction) return;
  event.preventDefault();
  const step = event.shiftKey ? 10 : 1;
  if (props.geometry) {
    emit(
      "position",
      point.id,
      Math.max(
        0,
        Math.min(
          100,
          (point.position ?? 0) + (direction.x - direction.y) * step,
        ),
      ),
    );
    return;
  }
  emit("move", point.id, {
    x: Math.max(0, Math.min(100, point.x + direction.x * step)),
    y: Math.max(0, Math.min(100, point.y + direction.y * step)),
  });
}
</script>

<template>
  <div
    ref="overlay"
    class="mesh-overlay"
    role="group"
    :aria-label="geometry ? `${geometry.type} color stop positions` : 'Mesh color positions'"
  >
    <div
      v-if="axis"
      class="gradient-axis"
      :style="axisStyle"
      aria-hidden="true"
    />
    <button
      v-for="(point, index) in handles"
      :key="point.id"
      type="button"
      class="mesh-dot"
      :class="{
        'mesh-dot--dragging': dragging?.id === point.id,
        'gradient-stop-dot': !!geometry,
      }"
      :aria-label="geometry
      ? `Move ${geometry.type} stop ${index + 1} (${point.position}%)`
      : `Move mesh point ${index + 1} (${point.x}%, ${point.y}%)`"
      :title="geometry
      ? `Stop ${index + 1}: ${point.position}%`
      : `Point ${index + 1}: ${point.x}%, ${point.y}%`"
      :style="{
        left: `clamp(1.125rem, ${point.x}%, calc(100% - 1.125rem))`,
        top: `clamp(1.125rem, ${point.y}%, calc(100% - 1.125rem))`,
        backgroundColor: color(point.color),
      }"
      @pointerdown="startDrag($event, point)"
      @pointermove="moveDrag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
      @lostpointercapture="endDrag"
      @keydown="moveWithKeys($event, point)"
    >
      <span>{{ index + 1 }}</span>
    </button>
  </div>
</template>

<style scoped>
.mesh-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.gradient-axis {
  position: absolute;
  height: 1px;
  background: var(--ui-bg);
  box-shadow: 0 0 0 1px var(--ui-text-highlighted);
  opacity: 0.6;
  transform-origin: left center;
}
.mesh-dot {
  position: absolute;
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 2px solid var(--ui-bg);
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--ui-text-highlighted);
  transform: translate(-50%, -50%);
  pointer-events: auto;
  touch-action: none;
  user-select: none;
  cursor: grab;
}
.mesh-dot span {
  display: grid;
  place-items: center;
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 50%;
  font-size: 0.625rem;
  line-height: 1;
  font-weight: 600;
  background: var(--ui-bg-inverted);
  color: var(--ui-text-inverted);
}
.mesh-dot:focus-visible {
  outline: 3px solid var(--ui-primary);
  outline-offset: 3px;
  z-index: 2;
}
.mesh-dot--dragging {
  cursor: grabbing;
  z-index: 3;
}
</style>
