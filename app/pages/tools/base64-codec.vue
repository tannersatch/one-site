<script setup lang="ts">
import ToolPage from "~/components/tools/ToolPage.vue";
import ToolTextEditor from "~/components/tools/ToolTextEditor.vue";
import ToolToolbar from "~/components/tools/ToolToolbar.vue";
import {
  decodeBase64,
  decodeBase64Text,
  encodeBase64,
  encodeBase64Text,
} from "~/utils/base64";

definePageMeta({ title: "Base64 Encoder / Decoder" });
useSeoMeta({
  title: "Base64 Encoder / Decoder | Dev Tools",
  description:
    "Encode UTF-8 text or files and decode Base64 text or downloadable binary files locally.",
});

const mode = ref<"text" | "file">("text");
const action = ref<"encode" | "decode">("encode");
const text = ref("Hello, world! こんにちは 🌎");
const base64 = ref("");
const fileBase64 = ref("");
const fileOutput = ref("");
const fileName = ref("download.bin");
const downloadUrl = ref("");
const error = ref("");
const modes = [
  { label: "Text", value: "text", icon: "i-lucide-text" },
  { label: "Files", value: "file", icon: "i-lucide-file" },
];
const actions = [
  { label: "Encode", value: "encode", icon: "i-lucide-arrow-up-right" },
  { label: "Decode", value: "decode", icon: "i-lucide-arrow-down-left" },
];
const textResult = computed(() => {
  if (!text.value) return { output: "", error: "" };
  try {
    return {
      output: action.value === "encode"
        ? encodeBase64Text(text.value)
        : decodeBase64Text(text.value),
      error: "",
    };
  } catch (reason) {
    return {
      output: "",
      error: reason instanceof Error
        ? reason.message
        : "Unable to process Base64 text.",
    };
  }
});
const fileDecodeError = computed(() => {
  if (
    mode.value !== "file" || action.value !== "decode"
    || !fileBase64.value.trim()
  ) return "";
  try {
    decodeBase64(fileBase64.value);
    return "";
  } catch (reason) {
    return reason instanceof Error
      ? reason.message
      : "Unable to decode this file.";
  }
});
const activeError = computed(() =>
  mode.value === "text"
    ? textResult.value.error
    : error.value || fileDecodeError.value
);

function clear() {
  text.value = "";
  base64.value = "";
  fileBase64.value = "";
  fileOutput.value = "";
  fileName.value = "download.bin";
  error.value = "";
  if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value);
  downloadUrl.value = "";
}
function example() {
  mode.value = "text";
  action.value = "encode";
  text.value = "Hello, world! こんにちは 🌎";
}
function updateMode(value: "text" | "file") {
  mode.value = value;
  error.value = "";
}
function updateAction(value: "encode" | "decode") {
  action.value = value;
  error.value = "";
  fileOutput.value = "";
  if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value);
  downloadUrl.value = "";
}
async function encodeFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  fileOutput.value = "";
  error.value = "";
  if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value);
  downloadUrl.value = "";
  if (!file) return;
  fileName.value = file.name;
  if (file.size > 5 * 1024 * 1024) {
    error.value = "Choose a file that is 5 MB or smaller.";
    return;
  }
  try {
    fileOutput.value = encodeBase64(new Uint8Array(await file.arrayBuffer()));
  } catch (reason) {
    error.value = reason instanceof Error
      ? reason.message
      : "Unable to encode this file.";
  }
}
function makeDownload() {
  if (
    mode.value !== "file" || action.value !== "decode"
    || !fileBase64.value.trim() || fileDecodeError.value
  ) {
    if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value);
    downloadUrl.value = "";
    return;
  }
  if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value);
  downloadUrl.value = URL.createObjectURL(
    new Blob([decodeBase64(fileBase64.value)]),
  );
}
watch([mode, action, fileBase64, fileName], makeDownload, { flush: "post" });
onBeforeUnmount(() => {
  if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value);
});
</script>

