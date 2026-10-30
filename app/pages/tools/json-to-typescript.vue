<script setup lang="ts">
import ToolPage from "~/components/tools/ToolPage.vue";
import ToolTextEditor from "~/components/tools/ToolTextEditor.vue";
import ToolToolbar from "~/components/tools/ToolToolbar.vue";
import { formatJson, JsonFormattingError } from "~/utils/jsonFormatter";
import { jsonToTypeScript, TypeNameError } from "~/utils/jsonToTypeScript";

definePageMeta({ title: "JSON to TypeScript" });
useSeoMeta({
  title: "JSON to TypeScript | Dev Tools",
  description:
    "Infer TypeScript types from JSON samples with nested objects, arrays, and a custom root type name. Processing stays local.",
});

const example = formatJson(
  "{\"name\":\"Tanner\",\"active\":true,\"profile\":{\"displayName\":\"Tanner Satchwell\",\"location\":null},\"projects\":[{\"name\":\"Portfolio\",\"category\":\"Software\"},{\"name\":\"Developer tools\"}]}",
);
const source = ref(example);
const rootName = ref("Root");
const output = ref("");
const errorMessage = ref("");
const inputError = ref(false);
const nameError = ref(false);
const generating = ref(false);

onMounted(() => {
  watch([source, rootName], ([json, name], _previous, onCleanup) => {
    output.value = "";
    errorMessage.value = "";
    inputError.value = false;
    nameError.value = false;
    generating.value = !!json.trim();
    if (!json.trim()) return;

    let active = true;
    const timer = setTimeout(async () => {
      try {
        const generated = await jsonToTypeScript(json, name);
        if (active) output.value = generated;
      } catch (error) {
        if (!active) return;
        errorMessage.value = error instanceof Error
          ? error.message
          : "Unable to generate TypeScript.";
        inputError.value = error instanceof JsonFormattingError;
        nameError.value = error instanceof TypeNameError;
      } finally {
        if (active) generating.value = false;
      }
    }, 200);
    onCleanup(() => {
      active = false;
      clearTimeout(timer);
    });
  }, { immediate: true });
});

function loadExample() {
  source.value = example;
  rootName.value = "Root";
}
</script>

<template>
  <ToolPage
    title="JSON to TypeScript"
    icon="i-lucide-file-code"
    max-width="1400px"
  >
    <template v-if="source.trim()" #status><UBadge
        :color="errorMessage ? 'error' : 'neutral'"
        variant="subtle"
        :icon="errorMessage ? 'i-lucide-circle-alert' : 'i-lucide-file-code'"
      >{{
        generating
        ? "Generating"
        : errorMessage
        ? "Unable to generate"
        : output
        ? "Generated"
        : "Ready"
      }}</UBadge></template>
    <ToolToolbar @clear="source = ''">
      <UFormField label="Root type name" class="root-field"><UInput
          id="typescript-root-name"
          v-model="rootName"
          placeholder="Root"
          :maxlength="80"
          autocomplete="off"
          :spellcheck="false"
          :aria-invalid="nameError"
          :aria-describedby="nameError ? 'typescript-error' : undefined"
          class="root-input"
        /></UFormField>
      <template #actions><UButton
          icon="i-lucide-flask-conical"
          color="neutral"
          variant="ghost"
          @click="loadExample"
        >Example</UButton></template>
    </ToolToolbar>
    <div aria-live="polite" aria-atomic="true">
      <UAlert
        v-if="errorMessage"
        id="typescript-error"
        :title="errorMessage"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        class="generation-error"
      />
    </div>
    <div class="generator-grid" :aria-busy="generating">
      <ToolTextEditor
        id="typescript-source"
        v-model="source"
        label="Input"
        language="JSON"
        placeholder="Paste JSON..."
        :error="inputError"
        :error-id="inputError ? 'typescript-error' : undefined"
      />
      <ToolTextEditor
        id="typescript-output"
        :model-value="output"
        label="Output"
        language="TYPESCRIPT"
        readonly
      />
    </div>
    <footer class="generator-footer">
      <span><UIcon name="i-lucide-lock-keyhole" />Local processing</span><span
      >Types inferred from this sample</span>
    </footer>
  </ToolPage>
</template>

<style scoped>
.root-field {
  width: 18rem;
  max-width: 100%;
}
.root-input {
  width: 100%;
}
.generation-error {
  margin-bottom: 1rem;
}
.generator-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}
.generator-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.generator-footer > span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
@media (min-width: 900px) {
  .generator-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 479px) {
  .root-field {
    width: 100%;
  }
}
</style>
