<script setup lang="ts">
import ToolPage from "~/components/tools/ToolPage.vue";
import ToolTextEditor from "~/components/tools/ToolTextEditor.vue";
import ToolToolbar from "~/components/tools/ToolToolbar.vue";
import { decodeUrl, encodeUrl } from "~/utils/urlCodec";
import type { UrlEncodingMode } from "~/utils/urlCodec";

definePageMeta({ title: "URL Encoder / Decoder" });
useSeoMeta({
  title: "URL Encoder / Decoder | Dev Tools",
  description:
    "Encode or decode URL components and complete URI strings locally.",
});

const source = ref("https://example.com/search?q=hello world&lang=日本語");
const action = ref<"encode" | "decode">("encode");
const mode = ref<UrlEncodingMode>("component");
const actionOptions = [
  { label: "Encode", value: "encode", icon: "i-lucide-arrow-up-right" },
  { label: "Decode", value: "decode", icon: "i-lucide-arrow-down-left" },
];
const modeOptions = [
  { label: "Component", value: "component" },
  { label: "Full URI", value: "uri" },
];
const result = computed(() => {
  if (!source.value) return { output: "", error: "" };
  try {
    return {
      output: action.value === "encode"
        ? encodeUrl(source.value, mode.value)
        : decodeUrl(source.value, mode.value),
      error: "",
    };
  } catch {
    return {
      output: "",
      error: "Input contains malformed encoding or invalid Unicode.",
    };
  }
});
</script>

<template>
  <ToolPage
    title="URL Encoder / Decoder"
    icon="i-lucide-link"
    max-width="1400px"
  >
    <template v-if="source" #status><UBadge
        :color="result.error ? 'error' : 'neutral'"
        variant="subtle"
      >{{
        result.error
        ? "Invalid input"
        : action === "encode"
        ? "Encoded locally"
        : "Decoded locally"
      }}</UBadge></template>
    <ToolToolbar @clear="source = ''">
      <div class="codec-controls">
        <UTabs
          v-model="action"
          :items="actionOptions"
          :content="false"
          aria-label="URL operation"
        />
        <USelect
          v-model="mode"
          :items="modeOptions"
          aria-label="URL encoding mode"
          class="mode-select"
        />
      </div>
      <template #actions><UButton
          icon="i-lucide-flask-conical"
          color="neutral"
          variant="ghost"
          @click="source = 'https://example.com/search?q=hello world&lang=日本語'"
        >Example</UButton></template>
    </ToolToolbar>
    <UAlert
      v-if="result.error"
      :title="result.error"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      class="tool-error"
    />
    <div class="editor-grid">
      <ToolTextEditor
        id="url-source"
        v-model="source"
        label="Input"
        language="URL / URI"
        placeholder="Paste text or a URL..."
        :error="!!result.error"
      />
      <ToolTextEditor
        id="url-output"
        :model-value="result.output"
        label="Output"
        language="URL / URI"
        readonly
      />
    </div>
    <p class="privacy-note">
      <UIcon name="i-lucide-lock-keyhole" />Processing stays in your browser.
      Component mode encodes reserved URL characters; Full URI mode preserves
      URL delimiters.
    </p>
  </ToolPage>
</template>

<style scoped>
.codec-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}
.mode-select {
  width: 9rem;
}
.tool-error {
  margin-bottom: 1rem;
}
.editor-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
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
@media (min-width: 900px) {
  .editor-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 479px) {
  .codec-controls {
    width: 100%;
  }
}
</style>