<template>
  <ToolPage
    title="Base64 Encoder / Decoder"
    icon="i-lucide-binary"
    max-width="1400px"
  >
    <template #status><UBadge
        :color="activeError ? 'error' : 'neutral'"
        variant="subtle"
      >{{
        activeError
        ? "Invalid input"
        : mode === "file"
        ? "Files stay local"
        : "UTF-8 text"
      }}</UBadge></template>
    <ToolToolbar @clear="clear">
      <div class="codec-controls">
        <UTabs
          :model-value="mode"
          :items="modes"
          :content="false"
          aria-label="Base64 data type"
          @update:model-value="updateMode"
        /><UTabs
          :model-value="action"
          :items="actions"
          :content="false"
          aria-label="Base64 operation"
          @update:model-value="updateAction"
        />
      </div>
      <template #actions><UButton
          icon="i-lucide-flask-conical"
          color="neutral"
          variant="ghost"
          @click="example"
        >Example</UButton></template>
    </ToolToolbar>
    <UAlert
      v-if="activeError"
      :title="activeError"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      class="tool-error"
    />
    <div v-if="mode === 'text'" class="editor-grid">
      <ToolTextEditor
        v-if="action === 'encode'"
        id="base64-text-source"
        v-model="text"
        label="UTF-8 text"
        language="TEXT"
        placeholder="Enter text to encode..."
        :error="!!textResult.error"
      />
      <ToolTextEditor
        v-else
        id="base64-text-source"
        v-model="text"
        label="Base64 input"
        language="BASE64"
        placeholder="Paste Base64 text..."
        :error="!!textResult.error"
      />
      <ToolTextEditor
        id="base64-text-output"
        :model-value="textResult.output"
        :label="action === 'encode' ? 'Base64 output' : 'Decoded text'"
        :language="action === 'encode' ? 'BASE64' : 'UTF-8'"
        readonly
      />
    </div>
    <div v-else class="file-workspace">
      <section v-if="action === 'encode'" class="file-input-section">
        <label for="base64-file">Choose file to encode</label>
        <input id="base64-file" type="file" @change="encodeFile">
        <p>
          Files up to 5 MB are encoded locally. Base64 output is approximately
          33% larger than the original.
        </p>
      </section>
      <ToolTextEditor
        v-else
        id="base64-file-source"
        v-model="fileBase64"
        label="Base64 file data"
        language="BASE64"
        placeholder="Paste Base64 file data..."
        :error="!!fileDecodeError"
      />
      <ToolTextEditor
        v-if="action === 'encode'"
        id="base64-file-output"
        :model-value="fileOutput"
        label="Base64 output"
        language="BASE64"
        readonly
      />
      <section v-else class="download-section">
        <label for="base64-filename">Download filename</label>
        <UInput
          id="base64-filename"
          v-model="fileName"
          autocomplete="off"
          placeholder="download.bin"
        />
        <UButton
          icon="i-lucide-download"
          :disabled="!downloadUrl"
          :href="downloadUrl || undefined"
          :download="fileName || 'download.bin'"
        >Download decoded file</UButton>
      </section>
    </div>
    <p class="privacy-note">
      <UIcon name="i-lucide-lock-keyhole" />Processing stays in your browser.
      Text decoding requires valid UTF-8; use file mode for arbitrary binary
      data.
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
.tool-error {
  margin-bottom: 1rem;
}
.editor-grid, .file-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}
.file-input-section, .download-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
}
.file-input-section label, .download-section label {
  color: var(--ui-text-highlighted);
  font-size: 0.875rem;
  font-weight: 600;
}
.file-input-section input {
  width: 100%;
  max-width: 100%;
  color: var(--ui-text);
  font-size: 0.8125rem;
}
.file-input-section p, .privacy-note {
  color: var(--ui-text-muted);
  font-size: 0.75rem;
}
.download-section .ui-input {
  width: 100%;
  max-width: 24rem;
}
.privacy-note {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.privacy-note :deep(.iconify) {
  flex-shrink: 0;
}
@media (min-width: 900px) {
  .editor-grid, .file-workspace {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }
}
@media (max-width: 639px) {
  .codec-controls {
    width: 100%;
  }
}
</style>
