<script setup lang="ts">
import ToolPage from "~/components/tools/ToolPage.vue";
import ToolTextEditor from "~/components/tools/ToolTextEditor.vue";
import ToolToolbar from "~/components/tools/ToolToolbar.vue";
import { formatJson } from "~/utils/jsonFormatter";
import type { JsonIndentation } from "~/utils/jsonFormatter";

definePageMeta({ title: "JSON Formatter" });
useSeoMeta({
  title: "JSON Formatter | Dev Tools",
  description:
    "Format, minify, and validate JSON locally without changing numeric values.",
});

const example =
  "{\"name\":\"Tanner\",\"projects\":[\"Portfolio\",\"Developer tools\"],\"active\":true,\"id\":9007199254740993}";
const source = ref(example);
const mode = ref("format");
const indentation = ref<JsonIndentation>("2");
const modes = [
  { label: "Format", value: "format", icon: "i-lucide-list-tree" },
  { label: "Minify", value: "minify", icon: "i-lucide-minimize-2" },
];
const indentationOptions = [{ label: "2 spaces", value: "2" }, {
  label: "4 spaces",
  value: "4",
}, { label: "Tabs", value: "tab" }];
const result = computed(() => {
  try {
    return {
      output: formatJson(source.value, {
        minify: mode.value === "minify",
        indentation: indentation.value,
      }),
      error: "",
    };
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : "Unable to format JSON.",
    };
  }
});
</script>

<template>
  <ToolPage title="JSON Formatter" icon="i-lucide-braces" max-width="1400px">
    <template v-if="source.trim()" #status><UBadge
        :color="result.error ? 'error' : 'success'"
        variant="subtle"
        :icon="result.error ? 'i-lucide-circle-alert' : 'i-lucide-circle-check'"
      >{{ result.error ? "Invalid JSON" : "Valid JSON" }}</UBadge></template>
    <ToolToolbar @clear="source = ''">
      <div class="formatter-controls">
        <UTabs
          v-model="mode"
          :items="modes"
          :content="false"
          aria-label="JSON output mode"
          class="mode-control"
        /><USelect
          v-if="mode === 'format'"
          v-model="indentation"
          :items="indentationOptions"
          aria-label="Indentation"
          class="indentation-select"
        />
      </div>
      <template #actions><UButton
          icon="i-lucide-flask-conical"
          color="neutral"
          variant="ghost"
          @click="source = example"
        >Example</UButton></template>
    </ToolToolbar>
    <div aria-live="polite" aria-atomic="true">
      <UAlert
        v-if="result.error"
        id="json-format-error"
        :title="result.error"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        class="format-error"
      />
    </div>
    <div class="formatter-grid">
      <ToolTextEditor
        id="json-source"
        v-model="source"
        label="Input"
        language="JSON"
        placeholder="Paste JSON..."
        :error="!!result.error"
        :error-id="result.error ? 'json-format-error' : undefined"
      />
      <ToolTextEditor
        id="json-output"
        :model-value="result.output"
        label="Output"
        language="JSON"
        readonly
        placeholder=""
      />
    </div>
    <footer class="formatter-footer">
      <span><UIcon name="i-lucide-lock-keyhole" />Local processing</span><span
      >{{ result.output.length }} output characters</span>
    </footer>
  </ToolPage>
</template>

<style scoped>
.formatter-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}
.mode-control {
  width: 14rem;
  max-width: 100%;
}
.indentation-select {
  width: 8rem;
}
.format-error {
  margin-bottom: 1rem;
}
.formatter-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}
.formatter-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.formatter-footer > span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
@media (min-width: 900px) {
  .formatter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 479px) {
  .formatter-controls, .mode-control {
    width: 100%;
  }
}
</style>
