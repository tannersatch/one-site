<script setup lang="ts">
import ToolPage from "~/components/tools/ToolPage.vue";
import ToolTextEditor from "~/components/tools/ToolTextEditor.vue";
import ToolToolbar from "~/components/tools/ToolToolbar.vue";
import { formatJson } from "~/utils/jsonFormatter";
import { jsonToYaml, yamlToJson } from "~/utils/yamlJson";
import type { ConversionIndentation } from "~/utils/yamlJson";

definePageMeta({ title: "JSON / YAML Converter" });
useSeoMeta({
  title: "JSON / YAML Converter | Dev Tools",
  description:
    "Convert JSON and YAML 1.2 in either direction with local processing and safe alias handling.",
});

type Direction = "yaml-to-json" | "json-to-yaml";
const examples: Record<Direction, string> = {
  "yaml-to-json":
    "name: Tanner\nactive: true\nprojects:\n  - name: Portfolio\n    path: /portfolio\n  - name: Developer tools\n    path: /tools",
  "json-to-yaml": formatJson(
    "{\"name\":\"Tanner\",\"active\":true,\"projects\":[{\"name\":\"Portfolio\",\"path\":\"/portfolio\"},{\"name\":\"Developer tools\",\"path\":\"/tools\"}]}",
  ),
};
const direction = ref<Direction>("json-to-yaml");
const indentation = ref<ConversionIndentation>("2");
const source = ref(examples[direction.value]);
const modes = [{
  label: "JSON to YAML",
  value: "json-to-yaml",
  icon: "i-lucide-arrow-right",
}, {
  label: "YAML to JSON",
  value: "yaml-to-json",
  icon: "i-lucide-arrow-left",
}];
const indentationOptions = [{ label: "2 spaces", value: "2" }, {
  label: "4 spaces",
  value: "4",
}];
const result = computed(() => {
  try {
    return {
      output: direction.value === "yaml-to-json"
        ? yamlToJson(source.value, indentation.value)
        : jsonToYaml(source.value, indentation.value),
      error: "",
    };
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error
        ? error.message
        : "Unable to convert this input.",
    };
  }
});

function changeDirection(value: string | number) {
  if (
    (value !== "yaml-to-json" && value !== "json-to-yaml")
    || value === direction.value
  ) return;
  const converted = result.value.output;
  if (converted) source.value = converted;
  direction.value = value;
}
</script>

<template>
  <ToolPage
    title="JSON / YAML Converter"
    icon="i-lucide-file-code"
    max-width="1400px"
  >
    <template v-if="source.trim()" #status><UBadge
        :color="result.error ? 'error' : 'neutral'"
        variant="subtle"
        :icon="result.error ? 'i-lucide-circle-alert' : 'i-lucide-arrow-left-right'"
      >{{
        result.error ? "Unable to convert" : "Converted"
      }}</UBadge></template>
    <ToolToolbar @clear="source = ''">
      <div class="converter-controls">
        <UTabs
          :model-value="direction"
          :items="modes"
          :content="false"
          aria-label="Conversion direction"
          class="mode-control"
          @update:model-value="changeDirection"
        />
        <UFormField label="Indentation" class="indentation-field"><USelect
            id="yaml-json-indentation"
            v-model="indentation"
            :items="indentationOptions"
            aria-label="Indentation"
            class="indentation-select"
          /></UFormField>
      </div>
      <template #actions><UButton
          icon="i-lucide-flask-conical"
          color="neutral"
          variant="ghost"
          @click="source = examples[direction]"
        >Example</UButton></template>
    </ToolToolbar>
    <div aria-live="polite" aria-atomic="true">
      <UAlert
        v-if="result.error"
        id="yaml-json-error"
        :title="result.error"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        class="conversion-error"
      />
    </div>
    <div class="converter-grid">
      <ToolTextEditor
        id="yaml-json-source"
        v-model="source"
        label="Input"
        :language="direction === 'yaml-to-json' ? 'YAML' : 'JSON'"
        :placeholder="direction === 'yaml-to-json' ? 'Paste YAML...' : 'Paste JSON...'"
        :error="!!result.error"
        :error-id="result.error ? 'yaml-json-error' : undefined"
      />
      <ToolTextEditor
        id="yaml-json-output"
        :model-value="result.output"
        label="Output"
        :language="direction === 'yaml-to-json' ? 'JSON' : 'YAML'"
        readonly
      />
    </div>
    <p class="conversion-note">
      Comments, styling, and anchor names are not preserved. Fractional numbers
      use JavaScript precision.
    </p>
    <footer class="converter-footer">
      <span><UIcon name="i-lucide-lock-keyhole" />Local processing</span><span
      >YAML 1.2 core &middot; One document</span>
    </footer>
  </ToolPage>
</template>

<style scoped>
.converter-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
  min-width: 0;
}
.mode-control {
  width: 22rem;
  max-width: 100%;
}
.converter-controls :deep(.indentation-select) {
  width: 8rem;
}
.conversion-error {
  margin-bottom: 1rem;
}
.conversion-error :deep([data-slot="title"]) {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  max-height: 12rem;
  overflow-y: auto;
}
.converter-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}
.conversion-note {
  margin-top: 1rem;
  font-size: 0.75rem;
  line-height: 1.7;
  color: var(--ui-text-muted);
}
.converter-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.75rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.converter-footer > span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
@media (min-width: 900px) {
  .converter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 479px) {
  .converter-controls,
  .mode-control,
  .indentation-field,
  .converter-controls :deep(.indentation-select) {
    width: 100%;
  }
}
</style>
