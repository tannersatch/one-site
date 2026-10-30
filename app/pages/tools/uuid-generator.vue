<script setup lang="ts">
import CopyButton from "~/components/tools/CopyButton.vue";
import ToolPage from "~/components/tools/ToolPage.vue";
import ToolToolbar from "~/components/tools/ToolToolbar.vue";
import { generateUuids, type UuidVersion } from "~/utils/uuidGenerator";

definePageMeta({ title: "UUID Generator" });
useSeoMeta({
  title: "UUID Generator | Dev Tools",
  description:
    "Generate RFC UUID version 4 or 7 identifiers in batches, locally.",
});

const version = ref<UuidVersion>("v4");
const count = ref<number | undefined>(10);
const uppercase = ref(false);
const values = ref<string[]>([]);
const error = ref("");
const versions = [
  { label: "Version 4 · Random", value: "v4", icon: "i-lucide-shuffle" },
  { label: "Version 7 · Time ordered", value: "v7", icon: "i-lucide-clock-3" },
];
const output = computed(() => values.value.join("\n"));

function generate() {
  try {
    values.value = generateUuids(
      version.value,
      count.value ?? NaN,
      uppercase.value,
    );
    error.value = "";
  } catch (reason) {
    values.value = [];
    error.value = reason instanceof Error
      ? reason.message
      : "Unable to generate UUIDs.";
  }
}
function clear() {
  values.value = [];
  error.value = "";
}
</script>

<template>
  <ToolPage title="UUID Generator" icon="i-lucide-fingerprint">
    <template v-if="values.length || error" #status><UBadge
        :color="error ? 'error' : 'success'"
        variant="subtle"
      >{{
        error
        ? "Invalid settings"
        : `${values.length} UUID${values.length === 1 ? "" : "s"}`
      }}</UBadge></template>
    <ToolToolbar clear-label="Clear output" @clear="clear">
      <div class="generator-controls">
        <UTabs
          v-model="version"
          :items="versions"
          :content="false"
          aria-label="UUID version"
          class="version-tabs"
        />
        <UFormField label="Quantity" class="quantity-field"><UInputNumber
            v-model="count"
            :min="1"
            :max="100"
            :step="1"
            aria-label="UUID quantity"
          /></UFormField>
        <UCheckbox v-model="uppercase" label="Uppercase" />
      </div>
      <template #actions><UButton
          icon="i-lucide-sparkles"
          color="primary"
          @click="generate"
        >Generate</UButton></template>
    </ToolToolbar>
    <UAlert
      v-if="error"
      :title="error"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      class="tool-error"
    />
    <section class="uuid-output" aria-labelledby="uuid-output-title">
      <div class="output-heading">
        <h2 id="uuid-output-title">Generated UUIDs</h2><CopyButton
          :value="output"
          label="Copy all UUIDs"
        />
      </div>
      <pre v-if="values.length" aria-live="polite">{{ output }}</pre>
      <p v-else class="empty-state">
        Choose a version and quantity, then generate.
      </p>
    </section>
    <p class="privacy-note">
      <UIcon name="i-lucide-lock-keyhole" />Generated locally with
      cryptographically secure randomness. UUID v7 includes a millisecond
      timestamp; avoid it when creation time should remain private.
    </p>
  </ToolPage>
</template>

<style scoped>
.generator-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}
.version-tabs {
  width: 22rem;
  max-width: 100%;
}
.quantity-field {
  width: 7rem;
}
.tool-error {
  margin-bottom: 1rem;
}
.uuid-output {
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
}
.output-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-bg-muted);
}
h2 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
pre {
  max-height: 34rem;
  overflow: auto;
  margin: 0;
  padding: 1rem;
  font-family: var(--font-mono, monospace);
  font-size: 0.8125rem;
  line-height: 1.8;
  overflow-wrap: anywhere;
}
.empty-state {
  margin: 0;
  padding: 2rem 1rem;
  color: var(--ui-text-muted);
  text-align: center;
  font-size: 0.875rem;
}
.privacy-note {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 1rem;
  color: var(--ui-text-muted);
  font-size: 0.75rem;
}
.privacy-note :deep(.iconify) {
  flex-shrink: 0;
  margin-top: 0.1rem;
}
@media (max-width: 639px) {
  .generator-controls, .version-tabs {
    width: 100%;
  }
}
</style>
